import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../../drawers/simple-drawer/simple-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
@Injectable()
export class DynamicPolylineDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PolylineCollection, cesiumService);
	}
}
