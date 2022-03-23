import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
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
export declare class AcBillboardComponent extends EntityOnMapComponent {
    constructor(billboardDrawer: BillboardDrawerService, mapLayers: MapLayersService);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcBillboardComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcBillboardComponent, "ac-billboard", never, {}, {}, never, never>;
}
