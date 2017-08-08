import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';

/**
 * @deprecated
 * This drawer is deprecated. PolygonDrawerService is used instead.
 * Primitive polygon drawer.
 */
@Injectable()
export class PrimitivePolygonDrawerService extends StaticPrimitiveDrawer {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PolygonGeometry, cesiumService);
	}
}
