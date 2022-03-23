import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
export declare class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<LabelPrimitiveDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<LabelPrimitiveDrawerService>;
}
