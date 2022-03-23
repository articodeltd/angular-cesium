import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
/**
 *
 * @deprecated use ac-ellipse-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an ellipse.
 *  __usage:__
 *  ```
 *  &lt;ac-static-ellipse-desc-desc
 *      geometryProps="{
 *          center: ellipse.geometry.center,
 *          semiMajorAxis: ellipse.geometry.semiMajorAxis,
 *          semiMinorAxis: ellipse.geometry.semiMinorAxis,
 *          height: ellipse.geometry.height,
 *          rotation: ellipse.geometry.rotation
 *      }"
 *      instanceProps="{
 *          attributes: ellipse.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: ellipse.appearance //Optional
 *      }"&gt;
 *  &lt;/ac-static-ellipse-desc-desc&gt;
 *  ```
 */
export class AcStaticEllipseDescComponent extends BasicStaticPrimitiveDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticEllipseDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticEllipseDescComponent, deps: [{ token: i1.StaticEllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticEllipseDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticEllipseDescComponent, selector: "ac-static-ellipse-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-ellipse-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticEllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWVsbGlwc2UtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy9hYy1zdGF0aWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDOzs7Ozs7QUFHdEg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUJHO0FBS0gsTUFBTSxPQUFPLDRCQUE2QixTQUFRLHdCQUF3QjtJQUN4RSxZQUFZLGFBQXlDLEVBQUUsWUFBMEIsRUFDckUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQzs7eUhBSlUsNEJBQTRCOzZHQUE1Qiw0QkFBNEIscUZBRjdCLEVBQUU7MkZBRUQsNEJBQTRCO2tCQUp4QyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSx3QkFBd0I7b0JBQ2xDLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY2VzaXVtLXByb3BlcnRpZXMvY2VzaXVtLXByb3BlcnRpZXMuc2VydmljZSc7XHJcbmltcG9ydCB7IEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Jhc2ljLXByaW1pdGl2ZS1kZXNjL2Jhc2ljLXN0YXRpYy1wcmltaXRpdmUtZGVzYy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqXHJcbiAqIEBkZXByZWNhdGVkIHVzZSBhYy1lbGxpcHNlLWRlc2MgaW5zdGVhZFxyXG4gKlxyXG4gKiAgVGhpcyBpcyBhIHN0YXRpYyAocG9zaXRpb24sIGNvbG9yLCBldGMuLiBhcmUgbm90IHVwZGF0ZWQpIGltcGxlbWVudGF0aW9uIG9mIGFuIGVsbGlwc2UuXHJcbiAqICBfX3VzYWdlOl9fXHJcbiAqICBgYGBcclxuICogICZsdDthYy1zdGF0aWMtZWxsaXBzZS1kZXNjLWRlc2NcclxuICogICAgICBnZW9tZXRyeVByb3BzPVwie1xyXG4gKiAgICAgICAgICBjZW50ZXI6IGVsbGlwc2UuZ2VvbWV0cnkuY2VudGVyLFxyXG4gKiAgICAgICAgICBzZW1pTWFqb3JBeGlzOiBlbGxpcHNlLmdlb21ldHJ5LnNlbWlNYWpvckF4aXMsXHJcbiAqICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2VvbWV0cnkuc2VtaU1pbm9yQXhpcyxcclxuICogICAgICAgICAgaGVpZ2h0OiBlbGxpcHNlLmdlb21ldHJ5LmhlaWdodCxcclxuICogICAgICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2VvbWV0cnkucm90YXRpb25cclxuICogICAgICB9XCJcclxuICogICAgICBpbnN0YW5jZVByb3BzPVwie1xyXG4gKiAgICAgICAgICBhdHRyaWJ1dGVzOiBlbGxpcHNlLmF0dHJpYnV0ZXMgLy9PcHRpb25hbFxyXG4gKiAgICAgIH1cIlxyXG4gKiAgICAgIHByaW1pdGl2ZVByb3BzPVwie1xyXG4gKiAgICAgICAgICBhcHBlYXJhbmNlOiBlbGxpcHNlLmFwcGVhcmFuY2UgLy9PcHRpb25hbFxyXG4gKiAgICAgIH1cIiZndDtcclxuICogICZsdDsvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy1kZXNjJmd0O1xyXG4gKiAgYGBgXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLXN0YXRpYy1lbGxpcHNlLWRlc2MnLFxyXG4gIHRlbXBsYXRlOiAnJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XHJcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIGNvbXB1dGF0aW9uQ2FjaGU6IENvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXM6IENlc2l1bVByb3BlcnRpZXMpIHtcclxuICAgIHN1cGVyKGVsbGlwc2VEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==