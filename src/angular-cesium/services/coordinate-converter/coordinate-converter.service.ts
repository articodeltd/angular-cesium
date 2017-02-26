import { Injectable, Optional } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';

let geodesy = require('geodesy');
let UTM = geodesy.Utm;
let LatLonEllipsoidal = geodesy.LatLonEllipsoidal;

@Injectable()
export class CoordinateConverter {
	constructor(@Optional() private cesiumService?: CesiumService) {
	}

	screenToCartesian3(screenPos: {x: number, y: number}) {
		if (!this.cesiumService) {
			throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order to do screen position calculations');
		}
		else {
			let camera = this.cesiumService.getViewer().camera;

			return camera.pickEllipsoid(screenPos);
		}
	}

	screenToCartographic(screenPos: {x: number, y: number}, ellipsoid?: any) {
		return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
	}

	cartesian3ToCartographic(cartesian, ellipsoid?: any) {
		return Cesium.Cartographic.fromCartesian(cartesian, ellipsoid);
	}

	degreesToCartographic(longitude: number, latitude: number, height?: number) {
		return Cesium.Cartographic.fromDegrees(longitude, latitude, height);
	}

	radiansToCartographic(longitude: number, latitude: number, height?: number) {
		return Cesium.Cartographic.fromRadians(longitude, latitude, height);
	}

	degreesToUTM(longitude: number, latitude: number, height?: number) {
		return new LatLonEllipsoidal(latitude, longitude, undefined, height).toUtm();
	}

	UTMToDegrees(zone: number, hemisphere: string, easting: number, northing: number) {
		return this.geodesyToCesiumObject(new UTM(zone, hemisphere, easting, northing).toLatLonE());
	}

	private geodesyToCesiumObject(geodesy) {
		return {
			longitude: geodesy.lon,
			latitude: geodesy.lat,
			height: geodesy.height ? geodesy.height : 0
		}
	}
}
