import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i2 from "../../services/map-layers/map-layers.service";
/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */
export class AcCircleComponent extends EntityOnMapComponent {
    constructor(ellipseDrawerService, mapLayers) {
        super(ellipseDrawerService, mapLayers);
    }
    updateEllipseProps() {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    }
    drawOnMap() {
        this.updateEllipseProps();
        super.drawOnMap();
    }
    updateOnMap() {
        this.updateEllipseProps();
        super.updateOnMap();
    }
}
AcCircleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleComponent, deps: [{ token: i1.EllipseDrawerService }, { token: i2.MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcCircleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCircleComponent, selector: "ac-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-circle',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipseDrawerService }, { type: i2.MapLayersService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY2lyY2xlLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1jaXJjbGUvYWMtY2lyY2xlLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFDLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLHNEQUFzRCxDQUFDOzs7O0FBSTVGOzs7Ozs7Ozs7Ozs7Ozs7OztHQWlCRztBQU1ILE1BQU0sT0FBTyxpQkFBa0IsU0FBUSxvQkFBb0I7SUFFekQsWUFBWSxvQkFBMEMsRUFBRSxTQUEyQjtRQUNqRixLQUFLLENBQUMsb0JBQW9CLEVBQUUsU0FBUyxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVPLGtCQUFrQjtRQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUM3QyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxHQUFHLENBQUM7SUFDNUIsQ0FBQztJQUVELFNBQVM7UUFDUCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDcEIsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztRQUMxQixLQUFLLENBQUMsV0FBVyxFQUFFLENBQUM7SUFDdEIsQ0FBQzs7OEdBcEJVLGlCQUFpQjtrR0FBakIsaUJBQWlCLHdFQUZsQixFQUFFOzJGQUVELGlCQUFpQjtrQkFKN0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsV0FBVztvQkFDckIsUUFBUSxFQUFFLEVBQUU7aUJBQ2IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDb21wb25lbnQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRW50aXR5T25NYXBDb21wb25lbnQgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9lbnRpdHktb24tbWFwL2VudGl0eS1vbi1tYXAuY29tcG9uZW50JztcclxuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBMYXllcnNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbWFwLWxheWVycy9tYXAtbGF5ZXJzLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGEgY2lyY2xlIGltcGxlbWVudGF0aW9uLlxyXG4gKiAgVGhlIGVsZW1lbnQgbXVzdCBiZSBhIGNoaWxkIG9mIGFjLW1hcCBlbGVtZW50LlxyXG4gKiAgc2VtaU1ham9yQXhpcyBhbnMgc2VtaU1pbm9yQXhpcyBhcmUgcmVwbGFjZWQgd2l0aCByYWRpdXMgcHJvcGVydHkuXHJcbiAqICBBbGwgb3RoZXIgcHJvcGVydGllcyBvZiBwcm9wcyBhcmUgdGhlIHNhbWUgYXMgdGhlIHByb3BlcnRpZXMgb2YgRW50aXR5IGFuZCBFbGxpcHNlR3JhcGhpY3M6XHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VudGl0eS5odG1sXHJcbiAqICArIGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0VsbGlwc2VHcmFwaGljcy5odG1sXHJcbiAqXHJcbiAqICBfX1VzYWdlOl9fXHJcbiAqICBgYGBcclxuICogIDxhYy1jaXJjbGUgW3Byb3BzXT1cIntcclxuICogICAgcG9zaXRpb246IHBvc2l0aW9uLFxyXG4gKiAgICByYWRpdXM6NDAwMDAuMCxcclxuICogICAgZ3JhbnVsYXJpdHk6MC4wMyxcclxuICogIH1cIj5cclxuICogIDwvYWMtY2lyY2xlPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1jaXJjbGUnLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQ2lyY2xlQ29tcG9uZW50IGV4dGVuZHMgRW50aXR5T25NYXBDb21wb25lbnQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVyczogTWFwTGF5ZXJzU2VydmljZSkge1xyXG4gICAgc3VwZXIoZWxsaXBzZURyYXdlclNlcnZpY2UsIG1hcExheWVycyk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZUVsbGlwc2VQcm9wcygpIHtcclxuICAgIHRoaXMucHJvcHMuc2VtaU1ham9yQXhpcyA9IHRoaXMucHJvcHMucmFkaXVzO1xyXG4gICAgdGhpcy5wcm9wcy5zZW1pTWlub3JBeGlzID0gdGhpcy5wcm9wcy5yYWRpdXM7XHJcbiAgICB0aGlzLnByb3BzLnJvdGF0aW9uID0gMC4wO1xyXG4gIH1cclxuXHJcbiAgZHJhd09uTWFwKCkge1xyXG4gICAgdGhpcy51cGRhdGVFbGxpcHNlUHJvcHMoKTtcclxuICAgIHN1cGVyLmRyYXdPbk1hcCgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlT25NYXAoKSB7XHJcbiAgICB0aGlzLnVwZGF0ZUVsbGlwc2VQcm9wcygpO1xyXG4gICAgc3VwZXIudXBkYXRlT25NYXAoKTtcclxuICB9XHJcbn1cclxuIl19