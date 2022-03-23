import { CesiumService } from '../../../cesium/cesium.service';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
export declare class DynamicEllipseDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService: CesiumService);
    add(cesiumProps: any): any;
    update(ellipse: any, cesiumProps: any): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<DynamicEllipseDrawerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DynamicEllipseDrawerService>;
}
