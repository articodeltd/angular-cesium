import { Injectable } from '@angular/core';
import { PolylineGeometry } from 'cesium';
import { when } from 'when';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
export class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            when(primitive.readyPromise).then((readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    }
}
StaticPolylineDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolylineDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIvc3RhdGljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sUUFBUSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxJQUFJLEVBQUUsTUFBTSxNQUFNLENBQUM7QUFFNUIsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUVuRzs7O0dBR0c7QUFFSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEscUJBQXFCO0lBQ3BFLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLGFBQWEsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFRDs7T0FFRztJQUNILE1BQU0sQ0FBQyxTQUFjLEVBQUUsYUFBa0IsRUFBRSxhQUFrQixFQUFFLGNBQW1CO1FBQ2hGLE1BQU0sS0FBSyxHQUFHLGFBQWEsQ0FBQyxVQUFVLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztRQUVuRCxJQUFJLFNBQVMsQ0FBQyxLQUFLLEVBQUU7WUFDbkIsU0FBUyxDQUFDLDZCQUE2QixFQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztTQUN6RDthQUFNO1lBQ0wsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxjQUFtQixFQUFFLEVBQUU7Z0JBQ3hELGNBQWMsQ0FBQyw2QkFBNkIsRUFBRSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1lBQ3JFLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLFNBQVMsQ0FBQztJQUNuQixDQUFDOzt3SEFwQlUsMkJBQTJCOzRIQUEzQiwyQkFBMkI7MkZBQTNCLDJCQUEyQjtrQkFEdkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUG9seWxpbmVHZW9tZXRyeSB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IHdoZW4gfSBmcm9tICd3aGVuJztcclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRpY1ByaW1pdGl2ZURyYXdlciB9IGZyb20gJy4uL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyL3N0YXRpYy1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhlIHN0YXRpYyB2ZXJzaW9uIG9mIHRoZSBwb2x5bGluZSBjb21wb25lbnQuXHJcbiAqICBUaGlzIGFsc28gYWxsb3dzIHVzIHRvIGNoYW5nZSB0aGUgY29sb3Igb2YgdGhlIHBvbHlsaW5lcy5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSBleHRlbmRzIFN0YXRpY1ByaW1pdGl2ZURyYXdlciB7XHJcbiAgY29uc3RydWN0b3IoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSkge1xyXG4gICAgc3VwZXIoUG9seWxpbmVHZW9tZXRyeSwgY2VzaXVtU2VydmljZSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVcGRhdGUgZnVuY3Rpb24gY2FuIG9ubHkgY2hhbmdlIHRoZSBwcmltaXRpdmUgY29sb3IuXHJcbiAgICovXHJcbiAgdXBkYXRlKHByaW1pdGl2ZTogYW55LCBnZW9tZXRyeVByb3BzOiBhbnksIGluc3RhbmNlUHJvcHM6IGFueSwgcHJpbWl0aXZlUHJvcHM6IGFueSkge1xyXG4gICAgY29uc3QgY29sb3IgPSBpbnN0YW5jZVByb3BzLmF0dHJpYnV0ZXMuY29sb3IudmFsdWU7XHJcblxyXG4gICAgaWYgKHByaW1pdGl2ZS5yZWFkeSkge1xyXG4gICAgICBwcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvciA9IGNvbG9yO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgd2hlbihwcmltaXRpdmUucmVhZHlQcm9taXNlKS50aGVuKChyZWFkeVByaW1pdGl2ZTogYW55KSA9PiB7XHJcbiAgICAgICAgcmVhZHlQcmltaXRpdmUuZ2V0R2VvbWV0cnlJbnN0YW5jZUF0dHJpYnV0ZXMoKS5jb2xvci52YWx1ZSA9IGNvbG9yO1xyXG4gICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcHJpbWl0aXZlO1xyXG4gIH1cclxufVxyXG4iXX0=