import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { AcEntity } from '../../models/ac-entity';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../map-events-mananger/consts/cesium-event-modifier.enum';
import { MapsManagerService } from '../maps-manager/maps-manager.service';
import * as i0 from "@angular/core";
export interface SelectionOptions {
    event?: CesiumEvent;
    modifier?: CesiumEventModifier;
    entityType?: any;
}
/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
export declare class SelectionManagerService {
    private mapsManager;
    selectedEntitiesItems$: BehaviorSubject<AcEntity[]>;
    selectedEntitySubject$: Subject<AcEntity>;
    private mapEventsManagerService;
    constructor(mapsManager: MapsManagerService);
    selectedEntities$(): Observable<AcEntity[]>;
    selectedEntities(): AcEntity[];
    selectedEntity$(): Subject<AcEntity>;
    toggleSelection(entity: AcEntity, addSelectedIndicator: boolean): void;
    private addToSelected;
    private removeSelected;
    initSelection(selectionOptions?: SelectionOptions, addSelectedIndicator?: boolean, eventPriority?: number, mapId?: string): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<SelectionManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<SelectionManagerService>;
}
