import { Injectable } from '@angular/core';
import { Ellipsoid, Cartesian3, Cartographic } from 'cesium';
import { CesiumService } from '../cesium/cesium.service';
import { Vec3 } from '../../models/vec3';

@Injectable()
export class GeoUtilsService {
  static pointByLocationDistanceAndAzimuth(currentLocation: any, meterDistance: number, radianAzimuth: number, deprecated?) {
    const distance = meterDistance / Ellipsoid.WGS84.maximumRadius;
    const cartographicLocation =
      currentLocation instanceof Cartesian3 ? Cartographic.fromCartesian(currentLocation) : currentLocation;
    const cartesianLocation =
      currentLocation instanceof Cartesian3
        ? currentLocation
        : Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);

    let resultPosition;
    let resultDistance;
    let counter = 0;
    let distanceFactorRangeMax = 0.1;
    let distanceFactorRangeMin = -0.1;
    while (
      counter === 0 ||
      (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)
      ) {
      const factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
      resultPosition = GeoUtilsService._pointByLocationDistanceAndAzimuth(cartographicLocation, distance * (1 + factor), radianAzimuth);
      resultDistance = this.distance(cartesianLocation, resultPosition);

      if (resultDistance > meterDistance) {
        distanceFactorRangeMax = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
      } else {
        distanceFactorRangeMin = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
      }
      counter++;
    }

    return resultPosition;
  }

  static _pointByLocationDistanceAndAzimuth(cartographicLocation: any, distance: number, radianAzimuth: number) {
    const curLat = cartographicLocation.latitude;
    const curLon = cartographicLocation.longitude;
    const destinationLat = Math.asin(
      Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth),
    );

    let destinationLon =
      curLon +
      Math.atan2(
        Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat),
        Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat),
      );

    destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;

    return Cartesian3.fromRadians(destinationLon, destinationLat);
  }

  static distance(pos0: Cartesian3, pos1: Cartesian3): number {
    return Cartesian3.distance(pos0, pos1);
  }

  static getPositionsDelta(position0: Cartesian3, position1: Cartesian3): Vec3 {
    return {
      x: position1.x - position0.x,
      y: position1.y - position0.y,
      z: position1.z - position0.z,
    };
  }

  static addDeltaToPosition(position: Cartesian3, delta: Vec3, updateReference = false): Cartesian3 {
    if (updateReference) {
      position.x += delta.x;
      position.y += delta.y;
      position.z += delta.z;
      const cartographic = Cartographic.fromCartesian(position);
      cartographic.height = 0;
      const cartesian = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
      position.x = cartesian.x;
      position.y = cartesian.y;
      position.z = cartesian.z;
      return position;
    } else {
      const cartesian = new Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
      const cartographic = Cartographic.fromCartesian(cartesian);
      cartographic.height = 0;
      return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
    }
  }

  static middleCartesian3Point(position0: Cartesian3, position1: Cartesian3) {
    return new Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
  }

  constructor(private cesiumService: CesiumService) {
  }

  screenPositionToCartesian3(screenPos: { x: number; y: number }) {
    const camera = this.cesiumService.getViewer().camera;
    return camera.pickEllipsoid(screenPos);
  }
}
