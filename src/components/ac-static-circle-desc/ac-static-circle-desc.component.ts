import { Component } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-circle-drawer/static-circle-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../services/basic-primitive-desc/basic-static-primitive-desc.service';

/**
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
@Component({
	selector: 'ac-static-circle',
	template: ''
})
export class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
	constructor(staticCircleDrawer: StaticCircleDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
	}
}
