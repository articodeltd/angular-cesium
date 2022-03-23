import { BasicDesc } from '../../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { DynamicPolylineDrawerService } from '../../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import * as i0 from "@angular/core";
/**
 * @deprecated use ac-polylinc-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-dynamic-polyline-desc element must be a child of ac-layer element.
 *  __Usage:__
 *  ```
 *    &lt;ac-dynamic-polyline-desc props="{width : polyline.width, //optional
 *                                      positions: polyline.positions,
 *                                      material: polyline.material //optional
 *                                      }"
 *    &gt;
 *    &lt;/ac-dynamic-polyline-desc&gt;
 * ```
 */
export declare class AcDynamicPolylineDescComponent extends BasicDesc {
    constructor(dynamicPolylineDrawerService: DynamicPolylineDrawerService, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcDynamicPolylineDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcDynamicPolylineDescComponent, "ac-dynamic-polyline-desc", never, {}, {}, never, never>;
}
