import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';

/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
@Injectable()
export class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(Cesium.PolylineCollection, cesiumService);
  }

  add(cesiumProps: any) {
    return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
  }

  update(cesiumObject: any, cesiumProps: any) {
    if (cesiumProps.material instanceof Cesium.Color) {
      if (cesiumObject.material && cesiumObject.material.uniforms &&
        cesiumObject.material.uniforms.color instanceof Cesium.Color) {
        this.withColorMaterial(cesiumProps);
      } else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
        cesiumObject.material.uniforms.color = cesiumProps.material;
      }
    }
    super.update(cesiumObject, cesiumProps);
  }

  withColorMaterial(cesiumProps: any) {
    if (cesiumProps.material instanceof Cesium.Color) {
      const material = Cesium.Material.fromType('Color');
      material.uniforms.color = cesiumProps.material;
      cesiumProps.material = material;
    }

    return cesiumProps;
  }
}
