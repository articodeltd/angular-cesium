import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';

@Injectable()
export class GeoUtilsService {

	constructor(private cesiumService: CesiumService) {
	}

	screenPositionToCartesian3(screenPos: {x: number, y: number}) {
		const camera = this.cesiumService.getViewer().camera;
		return camera.pickEllipsoid(screenPos);
	}
}
