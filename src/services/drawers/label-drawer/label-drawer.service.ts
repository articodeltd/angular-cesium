import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';

/**
 *  This drawer is responsible for drawing labels.
 */
@Injectable()
export class LabelDrawerService extends PrimitivesDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.LabelCollection, cesiumService);
	}
}
