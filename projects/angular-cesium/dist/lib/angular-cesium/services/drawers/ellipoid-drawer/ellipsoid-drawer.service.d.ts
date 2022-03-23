import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing ellipsoid.
 */
export declare class EllipsoidDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<EllipsoidDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EllipsoidDrawerService>;
}
