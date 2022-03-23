// tslint:disable
import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
// tslint:enable
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
export class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolylineDescComponent, deps: [{ token: i1.StaticPolylineDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticPolylineDescComponent, selector: "ac-static-polyline-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polyline-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticPolylineDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUsxQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7O0FBRXRILGdCQUFnQjtBQUVoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFLSCxNQUFNLE9BQU8sNkJBQThCLFNBQVEsd0JBQXdCO0lBQ3pFLFlBQVkscUJBQWtELEVBQUUsWUFBMEIsRUFDOUUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxxQkFBcUIsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNqRixDQUFDOzswSEFKVSw2QkFBNkI7OEdBQTdCLDZCQUE2QixzRkFGOUIsRUFBRTsyRkFFRCw2QkFBNkI7a0JBSnpDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHlCQUF5QjtvQkFDbkMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWxpbmUtZHJhd2VyL3N0YXRpYy1wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XHJcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcclxuXHJcbi8vIHRzbGludDplbmFibGVcclxuXHJcbi8qKlxyXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtcGxveWxpbmUtZGVzYyBpbnN0ZWFkXHJcbiAqXHJcbiAqICBUaGlzIGlzIGEgc3RhdGljIGltcGxlbWVudGF0aW9uIG9mIGFuIHBvbHlsaW5lLlxyXG4gKiAgX191c2FnZTpfX1xyXG4gKiAgYGBgXHJcbiAqICAgICZsdGFjLXN0YXRpYy1wb2x5bGluZS1kZXNjXHJcbiAqICAgICAgICAgICAgZ2VvbWV0cnlQcm9wcz1cIntcclxuICogICAgICAgICAgICBcdHdpZHRoOiBwb2x5Lmdlb21ldHJ5LndpZHRoLFxyXG4gKiAgICAgICAgICAgIFx0cG9zaXRpb25zOiBwb2x5Lmdlb21ldHJ5LnBvc2l0aW9uc1xyXG4gKiAgICAgICAgICAgIH1cIlxyXG4gKiAgICAgICAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XHJcbiAqICAgICAgICAgICAgICBhdHRyaWJ1dGVzOiB7XHJcbiAqICAgICAgICAgICAgICAgICAgQ29sb3JHZW9tZXRyeUluc3RhbmNlQXR0cmlidXRlLmZyb21Db2xvcihDb2xvci5mcm9tUmFuZG9tKCkpXHJcbiAqICAgICAgICAgICAgICB9XHJcbiAqICAgICAgICAgICAgfVwiXHJcbiAqICAgICAgICAgICAgcHJpbWl0aXZlUHJvcHM9XCJ7XHJcbiAqICAgICAgICAgICAgICBhcHBlYXJhbmNlOiBuZXcgUG9seWxpbmVDb2xvckFwcGVhcmFuY2UoKVxyXG4gKiAgICB9XCImZ3QmbHQvYWMtc3RhdGljLXBvbHlsaW5lLWRlc2MmZ3RcclxuICogIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtcG9seWxpbmUtZGVzYycsXHJcbiAgdGVtcGxhdGU6ICcnXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY1BvbHlsaW5lRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XHJcbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5bGluZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcclxuICAgIHN1cGVyKHBvbHlsaW5lRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcclxuICB9XHJcbn1cclxuIl19