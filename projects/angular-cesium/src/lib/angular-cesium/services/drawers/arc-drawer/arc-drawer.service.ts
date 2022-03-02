import { Injectable } from '@angular/core';
import { PolylineCollection, Material } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import { GeoUtilsService } from '../../geo-utils/geo-utils.service';

/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */

@Injectable()
export class ArcDrawerService extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(PolylineCollection, cesiumService);
  }

  _calculateArcPositions(cesiumProps: any) {
    const quality = cesiumProps.quality || 18;
    const delta = (cesiumProps.delta) / quality;
    const pointsArray = [];
    for (let i = 0; i < quality + 1; ++i) {
      const point =
        GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
      pointsArray.push(point);
    }

    return pointsArray;
  }

  _calculateTriangle(cesiumProps: any) {
    return [
      cesiumProps.center,
      GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
    ];
  }

  _calculateArc(cesiumProps: any) {
    const arcPoints = this._calculateArcPositions(cesiumProps);
    return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
  }

  add(cesiumProps: any): any {
    cesiumProps.positions = this._calculateArc(cesiumProps);
    if (cesiumProps.color) {
      const material = Material.fromType('Color');
      material.uniforms.color = cesiumProps.color;
      cesiumProps.material = material;
    }

    return this._cesiumCollection.add(cesiumProps);
  }

  update(primitive: any, cesiumProps: any) {
    if (!cesiumProps.constantColor && cesiumProps.color &&
      !primitive.material.uniforms.color.equals(cesiumProps.color)) {
      primitive.material.uniforms.color = cesiumProps.color;
    }
    primitive.width = cesiumProps.width !== undefined ? cesiumProps.width : primitive.width;
    primitive.show = cesiumProps.show !== undefined ? cesiumProps.show : primitive.show;
    primitive.distanceDisplayCondition = cesiumProps.distanceDisplayCondition !== undefined ?
      cesiumProps.distanceDisplayCondition : primitive.distanceDisplayCondition;
    primitive.positions = this._calculateArc(cesiumProps);

    return primitive;
  }
}
