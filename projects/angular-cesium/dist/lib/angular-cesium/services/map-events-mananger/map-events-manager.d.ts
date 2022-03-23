import { CesiumService } from '../cesium/cesium.service';
import { CesiumEventBuilder } from './cesium-event-builder';
import { EventRegistrationInput } from './event-registration-input';
import { DisposableObservable } from './disposable-observable';
import { PlonterService } from '../plonter/plonter.service';
import * as i0 from "@angular/core";
/**
 * Returns screen position, drag boolean for drag events only
 */
export interface Movement {
    startPosition: {
        x: number;
        y: number;
    };
    endPosition: {
        x: number;
        y: number;
    };
    drop?: boolean;
}
export interface EventResult {
    movement: Movement;
    cesiumEntities: any[];
    entities: any[];
}
/**
 * Manages all map events. Notice events will run outside of Angular zone.
 * Provided by `<ac-map/>` component there for could be injected at any component under `<ac-map/>` hierarchy
 * or from the `<ac-map/>` component reference `acMapComponent.getMapEventsManager()`
 *
 * __usage:__
 * ```
 * MapEventsManagerService.register({event, modifier, priority, entityType, pickOption}).subscribe()
 * ```
 * __param:__ {CesiumEvent} event
 * __param:__ {CesiumEventModifier} modifier
 * __param:__ priority - the bigger the number the bigger the priority. default : 0.
 * __param:__ entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 * __param:__ pickOption - self explained
 */
export declare class MapEventsManagerService {
    private cesiumService;
    private eventBuilder;
    private plonterService;
    private scene;
    private eventRegistrations;
    constructor(cesiumService: CesiumService, eventBuilder: CesiumEventBuilder, plonterService: PlonterService);
    init(): void;
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    register(input: EventRegistrationInput): DisposableObservable<EventResult>;
    private disposeObservable;
    private sortRegistrationsByPriority;
    private createEventRegistration;
    private createDragEvent;
    private triggerPick;
    private addEntities;
    private plonter;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapEventsManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapEventsManagerService>;
}
