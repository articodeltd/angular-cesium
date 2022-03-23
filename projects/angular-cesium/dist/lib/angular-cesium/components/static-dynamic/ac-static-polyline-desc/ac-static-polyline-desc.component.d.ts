import { StaticPolylineDrawerService } from '../../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { BasicStaticPrimitiveDesc } from '../../../services/basic-primitive-desc/basic-static-primitive-desc.service';
import * as i0 from "@angular/core";
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
export declare class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polylineDrawerService: StaticPolylineDrawerService, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    static ɵfac: i0.ɵɵFactoryDeclaration<AcStaticPolylineDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcStaticPolylineDescComponent, "ac-static-polyline-desc", never, {}, {}, never, never>;
}
