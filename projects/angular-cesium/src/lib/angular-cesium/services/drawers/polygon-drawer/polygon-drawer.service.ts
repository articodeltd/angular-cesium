import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';

/**
 *  This drawer is responsible for drawing polygons.
 */
@Injectable()
export class PolygonDrawerService extends EntitiesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(cesiumService, GraphicsType.polygon);
  }
}
