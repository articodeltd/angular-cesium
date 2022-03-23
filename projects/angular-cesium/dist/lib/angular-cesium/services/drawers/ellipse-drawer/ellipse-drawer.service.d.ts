import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing ellipses.
 */
export declare class EllipseDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<EllipseDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EllipseDrawerService>;
}
