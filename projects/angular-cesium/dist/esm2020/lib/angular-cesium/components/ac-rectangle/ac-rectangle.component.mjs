import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/rectangle-dawer/rectangle-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a rectangle implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and RectangleGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-rectangle props="{
 *      coordinates: rectangle.coordinates,
 *      material: rectangle.material,
 *      height: rectangle.height
 *    }">
 *    </ac-rectangle>
 *  ```
 */
export class AcRectangleComponent extends EntityOnMapComponent {
    constructor(rectangleDrawer, mapLayers) {
        super(rectangleDrawer, mapLayers);
    }
}
AcRectangleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleComponent, deps: [{ token: i1.RectangleDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcRectangleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcRectangleComponent, selector: "ac-rectangle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-rectangle',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: i1.RectangleDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1yZWN0YW5nbGUvYWMtcmVjdGFuZ2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBRzVGOzs7Ozs7Ozs7Ozs7Ozs7O0dBZ0JHO0FBS0gsTUFBTSxPQUFPLG9CQUFxQixTQUFRLG9CQUFvQjtJQUM1RCxZQUFZLGVBQXVDLEVBQUUsU0FBMkI7UUFDOUUsS0FBSyxDQUFDLGVBQWUsRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNwQyxDQUFDOztpSEFIVSxvQkFBb0I7cUdBQXBCLG9CQUFvQiwyRUFGckIsRUFBRTsyRkFFRCxvQkFBb0I7a0JBSmhDLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFFBQVEsRUFBRSxFQUFFO2lCQUNiIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ29tcG9uZW50IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFJlY3RhbmdsZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3JlY3RhbmdsZS1kYXdlci9yZWN0YW5nbGUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFbnRpdHlPbk1hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1vbi1tYXAvZW50aXR5LW9uLW1hcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgcmVjdGFuZ2xlIGltcGxlbWVudGF0aW9uLlxyXG4gKiAgVGhlIGFjLWxhYmVsIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxyXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgUmVjdGFuZ2xlR3JhcGhpY3M6XHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1JlY3RhbmdsZUdyYXBoaWNzLmh0bWxcclxuICpcclxuICogIF9fVXNhZ2U6X19cclxuICogIGBgYFxyXG4gKiAgICA8YWMtcmVjdGFuZ2xlIHByb3BzPVwie1xyXG4gKiAgICAgIGNvb3JkaW5hdGVzOiByZWN0YW5nbGUuY29vcmRpbmF0ZXMsXHJcbiAqICAgICAgbWF0ZXJpYWw6IHJlY3RhbmdsZS5tYXRlcmlhbCxcclxuICogICAgICBoZWlnaHQ6IHJlY3RhbmdsZS5oZWlnaHRcclxuICogICAgfVwiPlxyXG4gKiAgICA8L2FjLXJlY3RhbmdsZT5cclxuICogIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1yZWN0YW5nbGUnLFxyXG4gIHRlbXBsYXRlOiAnJ1xyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNSZWN0YW5nbGVDb21wb25lbnQgZXh0ZW5kcyBFbnRpdHlPbk1hcENvbXBvbmVudCB7XHJcbiAgY29uc3RydWN0b3IocmVjdGFuZ2xlRHJhd2VyOiBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlLCBtYXBMYXllcnM6IE1hcExheWVyc1NlcnZpY2UpIHtcclxuICAgIHN1cGVyKHJlY3RhbmdsZURyYXdlciwgbWFwTGF5ZXJzKTtcclxuICB9XHJcbn1cclxuIl19