import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';

/**
 *  This drawer is responsible for creating label component.
 */
@Injectable()
export class LabelDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.LabelCollection, cesiumService);
	}
}
