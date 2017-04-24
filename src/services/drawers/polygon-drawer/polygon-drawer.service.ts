import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';

/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
@Injectable()
export class PolygonDrawerService extends StaticPrimitiveDrawer {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PolygonGeometry, cesiumService);
	}
}
