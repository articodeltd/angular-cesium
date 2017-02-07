import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';

@Injectable()
export class LabelDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.LabelCollection, cesiumService);
	}
}
