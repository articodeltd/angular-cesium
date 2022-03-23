import { Component } from '@angular/core';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service";
import * as i2 from "../../../services/layer-service/layer-service.service";
import * as i3 from "../../../services/computation-cache/computation-cache.service";
import * as i4 from "../../../services/cesium-properties/cesium-properties.service";
/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
export class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticCircleDescComponent, deps: [{ token: i1.StaticCircleDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticCircleDescComponent, selector: "ac-static-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-circle',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.StaticCircleDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MvYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBSTFDLE9BQU8sRUFBRSx3QkFBd0IsRUFBRSxNQUFNLDRFQUE0RSxDQUFDOzs7Ozs7QUFHdEg7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FtQkc7QUFLSCxNQUFNLE9BQU8sMkJBQTRCLFNBQVEsd0JBQXdCO0lBQ3ZFLFlBQVksa0JBQTZDLEVBQUUsWUFBMEIsRUFDekUsZ0JBQWtDLEVBQUUsZ0JBQWtDO1FBQ2hGLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUM5RSxDQUFDOzt3SEFKVSwyQkFBMkI7NEdBQTNCLDJCQUEyQiwrRUFGNUIsRUFBRTsyRkFFRCwyQkFBMkI7a0JBSnZDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGtCQUFrQjtvQkFDNUIsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDb21wdXRhdGlvbkNhY2hlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvY29tcHV0YXRpb24tY2FjaGUvY29tcHV0YXRpb24tY2FjaGUuc2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQmFzaWNTdGF0aWNQcmltaXRpdmVEZXNjIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvYmFzaWMtcHJpbWl0aXZlLWRlc2MvYmFzaWMtc3RhdGljLXByaW1pdGl2ZS1kZXNjLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtY2lyY2xlLWRyYXdlci9zdGF0aWMtY2lyY2xlLWRyYXdlci5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBAZGVwcmVjYXRlZCB1c2UgYWMtY2lyY2xlLWRlc2NcclxuICpcclxuICogIFRoaXMgaXMgYSBzdGF0aWMgKHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gYXJlIG5vdCB1cGRhdGVkKSBpbXBsZW1lbnRhdGlvbiBvZiBhbiBjaXJjbGUuXHJcbiAqICBfX3VzYWdlOl9fXHJcbiAqICBgYGBcclxuICogICAgJmx0O2FjLXN0YXRpYy1jaXJjbGUtZGVzY1xyXG4gKiAgICAgIGdlb21ldHJ5UHJvcHM9XCJ7XHJcbiAqICAgICAgICAgIGNlbnRlcjogY2lyY2xlLmdlb21ldHJ5LmNlbnRlcixcclxuICogICAgICAgICAgcmFkaXVzOiBjaXJjbGUuZ2VvbWV0cnkucmFkaXVzLFxyXG4gKiAgICAgIH1cIlxyXG4gKiAgICAgIGluc3RhbmNlUHJvcHM9XCJ7XHJcbiAqICAgICAgICAgIGF0dHJpYnV0ZXM6IGNpcmNsZS5hdHRyaWJ1dGVzIC8vT3B0aW9uYWxcclxuICogICAgICB9XCJcclxuICogICAgICBwcmltaXRpdmVQcm9wcz1cIntcclxuICogICAgICAgICAgYXBwZWFyYW5jZTogY2lyY2xlLmFwcGVhcmFuY2UgLy9PcHRpb25hbFxyXG4gKiAgICAgIH1cIiZndDtcclxuICogICAgJmx0Oy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MmZ3Q7XHJcbiAqICAgIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1zdGF0aWMtY2lyY2xlJyxcclxuICB0ZW1wbGF0ZTogJydcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjU3RhdGljQ2lyY2xlRGVzY0NvbXBvbmVudCBleHRlbmRzIEJhc2ljU3RhdGljUHJpbWl0aXZlRGVzYyB7XHJcbiAgY29uc3RydWN0b3Ioc3RhdGljQ2lyY2xlRHJhd2VyOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihzdGF0aWNDaXJjbGVEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==