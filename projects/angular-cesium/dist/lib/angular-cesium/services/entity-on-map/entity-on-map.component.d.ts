import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { MapLayersService } from '../map-layers/map-layers.service';
import * as i0 from "@angular/core";
/**
 *  Extend this class to create drawing on map components.
 */
export declare class EntityOnMapComponent implements OnInit, OnChanges, OnDestroy {
    protected _drawer: BasicDrawerService;
    private mapLayers;
    props: any;
    protected selfPrimitive: any;
    protected selfPrimitiveIsDraw: boolean;
    protected dataSources: any;
    constructor(_drawer: BasicDrawerService, mapLayers: MapLayersService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    drawOnMap(): any;
    removeFromMap(): void;
    updateOnMap(): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<EntityOnMapComponent, never>;
    static ɵdir: i0.ɵɵDirectiveDeclaration<EntityOnMapComponent, never, never, { "props": "props"; }, {}, never>;
}
