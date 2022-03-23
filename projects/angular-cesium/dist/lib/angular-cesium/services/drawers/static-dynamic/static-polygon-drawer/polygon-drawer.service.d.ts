import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
export declare class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService: CesiumService);
    static ɵfac: i0.ɵɵFactoryDeclaration<StaticPolygonDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<StaticPolygonDrawerService>;
}
