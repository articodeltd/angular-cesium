import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

/**
 *  This is a billboard implementation.
 *  The ac-billboard-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of billboard:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *  __Usage :__
 *  ```
 *    &lt;ac-billboard-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }"&gt;
 *    &lt;/ac-billboard-desc&gt;
 *  ```
 */

@Component({
	selector: 'ac-billboard-desc',
	template: ''
})
export class AcBillboardDescComponent extends BasicDesc {

	constructor(billboardDrawer: BillboardDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(billboardDrawer, layerService, computationCache, cesiumProperties);
	}
}
