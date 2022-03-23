import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-point [props]="{
 *    position: position,
 *    width: 3
 *  }">
 *  </ac-point>
 *  ```
 */
export declare class AcPointComponent extends EntityOnMapComponent {
    constructor(pointDrawer: PointDrawerService, mapLayers: MapLayersService);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcPointComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcPointComponent, "ac-point", never, {}, {}, never, never>;
}
