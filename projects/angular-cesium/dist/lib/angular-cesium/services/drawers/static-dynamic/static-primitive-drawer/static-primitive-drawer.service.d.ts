import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';
/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 */
export declare abstract class StaticPrimitiveDrawer extends PrimitivesDrawerService {
    private geometryType;
    constructor(geometryType: any, cesiumService: CesiumService);
    add(geometryProps: any, instanceProps: any, primitiveProps: any): any;
    update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any): any;
}
