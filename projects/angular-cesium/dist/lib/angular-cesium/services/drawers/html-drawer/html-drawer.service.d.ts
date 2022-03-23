import { CesiumService } from '../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
export declare class HtmlDrawerService extends PrimitivesDrawerService {
    private _cesiumService;
    constructor(_cesiumService: CesiumService);
    add(cesiumProps: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<HtmlDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HtmlDrawerService>;
}
