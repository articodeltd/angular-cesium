import { Injectable, Optional } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import * as geodesy from 'geodesy';

const UTM = geodesy.Utm;
const LatLonEllipsoidal = geodesy.LatLonEllipsoidal;

/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * @example
 * import { Component, OnInit } from '@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * @Component({
 * 		selector:'my-component',
 * 		template:'<div>{{showCartographic}}</div>',
 * 		providers:[CoordinateConverter]
 * })
 * export class MyComponent implements OnInit {
 * 		showCartographic;
 *
 * 		constructor(private coordinateConverter:CoordinateConverter){
 * 		}
 *
 * 		ngOnInit(){
 * 			this.showCartographic = this.coordinateConverter.degreesToCartographic(5, 5, 5);
 *  }
 * }
 *
 */
@Injectable()
export class CoordinateConverter {
  constructor(@Optional() private cesiumService?: CesiumService) {
  }

  screenToCartesian3(screenPos: {x: number, y: number}) {
    if (!this.cesiumService) {
      throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order to do screen position calculations');
    }
    else {
      const camera = this.cesiumService.getViewer().camera;

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

  private geodesyToCesiumObject(geodesyRadians) {
    return {
      longitude: geodesyRadians.lon,
      latitude: geodesyRadians.lat,
      height: geodesyRadians.height ? geodesyRadians.height : 0
    };
  }
}
