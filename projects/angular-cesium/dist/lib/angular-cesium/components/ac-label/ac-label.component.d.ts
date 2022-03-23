import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
export declare class AcLabelComponent extends EntityOnMapComponent {
    constructor(labelDrawer: LabelDrawerService, mapLayers: MapLayersService);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcLabelComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcLabelComponent, "ac-label", never, {}, {}, never, never>;
}
