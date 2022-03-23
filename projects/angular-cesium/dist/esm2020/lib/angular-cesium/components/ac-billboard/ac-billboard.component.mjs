import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/billboard-drawer/billboard-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }">;
 *    </ac-billboard>
 *  ```
 */
export class AcBillboardComponent extends EntityOnMapComponent {
    constructor(billboardDrawer, mapLayers) {
        super(billboardDrawer, mapLayers);
    }
}
AcBillboardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardComponent, deps: [{ token: i1.BillboardDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBillboardComponent, selector: "ac-billboard", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.BillboardDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYmlsbGJvYXJkLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1iaWxsYm9hcmQvYWMtYmlsbGJvYXJkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBSTVGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7R0FrQkc7QUFNSCxNQUFNLE9BQU8sb0JBQXFCLFNBQVEsb0JBQW9CO0lBRTVELFlBQVksZUFBdUMsRUFBRSxTQUEyQjtRQUM5RSxLQUFLLENBQUMsZUFBZSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7O2lIQUpVLG9CQUFvQjtxR0FBcEIsb0JBQW9CLDJFQUZyQixFQUFFOzJGQUVELG9CQUFvQjtrQkFKaEMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsY0FBYztvQkFDeEIsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQmlsbGJvYXJkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYmlsbGJvYXJkLWRyYXdlci9iaWxsYm9hcmQtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgYmlsbGJvYXJkIGltcGxlbWVudGF0aW9uLlxyXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxyXG4gKiAgVGhlIHByb3BlcnRpZXMgb2YgcHJvcHMgYXJlIHRoZSBzYW1lIGFzIHRoZSBwcm9wZXJ0aWVzIG9mIEVudGl0eSBhbmQgQmlsbGJvYXJkR3JhcGhpY3M6XHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0JpbGxib2FyZEdyYXBoaWNzLmh0bWxcclxuICpcclxuICogIF9fVXNhZ2UgOl9fXHJcbiAqICBgYGBcclxuICogICAgPGFjLWJpbGxib2FyZCBbcHJvcHNdPVwie1xyXG4gKiAgICAgIGltYWdlOiBpbWFnZSxcclxuICogICAgICBwb3NpdGlvbjogcG9zaXRpb24sXHJcbiAqICAgICAgc2NhbGU6IHNjYWxlLFxyXG4gKiAgICAgIGNvbG9yOiBjb2xvcixcclxuICogICAgICBuYW1lOiBuYW1lXHJcbiAqICAgIH1cIj47XHJcbiAqICAgIDwvYWMtYmlsbGJvYXJkPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1iaWxsYm9hcmQnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQmlsbGJvYXJkQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihiaWxsYm9hcmREcmF3ZXI6IEJpbGxib2FyZERyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xyXG4gICAgc3VwZXIoYmlsbGJvYXJkRHJhd2VyLCBtYXBMYXllcnMpO1xyXG4gIH1cclxufVxyXG4iXX0=