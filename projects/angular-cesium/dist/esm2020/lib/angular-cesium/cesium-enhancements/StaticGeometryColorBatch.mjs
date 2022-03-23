/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
import { Color, AssociativeArray, defined, ColorGeometryInstanceAttribute, DistanceDisplayCondition, DistanceDisplayConditionGeometryInstanceAttribute, ShowGeometryInstanceAttribute, Primitive, ShadowMode, ColorMaterialProperty } from 'cesium';
// tslint:disable
// const AssociativeArray = AssociativeArray;
// const Color = Color;
// const ColorGeometryInstanceAttribute = ColorGeometryInstanceAttribute;
// const defined = defined;
// const DistanceDisplayCondition = DistanceDisplayCondition;
// const DistanceDisplayConditionGeometryInstanceAttribute = DistanceDisplayConditionGeometryInstanceAttribute;
// const ShowGeometryInstanceAttribute = ShowGeometryInstanceAttribute;
// const Primitive = Primitive;
// const ShadowMode = ShadowMode;
// const BoundingSphereState = BoundingSphereState;
// const ColorMaterialProperty = ColorMaterialProperty;
// const MaterialProperty = MaterialProperty;
//  const Property = Property;
var colorScratch = new Color();
var distanceDisplayConditionScratch = new DistanceDisplayCondition();
var defaultDistanceDisplayCondition = new DistanceDisplayCondition();
function Batch(primitives, translucent, appearanceType, depthFailAppearanceType, depthFailMaterialProperty, closed, shadows) {
    this.translucent = translucent;
    this.appearanceType = appearanceType;
    this.depthFailAppearanceType = depthFailAppearanceType;
    this.depthFailMaterialProperty = depthFailMaterialProperty;
    this.depthFailMaterial = undefined;
    this.closed = closed;
    this.shadows = shadows;
    this.primitives = primitives;
    this.createPrimitive = false;
    this.waitingOnCreate = false;
    this.primitive = undefined;
    this.oldPrimitive = undefined;
    this.geometry = new AssociativeArray();
    this.updaters = new AssociativeArray();
    this.updatersWithAttributes = new AssociativeArray();
    this.attributes = new AssociativeArray();
    this.subscriptions = new AssociativeArray();
    this.showsUpdated = new AssociativeArray();
    this.itemsToRemove = [];
    this.invalidated = false;
    var removeMaterialSubscription;
    if (defined(depthFailMaterialProperty)) {
        removeMaterialSubscription = depthFailMaterialProperty.definitionChanged.addEventListener(Batch.prototype.onMaterialChanged, this);
    }
    this.removeMaterialSubscription = removeMaterialSubscription;
}
Batch.prototype.onMaterialChanged = function () {
    this.invalidated = true;
};
Batch.prototype.isMaterial = function (updater) {
    var material = this.depthFailMaterialProperty;
    var updaterMaterial = updater.depthFailMaterialProperty;
    if (updaterMaterial === material) {
        return true;
    }
    if (defined(material)) {
        return material.equals(updaterMaterial);
    }
    return false;
};
Batch.prototype.add = function (updater, instance) {
    var id = updater.id;
    this.createPrimitive = true;
    this.geometry.set(id, instance);
    this.updaters.set(id, updater);
    if (!updater.hasConstantFill || !updater.fillMaterialProperty.isConstant || !Cesium.Property.isConstant(updater.distanceDisplayConditionProperty)) {
        this.updatersWithAttributes.set(id, updater);
    }
    else {
        var that = this;
        this.subscriptions.set(id, updater.entity.definitionChanged.addEventListener(function (entity, propertyName, newValue, oldValue) {
            if (propertyName === 'isShowing') {
                that.showsUpdated.set(updater.id, updater);
            }
        }));
    }
};
Batch.prototype.remove = function (updater) {
    var id = updater.id;
    this.createPrimitive = this.geometry.remove(id) || this.createPrimitive;
    if (this.updaters.remove(id)) {
        this.updatersWithAttributes.remove(id);
        var unsubscribe = this.subscriptions.get(id);
        if (defined(unsubscribe)) {
            unsubscribe();
            this.subscriptions.remove(id);
        }
    }
};
Batch.prototype.update = function (time) {
    var isUpdated = true;
    var removedCount = 0;
    var primitive = this.primitive;
    var primitives = this.primitives;
    var attributes;
    var i;
    if (this.createPrimitive) {
        var geometries = this.geometry.values;
        var geometriesLength = geometries.length;
        if (geometriesLength > 0) {
            if (defined(primitive)) {
                if (!defined(this.oldPrimitive)) {
                    this.oldPrimitive = primitive;
                }
                else {
                    primitives.remove(primitive);
                }
            }
            for (i = 0; i < geometriesLength; i++) {
                var geometryItem = geometries[i];
                var originalAttributes = geometryItem.attributes;
                attributes = this.attributes.get(geometryItem.id.id);
                if (defined(attributes)) {
                    if (defined(originalAttributes.show)) {
                        originalAttributes.show.value = attributes.show;
                    }
                    if (defined(originalAttributes.color)) {
                        originalAttributes.color.value = attributes.color;
                    }
                    if (defined(originalAttributes.depthFailColor)) {
                        originalAttributes.depthFailColor.value = attributes.depthFailColor;
                    }
                }
            }
            var depthFailAppearance;
            if (defined(this.depthFailAppearanceType)) {
                if (defined(this.depthFailMaterialProperty)) {
                    this.depthFailMaterial = Cesium.MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
                }
                depthFailAppearance = new this.depthFailAppearanceType({
                    material: this.depthFailMaterial,
                    translucent: this.translucent,
                    closed: this.closed
                });
            }
            primitive = new Primitive({
                show: false,
                asynchronous: true,
                geometryInstances: geometries,
                appearance: new this.appearanceType({
                    flat: this.shadows === ShadowMode.DISABLED || this.shadows === ShadowMode.CAST_ONLY,
                    translucent: this.translucent,
                    closed: this.closed
                }),
                depthFailAppearance: depthFailAppearance,
                shadows: this.shadows
            });
            primitives.add(primitive);
            isUpdated = false;
        }
        else {
            if (defined(primitive)) {
                primitives.remove(primitive);
                primitive = undefined;
            }
            var oldPrimitive = this.oldPrimitive;
            if (defined(oldPrimitive)) {
                primitives.remove(oldPrimitive);
                this.oldPrimitive = undefined;
            }
        }
        this.attributes.removeAll();
        this.primitive = primitive;
        this.createPrimitive = false;
        this.waitingOnCreate = true;
    }
    else if (defined(primitive) && primitive.ready) {
        primitive.show = true;
        if (defined(this.oldPrimitive)) {
            primitives.remove(this.oldPrimitive);
            this.oldPrimitive = undefined;
        }
        if (defined(this.depthFailAppearanceType) && !(this.depthFailMaterialProperty instanceof ColorMaterialProperty)) {
            this.depthFailMaterial = Cesium.MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
            this.primitive.depthFailAppearance.material = this.depthFailMaterial;
        }
        var updatersWithAttributes = this.updatersWithAttributes.values;
        var length = updatersWithAttributes.length;
        var waitingOnCreate = this.waitingOnCreate;
        for (i = 0; i < length; i++) {
            var updater = updatersWithAttributes[i];
            var instance = this.geometry.get(updater.id);
            attributes = this.attributes.get(instance.id.id);
            if (!defined(attributes)) {
                attributes = primitive.getGeometryInstanceAttributes(instance.id);
                this.attributes.set(instance.id.id, attributes);
            }
            if (!updater.fillMaterialProperty.isConstant || waitingOnCreate) {
                var colorProperty = updater.fillMaterialProperty.color;
                var resultColor = Cesium.Property.getValueOrDefault(colorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastColor, resultColor)) {
                    attributes._lastColor = Color.clone(resultColor, attributes._lastColor);
                    attributes.color = ColorGeometryInstanceAttribute.toValue(resultColor, attributes.color);
                    if ((this.translucent && attributes.color[3] === 255) || (!this.translucent && attributes.color[3] !== 255)) {
                        this.itemsToRemove[removedCount++] = updater;
                    }
                }
            }
            if (defined(this.depthFailAppearanceType) && updater.depthFailMaterialProperty instanceof ColorMaterialProperty && (!updater.depthFailMaterialProperty.isConstant || waitingOnCreate)) {
                var depthFailColorProperty = updater.depthFailMaterialProperty.color;
                var depthColor = Cesium.Property.getValueOrDefault(depthFailColorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastDepthFailColor, depthColor)) {
                    attributes._lastDepthFailColor = Color.clone(depthColor, attributes._lastDepthFailColor);
                    attributes.depthFailColor = ColorGeometryInstanceAttribute.toValue(depthColor, attributes.depthFailColor);
                }
            }
            var show = updater.entity.isShowing && (updater.hasConstantFill || updater.isFilled(time));
            var currentShow = attributes.show[0] === 1;
            if (show !== currentShow) {
                attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
            }
            var distanceDisplayConditionProperty = updater.distanceDisplayConditionProperty;
            if (!Cesium.Property.isConstant(distanceDisplayConditionProperty)) {
                var distanceDisplayCondition = Cesium.Property.getValueOrDefault(distanceDisplayConditionProperty, time, defaultDistanceDisplayCondition, distanceDisplayConditionScratch);
                if (!DistanceDisplayCondition.equals(distanceDisplayCondition, attributes._lastDistanceDisplayCondition)) {
                    attributes._lastDistanceDisplayCondition = DistanceDisplayCondition.clone(distanceDisplayCondition, attributes._lastDistanceDisplayCondition);
                    attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.toValue(distanceDisplayCondition, attributes.distanceDisplayCondition);
                }
            }
        }
        this.updateShows(primitive);
        this.waitingOnCreate = false;
    }
    else if (defined(primitive) && !primitive.ready) {
        isUpdated = false;
    }
    this.itemsToRemove.length = removedCount;
    return isUpdated;
};
Batch.prototype.updateShows = function (primitive) {
    var showsUpdated = this.showsUpdated.values;
    var length = showsUpdated.length;
    for (var i = 0; i < length; i++) {
        var updater = showsUpdated[i];
        var instance = this.geometry.get(updater.id);
        var attributes = this.attributes.get(instance.id.id);
        if (!defined(attributes)) {
            attributes = primitive.getGeometryInstanceAttributes(instance.id);
            this.attributes.set(instance.id.id, attributes);
        }
        var show = updater.entity.isShowing;
        var currentShow = attributes.show[0] === 1;
        if (show !== currentShow) {
            attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
        }
    }
    this.showsUpdated.removeAll();
};
Batch.prototype.contains = function (updater) {
    return this.updaters.contains(updater.id);
};
Batch.prototype.getBoundingSphere = function (updater, result) {
    var primitive = this.primitive;
    if (!primitive.ready) {
        return Cesium.BoundingSphereState.PENDING;
    }
    var attributes = primitive.getGeometryInstanceAttributes(updater.entity);
    if (!defined(attributes) || !defined(attributes.boundingSphere) || //
        (defined(attributes.show) && attributes.show[0] === 0)) {
        return Cesium.BoundingSphereState.FAILED;
    }
    attributes.boundingSphere.clone(result);
    return Cesium.BoundingSphereState.DONE;
};
Batch.prototype.removeAllPrimitives = function () {
    var primitives = this.primitives;
    var primitive = this.primitive;
    if (defined(primitive)) {
        primitives.remove(primitive);
        this.primitive = undefined;
        this.geometry.removeAll();
        this.updaters.removeAll();
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
        this.oldPrimitive = undefined;
    }
};
Batch.prototype.destroy = function () {
    var primitive = this.primitive;
    var primitives = this.primitives;
    if (defined(primitive)) {
        primitives.remove(primitive);
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
    }
    if (defined(this.removeMaterialSubscription)) {
        this.removeMaterialSubscription();
    }
};
let wasFixed = false;
export function fixCesiumEntitiesShadows() {
    if (wasFixed) {
        return;
    }
    Cesium.StaticGeometryColorBatch.prototype.add = function (time, updater) {
        var items;
        var translucent;
        var instance = updater.createFillGeometryInstance(time);
        if (instance.attributes.color.value[3] === 255) {
            items = this._solidItems;
            translucent = false;
        }
        else {
            items = this._translucentItems;
            translucent = true;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var item = items[i];
            if (item.isMaterial(updater)) {
                item.add(updater, instance);
                return;
            }
        }
        var batch = new Batch(this._primitives, translucent, this._appearanceType, this._depthFailAppearanceType, updater.depthFailMaterialProperty, this._closed, this._shadows);
        batch.add(updater, instance);
        items.push(batch);
    };
    wasFixed = true;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU3RhdGljR2VvbWV0cnlDb2xvckJhdGNoLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jZXNpdW0tZW5oYW5jZW1lbnRzL1N0YXRpY0dlb21ldHJ5Q29sb3JCYXRjaC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0dBR0c7QUFDSCxPQUFPLEVBQUUsS0FBSyxFQUFFLGdCQUFnQixFQUFFLE9BQU8sRUFBRSw4QkFBOEIsRUFBRyx3QkFBd0IsRUFDbEcsaURBQWlELEVBQUUsNkJBQTZCLEVBQUUsU0FBUyxFQUMzRixVQUFVLEVBQUUscUJBQXFCLEVBQ2pDLE1BQU0sUUFBUSxDQUFDO0FBR2pCLGlCQUFpQjtBQUNqQiw2Q0FBNkM7QUFDN0MsdUJBQXVCO0FBQ3ZCLHlFQUF5RTtBQUN6RSwyQkFBMkI7QUFDM0IsNkRBQTZEO0FBQzdELCtHQUErRztBQUMvRyx1RUFBdUU7QUFDdkUsK0JBQStCO0FBQy9CLGlDQUFpQztBQUNqQyxtREFBbUQ7QUFDbkQsdURBQXVEO0FBQ3ZELDZDQUE2QztBQUM3Qyw4QkFBOEI7QUFFOUIsSUFBSSxZQUFZLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQztBQUMvQixJQUFJLCtCQUErQixHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQztBQUNyRSxJQUFJLCtCQUErQixHQUFHLElBQUksd0JBQXdCLEVBQUUsQ0FBQztBQUVyRSxTQUFTLEtBQUssQ0FBQyxVQUFVLEVBQUUsV0FBVyxFQUFFLGNBQWMsRUFBRSx1QkFBdUIsRUFBRSx5QkFBeUIsRUFBRSxNQUFNLEVBQUUsT0FBTztJQUN6SCxJQUFJLENBQUMsV0FBVyxHQUFHLFdBQVcsQ0FBQztJQUMvQixJQUFJLENBQUMsY0FBYyxHQUFHLGNBQWMsQ0FBQztJQUNyQyxJQUFJLENBQUMsdUJBQXVCLEdBQUcsdUJBQXVCLENBQUM7SUFDdkQsSUFBSSxDQUFDLHlCQUF5QixHQUFHLHlCQUF5QixDQUFD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QyxHQUFHLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO2dCQUM1QixPQUFPO2FBQ1I7U0FFRjtRQUVELElBQUksS0FBSyxHQUFRLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsV0FBVyxFQUFFLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLHdCQUF3QixFQUFFLE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztRQUMvSyxLQUFLLENBQUMsR0FBRyxDQUFDLE9BQU8sRUFBRSxRQUFRLENBQUMsQ0FBQztRQUM3QixLQUFLLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztJQUNGLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxyXG4gKiBGaXggZm9yIHRoZSBjb25zdGFudCBlbnRpdHkgc2hhZG93aW5nLlxyXG4gKiBQUiBpbiBDZXNpdW0gcmVwbzogaHR0cHM6Ly9naXRodWIuY29tL0FuYWx5dGljYWxHcmFwaGljc0luYy9jZXNpdW0vcHVsbC81NzM2XHJcbiAqL1xyXG5pbXBvcnQgeyBDb2xvciwgQXNzb2NpYXRpdmVBcnJheSwgZGVmaW5lZCwgQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLCAgRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLFxyXG4gIERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUsIFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLCBQcmltaXRpdmUsXHJcbiAgU2hhZG93TW9kZSwgQ29sb3JNYXRlcmlhbFByb3BlcnR5XHJcbiB9IGZyb20gJ2Nlc2l1bSc7XHJcbiBkZWNsYXJlIHZhciBDZXNpdW06IGFueTtcclxuXHJcbi8vIHRzbGludDpkaXNhYmxlXHJcbi8vIGNvbnN0IEFzc29jaWF0aXZlQXJyYXkgPSBBc3NvY2lhdGl2ZUFycmF5O1xyXG4vLyBjb25zdCBDb2xvciA9IENvbG9yO1xyXG4vLyBjb25zdCBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBDb2xvckdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGU7XHJcbi8vIGNvbnN0IGRlZmluZWQgPSBkZWZpbmVkO1xyXG4vLyBjb25zdCBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb247XHJcbi8vIGNvbnN0IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUgPSBEaXN0YW5jZURpc3BsYXlDb25kaXRpb25HZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xyXG4vLyBjb25zdCBTaG93R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZSA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlO1xyXG4vLyBjb25zdCBQcmltaXRpdmUgPSBQcmltaXRpdmU7XHJcbi8vIGNvbnN0IFNoYWRvd01vZGUgPSBTaGFkb3dNb2RlO1xyXG4vLyBjb25zdCBCb3VuZGluZ1NwaGVyZVN0YXRlID0gQm91bmRpbmdTcGhlcmVTdGF0ZTtcclxuLy8gY29uc3QgQ29sb3JNYXRlcmlhbFByb3BlcnR5ID0gQ29sb3JNYXRlcmlhbFByb3BlcnR5O1xyXG4vLyBjb25zdCBNYXRlcmlhbFByb3BlcnR5ID0gTWF0ZXJpYWxQcm9wZXJ0eTtcclxuLy8gIGNvbnN0IFByb3BlcnR5ID0gUHJvcGVydHk7XHJcblxyXG52YXIgY29sb3JTY3JhdGNoID0gbmV3IENvbG9yKCk7XHJcbnZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb25TY3JhdGNoID0gbmV3IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbigpO1xyXG52YXIgZGVmYXVsdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IG5ldyBEaXN0YW5jZURpc3BsYXlDb25kaXRpb24oKTtcclxuXHJcbmZ1bmN0aW9uIEJhdGNoKHByaW1pdGl2ZXMsIHRyYW5zbHVjZW50LCBhcHBlYXJhbmNlVHlwZSwgZGVwdGhGYWlsQXBwZWFyYW5jZVR5cGUsIGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIGNsb3NlZCwgc2hhZG93cykge1xyXG4gIHRoaXMudHJhbnNsdWNlbnQgPSB0cmFuc2x1Y2VudDtcclxuICB0aGlzLmFwcGVhcmFuY2VUeXBlID0gYXBwZWFyYW5jZVR5cGU7XHJcbiAgdGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSA9IGRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlO1xyXG4gIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSA9IGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHk7XHJcbiAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IHVuZGVmaW5lZDtcclxuICB0aGlzLmNsb3NlZCA9IGNsb3NlZDtcclxuICB0aGlzLnNoYWRvd3MgPSBzaGFkb3dzO1xyXG4gIHRoaXMucHJpbWl0aXZlcyA9IHByaW1pdGl2ZXM7XHJcbiAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcclxuICB0aGlzLndhaXRpbmdPbkNyZWF0ZSA9IGZhbHNlO1xyXG4gIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xyXG4gIHRoaXMuZ2VvbWV0cnkgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xyXG4gIHRoaXMudXBkYXRlcnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xyXG4gIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcyA9IG5ldyBBc3NvY2lhdGl2ZUFycmF5KCk7XHJcbiAgdGhpcy5hdHRyaWJ1dGVzID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcclxuICB0aGlzLnN1YnNjcmlwdGlvbnMgPSBuZXcgQXNzb2NpYXRpdmVBcnJheSgpO1xyXG4gIHRoaXMuc2hvd3NVcGRhdGVkID0gbmV3IEFzc29jaWF0aXZlQXJyYXkoKTtcclxuICB0aGlzLml0ZW1zVG9SZW1vdmUgPSBbXTtcclxuICB0aGlzLmludmFsaWRhdGVkID0gZmFsc2U7XHJcbiAgXHJcbiAgdmFyIHJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uO1xyXG4gIGlmIChkZWZpbmVkKGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XHJcbiAgICByZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbiA9IGRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkuZGVmaW5pdGlvbkNoYW5nZWQuYWRkRXZlbnRMaXN0ZW5lcihCYXRjaC5wcm90b3R5cGUub25NYXRlcmlhbENoYW5nZWQsIHRoaXMpO1xyXG4gIH1cclxuICB0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uID0gcmVtb3ZlTWF0ZXJpYWxTdWJzY3JpcHRpb247XHJcbn1cclxuXHJcbkJhdGNoLnByb3RvdHlwZS5vbk1hdGVyaWFsQ2hhbmdlZCA9IGZ1bmN0aW9uICgpIHtcclxuICB0aGlzLmludmFsaWRhdGVkID0gdHJ1ZTtcclxufTtcclxuXHJcbkJhdGNoLnByb3RvdHlwZS5pc01hdGVyaWFsID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcclxuICB2YXIgbWF0ZXJpYWwgPSB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHk7XHJcbiAgdmFyIHVwZGF0ZXJNYXRlcmlhbCA9IHVwZGF0ZXIuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eTtcclxuICBpZiAodXBkYXRlck1hdGVyaWFsID09PSBtYXRlcmlhbCkge1xyXG4gICAgcmV0dXJuIHRydWU7XHJcbiAgfVxyXG4gIGlmIChkZWZpbmVkKG1hdGVyaWFsKSkge1xyXG4gICAgcmV0dXJuIG1hdGVyaWFsLmVxdWFscyh1cGRhdGVyTWF0ZXJpYWwpO1xyXG4gIH1cclxuICByZXR1cm4gZmFsc2U7XHJcbn07XHJcblxyXG5CYXRjaC5wcm90b3R5cGUuYWRkID0gZnVuY3Rpb24gKHVwZGF0ZXIsIGluc3RhbmNlKSB7XHJcbiAgdmFyIGlkID0gdXBkYXRlci5pZDtcclxuICB0aGlzLmNyZWF0ZVByaW1pdGl2ZSA9IHRydWU7XHJcbiAgdGhpcy5nZW9tZXRyeS5zZXQoaWQsIGluc3RhbmNlKTtcclxuICB0aGlzLnVwZGF0ZXJzLnNldChpZCwgdXBkYXRlcik7XHJcbiAgaWYgKCF1cGRhdGVyLmhhc0NvbnN0YW50RmlsbCB8fCAhdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8ICFDZXNpdW0uUHJvcGVydHkuaXNDb25zdGFudCh1cGRhdGVyLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5KSkge1xyXG4gICAgdGhpcy51cGRhdGVyc1dpdGhBdHRyaWJ1dGVzLnNldChpZCwgdXBkYXRlcik7XHJcbiAgfSBlbHNlIHtcclxuICAgIHZhciB0aGF0ID0gdGhpcztcclxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5zZXQoaWQsIHVwZGF0ZXIuZW50aXR5LmRlZmluaXRpb25DaGFuZ2VkLmFkZEV2ZW50TGlzdGVuZXIoZnVuY3Rpb24gKGVudGl0eSwgcHJvcGVydHlOYW1lLCBuZXdWYWx1ZSwgb2xkVmFsdWUpIHtcclxuICAgICAgaWYgKHByb3BlcnR5TmFtZSA9PT0gJ2lzU2hvd2luZycpIHtcclxuICAgICAgICB0aGF0LnNob3dzVXBkYXRlZC5zZXQodXBkYXRlci5pZCwgdXBkYXRlcik7XHJcbiAgICAgIH1cclxuICAgIH0pKTtcclxuICB9XHJcbn07XHJcblxyXG5CYXRjaC5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24gKHVwZGF0ZXIpIHtcclxuICB2YXIgaWQgPSB1cGRhdGVyLmlkO1xyXG4gIHRoaXMuY3JlYXRlUHJpbWl0aXZlID0gdGhpcy5nZW9tZXRyeS5yZW1vdmUoaWQpIHx8IHRoaXMuY3JlYXRlUHJpbWl0aXZlO1xyXG4gIGlmICh0aGlzLnVwZGF0ZXJzLnJlbW92ZShpZCkpIHtcclxuICAgIHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy5yZW1vdmUoaWQpO1xyXG4gICAgdmFyIHVuc3Vic2NyaWJlID0gdGhpcy5zdWJzY3JpcHRpb25zLmdldChpZCk7XHJcbiAgICBpZiAoZGVmaW5lZCh1bnN1YnNjcmliZSkpIHtcclxuICAgICAgdW5zdWJzY3JpYmUoKTtcclxuICAgICAgdGhpcy5zdWJzY3JpcHRpb25zLnJlbW92ZShpZCk7XHJcbiAgICB9XHJcbiAgfVxyXG59O1xyXG5cclxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZSA9IGZ1bmN0aW9uICh0aW1lKSB7XHJcbiAgdmFyIGlzVXBkYXRlZCA9IHRydWU7XHJcbiAgdmFyIHJlbW92ZWRDb3VudCA9IDA7XHJcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xyXG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xyXG4gIHZhciBhdHRyaWJ1dGVzO1xyXG4gIHZhciBpO1xyXG4gIFxyXG4gIGlmICh0aGlzLmNyZWF0ZVByaW1pdGl2ZSkge1xyXG4gICAgdmFyIGdlb21ldHJpZXMgPSB0aGlzLmdlb21ldHJ5LnZhbHVlcztcclxuICAgIHZhciBnZW9tZXRyaWVzTGVuZ3RoID0gZ2VvbWV0cmllcy5sZW5ndGg7XHJcbiAgICBpZiAoZ2VvbWV0cmllc0xlbmd0aCA+IDApIHtcclxuICAgICAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xyXG4gICAgICAgIGlmICghZGVmaW5lZCh0aGlzLm9sZFByaW1pdGl2ZSkpIHtcclxuICAgICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gcHJpbWl0aXZlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgZm9yIChpID0gMDsgaSA8IGdlb21ldHJpZXNMZW5ndGg7IGkrKykge1xyXG4gICAgICAgIHZhciBnZW9tZXRyeUl0ZW0gPSBnZW9tZXRyaWVzW2ldO1xyXG4gICAgICAgIHZhciBvcmlnaW5hbEF0dHJpYnV0ZXMgPSBnZW9tZXRyeUl0ZW0uYXR0cmlidXRlcztcclxuICAgICAgICBhdHRyaWJ1dGVzID0gdGhpcy5hdHRyaWJ1dGVzLmdldChnZW9tZXRyeUl0ZW0uaWQuaWQpO1xyXG4gICAgICAgIFxyXG4gICAgICAgIGlmIChkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuc2hvdykpIHtcclxuICAgICAgICAgICAgb3JpZ2luYWxBdHRyaWJ1dGVzLnNob3cudmFsdWUgPSBhdHRyaWJ1dGVzLnNob3c7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuY29sb3IpKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5jb2xvci52YWx1ZSA9IGF0dHJpYnV0ZXMuY29sb3I7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgICBpZiAoZGVmaW5lZChvcmlnaW5hbEF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3IpKSB7XHJcbiAgICAgICAgICAgIG9yaWdpbmFsQXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvci52YWx1ZSA9IGF0dHJpYnV0ZXMuZGVwdGhGYWlsQ29sb3I7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZGVwdGhGYWlsQXBwZWFyYW5jZTtcclxuICAgICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkpIHtcclxuICAgICAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHkpKSB7XHJcbiAgICAgICAgICB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsID0gQ2VzaXVtLk1hdGVyaWFsUHJvcGVydHkuZ2V0VmFsdWUodGltZSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LCB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgZGVwdGhGYWlsQXBwZWFyYW5jZSA9IG5ldyB0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKHtcclxuICAgICAgICAgIG1hdGVyaWFsOiB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsLFxyXG4gICAgICAgICAgdHJhbnNsdWNlbnQ6IHRoaXMudHJhbnNsdWNlbnQsXHJcbiAgICAgICAgICBjbG9zZWQ6IHRoaXMuY2xvc2VkXHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIHByaW1pdGl2ZSA9IG5ldyBQcmltaXRpdmUoe1xyXG4gICAgICAgIHNob3c6IGZhbHNlLFxyXG4gICAgICAgIGFzeW5jaHJvbm91czogdHJ1ZSxcclxuICAgICAgICBnZW9tZXRyeUluc3RhbmNlczogZ2VvbWV0cmllcyxcclxuICAgICAgICBhcHBlYXJhbmNlOiBuZXcgdGhpcy5hcHBlYXJhbmNlVHlwZSh7XHJcbiAgICAgICAgICBmbGF0OiB0aGlzLnNoYWRvd3MgPT09IFNoYWRvd01vZGUuRElTQUJMRUQgfHwgdGhpcy5zaGFkb3dzID09PSBTaGFkb3dNb2RlLkNBU1RfT05MWSxcclxuICAgICAgICAgIHRyYW5zbHVjZW50OiB0aGlzLnRyYW5zbHVjZW50LFxyXG4gICAgICAgICAgY2xvc2VkOiB0aGlzLmNsb3NlZFxyXG4gICAgICAgIH0pLFxyXG4gICAgICAgIGRlcHRoRmFpbEFwcGVhcmFuY2U6IGRlcHRoRmFpbEFwcGVhcmFuY2UsXHJcbiAgICAgICAgc2hhZG93czogdGhpcy5zaGFkb3dzXHJcbiAgICAgIH0pO1xyXG4gICAgICBwcmltaXRpdmVzLmFkZChwcmltaXRpdmUpO1xyXG4gICAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcclxuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShwcmltaXRpdmUpO1xyXG4gICAgICAgIHByaW1pdGl2ZSA9IHVuZGVmaW5lZDtcclxuICAgICAgfVxyXG4gICAgICB2YXIgb2xkUHJpbWl0aXZlID0gdGhpcy5vbGRQcmltaXRpdmU7XHJcbiAgICAgIGlmIChkZWZpbmVkKG9sZFByaW1pdGl2ZSkpIHtcclxuICAgICAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xyXG4gICAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHRoaXMuYXR0cmlidXRlcy5yZW1vdmVBbGwoKTtcclxuICAgIHRoaXMucHJpbWl0aXZlID0gcHJpbWl0aXZlO1xyXG4gICAgdGhpcy5jcmVhdGVQcmltaXRpdmUgPSBmYWxzZTtcclxuICAgIHRoaXMud2FpdGluZ09uQ3JlYXRlID0gdHJ1ZTtcclxuICB9IGVsc2UgaWYgKGRlZmluZWQocHJpbWl0aXZlKSAmJiBwcmltaXRpdmUucmVhZHkpIHtcclxuICAgIHByaW1pdGl2ZS5zaG93ID0gdHJ1ZTtcclxuICAgIGlmIChkZWZpbmVkKHRoaXMub2xkUHJpbWl0aXZlKSkge1xyXG4gICAgICBwcmltaXRpdmVzLnJlbW92ZSh0aGlzLm9sZFByaW1pdGl2ZSk7XHJcbiAgICAgIHRoaXMub2xkUHJpbWl0aXZlID0gdW5kZWZpbmVkO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICBpZiAoZGVmaW5lZCh0aGlzLmRlcHRoRmFpbEFwcGVhcmFuY2VUeXBlKSAmJiAhKHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSBpbnN0YW5jZW9mIENvbG9yTWF0ZXJpYWxQcm9wZXJ0eSkpIHtcclxuICAgICAgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCA9IENlc2l1bS5NYXRlcmlhbFByb3BlcnR5LmdldFZhbHVlKHRpbWUsIHRoaXMuZGVwdGhGYWlsTWF0ZXJpYWxQcm9wZXJ0eSwgdGhpcy5kZXB0aEZhaWxNYXRlcmlhbCk7XHJcbiAgICAgIHRoaXMucHJpbWl0aXZlLmRlcHRoRmFpbEFwcGVhcmFuY2UubWF0ZXJpYWwgPSB0aGlzLmRlcHRoRmFpbE1hdGVyaWFsO1xyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgdXBkYXRlcnNXaXRoQXR0cmlidXRlcyA9IHRoaXMudXBkYXRlcnNXaXRoQXR0cmlidXRlcy52YWx1ZXM7XHJcbiAgICB2YXIgbGVuZ3RoID0gdXBkYXRlcnNXaXRoQXR0cmlidXRlcy5sZW5ndGg7XHJcbiAgICB2YXIgd2FpdGluZ09uQ3JlYXRlID0gdGhpcy53YWl0aW5nT25DcmVhdGU7XHJcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcclxuICAgICAgdmFyIHVwZGF0ZXIgPSB1cGRhdGVyc1dpdGhBdHRyaWJ1dGVzW2ldO1xyXG4gICAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdlb21ldHJ5LmdldCh1cGRhdGVyLmlkKTtcclxuICAgICAgXHJcbiAgICAgIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcclxuICAgICAgaWYgKCFkZWZpbmVkKGF0dHJpYnV0ZXMpKSB7XHJcbiAgICAgICAgYXR0cmlidXRlcyA9IHByaW1pdGl2ZS5nZXRHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlcyhpbnN0YW5jZS5pZCk7XHJcbiAgICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XHJcbiAgICAgIH1cclxuICAgICAgXHJcbiAgICAgIGlmICghdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5pc0NvbnN0YW50IHx8IHdhaXRpbmdPbkNyZWF0ZSkge1xyXG4gICAgICAgIHZhciBjb2xvclByb3BlcnR5ID0gdXBkYXRlci5maWxsTWF0ZXJpYWxQcm9wZXJ0eS5jb2xvcjtcclxuICAgICAgICB2YXIgcmVzdWx0Q29sb3IgPSBDZXNpdW0uUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoY29sb3JQcm9wZXJ0eSwgdGltZSwgQ29sb3IuV0hJVEUsIGNvbG9yU2NyYXRjaCk7XHJcbiAgICAgICAgaWYgKCFDb2xvci5lcXVhbHMoYXR0cmlidXRlcy5fbGFzdENvbG9yLCByZXN1bHRDb2xvcikpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3RDb2xvciA9IENvbG9yLmNsb25lKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLl9sYXN0Q29sb3IpO1xyXG4gICAgICAgICAgYXR0cmlidXRlcy5jb2xvciA9IENvbG9yR2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZS50b1ZhbHVlKHJlc3VsdENvbG9yLCBhdHRyaWJ1dGVzLmNvbG9yKTtcclxuICAgICAgICAgIGlmICgodGhpcy50cmFuc2x1Y2VudCAmJiBhdHRyaWJ1dGVzLmNvbG9yWzNdID09PSAyNTUpIHx8ICghdGhpcy50cmFuc2x1Y2VudCAmJiBhdHRyaWJ1dGVzLmNvbG9yWzNdICE9PSAyNTUpKSB7XHJcbiAgICAgICAgICAgIHRoaXMuaXRlbXNUb1JlbW92ZVtyZW1vdmVkQ291bnQrK10gPSB1cGRhdGVyO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgICBcclxuICAgICAgaWYgKGRlZmluZWQodGhpcy5kZXB0aEZhaWxBcHBlYXJhbmNlVHlwZSkgJiYgdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5IGluc3RhbmNlb2YgQ29sb3JNYXRlcmlhbFByb3BlcnR5ICYmICghdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmlzQ29uc3RhbnQgfHwgd2FpdGluZ09uQ3JlYXRlKSkge1xyXG4gICAgICAgIHZhciBkZXB0aEZhaWxDb2xvclByb3BlcnR5ID0gdXBkYXRlci5kZXB0aEZhaWxNYXRlcmlhbFByb3BlcnR5LmNvbG9yO1xyXG4gICAgICAgIHZhciBkZXB0aENvbG9yID0gQ2VzaXVtLlByb3BlcnR5LmdldFZhbHVlT3JEZWZhdWx0KGRlcHRoRmFpbENvbG9yUHJvcGVydHksIHRpbWUsIENvbG9yLldISVRFLCBjb2xvclNjcmF0Y2gpO1xyXG4gICAgICAgIGlmICghQ29sb3IuZXF1YWxzKGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvciwgZGVwdGhDb2xvcikpIHtcclxuICAgICAgICAgIGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvciA9IENvbG9yLmNsb25lKGRlcHRoQ29sb3IsIGF0dHJpYnV0ZXMuX2xhc3REZXB0aEZhaWxDb2xvcik7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRlcHRoRmFpbENvbG9yID0gQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoZGVwdGhDb2xvciwgYXR0cmlidXRlcy5kZXB0aEZhaWxDb2xvcik7XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgc2hvdyA9IHVwZGF0ZXIuZW50aXR5LmlzU2hvd2luZyAmJiAodXBkYXRlci5oYXNDb25zdGFudEZpbGwgfHwgdXBkYXRlci5pc0ZpbGxlZCh0aW1lKSk7XHJcbiAgICAgIHZhciBjdXJyZW50U2hvdyA9IGF0dHJpYnV0ZXMuc2hvd1swXSA9PT0gMTtcclxuICAgICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XHJcbiAgICAgICAgYXR0cmlidXRlcy5zaG93ID0gU2hvd0dlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShzaG93LCBhdHRyaWJ1dGVzLnNob3cpO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgICB2YXIgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHkgPSB1cGRhdGVyLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5O1xyXG4gICAgICBpZiAoIUNlc2l1bS5Qcm9wZXJ0eS5pc0NvbnN0YW50KGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblByb3BlcnR5KSkge1xyXG4gICAgICAgIHZhciBkaXN0YW5jZURpc3BsYXlDb25kaXRpb24gPSBDZXNpdW0uUHJvcGVydHkuZ2V0VmFsdWVPckRlZmF1bHQoZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uUHJvcGVydHksIHRpbWUsIGRlZmF1bHREaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvblNjcmF0Y2gpO1xyXG4gICAgICAgIGlmICghRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLmVxdWFscyhkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuX2xhc3REaXN0YW5jZURpc3BsYXlDb25kaXRpb24pKSB7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzLl9sYXN0RGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uID0gRGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uLmNsb25lKGRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiwgYXR0cmlidXRlcy5fbGFzdERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbik7XHJcbiAgICAgICAgICBhdHRyaWJ1dGVzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IERpc3RhbmNlRGlzcGxheUNvbmRpdGlvbkdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGUudG9WYWx1ZShkaXN0YW5jZURpc3BsYXlDb25kaXRpb24sIGF0dHJpYnV0ZXMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH1cclxuICAgIFxyXG4gICAgdGhpcy51cGRhdGVTaG93cyhwcmltaXRpdmUpO1xyXG4gICAgdGhpcy53YWl0aW5nT25DcmVhdGUgPSBmYWxzZTtcclxuICB9IGVsc2UgaWYgKGRlZmluZWQocHJpbWl0aXZlKSAmJiAhcHJpbWl0aXZlLnJlYWR5KSB7XHJcbiAgICBpc1VwZGF0ZWQgPSBmYWxzZTtcclxuICB9XHJcbiAgdGhpcy5pdGVtc1RvUmVtb3ZlLmxlbmd0aCA9IHJlbW92ZWRDb3VudDtcclxuICByZXR1cm4gaXNVcGRhdGVkO1xyXG59O1xyXG5cclxuQmF0Y2gucHJvdG90eXBlLnVwZGF0ZVNob3dzID0gZnVuY3Rpb24gKHByaW1pdGl2ZSkge1xyXG4gIHZhciBzaG93c1VwZGF0ZWQgPSB0aGlzLnNob3dzVXBkYXRlZC52YWx1ZXM7XHJcbiAgdmFyIGxlbmd0aCA9IHNob3dzVXBkYXRlZC5sZW5ndGg7XHJcbiAgZm9yICh2YXIgaSA9IDA7IGkgPCBsZW5ndGg7IGkrKykge1xyXG4gICAgdmFyIHVwZGF0ZXIgPSBzaG93c1VwZGF0ZWRbaV07XHJcbiAgICB2YXIgaW5zdGFuY2UgPSB0aGlzLmdlb21ldHJ5LmdldCh1cGRhdGVyLmlkKTtcclxuICAgIFxyXG4gICAgdmFyIGF0dHJpYnV0ZXMgPSB0aGlzLmF0dHJpYnV0ZXMuZ2V0KGluc3RhbmNlLmlkLmlkKTtcclxuICAgIGlmICghZGVmaW5lZChhdHRyaWJ1dGVzKSkge1xyXG4gICAgICBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKGluc3RhbmNlLmlkKTtcclxuICAgICAgdGhpcy5hdHRyaWJ1dGVzLnNldChpbnN0YW5jZS5pZC5pZCwgYXR0cmlidXRlcyk7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBzaG93ID0gdXBkYXRlci5lbnRpdHkuaXNTaG93aW5nO1xyXG4gICAgdmFyIGN1cnJlbnRTaG93ID0gYXR0cmlidXRlcy5zaG93WzBdID09PSAxO1xyXG4gICAgaWYgKHNob3cgIT09IGN1cnJlbnRTaG93KSB7XHJcbiAgICAgIGF0dHJpYnV0ZXMuc2hvdyA9IFNob3dHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLnRvVmFsdWUoc2hvdywgYXR0cmlidXRlcy5zaG93KTtcclxuICAgIH1cclxuICB9XHJcbiAgdGhpcy5zaG93c1VwZGF0ZWQucmVtb3ZlQWxsKCk7XHJcbn07XHJcblxyXG5CYXRjaC5wcm90b3R5cGUuY29udGFpbnMgPSBmdW5jdGlvbiAodXBkYXRlcikge1xyXG4gIHJldHVybiB0aGlzLnVwZGF0ZXJzLmNvbnRhaW5zKHVwZGF0ZXIuaWQpO1xyXG59O1xyXG5cclxuQmF0Y2gucHJvdG90eXBlLmdldEJvdW5kaW5nU3BoZXJlID0gZnVuY3Rpb24gKHVwZGF0ZXIsIHJlc3VsdCkge1xyXG4gIHZhciBwcmltaXRpdmUgPSB0aGlzLnByaW1pdGl2ZTtcclxuICBpZiAoIXByaW1pdGl2ZS5yZWFkeSkge1xyXG4gICAgcmV0dXJuIENlc2l1bS5Cb3VuZGluZ1NwaGVyZVN0YXRlLlBFTkRJTkc7XHJcbiAgfVxyXG4gIHZhciBhdHRyaWJ1dGVzID0gcHJpbWl0aXZlLmdldEdlb21ldHJ5SW5zdGFuY2VBdHRyaWJ1dGVzKHVwZGF0ZXIuZW50aXR5KTtcclxuICBpZiAoIWRlZmluZWQoYXR0cmlidXRlcykgfHwgIWRlZmluZWQoYXR0cmlidXRlcy5ib3VuZGluZ1NwaGVyZSkgfHwvL1xyXG4gICAgKGRlZmluZWQoYXR0cmlidXRlcy5zaG93KSAmJiBhdHRyaWJ1dGVzLnNob3dbMF0gPT09IDApKSB7XHJcbiAgICByZXR1cm4gQ2VzaXVtLkJvdW5kaW5nU3BoZXJlU3RhdGUuRkFJTEVEO1xyXG4gIH1cclxuICBhdHRyaWJ1dGVzLmJvdW5kaW5nU3BoZXJlLmNsb25lKHJlc3VsdCk7XHJcbiAgcmV0dXJuIENlc2l1bS5Cb3VuZGluZ1NwaGVyZVN0YXRlLkRPTkU7XHJcbn07XHJcblxyXG5CYXRjaC5wcm90b3R5cGUucmVtb3ZlQWxsUHJpbWl0aXZlcyA9IGZ1bmN0aW9uICgpIHtcclxuICB2YXIgcHJpbWl0aXZlcyA9IHRoaXMucHJpbWl0aXZlcztcclxuICBcclxuICB2YXIgcHJpbWl0aXZlID0gdGhpcy5wcmltaXRpdmU7XHJcbiAgaWYgKGRlZmluZWQocHJpbWl0aXZlKSkge1xyXG4gICAgcHJpbWl0aXZlcy5yZW1vdmUocHJpbWl0aXZlKTtcclxuICAgIHRoaXMucHJpbWl0aXZlID0gdW5kZWZpbmVkO1xyXG4gICAgdGhpcy5nZW9tZXRyeS5yZW1vdmVBbGwoKTtcclxuICAgIHRoaXMudXBkYXRlcnMucmVtb3ZlQWxsKCk7XHJcbiAgfVxyXG4gIFxyXG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcclxuICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XHJcbiAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xyXG4gICAgdGhpcy5vbGRQcmltaXRpdmUgPSB1bmRlZmluZWQ7XHJcbiAgfVxyXG59O1xyXG5cclxuQmF0Y2gucHJvdG90eXBlLmRlc3Ryb3kgPSBmdW5jdGlvbiAoKSB7XHJcbiAgdmFyIHByaW1pdGl2ZSA9IHRoaXMucHJpbWl0aXZlO1xyXG4gIHZhciBwcmltaXRpdmVzID0gdGhpcy5wcmltaXRpdmVzO1xyXG4gIGlmIChkZWZpbmVkKHByaW1pdGl2ZSkpIHtcclxuICAgIHByaW1pdGl2ZXMucmVtb3ZlKHByaW1pdGl2ZSk7XHJcbiAgfVxyXG4gIHZhciBvbGRQcmltaXRpdmUgPSB0aGlzLm9sZFByaW1pdGl2ZTtcclxuICBpZiAoZGVmaW5lZChvbGRQcmltaXRpdmUpKSB7XHJcbiAgICBwcmltaXRpdmVzLnJlbW92ZShvbGRQcmltaXRpdmUpO1xyXG4gIH1cclxuICBpZiAoZGVmaW5lZCh0aGlzLnJlbW92ZU1hdGVyaWFsU3Vic2NyaXB0aW9uKSkge1xyXG4gICAgdGhpcy5yZW1vdmVNYXRlcmlhbFN1YnNjcmlwdGlvbigpO1xyXG4gIH1cclxufTtcclxuXHJcblxyXG5sZXQgd2FzRml4ZWQgPSBmYWxzZTtcclxuXHJcbmV4cG9ydCBmdW5jdGlvbiBmaXhDZXNpdW1FbnRpdGllc1NoYWRvd3MoKSB7XHJcbiAgaWYgKHdhc0ZpeGVkKSB7XHJcbiAgICByZXR1cm47XHJcbiAgfVxyXG4gIENlc2l1bS5TdGF0aWNHZW9tZXRyeUNvbG9yQmF0Y2gucHJvdG90eXBlLmFkZCA9IGZ1bmN0aW9uICh0aW1lOiBhbnksIHVwZGF0ZXI6IGFueSkge1xyXG4gICAgdmFyIGl0ZW1zO1xyXG4gICAgdmFyIHRyYW5zbHVjZW50O1xyXG4gICAgdmFyIGluc3RhbmNlID0gdXBkYXRlci5jcmVhdGVGaWxsR2VvbWV0cnlJbnN0YW5jZSh0aW1lKTtcclxuICAgIGlmIChpbnN0YW5jZS5hdHRyaWJ1dGVzLmNvbG9yLnZhbHVlWzNdID09PSAyNTUpIHtcclxuICAgICAgaXRlbXMgPSB0aGlzLl9zb2xpZEl0ZW1zO1xyXG4gICAgICB0cmFuc2x1Y2VudCA9IGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgaXRlbXMgPSB0aGlzLl90cmFuc2x1Y2VudEl0ZW1zO1xyXG4gICAgICB0cmFuc2x1Y2VudCA9IHRydWU7XHJcbiAgICB9XHJcbiAgICBcclxuICAgIHZhciBsZW5ndGggPSBpdGVtcy5sZW5ndGg7XHJcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGxlbmd0aDsgaSsrKSB7XHJcbiAgICAgIHZhciBpdGVtID0gaXRlbXNbaV07XHJcbiAgICAgIGlmIChpdGVtLmlzTWF0ZXJpYWwodXBkYXRlcikpIHtcclxuICAgICAgICBpdGVtLmFkZCh1cGRhdGVyLCBpbnN0YW5jZSk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIFxyXG4gICAgfVxyXG4gICAgXHJcbiAgICB2YXIgYmF0Y2g6IGFueSA9IG5ldyBCYXRjaCh0aGlzLl9wcmltaXRpdmVzLCB0cmFuc2x1Y2VudCwgdGhpcy5fYXBwZWFyYW5jZVR5cGUsIHRoaXMuX2RlcHRoRmFpbEFwcGVhcmFuY2VUeXBlLCB1cGRhdGVyLmRlcHRoRmFpbE1hdGVyaWFsUHJvcGVydHksIHRoaXMuX2Nsb3NlZCwgdGhpcy5fc2hhZG93cyk7XHJcbiAgICBiYXRjaC5hZGQodXBkYXRlciwgaW5zdGFuY2UpO1xyXG4gICAgaXRlbXMucHVzaChiYXRjaCk7XHJcbiAgfTtcclxuICB3YXNGaXhlZCA9IHRydWU7XHJcbn1cclxuIl19