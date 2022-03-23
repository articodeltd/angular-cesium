import { Input, Directive } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../drawers/static-dynamic/static-primitive-drawer/static-primitive-drawer.service";
import * as i2 from "../layer-service/layer-service.service";
import * as i3 from "../computation-cache/computation-cache.service";
import * as i4 from "../cesium-properties/cesium-properties.service";
export class BasicStaticPrimitiveDesc extends BasicDesc {
    constructor(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
        this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
    }
    ngOnInit() {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    }
    draw(context, id, entity) {
        const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    }
}
BasicStaticPrimitiveDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicStaticPrimitiveDesc, deps: [{ token: i1.StaticPrimitiveDrawer }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicStaticPrimitiveDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: BasicStaticPrimitiveDesc, inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicStaticPrimitiveDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i1.StaticPrimitiveDrawer }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxLQUFLLEVBQVUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3pELE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxrQ0FBa0MsQ0FBQzs7Ozs7O0FBUTdELE1BQU0sT0FBTyx3QkFBeUIsU0FBUSxTQUFTO0lBWXJELFlBQXNCLHNCQUE2QyxFQUFFLFlBQTBCLEVBQ25GLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsc0JBQXNCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7UUFGNUQsMkJBQXNCLEdBQXRCLHNCQUFzQixDQUF1QjtJQUduRSxDQUFDO0lBRUQsUUFBUTtRQUNOLElBQUksQ0FBQyxhQUFhLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFN0MsSUFBSSxDQUFDLHVCQUF1QixHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzFGLElBQUksQ0FBQyx1QkFBdUIsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsZUFBZSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQztRQUMxRixJQUFJLENBQUMsd0JBQXdCLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDOUYsQ0FBQztJQUVELElBQUksQ0FBQyxPQUFZLEVBQUUsRUFBVSxFQUFFLE1BQWdCO1FBQzdDLE1BQU0sYUFBYSxHQUFHLElBQUksQ0FBQyx1QkFBdUIsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsT0FBTyxDQUFDLENBQUM7UUFDcEYsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLHVCQUF1QixDQUFDLElBQUksQ0FBQyxpQkFBaUIsRUFBRSxPQUFPLENBQUMsQ0FBQztRQUNwRixNQUFNLGNBQWMsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLGlCQUFpQixFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBRXRGLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ25DLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxHQUFHLENBQUMsYUFBYSxFQUFFLGFBQWEsRUFBRSxjQUFjLENBQUMsQ0FBQztZQUNoRyxTQUFTLENBQUMsUUFBUSxHQUFHLE1BQU0sQ0FBQyxDQUFDLGtEQUFrRDtZQUMvRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztTQUMzQzthQUFNO1lBQ0wsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztZQUNqRCxJQUFJLENBQUMsc0JBQXNCLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxhQUFhLEVBQUUsYUFBYSxFQUFFLGNBQWMsQ0FBQyxDQUFDO1NBQzdGO0lBQ0gsQ0FBQzs7cUhBdENVLHdCQUF3Qjt5R0FBeEIsd0JBQXdCOzJGQUF4Qix3QkFBd0I7a0JBRHBDLFNBQVM7cU1BR1IsYUFBYTtzQkFEWixLQUFLO2dCQUdOLGFBQWE7c0JBRFosS0FBSztnQkFHTixjQUFjO3NCQURiLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbnB1dCwgT25Jbml0LCBEaXJlY3RpdmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0aWNQcmltaXRpdmVEcmF3ZXIgfSBmcm9tICcuLi9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY0VudGl0eSB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1lbnRpdHknO1xyXG5cclxuQERpcmVjdGl2ZSgpXHJcbmV4cG9ydCBjbGFzcyBCYXNpY1N0YXRpY1ByaW1pdGl2ZURlc2MgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xyXG4gIEBJbnB1dCgpXHJcbiAgZ2VvbWV0cnlQcm9wczogYW55O1xyXG4gIEBJbnB1dCgpXHJcbiAgaW5zdGFuY2VQcm9wczogYW55O1xyXG4gIEBJbnB1dCgpXHJcbiAgcHJpbWl0aXZlUHJvcHM6IGFueTtcclxuXHJcbiAgcHJpdmF0ZSBfZ2VvbWV0cnlQcm9wc0V2YWx1YXRvcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSBfaW5zdGFuY2VQcm9wc0V2YWx1YXRvcjogRnVuY3Rpb247XHJcbiAgcHJpdmF0ZSBfcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3I6IEZ1bmN0aW9uO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgX3N0YXRpY1ByaW1pdGl2ZURyYXdlcjogU3RhdGljUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihfc3RhdGljUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKTogdm9pZCB7XHJcbiAgICB0aGlzLl9sYXllclNlcnZpY2UucmVnaXN0ZXJEZXNjcmlwdGlvbih0aGlzKTtcclxuXHJcbiAgICB0aGlzLl9nZW9tZXRyeVByb3BzRXZhbHVhdG9yID0gdGhpcy5fY2VzaXVtUHJvcGVydGllcy5jcmVhdGVFdmFsdWF0b3IodGhpcy5nZW9tZXRyeVByb3BzKTtcclxuICAgIHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLmluc3RhbmNlUHJvcHMpO1xyXG4gICAgdGhpcy5fcHJpbWl0aXZlUHJvcHNFdmFsdWF0b3IgPSB0aGlzLl9jZXNpdW1Qcm9wZXJ0aWVzLmNyZWF0ZUV2YWx1YXRvcih0aGlzLnByaW1pdGl2ZVByb3BzKTtcclxuICB9XHJcblxyXG4gIGRyYXcoY29udGV4dDogYW55LCBpZDogc3RyaW5nLCBlbnRpdHk6IEFjRW50aXR5KTogYW55IHtcclxuICAgIGNvbnN0IGdlb21ldHJ5UHJvcHMgPSB0aGlzLl9nZW9tZXRyeVByb3BzRXZhbHVhdG9yKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xyXG4gICAgY29uc3QgaW5zdGFuY2VQcm9wcyA9IHRoaXMuX2luc3RhbmNlUHJvcHNFdmFsdWF0b3IodGhpcy5fY29tcHV0YXRpb25DYWNoZSwgY29udGV4dCk7XHJcbiAgICBjb25zdCBwcmltaXRpdmVQcm9wcyA9IHRoaXMuX3ByaW1pdGl2ZVByb3BzRXZhbHVhdG9yKHRoaXMuX2NvbXB1dGF0aW9uQ2FjaGUsIGNvbnRleHQpO1xyXG5cclxuICAgIGlmICghdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5oYXMoaWQpKSB7XHJcbiAgICAgIGNvbnN0IHByaW1pdGl2ZSA9IHRoaXMuX3N0YXRpY1ByaW1pdGl2ZURyYXdlci5hZGQoZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xyXG4gICAgICBwcmltaXRpdmUuYWNFbnRpdHkgPSBlbnRpdHk7IC8vIHNldCB0aGUgZW50aXR5IG9uIHRoZSBwcmltaXRpdmUgZm9yIGxhdGVyIHVzYWdlXHJcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5nZXQoaWQpO1xyXG4gICAgICB0aGlzLl9zdGF0aWNQcmltaXRpdmVEcmF3ZXIudXBkYXRlKHByaW1pdGl2ZSwgZ2VvbWV0cnlQcm9wcywgaW5zdGFuY2VQcm9wcywgcHJpbWl0aXZlUHJvcHMpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=