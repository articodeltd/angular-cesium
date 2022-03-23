import { CesiumService } from '../../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
export declare class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<StaticEllipseDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StaticEllipseDrawerService>;
}
