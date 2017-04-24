import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

/**
 *  This is a dynamic(position is updatable) implementation of an point.
 *  The ac-point-desc element must be a child of ac-layer element.
 *  see also:
 *  https://cesiumjs.org/Cesium/Build/Documentation/PointPrimitive.html
 *  https://cesiumjs.org/Cesium/Build/Documentation/PointPrimitiveCollection.html
 *
 *  Usage :
 *  @example
 *    <ac-point-desc props="{
 *                         pixelSize : point.pixelSize, //optional
 *                         position : point.positions,
 *                         color : point.color  //optional
 *                        }">
 *	  </ac-point-desc>
 */
@Component({
	selector: 'ac-point-desc',
	template: ''
})
export class AcPointDescComponent extends BasicDesc {

	constructor(pointDrawerService: PointDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(pointDrawerService, layerService, computationCache, cesiumProperties);
	}
}
