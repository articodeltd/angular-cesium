import { Injectable } from '@angular/core';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../entities-drawer/enums/graphics-type.enum';

@Injectable()
export class EllipseDrawerService extends EntitiesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(cesiumService, GraphicsType.ellipse, {
      collectionsNumber: 100,
      collectionMaxSize: 100,
      collectionSuspensionTime: 100
    });
  }
}
