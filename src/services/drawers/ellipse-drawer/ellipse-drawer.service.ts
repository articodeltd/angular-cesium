import {Injectable} from '@angular/core';
import {BasicEntityDrawerService} from '../basic-entity-drawer/basic-entity-drawer.service';
import {CesiumService} from '../../cesium/cesium.service';
import {GraphicsType} from '../basic-entity-drawer/enums/graphics-type.enum';

@Injectable()
export class EllipseDrawerService extends BasicEntityDrawerService {
    constructor(cesiumService: CesiumService) {
        super(cesiumService, GraphicsType.ellipse, 100, 100, 100);
    }
}
