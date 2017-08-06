import {Injectable} from '@angular/core';
import { BasicEntityDrawerService } from '../basic-entity-drawer/basic-entity-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from '../basic-entity-drawer/enums/graphics-type.enum';

@Injectable()
export class PolygonDrawerService extends BasicEntityDrawerService {
    constructor(cesiumService: CesiumService) {
        super(cesiumService, GraphicsType.polygon);
    }
}
