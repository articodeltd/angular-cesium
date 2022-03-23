import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
export class AcBillboardPrimitiveDescComponent extends BasicDesc {
    constructor(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardPrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardPrimitiveDescComponent, deps: [{ token: i1.BillboardPrimitiveDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardPrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBillboardPrimitiveDescComponent, selector: "ac-billboard-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: i1.BillboardPrimitiveDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MvYWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUN0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQU16RTs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FpQkc7QUFPSCxNQUFNLE9BQU8saUNBQWtDLFNBQVEsU0FBUztJQUU5RCxZQUFZLHdCQUF5RCxFQUFFLFlBQTBCLEVBQ3JGLGdCQUFrQyxFQUFFLGdCQUFrQztRQUNoRixLQUFLLENBQUMsd0JBQXdCLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDcEYsQ0FBQzs7OEhBTFUsaUNBQWlDO2tIQUFqQyxpQ0FBaUMsc0RBRmpDLENBQUMsRUFBQyxPQUFPLEVBQUUsU0FBUyxFQUFFLFdBQVcsRUFBRSxVQUFVLENBQUMsR0FBRyxFQUFFLENBQUMsaUNBQWlDLENBQUMsRUFBQyxDQUFDLGlEQUR6RixFQUFFOzJGQUdELGlDQUFpQztrQkFMN0MsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsNkJBQTZCO29CQUN2QyxRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsa0NBQWtDLENBQUMsRUFBQyxDQUFDO2lCQUNwRyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyL2JpbGxib2FyZC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgYmlsbGJvYXJkIHByaW1pdGl2ZSBpbXBsZW1lbnRhdGlvbi5cclxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxyXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlOlxyXG4gKiAgKyBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9CaWxsYm9hcmQuaHRtbFxyXG4gKlxyXG4gKiAgX19Vc2FnZSA6X19cclxuICogIGBgYFxyXG4gKiAgICA8YWMtYmlsbGJvYXJkLXByaW1pdGl2ZS1kZXNjIHByb3BzPVwie1xyXG4gKiAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcclxuICogICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXHJcbiAqICAgICAgc2NhbGU6IHRyYWNrLnNjYWxlLFxyXG4gKiAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcclxuICogICAgICBuYW1lOiB0cmFjay5uYW1lXHJcbiAqICAgIH1cIj5cclxuICogICAgPC9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2M+XHJcbiAqICBgYGBcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYycsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG4gIHByb3ZpZGVyczogW3twcm92aWRlOiBCYXNpY0Rlc2MsIHVzZUV4aXN0aW5nOiBmb3J3YXJkUmVmKCgpID0+IEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCl9XSxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XHJcblxyXG4gIGNvbnN0cnVjdG9yKGJpbGxib2FyZFByaW1pdGl2ZURyYXdlcjogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllczogQ2VzaXVtUHJvcGVydGllcykge1xyXG4gICAgc3VwZXIoYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xyXG4gIH1cclxufVxyXG4iXX0=