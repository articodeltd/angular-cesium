import { Component } from '@angular/core';

import { LayerService } from '../../services/layer-service/layer-service.service';
import { PolygonDrawerService } from '../../services/polygon-drawer/polygon-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BasicStaticPrimitiveDesc } from '../../services/basic-primitive-desc/basic-static-primitive-desc.service';

/**
 *  This is a static (position, color, etc.. are not updated) implementation of a polygon.
 *  Usage :
 *    <ac-polygon-static-desc
 geometryProps="{
            polygonHierarchy: polygon.geometry.polygonHierarchy,
            height: polygon.geometry.height,
            granularity: polygon.geometry.granularity
        }"
 instanceProps="{
            attributes: polygon.attributes
        }"
 primitiveProps="{
            appearance: polygon.appearance
        }"
 >
 */
@Component({
	selector: 'ac-polygon-static-desc',
	templateUrl: 'ac-polygon-static-desc.component.html',
	styleUrls: ['ac-polygon-static-desc.component.css']
})
export class AcPolygonStaticDescComponent extends BasicStaticPrimitiveDesc {
	constructor(polygonDrawer: PolygonDrawerService, layerService: LayerService,
	            computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
		super(polygonDrawer, layerService, computationCache, cesiumProperties);
	}
}
