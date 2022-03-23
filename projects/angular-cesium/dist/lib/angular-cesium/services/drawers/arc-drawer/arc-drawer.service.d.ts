import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
export declare class ArcDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    _calculateArcPositions(cesiumProps: any): any[];
    _calculateTriangle(cesiumProps: any): any[];
    _calculateArc(cesiumProps: any): any[];
    add(cesiumProps: any): any;
    update(primitive: any, cesiumProps: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<ArcDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ArcDrawerService>;
}
