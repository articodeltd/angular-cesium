import { Injectable } from '@angular/core';
import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';

/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
@Injectable()
export class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
  constructor(cesiumService: CesiumService) {
    super(Cesium.PolylineGeometry, cesiumService);
  }

  /**
   * Update function can only change the primitive color.
   */
  update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any) {
    const color = instanceProps.attributes.color.value;

    if (primitive.ready) {
      primitive.getGeometryInstanceAttributes().color = color;
    } else {
      primitive.readyPromise.then((readyPrimitive: any) => {
        readyPrimitive.getGeometryInstanceAttributes().color.value = color;
      });
    }

    return primitive;
  }
}
