import { Injectable } from '@angular/core';
import { PolylineCollection, Color, Material } from 'cesium';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
export class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PolylineCollection, cesiumService);
    }
    add(cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    }
    update(cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        super.update(cesiumObject, cesiumProps);
    }
    withColorMaterial(cesiumProps) {
        if (cesiumProps.material instanceof Color) {
            const material = Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    }
}
PolylinePrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolylinePrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLEtBQUssRUFBRSxRQUFRLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFN0QsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUV6Rjs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sOEJBQStCLFNBQVEsdUJBQXVCO0lBQ3pFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLGtCQUFrQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxHQUFHLENBQUMsV0FBZ0I7UUFDbEIsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQyxDQUFDO0lBQ3pFLENBQUM7SUFFRCxNQUFNLENBQUMsWUFBaUIsRUFBRSxXQUFnQjtRQUN4QyxJQUFJLFdBQVcsQ0FBQyxRQUFRLFlBQVksS0FBSyxFQUFFO1lBQ3pDLElBQUksWUFBWSxDQUFDLFFBQVEsSUFBSSxZQUFZLENBQUMsUUFBUSxDQUFDLFFBQVE7Z0JBQ3pELFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssWUFBWSxLQUFLLEVBQUU7Z0JBQ3ZELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxXQUFXLENBQUMsQ0FBQzthQUNyQztpQkFBTSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsUUFBUSxDQUFDLEVBQUU7Z0JBQzdFLFlBQVksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsUUFBUSxDQUFDO2FBQzdEO1NBQ0Y7UUFDRCxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQVksRUFBRSxXQUFXLENBQUMsQ0FBQztJQUMxQyxDQUFDO0lBRUQsaUJBQWlCLENBQUMsV0FBZ0I7UUFDaEMsSUFBSSxXQUFXLENBQUMsUUFBUSxZQUFZLEtBQUssRUFBRTtZQUN6QyxNQUFNLFFBQVEsR0FBRyxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1lBQzVDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxRQUFRLENBQUM7WUFDL0MsV0FBVyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7U0FDakM7UUFFRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzsySEE3QlUsOEJBQThCOytIQUE5Qiw4QkFBOEI7MkZBQTlCLDhCQUE4QjtrQkFEMUMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUG9seWxpbmVDb2xsZWN0aW9uLCBDb2xvciwgTWF0ZXJpYWwgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgb2YgZHJhd2luZyBwb2x5bGluZXMgYXMgcHJpbWl0aXZlcy5cclxuICogIFRoaXMgZHJhd2VyIGlzIG1vcmUgZWZmaWNpZW50IHRoYW4gUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIHdoZW4gZHJhd2luZyBkeW5hbWljIHBvbHlsaW5lcy5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihQb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xyXG4gIH1cclxuXHJcbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLl9jZXNpdW1Db2xsZWN0aW9uLmFkZCh0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoY2VzaXVtT2JqZWN0OiBhbnksIGNlc2l1bVByb3BzOiBhbnkpIHtcclxuICAgIGlmIChjZXNpdW1Qcm9wcy5tYXRlcmlhbCBpbnN0YW5jZW9mIENvbG9yKSB7XHJcbiAgICAgIGlmIChjZXNpdW1PYmplY3QubWF0ZXJpYWwgJiYgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zICYmXHJcbiAgICAgICAgY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yIGluc3RhbmNlb2YgQ29sb3IpIHtcclxuICAgICAgICB0aGlzLndpdGhDb2xvck1hdGVyaWFsKGNlc2l1bVByb3BzKTtcclxuICAgICAgfSBlbHNlIGlmICghY2VzaXVtT2JqZWN0Lm1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yLmVxdWFscyhjZXNpdW1Qcm9wcy5tYXRlcmlhbCkpIHtcclxuICAgICAgICBjZXNpdW1PYmplY3QubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5tYXRlcmlhbDtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgc3VwZXIudXBkYXRlKGNlc2l1bU9iamVjdCwgY2VzaXVtUHJvcHMpO1xyXG4gIH1cclxuXHJcbiAgd2l0aENvbG9yTWF0ZXJpYWwoY2VzaXVtUHJvcHM6IGFueSkge1xyXG4gICAgaWYgKGNlc2l1bVByb3BzLm1hdGVyaWFsIGluc3RhbmNlb2YgQ29sb3IpIHtcclxuICAgICAgY29uc3QgbWF0ZXJpYWwgPSBNYXRlcmlhbC5mcm9tVHlwZSgnQ29sb3InKTtcclxuICAgICAgbWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5tYXRlcmlhbDtcclxuICAgICAgY2VzaXVtUHJvcHMubWF0ZXJpYWwgPSBtYXRlcmlhbDtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gY2VzaXVtUHJvcHM7XHJcbiAgfVxyXG59XHJcbiJdfQ==