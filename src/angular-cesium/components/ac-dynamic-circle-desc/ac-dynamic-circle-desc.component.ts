import { Component } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a dynamic(position is updatable) implementation of an circle.
 *  Usage :
 *    <ac-dynamic-circle-desc props="{
        center: data.position,
        radius: 5
        rotation : 0.785398,
        width:3, // Optional
        granularity:0.08 // Optional
        }">
 }">

 @param {Cesium.Cartesian3} center
 @param {number} rotation
 @param {number} radius in meters
 @param {number} [1] width
 @param {number} granularity
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

	protected _propsEvaluator(context: Object): any {
		let cesiumProps = super._propsEvaluator(context);

		cesiumProps.semiMajorAxis = cesiumProps.radius;
		cesiumProps.semiMinorAxis = cesiumProps.radius;

		return cesiumProps;
	}
}
