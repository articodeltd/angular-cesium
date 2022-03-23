import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
export class AcPrimitivePolylineComponent extends EntityOnMapComponent {
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPrimitivePolylineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPrimitivePolylineComponent, deps: [{ token: i1.PolylinePrimitiveDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPrimitivePolylineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPrimitivePolylineComponent, selector: "ac-primitive-polyline", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPrimitivePolylineComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-primitive-polyline',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.PolylinePrimitiveDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1wcmltaXRpdmUtcG9seWxpbmUvYWMtcHJpbWl0aXZlLXBvbHlsaW5lLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBSTVGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBTUgsTUFBTSxPQUFPLDRCQUE2QixTQUFRLG9CQUFvQjtJQUVwRSxZQUFZLGNBQThDLEVBQUUsU0FBMkI7UUFDckYsS0FBSyxDQUFDLGNBQWMsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNuQyxDQUFDOzt5SEFKVSw0QkFBNEI7NkdBQTVCLDRCQUE0QixvRkFGN0IsRUFBRTsyRkFFRCw0QkFBNEI7a0JBSnhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLHVCQUF1QjtvQkFDakMsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgYSBwb2x5bGluZSBpbXBsZW1lbnRhdGlvbi5cclxuICogIFRoZSBhYy1sYWJlbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cclxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBQb2x5bGluZSBQcmltaXRpdmU6XHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1BvbHlsaW5lLmh0bWxcclxuICpcclxuICogIF9fVXNhZ2U6X19cclxuICogIGBgYFxyXG4gKiAgPGFjLXBvbHlsaW5lIFtwcm9wc109XCJ7XHJcbiAqICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICogICAgdGV4dDogJ2xhYmVsVGV4dCcsXHJcbiAqICAgIGZvbnQ6ICczMHB4IHNhbnMtc2VyaWYnXHJcbiAqICAgIGNvbG9yOiBDb2xvci5HUkVFTlxyXG4gKiAgfVwiPjtcclxuICogIDwvYWMtcG9seWxpbmU+XHJcbiAqICBgYGBcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLXByaW1pdGl2ZS1wb2x5bGluZScsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNQcmltaXRpdmVQb2x5bGluZUNvbXBvbmVudCBleHRlbmRzIEVudGl0eU9uTWFwQ29tcG9uZW50IHtcclxuXHJcbiAgY29uc3RydWN0b3IocG9seWxpbmVEcmF3ZXI6IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSwgbWFwTGF5ZXJzOiBNYXBMYXllcnNTZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihwb2x5bGluZURyYXdlciwgbWFwTGF5ZXJzKTtcclxuICB9XHJcbn1cclxuIl19