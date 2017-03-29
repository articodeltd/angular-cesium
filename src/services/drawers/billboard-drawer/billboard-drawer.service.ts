import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

/**
 *  This drawer is responsible for creating billboard component over the Cesium map.
 */
@Injectable()
export class BillboardDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.BillboardCollection, cesiumService);
	}
}
