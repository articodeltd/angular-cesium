import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';

/**
 *  This drawer is responsible of drawing polylines.
 */
@Injectable()
export class PolylineDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PolylineCollection, cesiumService);
	}

  add(cesiumProps: any) {
    if (cesiumProps.color) {
      const material = Cesium.Material.fromType('Color');
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
    super.update(primitive, cesiumProps);
  }
}
