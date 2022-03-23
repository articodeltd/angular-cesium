import { CesiumService } from '../../cesium/cesium.service';
import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible of drawing polylines.
 */
export declare class PolylineDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<PolylineDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PolylineDrawerService>;
}
