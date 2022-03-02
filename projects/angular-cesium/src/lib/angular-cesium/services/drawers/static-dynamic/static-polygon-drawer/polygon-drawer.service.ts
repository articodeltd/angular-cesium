import { Injectable } from '@angular/core';
import { PolygonGeometry } from 'cesium';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';

/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
@Injectable()
export class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
  constructor(cesiumService: CesiumService) {
    super(PolygonGeometry, cesiumService);
  }
}
