import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Point.html
 *
 *  __Usage :__
 *  ```
 *    <ac-point-primitive-desc props="{
 *      position: track.position,
 *      color: Color.RED
 *    }">
 *    </ac-point-primitive-desc>
 *  ```
 */
export declare class AcPointPrimitiveDescComponent extends BasicDesc {
    constructor(pointPrimitiveDrawerService: PointPrimitiveDrawerService, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcPointPrimitiveDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcPointPrimitiveDescComponent, "ac-point-primitive-desc", never, {}, {}, never, never>;
}
