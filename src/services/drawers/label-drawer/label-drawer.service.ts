import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';

/**
 *  This drawer is responsible for creating label component.
 */
@Injectable()
export class LabelDrawerService extends PrimitivesDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.LabelCollection, cesiumService);
	}
}
