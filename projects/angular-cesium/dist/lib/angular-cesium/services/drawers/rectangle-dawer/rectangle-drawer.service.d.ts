import { EntitiesDrawerService } from '../entities-drawer/entities-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing rectangles.
 */
export declare class RectangleDrawerService extends EntitiesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<RectangleDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RectangleDrawerService>;
}
