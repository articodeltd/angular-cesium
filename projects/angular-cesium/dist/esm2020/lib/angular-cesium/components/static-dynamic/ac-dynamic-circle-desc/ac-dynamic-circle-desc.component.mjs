import { Component } from '@angular/core';
import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
/**
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
export class AcDynamicCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
}
AcDynamicCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicCircleDescComponent, deps: [{ token: i1.DynamicEllipseDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDynamicCircleDescComponent, selector: "ac-dynamic-circle-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-circle-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.DynamicEllipseDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZHluYW1pYy1jaXJjbGUtZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtZHluYW1pYy1jaXJjbGUtZGVzYy9hYy1keW5hbWljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxpREFBaUQsQ0FBQzs7Ozs7O0FBRzVFOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FxQkc7QUFLSCxNQUFNLE9BQU8sNEJBQTZCLFNBQVEsU0FBUztJQUN6RCxZQUFZLGFBQTBDLEVBQUUsWUFBMEIsRUFDdEUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxhQUFhLEVBQUUsWUFBWSxFQUFFLGdCQUFnQixFQUFFLGdCQUFnQixDQUFDLENBQUM7SUFDekUsQ0FBQztJQUVTLGVBQWUsQ0FBQyxPQUFlO1FBQ3ZDLE1BQU0sV0FBVyxHQUFHLEtBQUssQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFFbkQsV0FBVyxDQUFDLGFBQWEsR0FBRyxXQUFXLENBQUMsTUFBTSxDQUFDO1FBQy9DLFdBQVcsQ0FBQyxhQUFhLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztRQUUvQyxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDOzt5SEFiVSw0QkFBNEI7NkdBQTVCLDRCQUE0QixxRkFGN0IsRUFBRTsyRkFFRCw0QkFBNEI7a0JBSnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHdCQUF3QjtvQkFDbEMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogQGRlcHJlY2F0ZWQgdXNlIGFjLWNpcmNsZS1kZXNjIGluc3RlYWRcclxuICpcclxuICogIFRoaXMgaXMgYSBkeW5hbWljKHBvc2l0aW9uIGlzIHVwZGF0YWJsZSkgaW1wbGVtZW50YXRpb24gb2YgYW4gY2lyY2xlLlxyXG4gX19Vc2FnZSA6X19cclxuICogIGBgYFxyXG4gKiAgICAmbHQ7YWMtZHluYW1pYy1jaXJjbGUtZGVzYyBwcm9wcz1cIntcclxuICogICAgICBjZW50ZXI6IGRhdGEucG9zaXRpb24sXHJcbiAqICAgICAgcmFkaXVzOiA1XHJcbiAqICAgICAgcm90YXRpb24gOiAwLjc4NTM5OCxcclxuICogICAgICB3aWR0aDozLCAvLyBPcHRpb25hbFxyXG4gKiAgICAgIGdyYW51bGFyaXR5OjAuMDggLy8gT3B0aW9uYWxcclxuICogICAgICB9XCImZ3Q7XHJcbiAqICAgICZsdDsvYWMtZHluYW1pYy1jaXJjbGUtZGVzYyZndDtcclxuICogIGBgYFxyXG4gKlxyXG4gKiAgX19wYXJhbV9fOiB7Q2FydGVzaWFuM30gY2VudGVyXHJcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSByb3RhdGlvblxyXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gcmFkaXVzIGluIG1ldGVyc1xyXG4gKiAgIF9fcGFyYW1fXzoge251bWJlcn0gWzFdIHdpZHRoXHJcbiAqICAgX19wYXJhbV9fOiB7bnVtYmVyfSBbMC4wMDNdIGdyYW51bGFyaXR5XHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLWR5bmFtaWMtY2lyY2xlLWRlc2MnLFxyXG4gIHRlbXBsYXRlOiAnJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNEeW5hbWljQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljRGVzYyB7XHJcbiAgY29uc3RydWN0b3IoZWxsaXBzZURyYXdlcjogRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihlbGxpcHNlRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xyXG4gIH1cclxuXHJcbiAgcHJvdGVjdGVkIF9wcm9wc0V2YWx1YXRvcihjb250ZXh0OiBPYmplY3QpOiBhbnkge1xyXG4gICAgY29uc3QgY2VzaXVtUHJvcHMgPSBzdXBlci5fcHJvcHNFdmFsdWF0b3IoY29udGV4dCk7XHJcblxyXG4gICAgY2VzaXVtUHJvcHMuc2VtaU1ham9yQXhpcyA9IGNlc2l1bVByb3BzLnJhZGl1cztcclxuICAgIGNlc2l1bVByb3BzLnNlbWlNaW5vckF4aXMgPSBjZXNpdW1Qcm9wcy5yYWRpdXM7XHJcblxyXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xyXG4gIH1cclxufVxyXG4iXX0=