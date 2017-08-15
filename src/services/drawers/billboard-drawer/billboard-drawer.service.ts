import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

/**
 *  This drawer is responsible for drawing billboards.
 */
@Injectable()
export class BillboardDrawerService extends PrimitivesDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.BillboardCollection, cesiumService);
	}
}
