import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
export declare class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    add(cesiumProps: any): any;
    update(cesiumObject: any, cesiumProps: any): void;
    withColorMaterial(cesiumProps: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<PolylinePrimitiveDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PolylinePrimitiveDrawerService>;
}
