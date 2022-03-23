import { OnInit } from '@angular/core';
import { BasicDesc } from '../basic-desc/basic-desc.service';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { StaticPrimitiveDrawer } from '../drawers/static-dynamic/static-primitive-drawer/static-primitive-drawer.service';
import { AcEntity } from '../../models/ac-entity';
import * as i0 from "@angular/core";
export declare class BasicStaticPrimitiveDesc extends BasicDesc implements OnInit {
    protected _staticPrimitiveDrawer: StaticPrimitiveDrawer;
    geometryProps: any;
    instanceProps: any;
    primitiveProps: any;
    private _geometryPropsEvaluator;
    private _instancePropsEvaluator;
    private _primitivePropsEvaluator;
    constructor(_staticPrimitiveDrawer: StaticPrimitiveDrawer, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    ngOnInit(): void;
    draw(context: any, id: string, entity: AcEntity): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<BasicStaticPrimitiveDesc, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<BasicStaticPrimitiveDesc, never, never, { "geometryProps": "geometryProps"; "instanceProps": "instanceProps"; "primitiveProps": "primitiveProps"; }, {}, never>;
}
