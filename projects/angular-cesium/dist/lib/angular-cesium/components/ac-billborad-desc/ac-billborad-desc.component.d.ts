import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import * as i0 from "@angular/core";
/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-desc>
 *  ```
 */
export declare class AcBillboardDescComponent extends BasicDesc {
    constructor(billboardDrawer: BillboardDrawerService, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcBillboardDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcBillboardDescComponent, "ac-billboard-desc", never, {}, {}, never, never>;
}
