import { Component } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a dynamic(position is updatable) implementation of an circle.
 __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cesium.Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
@Component({
	selector: 'ac-dynamic-circle-desc',
	template: ''
})
export class AcDynamicCircleDescComponent extends BasicDesc {
	constructor(ellipseDrawer: DynamicEllipseDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(ellipseDrawer, layerService, computationCache, cesiumProperties);
	}

	/**
	 *
	 * @param {Object} context
	 * @returns {any}
	 */
	protected _propsEvaluator(context: Object): any {
		const cesiumProps = super._propsEvaluator(context);

		cesiumProps.semiMajorAxis = cesiumProps.radius;
		cesiumProps.semiMinorAxis = cesiumProps.radius;

		return cesiumProps;
	}
}
