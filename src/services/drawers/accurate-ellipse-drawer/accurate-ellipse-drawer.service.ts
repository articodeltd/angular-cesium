import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

@Injectable()
export class AccurateEllipseDrawerService extends SimpleDrawerService {
  constructor(cesiumService: CesiumService) {
    super(Cesium.PolylineCollection, cesiumService);
  }

  add(cesiumProps: any): any {
    const positions = this.generatePositions(cesiumProps);
    if (cesiumProps.color) {
      const material = Cesium.Material.fromType('Color');
      material.uniforms.color = cesiumProps.color;
      cesiumProps.material = material;
    }

    const polylinedEllipse = {
      positions: positions,
      loop: true,
      followSurface: cesiumProps.followSurface,
      width: cesiumProps.width,
      material: cesiumProps.material
    };

    return super.add(polylinedEllipse);
  }

  update(ellipse: any, cesiumProps: any): any {
    ellipse.positions = this.generatePositions(cesiumProps);
    if (!cesiumProps.constantColor && cesiumProps.color &&
      !ellipse.material.uniforms.color.equals(cesiumProps.color)) {
      ellipse.material.uniforms.color = cesiumProps.color;
    }

    super.update(ellipse, { width: cesiumProps.width });

    return ellipse;
  }

  private generatePositions(cesiumProps: any) {
    cesiumProps.granularity = cesiumProps.granularity || 0.01;
    const points = Cesium.EllipseGeometryLibrary.computeEllipsePositions(cesiumProps, false, true);
    const positions = [];

    const length = points.outerPositions.length;
    for (let startIndex = 0; startIndex < length; startIndex += 3) {
      positions.push(Cesium.Cartesian3.fromArray(points.outerPositions, startIndex));
    }

    return positions;
  }
}
