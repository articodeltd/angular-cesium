import { Injectable } from '@angular/core';
import { PolygonGeometry } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-dynamic/static-primitive-drawer/static-primitive-drawer.service';

/**
 * @deprecated use PolygonDrawerService instead
 * This drawer is deprecated. use instead PolygonDrawerService.
 * Primitive polygon drawer.
 */
@Injectable()
export class PrimitivePolygonDrawerService extends StaticPrimitiveDrawer {
  constructor(cesiumService: CesiumService) {
    super(PolygonGeometry, cesiumService);
  }
}
