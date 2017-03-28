import { Component } from '@angular/core';
import { StaticPolylineDrawerService } from '../../services/drawers/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { BasicStaticPrimitiveDesc } from '../../services/basic-primitive-desc/basic-static-primitive-desc.service';

/**
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new Cesium.PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline&gt
 *  ```
 */
@Component({
	selector: 'ac-static-polyline-desc',
	template: ''
})
export class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
	constructor(polylineDrawerService: StaticPolylineDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(polylineDrawerService, layerService, computationCache, cesiumProperties);
	}
}
