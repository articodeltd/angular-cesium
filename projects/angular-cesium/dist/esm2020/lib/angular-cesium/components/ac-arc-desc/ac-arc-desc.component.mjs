import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-layer element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc props="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius,
 *          color : arc.color - The color should be Cesium.Color type
 *    }">
 *    </ac-arc-desc>
 *    ```
 *
 *    description of the props :
 *    center - The arc is a section of an outline of a circle, This is the center of the circle
 *    angle - the initial angle of the arc in radians
 *    delta - the spreading of the arc,
 *    radius - the distance from the center to the arc
 *
 *    for example :
 *    angle - 0
 *    delta - π
 *
 *    will draw an half circle
 */
export class AcArcDescComponent extends BasicDesc {
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcDescComponent, deps: [{ token: i1.ArcDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcArcDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArcDescComponent, selector: "ac-arc-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: i1.ArcDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJjLWRlc2MuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWFyYy1kZXNjL2FjLWFyYy1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUt0RCxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOENBQThDLENBQUM7Ozs7OztBQUV6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTRCRztBQU9ILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxTQUFTO0lBRS9DLFlBQVksU0FBMkIsRUFBRSxZQUEwQixFQUN2RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFNBQVMsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUNyRSxDQUFDOzsrR0FMVSxrQkFBa0I7bUdBQWxCLGtCQUFrQixzQ0FGbEIsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxrQkFBa0IsQ0FBQyxFQUFDLENBQUMsaURBRDFFLEVBQUU7MkZBR0Qsa0JBQWtCO2tCQUw5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxhQUFhO29CQUN2QixRQUFRLEVBQUUsRUFBRTtvQkFDWixTQUFTLEVBQUUsQ0FBQyxFQUFDLE9BQU8sRUFBRSxTQUFTLEVBQUUsV0FBVyxFQUFFLFVBQVUsQ0FBQyxHQUFHLEVBQUUsbUJBQW1CLENBQUMsRUFBQyxDQUFDO2lCQUNyRiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgZm9yd2FyZFJlZiB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bVByb3BlcnRpZXMgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEJhc2ljRGVzYyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Jhc2ljLWRlc2MvYmFzaWMtZGVzYy5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiAgVGhpcyBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBhbiBhcmMuXHJcbiAqICBUaGUgZWxlbWVudCBtdXN0IGJlIGEgY2hpbGQgb2YgYWMtbGF5ZXIgZWxlbWVudC5cclxuICogIEFuIGFyYyBpcyBub3QgY2VzaXVtIG5hdGl2ZWx5IGltcGxlbWVudGVkIGFuZCB0aGVyZWZvcmUgaXQncyBBUEkgZG9lc24ndCBhcHBlYXIgYW55d2hlcmVcclxuICpcclxuICogIF9fVXNhZ2UgOl9fXHJcbiAqICBgYGBcclxuICogICAgPGFjLWFyYy1kZXNjIHByb3BzPVwie1xyXG4gKiAgICAgICAgICBjZW50ZXI6IGFyYy5jZW50ZXIsXHJcbiAqICAgICAgICAgIGFuZ2xlOiBhcmMuYW5nbGUsXHJcbiAqICAgICAgICAgIGRlbHRhOiBhcmMuZGVsdGEsXHJcbiAqICAgICAgICAgIHJhZGl1czogYXJjLnJhZGl1cyxcclxuICogICAgICAgICAgY29sb3IgOiBhcmMuY29sb3IgLSBUaGUgY29sb3Igc2hvdWxkIGJlIENlc2l1bS5Db2xvciB0eXBlXHJcbiAqICAgIH1cIj5cclxuICogICAgPC9hYy1hcmMtZGVzYz5cclxuICogICAgYGBgXHJcbiAqXHJcbiAqICAgIGRlc2NyaXB0aW9uIG9mIHRoZSBwcm9wcyA6XHJcbiAqICAgIGNlbnRlciAtIFRoZSBhcmMgaXMgYSBzZWN0aW9uIG9mIGFuIG91dGxpbmUgb2YgYSBjaXJjbGUsIFRoaXMgaXMgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXHJcbiAqICAgIGFuZ2xlIC0gdGhlIGluaXRpYWwgYW5nbGUgb2YgdGhlIGFyYyBpbiByYWRpYW5zXHJcbiAqICAgIGRlbHRhIC0gdGhlIHNwcmVhZGluZyBvZiB0aGUgYXJjLFxyXG4gKiAgICByYWRpdXMgLSB0aGUgZGlzdGFuY2UgZnJvbSB0aGUgY2VudGVyIHRvIHRoZSBhcmNcclxuICpcclxuICogICAgZm9yIGV4YW1wbGUgOlxyXG4gKiAgICBhbmdsZSAtIDBcclxuICogICAgZGVsdGEgLSDPgFxyXG4gKlxyXG4gKiAgICB3aWxsIGRyYXcgYW4gaGFsZiBjaXJjbGVcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLWFyYy1kZXNjJyxcclxuICB0ZW1wbGF0ZTogJycsXHJcbiAgcHJvdmlkZXJzOiBbe3Byb3ZpZGU6IEJhc2ljRGVzYywgdXNlRXhpc3Rpbmc6IGZvcndhcmRSZWYoKCkgPT4gQWNBcmNEZXNjQ29tcG9uZW50KX1dLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNBcmNEZXNjQ29tcG9uZW50IGV4dGVuZHMgQmFzaWNEZXNjIHtcclxuXHJcbiAgY29uc3RydWN0b3IoYXJjRHJhd2VyOiBBcmNEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihhcmNEcmF3ZXIsIGxheWVyU2VydmljZSwgY29tcHV0YXRpb25DYWNoZSwgY2VzaXVtUHJvcGVydGllcyk7XHJcbiAgfVxyXG5cclxufVxyXG4iXX0=