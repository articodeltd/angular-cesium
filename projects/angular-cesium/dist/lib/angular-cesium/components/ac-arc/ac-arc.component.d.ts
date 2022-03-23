import { OnChanges, SimpleChanges } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import * as i0 from "@angular/core";
/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */
export declare class AcArcComponent extends EntityOnMapComponent implements OnChanges {
    geometryProps: any;
    instanceProps: any;
    primitiveProps: any;
    constructor(arcDrawer: ArcDrawerService, mapLayers: MapLayersService);
    updateOnMap(): void;
    drawOnMap(): any;
    ngOnChanges(changes: SimpleChanges): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcArcComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcArcComponent, "ac-arc", never, { "geometryProps": "geometryProps"; "instanceProps": "instanceProps"; "primitiveProps": "primitiveProps"; }, {}, never, never>;
}
