import { Component } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { EntityDrawerService } from '../../services/drawers/entity-drawer/entity-drawer.service';

/**
 *  This is an implementation of a Cesium entity.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-entity-desc props="{
 *		        position : model.position,
 *       orientation : this.getOrientation(model),
 *       model : {
 *           uri : this.url,
 *           minimumPixelSize : 128,
 *           maximumScale : 20000
 *       }}
 *      }"&gt;
 *    ">
 *    &lt;/ac-dynamic-ellipse-desc&gt;
 *  ```
 */
@Component({
	selector: 'ac-entity-desc',
	template: '',
})
export class AcEntityDescComponent extends BasicDesc {
	constructor(entityDrawer: EntityDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(entityDrawer, layerService, computationCache, cesiumProperties);
	}
}
