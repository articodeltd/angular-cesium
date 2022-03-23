import { CesiumService } from '../../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
export declare class DynamicPolylineDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicPolylineDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DynamicPolylineDrawerService>;
}
