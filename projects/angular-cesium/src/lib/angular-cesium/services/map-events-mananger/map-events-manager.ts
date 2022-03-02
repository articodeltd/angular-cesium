import { merge, Observable, of as observableOf, Subject } from 'rxjs';

import { filter, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Entity } from 'cesium';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEventBuilder } from './cesium-event-builder';
import { EventRegistrationInput, PickConfiguration } from './event-registration-input';
import { DisposableObservable } from './disposable-observable';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { PlonterService } from '../plonter/plonter.service';
import { UtilsService } from '../../utils/utils.service';
import { CesiumDragDropHelper } from './event-observers/cesium-drag-drop-helper';

class Registration {
  constructor(public observable: Observable<EventResult>,
              public  stopper: Subject<any>,
              public  priority: number,
              public  isPaused: boolean) {
  }
}

/**
 * Returns screen position, drag boolean for drag events only
 */
export interface Movement {
  startPosition: { x: number, y: number };
  endPosition: { x: number, y: number };
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
@Injectable()
export class MapEventsManagerService {

  private scene: any;
  private eventRegistrations = new Map<string, Registration[]>();

  constructor(private cesiumService: CesiumService,
              private eventBuilder: CesiumEventBuilder,
              private plonterService: PlonterService) {
  }

  init() {
    this.eventBuilder.init();
    this.scene = this.cesiumService.getScene();
  }

  /**
   * Register to map event
   * @param input Event Registration Input
   *
   * @returns DisposableObservable<EventResult>
   */
  register(input: EventRegistrationInput): DisposableObservable<EventResult> {
    if (this.scene === undefined) {
      throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
    }

    input.pick = input.pick || PickOptions.NO_PICK;
    input.priority = input.priority || 0;
    input.pickConfig = input.pickConfig || {};

    if (input.entityType && input.pick === PickOptions.NO_PICK) {
      throw new Error('MapEventsManagerService: can\'t register an event ' +
        'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
    }

    const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);

    if (!this.eventRegistrations.has(eventName)) {
      this.eventRegistrations.set(eventName, []);
    }

    const eventRegistration = this.createEventRegistration(input);
    const registrationObservable: any = eventRegistration.observable;
    registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
    this.eventRegistrations.get(eventName).push(eventRegistration);

    this.sortRegistrationsByPriority(eventName);
    return <DisposableObservable<EventResult>>registrationObservable;
  }

  private disposeObservable(eventRegistration: Registration, eventName: string) {
    eventRegistration.stopper.next(1);
    const registrations = this.eventRegistrations.get(eventName);
    const index = registrations.indexOf(eventRegistration);
    if (index !== -1) {
      registrations.splice(index, 1);
    }
    this.sortRegistrationsByPriority(eventName);
  }

  private sortRegistrationsByPriority(eventName: string) {
    const registrations = this.eventRegistrations.get(eventName);
    registrations.sort((a, b) => b.priority - a.priority);
    if (registrations.length === 0) {
      return;
    }

    // Active registrations by priority
    const currentPriority = registrations[0].priority;
    registrations.forEach((registration) => {
      registration.isPaused = registration.priority < currentPriority;
    });

  }

  private createEventRegistration({
                                    event,
                                    modifier,
                                    entityType,
                                    pick: pickOption,
                                    priority,
                                    pickFilter,
                                    pickConfig,
                                  }: EventRegistrationInput): Registration {
    const cesiumEventObservable = this.eventBuilder.get(event, modifier);
    const stopper = new Subject<any>();

    const registration = new Registration(undefined, stopper, priority, false);
    let observable: Observable<EventResult>;

    if (!CesiumDragDropHelper.dragEvents.has(event)) {
      observable = cesiumEventObservable.pipe(
        filter(() => !registration.isPaused),
        map((movement) => this.triggerPick(movement, pickOption, pickConfig)),
        filter((result) => result.cesiumEntities !== null || entityType === undefined),
        map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter)),
        filter((result) => result.entities !== null || (entityType === undefined && !pickFilter)),
        switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption)),
        takeUntil(stopper));
    } else {
      observable = this.createDragEvent({
        event,
        modifier,
        entityType,
        pick: pickOption,
        priority,
        pickFilter,
        pickConfig
      }).pipe(takeUntil(stopper));
    }

    registration.observable = observable;
    return registration;
  }

  private createDragEvent({
                            event,
                            modifier,
                            entityType,
                            pick: pickOption,
                            priority,
                            pickFilter,
                            pickConfig,
                          }: EventRegistrationInput): Observable<EventResult> {
    const { mouseDownEvent, mouseUpEvent } = CesiumDragDropHelper.getDragEventTypes(event);

    const mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
    const mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);

    const mouseDownRegistration = this.createEventRegistration({
      event: mouseDownEvent,
      modifier,
      entityType,
      pick: pickOption,
      priority,
      pickFilter,
      pickConfig,
    });

    const dropSubject = new Subject<EventResult>();
    const dragObserver = mouseDownRegistration.observable.pipe(mergeMap(e => {
      let lastMove: any = null;
      const dragStartPositionX = e.movement.startPosition.x;
      const dragStartPositionY = e.movement.startPosition.y;
      return mouseMoveObservable.pipe(map((movement) => {
        lastMove = {
          movement: {
            drop: false,
            startPosition: {
              x: dragStartPositionX,
              y: dragStartPositionY,
            },
            endPosition: movement.endPosition,
          },
          entities: e.entities,
          cesiumEntities: e.cesiumEntities
        };
        return lastMove;
      }), takeUntil(mouseUpObservable), tap({
        complete: () => {
          // On complete
          if (lastMove) {
            const dropEvent = Object.assign({}, lastMove);
            dropEvent.movement.drop = true;
            dropSubject.next(dropEvent);
          }
        }
      }));
    }));

    return merge(dragObserver, dropSubject);

  }

  private triggerPick(movement: any, pickOptions: PickOptions, pickConfig: PickConfiguration) {
    let picks: any = [];
    switch (pickOptions) {
      case PickOptions.PICK_ONE:
      case PickOptions.PICK_ALL:
        picks = this.scene.drillPick(movement.endPosition, pickConfig.drillPickLimit, pickConfig.pickWidth, pickConfig.pickHeight);
        picks = picks.length === 0 ? null : picks;
        break;
      case PickOptions.PICK_FIRST:
        const pick = this.scene.pick(movement.endPosition, pickConfig.pickWidth, pickConfig.pickHeight);
        picks = pick === undefined ? null : [pick];
        break;
      case PickOptions.NO_PICK:
        break;
      default:
        break;
    }

    // Picks can be cesium entity or cesium primitive
    if (picks) {
      picks = picks.map((pick: any) => pick.id && pick.id instanceof Entity ? pick.id : pick.primitive);
    }

    return { movement: movement, cesiumEntities: picks };
  }

  private addEntities(picksAndMovement: any, entityType: any, pickOption: PickOptions, pickFilter?: (any) => boolean): EventResult {

    if (picksAndMovement.cesiumEntities === null) {
      picksAndMovement.entities = null;
      return picksAndMovement;
    }
    let entities = [];
    if (pickOption !== PickOptions.NO_PICK) {
      if (entityType) {
        entities = picksAndMovement.cesiumEntities.map((pick: any) => pick.acEntity).filter((acEntity: any) => {
          return acEntity && acEntity instanceof entityType;
        });
      } else {
        entities = picksAndMovement.cesiumEntities.map((pick: any) => pick.acEntity);
      }

      entities = UtilsService.unique(entities);
      entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
      if (entities.length === 0) {
        entities = null;
      }
    }

    picksAndMovement.entities = entities;

    return picksAndMovement;
  }

  private plonter(entitiesAndMovement: EventResult, pickOption: PickOptions): Observable<EventResult> {
    if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
      return this.plonterService.plonterIt(entitiesAndMovement);
    } else {
      return observableOf(entitiesAndMovement);
    }
  }
}
