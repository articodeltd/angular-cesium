import { AfterContentInit, ChangeDetectorRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { AcNotification } from '../../models/ac-notification';
import { Subject } from 'rxjs';
import { IDescription } from '../../models/description';
import { LayerService } from '../../services/layer-service/layer-service.service';
import * as i0 from "@angular/core";
/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 *</ac-layer>
 *  ```
 */
export declare class AcArrayDescComponent implements OnChanges, OnInit, AfterContentInit, OnDestroy, IDescription {
    layerService: LayerService;
    private cd;
    acFor: string;
    idGetter: (item: any, index: number) => string;
    show: boolean;
    private layer;
    private basicDescs;
    private arrayDescs;
    private entitiesMap;
    private layerServiceSubscription;
    private id;
    private readonly acForRgx;
    entityName: string;
    arrayPath: string;
    arrayObservable$: Subject<AcNotification>;
    constructor(layerService: LayerService, cd: ChangeDetectorRef);
    ngOnChanges(changes: SimpleChanges): void;
    ngOnInit(): void;
    ngAfterContentInit(): void;
    ngOnDestroy(): void;
    setLayerService(layerService: LayerService): void;
    draw(context: any, id: string, contextEntity: any): void;
    remove(id: string): void;
    removeAll(): void;
    getAcForString(): string;
    private generateCombinedId;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcArrayDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcArrayDescComponent, "ac-array-desc", never, { "acFor": "acFor"; "idGetter": "idGetter"; "show": "show"; }, {}, ["basicDescs", "arrayDescs"], ["*"]>;
}
