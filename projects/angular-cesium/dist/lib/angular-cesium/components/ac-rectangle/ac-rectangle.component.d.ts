import { RectangleDrawerService } from '../../services/drawers/rectangle-dawer/rectangle-drawer.service';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
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
export declare class AcRectangleComponent extends EntityOnMapComponent {
    constructor(rectangleDrawer: RectangleDrawerService, mapLayers: MapLayersService);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcRectangleComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcRectangleComponent, "ac-rectangle", never, {}, {}, never, never>;
}
