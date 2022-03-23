// tslint:disable
import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
// tslint:enable
/**
 * @deprecated use ac-ploygon-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of a polygon.
 *  __Usage:__
 *  ```
 *    &lt;ac-static-polygon-desc
 *          geometryProps="{
 *                     polygonHierarchy: polygon.geometry.polygonHierarchy,
 *                     height: polygon.geometry.height,
 *                     granularity: polygon.geometry.granularity
 *                 }"
 *          instanceProps="{
 *                     attributes: polygon.attributes
 *                 }"
 *          primitiveProps="{
 *                     appearance: polygon.appearance
 *                 }"
 *    &gt;&lt;/ac-static-polygon-desc&gt;
 *    ```
 */
export class AcStaticPolygonDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolygonDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolygonDescComponent, deps: [{ token: i1.StaticPolygonDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticPolygonDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticPolygonDescComponent, selector: "ac-static-polygon-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolygonDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polygon-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticPolygonDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLXBvbHlnb24tZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLXBvbHlnb24tZGVzYy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxpQkFBaUI7QUFDakIsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUkxQyxPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0RUFBNEUsQ0FBQzs7Ozs7O0FBR3RILGdCQUFnQjtBQUNoQjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FvQkc7QUFLSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsd0JBQXdCO0lBQ3hFLFlBQVksYUFBeUMsRUFBRSxZQUEwQixFQUNyRSxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLGFBQWEsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN6RSxDQUFDOzt5SEFKVSw0QkFBNEI7NkdBQTVCLDRCQUE0QixxRkFGN0IsRUFBRTsyRkFFRCw0QkFBNEI7a0JBSnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyIvLyB0c2xpbnQ6ZGlzYWJsZVxyXG5pbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLy8gdHNsaW50OmVuYWJsZVxyXG4vKipcclxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLXBsb3lnb24tZGVzYyBpbnN0ZWFkXHJcbiAqXHJcbiAqICBUaGlzIGlzIGEgc3RhdGljIChwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIGFyZSBub3QgdXBkYXRlZCkgaW1wbGVtZW50YXRpb24gb2YgYSBwb2x5Z29uLlxyXG4gKiAgX19Vc2FnZTpfX1xyXG4gKiAgYGBgXHJcbiAqICAgICZsdDthYy1zdGF0aWMtcG9seWdvbi1kZXNjXHJcbiAqICAgICAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XHJcbiAqICAgICAgICAgICAgICAgICAgICAgcG9seWdvbkhpZXJhcmNoeTogcG9seWdvbi5nZW9tZXRyeS5wb2x5Z29uSGllcmFyY2h5LFxyXG4gKiAgICAgICAgICAgICAgICAgICAgIGhlaWdodDogcG9seWdvbi5nZW9tZXRyeS5oZWlnaHQsXHJcbiAqICAgICAgICAgICAgICAgICAgICAgZ3JhbnVsYXJpdHk6IHBvbHlnb24uZ2VvbWV0cnkuZ3JhbnVsYXJpdHlcclxuICogICAgICAgICAgICAgICAgIH1cIlxyXG4gKiAgICAgICAgICBpbnN0YW5jZVByb3BzPVwie1xyXG4gKiAgICAgICAgICAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHBvbHlnb24uYXR0cmlidXRlc1xyXG4gKiAgICAgICAgICAgICAgICAgfVwiXHJcbiAqICAgICAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xyXG4gKiAgICAgICAgICAgICAgICAgICAgIGFwcGVhcmFuY2U6IHBvbHlnb24uYXBwZWFyYW5jZVxyXG4gKiAgICAgICAgICAgICAgICAgfVwiXHJcbiAqICAgICZndDsmbHQ7L2FjLXN0YXRpYy1wb2x5Z29uLWRlc2MmZ3Q7XHJcbiAqICAgIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtcG9seWdvbi1kZXNjJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBBY1N0YXRpY1BvbHlnb25EZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIHtcclxuICBjb25zdHJ1Y3Rvcihwb2x5Z29uRHJhd2VyOiBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xyXG4gICAgc3VwZXIocG9seWdvbkRyYXdlciwgbGF5ZXJTZXJ2aWNlLCBjb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzKTtcclxuICB9XHJcbn1cclxuIl19