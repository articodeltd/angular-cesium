import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

/**
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-dynamic-polyline-desc element must be a child of ac-layer element.
 *  Usage :
 *  @example
 *    <ac-dynamic-polyline-desc props="{
 *                         width : polyline.width, //optional
 *                         positions: polyline.positions,
 *                         material: polyline.material //optional
 *                        }">
 *</ac-dynamic-polyline-desc>
 */
@Component({
	selector: 'ac-dynamic-polyline-desc',
	template: ''
})
export class AcDynamicPolylineDescComponent extends BasicDesc {

	constructor(dynamicPolylineDrawerService: DynamicPolylineDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
	}
}
