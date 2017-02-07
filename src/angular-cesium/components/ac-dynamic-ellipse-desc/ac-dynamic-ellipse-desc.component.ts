import { Component } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a dynamic(position is updatable) implementation of an ellipse.
 *  Usage :
 *    <ac-dynamic-ellipse-desc props="{
        center: data.position,
        semiMajorAxis:250000.0,
        semiMinorAxis:400000.0,
        rotation : 0.785398,
        width:3, // Optional
        granularity:0.08 // Optional
        }">
 }">

 @param {Cesium.Cartesian3} center
 @param {number} semiMajorAxis
 @param {number} semiMinorAxis
 @param {number} rotation
 @param {number} [1] width
 @param {number} granularity
 */
@Component({
	selector: 'ac-dynamic-ellipse-desc',
	templateUrl: 'ac-dynamic-ellipse-desc.component.html',
	styleUrls: ['ac-dynamic-ellipse-desc.component.css']
})
export class AcDynamicEllipseDescComponent extends BasicDesc {
	constructor(ellipseDrawer: DynamicEllipseDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(ellipseDrawer, layerService, computationCache, cesiumProperties);
	}
}
