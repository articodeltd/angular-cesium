import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
export declare class PointPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<PointPrimitiveDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PointPrimitiveDrawerService>;
}
