import { EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { AcEntity } from '../../models/ac-entity';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { IDescription } from '../../models/description';
import * as i0 from "@angular/core";
export interface OnDrawParams {
    acEntity: AcEntity;
    entityId: string;
    cesiumEntity: any;
}
/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export declare class BasicDesc implements OnInit, OnDestroy, IDescription {
    protected _drawer: BasicDrawerService;
    protected _layerService: LayerService;
    protected _computationCache: ComputationCache;
    protected _cesiumProperties: CesiumProperties;
    props: any;
    onDraw: EventEmitter<OnDrawParams>;
    onRemove: EventEmitter<OnDrawParams>;
    protected _cesiumObjectsMap: Map<string, any>;
    private _propsEvaluateFn;
    private _propsAssignerFn;
    constructor(_drawer: BasicDrawerService, _layerService: LayerService, _computationCache: ComputationCache, _cesiumProperties: CesiumProperties);
    protected _propsEvaluator(context: Object): any;
    protected _getPropsAssigner(): (cesiumObject: Object, desc: Object) => Object;
    getLayerService(): LayerService;
    setLayerService(layerService: LayerService): void;
    ngOnInit(): void;
    getCesiumObjectsMap(): Map<string, any>;
    draw(context: any, id: string, entity: AcEntity): void;
    remove(id: string): void;
    removeAll(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<BasicDesc, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BasicDesc, never, never, { "props": "props"; }, { "onDraw": "onDraw"; "onRemove": "onRemove"; }, never>;
}
