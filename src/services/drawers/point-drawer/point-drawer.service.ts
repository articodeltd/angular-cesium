import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

/**
 *  This drawer is responsible for creating the dynamic version of the point component.
 */
@Injectable()
export class PointDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PointPrimitiveCollection, cesiumService);
	}
}
