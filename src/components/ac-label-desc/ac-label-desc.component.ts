import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';

/**
 *  This is a label implementation.
 *  The ac-label-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of label:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *  __Usage :__
 *  ```
 *    &lt;ac-label-desc props="{
 *       position: track.position,
 *       pixelOffset : [-15,20] | pixelOffset,
 *       text: track.name,
 *       font: '15px sans-serif'
 *    }"&gt;
 *    &lt;/ac-label-desc&gt;
 *  ```
 */

@Component({
	selector: 'ac-label-desc',
	template: '',
})
export class AcLabelDescComponent extends BasicDesc {

	constructor(labelDrawer: LabelDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(labelDrawer, layerService, computationCache, cesiumProperties);
	}
}
