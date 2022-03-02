/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
import { Color, AssociativeArray, defined, ColorGeometryInstanceAttribute,  DistanceDisplayCondition,
  DistanceDisplayConditionGeometryInstanceAttribute, ShowGeometryInstanceAttribute, Primitive,
  ShadowMode, ColorMaterialProperty
 } from 'cesium';
 declare var Cesium: any;

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
  } else {
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
        } else {
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
    } else {
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
  } else if (defined(primitive) && primitive.ready) {
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
  } else if (defined(primitive) && !primitive.ready) {
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
  if (!defined(attributes) || !defined(attributes.boundingSphere) ||//
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
  Cesium.StaticGeometryColorBatch.prototype.add = function (time: any, updater: any) {
    var items;
    var translucent;
    var instance = updater.createFillGeometryInstance(time);
    if (instance.attributes.color.value[3] === 255) {
      items = this._solidItems;
      translucent = false;
    } else {
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
    
    var batch: any = new Batch(this._primitives, translucent, this._appearanceType, this._depthFailAppearanceType, updater.depthFailMaterialProperty, this._closed, this._shadows);
    batch.add(updater, instance);
    items.push(batch);
  };
  wasFixed = true;
}
