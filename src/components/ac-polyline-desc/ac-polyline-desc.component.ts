import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

/**
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-polyline-desc element must be a child of ac-layer element.
 *  __Usage:__
 *  ```
 *    &lt;ac-polyline-desc props="{width : polyline.width, //optional
 *                                      positions: polyline.positions,
 *                                      material: polyline.material //optional
 *                                      }"
 *    &gt;
 *    &lt;/ac-polyline-desc&gt;
 * ```
 */
@Component({
	selector: 'ac-polyline-desc',
	template: ''
})
export class AcPolylineDescComponent extends BasicDesc {

	constructor(dynamicPolylineDrawerService: PolylineDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
	}
}
