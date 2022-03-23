import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
export class AcPolygonComponent extends EntityOnMapComponent {
    constructor(polygonDrawer, mapLayers) {
        super(polygonDrawer, mapLayers);
    }
}
AcPolygonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonComponent, deps: [{ token: i1.PolygonDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPolygonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolygonComponent, selector: "ac-polygon", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polygon',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.PolygonDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcG9seWdvbi5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtcG9seWdvbi9hYy1wb2x5Z29uLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBRzVGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQUtILE1BQU0sT0FBTyxrQkFBbUIsU0FBUSxvQkFBb0I7SUFDMUQsWUFBWSxhQUFtQyxFQUFFLFNBQTJCO1FBQzFFLEtBQUssQ0FBQyxhQUFhLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDbEMsQ0FBQzs7K0dBSFUsa0JBQWtCO21HQUFsQixrQkFBa0IseUVBRm5CLEVBQUU7MkZBRUQsa0JBQWtCO2tCQUo5QixTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUUsRUFBRTtpQkFDYiIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEVudGl0eU9uTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LW9uLW1hcC9lbnRpdHktb24tbWFwLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgYSBwb2x5Z29uIGltcGxlbWVudGF0aW9uLlxyXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxyXG4gKiAgX1NldCBgaGVpZ2h0YCBwcm9wIGZvciBwZXJmb3JtYW5jZSBlbmhhbmNlbWVudF9cclxuICogIFRoZSBwcm9wZXJ0aWVzIG9mIHByb3BzIGFyZSB0aGUgc2FtZSBhcyB0aGUgcHJvcGVydGllcyBvZiBFbnRpdHkgYW5kIFBvbHlnb25HcmFwaGljczpcclxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vRW50aXR5Lmh0bWxcclxuICogICsgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vUG9seWdvbkdyYXBoaWNzLmh0bWxcclxuICpcclxuICogIF9fVXNhZ2U6X19cclxuICogIGBgYFxyXG4gKiAgICA8YWMtcG9seWdvbiBwcm9wcz1cIntcclxuICogICAgICBoaWVyYXJjaHk6IHBvbHlnb24uaGllcmFyY2h5LFxyXG4gKiAgICAgIG1hdGVyaWFsOiBwb2x5Z29uLm1hdGVyaWFsLFxyXG4gKiAgICAgIGhlaWdodDogcG9seWdvbi5oZWlnaHRcclxuICogICAgfVwiPlxyXG4gKiAgICA8L2FjLXBvbHlnb24+XHJcbiAqICBgYGBcclxuICovXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYWMtcG9seWdvbicsXHJcbiAgdGVtcGxhdGU6ICcnLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNQb2x5Z29uQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xyXG4gIGNvbnN0cnVjdG9yKHBvbHlnb25EcmF3ZXI6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcclxuICAgIHN1cGVyKHBvbHlnb25EcmF3ZXIsIG1hcExheWVycyk7XHJcbiAgfVxyXG59XHJcbiJdfQ==