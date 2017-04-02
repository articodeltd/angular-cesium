import { Injectable } from '@angular/core';
import { CesiumService } from '../cesium/cesium.service';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { EventResult, MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { EventRegistrationInput } from '../map-events-mananger/event-registration-input';
import { UtilsService } from '../../utils/utils.service';
import { Observable } from 'rxjs';
import { PlonterService } from '../plonter/plonter.service';
import { DisposableObservable } from "../map-events-mananger/disposable-observable";
let findIndex = require('lodash.findindex');

/**
 * Manages all map events. Notice events will run outside of Angular zone
 * __Notice__: When using multi selection, if registering to the same event more then once, the array of picks will reset.
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
@Injectable()
export class MapSelectionService {

    private scene;
    private multiPickEventMap = new Map<CesiumEvent, Array<{}>>();
    private triggerPickJson = {
        'PICK_FIRST': this.triggerPickFirst.bind(this),
        'PICK_ALL': this.triggerPickAll.bind(this),
        'MULTI_PICK': this.triggerMultiPick.bind(this)
    };


    constructor(cesiumService: CesiumService,
                private mapEventsManagerService: MapEventsManagerService,
                private plonterService: PlonterService) {
        this.scene = cesiumService.getScene();
    }

    select(input: EventRegistrationInput) {
        if (input.pick === PickOptions.MULTI_PICK) {
            this.multiPickEventMap.set(input.event, []);
        }

        let selectionObservable = this.mapEventsManagerService.register(input)
            .map((movement) => this.triggerPick(movement, input.pick, input.event))
            .filter((result) => result.primitives !== null)
            .map((picksAndMovement) => this.addEntities(picksAndMovement, input.entityType, input.pick))
            .filter((result) => result.entities !== null)
            .switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, input.pick));

        return <DisposableObservable<EventResult>> selectionObservable;
    }

    private triggerPick(movement: any, pickOption: PickOptions, event) {
        if (PickOptions[pickOption]) {
            return this.triggerPickJson[PickOptions[pickOption]](movement, event);
        }
    }

    private triggerPickAll(movement: any) {
        let picks = this.scene.drillPick(movement.endPosition);
        picks = picks.length === 0 ? null : picks;

        return {movement: movement, primitives: picks};
    }

    private triggerMultiPick(movement: any, event) {
        const newPick = this.scene.pick(movement.endPosition);
        if (newPick) {
            const indexInArray = findIndex(this.multiPickEventMap.get(event), (entity) => {
                return entity.primitive.acEntity.id === newPick.primitive.acEntity.id;
            });
            if (indexInArray === -1) {
                this.multiPickEventMap.get(event).push(newPick);
            }
            else {
                this.multiPickEventMap.get(event).splice(indexInArray, 1);
            }
        }

        return {movement: movement, primitives: this.multiPickEventMap.get(event)};
    }

    private addEntities(picksAndMovement, entityType, pickOption: PickOptions): EventResult {
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.primitives.map((pick) => pick.primitive.acEntity).filter((acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                });
            } else {
                entities = picksAndMovement.primitives.map((pick) => pick.primitive.acEntity);
            }

            entities = UtilsService.unique(entities);
            if (entities.length === 0) {
                entities = null;
            }
        }
        return Object.assign(picksAndMovement, {entities: entities});
    }

    private triggerPickFirst(movement: any) {
        const pick = this.scene.pick(movement.endPosition);
        const picks = pick === undefined ? null : [pick];

        return {movement: movement, primitives: picks};
    }

    private plonter(entitiesAndMovement: EventResult, pickOption: PickOptions): Observable<EventResult> {
        if (pickOption === PickOptions.PICK_FIRST && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        } else {
            return Observable.of(entitiesAndMovement);
        }
    }
}
