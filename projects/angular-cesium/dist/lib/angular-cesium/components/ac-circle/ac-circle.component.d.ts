import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
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
export declare class AcCircleComponent extends EntityOnMapComponent {
    constructor(ellipseDrawerService: EllipseDrawerService, mapLayers: MapLayersService);
    private updateEllipseProps;
    drawOnMap(): void;
    updateOnMap(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcCircleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcCircleComponent, "ac-circle", never, {}, {}, never, never>;
}
