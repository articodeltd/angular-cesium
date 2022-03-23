import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { EntitiesDrawerOptions } from '../../../models/entities-drawer-options';
/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
export declare class EntitiesDrawerService extends BasicDrawerService {
    private cesiumService;
    private graphicsType;
    private defaultOptions;
    private entityCollections;
    private graphicsTypeName;
    constructor(cesiumService: CesiumService, graphicsType: GraphicsType, defaultOptions?: EntitiesDrawerOptions);
    private getFreeEntitiesCollection;
    init(options?: EntitiesDrawerOptions): any[];
    add(cesiumProps: any): any;
    update(entity: any, cesiumProps: any): void;
    remove(entity: any): void;
    removeAll(): void;
    setShow(showValue: boolean): void;
    private suspendEntityCollection;
}
