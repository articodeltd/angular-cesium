import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
export declare abstract class PrimitivesDrawerService extends BasicDrawerService {
    private drawerType;
    private cesiumService;
    private _show;
    private _primitiveCollectionWrap;
    protected _cesiumCollection: any;
    protected _propsAssigner: Function;
    constructor(drawerType: any, cesiumService: CesiumService);
    init(): void;
    add(cesiumProps: any, ...args: any[]): any;
    update(entity: any, cesiumProps: any, ...args: any[]): void;
    remove(entity: any): void;
    removeAll(): void;
    setShow(showValue: boolean): void;
    getShow(): boolean;
}
