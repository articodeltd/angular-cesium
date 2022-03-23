import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
export declare class BillboardPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<BillboardPrimitiveDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<BillboardPrimitiveDrawerService>;
}
