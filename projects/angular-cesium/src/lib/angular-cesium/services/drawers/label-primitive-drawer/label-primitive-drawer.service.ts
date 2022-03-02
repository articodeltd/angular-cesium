import { Injectable } from '@angular/core';
import { LabelCollection } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';

/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
@Injectable()
export class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(LabelCollection, cesiumService);
  }
}
