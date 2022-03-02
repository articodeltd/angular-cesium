import { Injectable } from '@angular/core';
import { PointPrimitiveCollection } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';

/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
@Injectable()
export class PointPrimitiveDrawerService extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(PointPrimitiveCollection, cesiumService);
  }
}
