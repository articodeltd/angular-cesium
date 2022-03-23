import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing points.
 */
export declare class PointDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<PointDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PointDrawerService>;
}
