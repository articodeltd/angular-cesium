import { merge, of as observableOf, Subject } from 'rxjs';
import { filter, map, mergeMap, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Entity } from 'cesium';
import { CesiumEventBuilder } from './cesium-event-builder';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { UtilsService } from '../../utils/utils.service';
import { CesiumDragDropHelper } from './event-observers/cesium-drag-drop-helper';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
import * as i2 from "./cesium-event-builder";
import * as i3 from "../plonter/plonter.service";
class Registration {
    constructor(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
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
export class MapEventsManagerService {
    constructor(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
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
    register(input) {
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
        const registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return registrationObservable;
    }
    disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        const registrations = this.eventRegistrations.get(eventName);
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }
    sortRegistrationsByPriority(eventName) {
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
    createEventRegistration({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        const stopper = new Subject();
        const registration = new Registration(undefined, stopper, priority, false);
        let observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter(() => !registration.isPaused), map((movement) => this.triggerPick(movement, pickOption, pickConfig)), filter((result) => result.cesiumEntities !== null || entityType === undefined), map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter)), filter((result) => result.entities !== null || (entityType === undefined && !pickFilter)), switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption)), takeUntil(stopper));
        }
        else {
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
    createDragEvent({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
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
        const dropSubject = new Subject();
        const dragObserver = mouseDownRegistration.observable.pipe(mergeMap(e => {
            let lastMove = null;
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
    triggerPick(movement, pickOptions, pickConfig) {
        let picks = [];
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
            picks = picks.map((pick) => pick.id && pick.id instanceof Entity ? pick.id : pick.primitive);
        }
        return { movement: movement, cesiumEntities: picks };
    }
    addEntities(picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity).filter((acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                });
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity);
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
    plonter(entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return observableOf(entitiesAndMovement);
        }
    }
}
MapEventsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService, deps: [{ token: i1.CesiumService }, { token: i2.CesiumEventBuilder }, { token: i3.PlonterService }], target: i0.ɵɵFactoryTarget.Injectable });
MapEventsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }, { type: i2.CesiumEventBuilder }, { type: i3.PlonterService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWV2ZW50cy1tYW5hZ2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsS0FBSyxFQUFjLEVBQUUsSUFBSSxZQUFZLEVBQUUsT0FBTyxFQUFFLE1BQU0sTUFBTSxDQUFDO0FBRXRFLE9BQU8sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLEdBQUcsRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBQ2xGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVoQyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSx3QkFBd0IsQ0FBQztBQUc1RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDeEQsT0FBTyxFQUFFLFdBQVcsRUFBRSxNQUFNLDRCQUE0QixDQUFDO0FBRXpELE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSwyQkFBMkIsQ0FBQztBQUN6RCxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSwyQ0FBMkMsQ0FBQzs7Ozs7QUFFakYsTUFBTSxZQUFZO0lBQ2hCLFlBQW1CLFVBQW1DLEVBQ2xDLE9BQXFCLEVBQ3JCLFFBQWdCLEVBQ2hCLFFBQWlCO1FBSGxCLGVBQVUsR0FBVixVQUFVLENBQXlCO1FBQ2xDLFlBQU8sR0FBUCxPQUFPLENBQWM7UUFDckIsYUFBUSxHQUFSLFFBQVEsQ0FBUTtRQUNoQixhQUFRLEdBQVIsUUFBUSxDQUFTO0lBQ3JDLENBQUM7Q0FDRjtBQWlCRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQUVILE1BQU0sT0FBTyx1QkFBdUI7SUFLbEMs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QUFHLGdCQUFnQixDQUFDLGNBQWMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFTLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQzthQUM5RTtZQUVELFFBQVEsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pDLFFBQVEsR0FBRyxDQUFDLFVBQVUsSUFBSSxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDO1lBQzdFLElBQUksUUFBUSxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7Z0JBQ3pCLFFBQVEsR0FBRyxJQUFJLENBQUM7YUFDakI7U0FDRjtRQUVELGdCQUFnQixDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7UUFFckMsT0FBTyxnQkFBZ0IsQ0FBQztJQUMxQixDQUFDO0lBRU8sT0FBTyxDQUFDLG1CQUFnQyxFQUFFLFVBQXVCO1FBQ3ZFLElBQUksVUFBVSxLQUFLLFdBQVcsQ0FBQyxRQUFRLElBQUksbUJBQW1CLENBQUMsUUFBUSxLQUFLLElBQUksSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtZQUMzSCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsU0FBUyxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDM0Q7YUFBTTtZQUNMLE9BQU8sWUFBWSxDQUFDLG1CQUFtQixDQUFDLENBQUM7U0FDMUM7SUFDSCxDQUFDOztvSEExT1UsdUJBQXVCO3dIQUF2Qix1QkFBdUI7MkZBQXZCLHVCQUF1QjtrQkFEbkMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IG1lcmdlLCBPYnNlcnZhYmxlLCBvZiBhcyBvYnNlcnZhYmxlT2YsIFN1YmplY3QgfSBmcm9tICdyeGpzJztcclxuXHJcbmltcG9ydCB7IGZpbHRlciwgbWFwLCBtZXJnZU1hcCwgc3dpdGNoTWFwLCB0YWtlVW50aWwsIHRhcCB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcclxuaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBFbnRpdHkgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtRXZlbnRCdWlsZGVyIH0gZnJvbSAnLi9jZXNpdW0tZXZlbnQtYnVpbGRlcic7XHJcbmltcG9ydCB7IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQsIFBpY2tDb25maWd1cmF0aW9uIH0gZnJvbSAnLi9ldmVudC1yZWdpc3RyYXRpb24taW5wdXQnO1xyXG5pbXBvcnQgeyBEaXNwb3NhYmxlT2JzZXJ2YWJsZSB9IGZyb20gJy4vZGlzcG9zYWJsZS1vYnNlcnZhYmxlJztcclxuaW1wb3J0IHsgUGlja09wdGlvbnMgfSBmcm9tICcuL2NvbnN0cy9waWNrT3B0aW9ucy5lbnVtJztcclxuaW1wb3J0IHsgQ2VzaXVtRXZlbnQgfSBmcm9tICcuL2NvbnN0cy9jZXNpdW0tZXZlbnQuZW51bSc7XHJcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBVdGlsc1NlcnZpY2UgfSBmcm9tICcuLi8uLi91dGlscy91dGlscy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIgfSBmcm9tICcuL2V2ZW50LW9ic2VydmVycy9jZXNpdW0tZHJhZy1kcm9wLWhlbHBlcic7XHJcblxyXG5jbGFzcyBSZWdpc3RyYXRpb24ge1xyXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PixcclxuICAgICAgICAgICAgICBwdWJsaWMgIHN0b3BwZXI6IFN1YmplY3Q8YW55PixcclxuICAgICAgICAgICAgICBwdWJsaWMgIHByaW9yaXR5OiBudW1iZXIsXHJcbiAgICAgICAgICAgICAgcHVibGljICBpc1BhdXNlZDogYm9vbGVhbikge1xyXG4gIH1cclxufVxyXG5cclxuLyoqXHJcbiAqIFJldHVybnMgc2NyZWVuIHBvc2l0aW9uLCBkcmFnIGJvb2xlYW4gZm9yIGRyYWcgZXZlbnRzIG9ubHlcclxuICovXHJcbmV4cG9ydCBpbnRlcmZhY2UgTW92ZW1lbnQge1xyXG4gIHN0YXJ0UG9zaXRpb246IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfTtcclxuICBlbmRQb3NpdGlvbjogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9O1xyXG4gIGRyb3A/OiBib29sZWFuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEV2ZW50UmVzdWx0IHtcclxuICBtb3ZlbWVudDogTW92ZW1lbnQ7XHJcbiAgY2VzaXVtRW50aXRpZXM6IGFueVtdO1xyXG4gIGVudGl0aWVzOiBhbnlbXTtcclxufVxyXG5cclxuLyoqXHJcbiAqIE1hbmFnZXMgYWxsIG1hcCBldmVudHMuIE5vdGljZSBldmVudHMgd2lsbCBydW4gb3V0c2lkZSBvZiBBbmd1bGFyIHpvbmUuXHJcbiAqIFByb3ZpZGVkIGJ5IGA8YWMtbWFwLz5gIGNvbXBvbmVudCB0aGVyZSBmb3IgY291bGQgYmUgaW5qZWN0ZWQgYXQgYW55IGNvbXBvbmVudCB1bmRlciBgPGFjLW1hcC8+YCBoaWVyYXJjaHlcclxuICogb3IgZnJvbSB0aGUgYDxhYy1tYXAvPmAgY29tcG9uZW50IHJlZmVyZW5jZSBgYWNNYXBDb21wb25lbnQuZ2V0TWFwRXZlbnRzTWFuYWdlcigpYFxyXG4gKlxyXG4gKiBfX3VzYWdlOl9fXHJcbiAqIGBgYFxyXG4gKiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZS5yZWdpc3Rlcih7ZXZlbnQsIG1vZGlmaWVyLCBwcmlvcml0eSwgZW50aXR5VHlwZSwgcGlja09wdGlvbn0pLnN1YnNjcmliZSgpXHJcbiAqIGBgYFxyXG4gKiBfX3BhcmFtOl9fIHtDZXNpdW1FdmVudH0gZXZlbnRcclxuICogX19wYXJhbTpfXyB7Q2VzaXVtRXZlbnRNb2RpZmllcn0gbW9kaWZpZXJcclxuICogX19wYXJhbTpfXyBwcmlvcml0eSAtIHRoZSBiaWdnZXIgdGhlIG51bWJlciB0aGUgYmlnZ2VyIHRoZSBwcmlvcml0eS4gZGVmYXVsdCA6IDAuXHJcbiAqIF9fcGFyYW06X18gZW50aXR5VHlwZSAtIGVudGl0eSB0eXBlIGNsYXNzIHRoYXQgeW91IGFyZSBpbnRlcmVzdGVkIGxpa2UgKFRyYWNrKS4gdGhlIGNsYXNzIG11c3QgZXh0ZW5kcyBBY0VudGl0eVxyXG4gKiBfX3BhcmFtOl9fIHBpY2tPcHRpb24gLSBzZWxmIGV4cGxhaW5lZFxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2Uge1xyXG5cclxuICBwcml2YXRlIHNjZW5lOiBhbnk7XHJcbiAgcHJpdmF0ZSBldmVudFJlZ2lzdHJhdGlvbnMgPSBuZXcgTWFwPHN0cmluZywgUmVnaXN0cmF0aW9uW10+KCk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIGV2ZW50QnVpbGRlcjogQ2VzaXVtRXZlbnRCdWlsZGVyLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgcGxvbnRlclNlcnZpY2U6IFBsb250ZXJTZXJ2aWNlKSB7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy5ldmVudEJ1aWxkZXIuaW5pdCgpO1xyXG4gICAgdGhpcy5zY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmVnaXN0ZXIgdG8gbWFwIGV2ZW50XHJcbiAgICogQHBhcmFtIGlucHV0IEV2ZW50IFJlZ2lzdHJhdGlvbiBJbnB1dFxyXG4gICAqXHJcbiAgICogQHJldHVybnMgRGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+XHJcbiAgICovXHJcbiAgcmVnaXN0ZXIoaW5wdXQ6IEV2ZW50UmVnaXN0cmF0aW9uSW5wdXQpOiBEaXNwb3NhYmxlT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xyXG4gICAgaWYgKHRoaXMuc2NlbmUgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0Nlc2l1bVNlcnZpY2UgaGFzIG5vdCBiZWVuIGluaXRpYWxpemVkIHlldCAtIE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlIG11c3QgYmUgaW5qZWN0ZWQgIHVuZGVyIGFjLW1hcCcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlucHV0LnBpY2sgPSBpbnB1dC5waWNrIHx8IFBpY2tPcHRpb25zLk5PX1BJQ0s7XHJcbiAgICBpbnB1dC5wcmlvcml0eSA9IGlucHV0LnByaW9yaXR5IHx8IDA7XHJcbiAgICBpbnB1dC5waWNrQ29uZmlnID0gaW5wdXQucGlja0NvbmZpZyB8fCB7fTtcclxuXHJcbiAgICBpZiAoaW5wdXQuZW50aXR5VHlwZSAmJiBpbnB1dC5waWNrID09PSBQaWNrT3B0aW9ucy5OT19QSUNLKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignTWFwRXZlbnRzTWFuYWdlclNlcnZpY2U6IGNhblxcJ3QgcmVnaXN0ZXIgYW4gZXZlbnQgJyArXHJcbiAgICAgICAgJ3dpdGggZW50aXR5VHlwZSBhbmQgUGlja09wdGlvbnMuTk9fUElDSyAtIEl0IGRvZXNuXFwndCBtYWtlIHNlbnNlICcpO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IGV2ZW50TmFtZSA9IENlc2l1bUV2ZW50QnVpbGRlci5nZXRFdmVudEZ1bGxOYW1lKGlucHV0LmV2ZW50LCBpbnB1dC5tb2RpZmllcik7XHJcblxyXG4gICAgaWYgKCF0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5oYXMoZXZlbnROYW1lKSkge1xyXG4gICAgICB0aGlzLmV2ZW50UmVnaXN0cmF0aW9ucy5zZXQoZXZlbnROYW1lLCBbXSk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgZXZlbnRSZWdpc3RyYXRpb24gPSB0aGlzLmNyZWF0ZUV2ZW50UmVnaXN0cmF0aW9uKGlucHV0KTtcclxuICAgIGNvbnN0IHJlZ2lzdHJhdGlvbk9ic2VydmFibGU6IGFueSA9IGV2ZW50UmVnaXN0cmF0aW9uLm9ic2VydmFibGU7XHJcbiAgICByZWdpc3RyYXRpb25PYnNlcnZhYmxlLmRpc3Bvc2UgPSAoKSA9PiB0aGlzLmRpc3Bvc2VPYnNlcnZhYmxlKGV2ZW50UmVnaXN0cmF0aW9uLCBldmVudE5hbWUpO1xyXG4gICAgdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSkucHVzaChldmVudFJlZ2lzdHJhdGlvbik7XHJcblxyXG4gICAgdGhpcy5zb3J0UmVnaXN0cmF0aW9uc0J5UHJpb3JpdHkoZXZlbnROYW1lKTtcclxuICAgIHJldHVybiA8RGlzcG9zYWJsZU9ic2VydmFibGU8RXZlbnRSZXN1bHQ+PnJlZ2lzdHJhdGlvbk9ic2VydmFibGU7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGRpc3Bvc2VPYnNlcnZhYmxlKGV2ZW50UmVnaXN0cmF0aW9uOiBSZWdpc3RyYXRpb24sIGV2ZW50TmFtZTogc3RyaW5nKSB7XHJcbiAgICBldmVudFJlZ2lzdHJhdGlvbi5zdG9wcGVyLm5leHQoMSk7XHJcbiAgICBjb25zdCByZWdpc3RyYXRpb25zID0gdGhpcy5ldmVudFJlZ2lzdHJhdGlvbnMuZ2V0KGV2ZW50TmFtZSk7XHJcbiAgICBjb25zdCBpbmRleCA9IHJlZ2lzdHJhdGlvbnMuaW5kZXhPZihldmVudFJlZ2lzdHJhdGlvbik7XHJcbiAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgIHJlZ2lzdHJhdGlvbnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgIH1cclxuICAgIHRoaXMuc29ydFJlZ2lzdHJhdGlvbnNCeVByaW9yaXR5KGV2ZW50TmFtZSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHNvcnRSZWdpc3RyYXRpb25zQnlQcmlvcml0eShldmVudE5hbWU6IHN0cmluZykge1xyXG4gICAgY29uc3QgcmVnaXN0cmF0aW9ucyA9IHRoaXMuZXZlbnRSZWdpc3RyYXRpb25zLmdldChldmVudE5hbWUpO1xyXG4gICAgcmVnaXN0cmF0aW9ucy5zb3J0KChhLCBiKSA9PiBiLnByaW9yaXR5IC0gYS5wcmlvcml0eSk7XHJcbiAgICBpZiAocmVnaXN0cmF0aW9ucy5sZW5ndGggPT09IDApIHtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIEFjdGl2ZSByZWdpc3RyYXRpb25zIGJ5IHByaW9yaXR5XHJcbiAgICBjb25zdCBjdXJyZW50UHJpb3JpdHkgPSByZWdpc3RyYXRpb25zWzBdLnByaW9yaXR5O1xyXG4gICAgcmVnaXN0cmF0aW9ucy5mb3JFYWNoKChyZWdpc3RyYXRpb24pID0+IHtcclxuICAgICAgcmVnaXN0cmF0aW9uLmlzUGF1c2VkID0gcmVnaXN0cmF0aW9uLnByaW9yaXR5IDwgY3VycmVudFByaW9yaXR5O1xyXG4gICAgfSk7XHJcblxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBjcmVhdGVFdmVudFJlZ2lzdHJhdGlvbih7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtb2RpZmllcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZW50aXR5VHlwZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcGljazogcGlja09wdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgcHJpb3JpdHksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tGaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tDb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9OiBFdmVudFJlZ2lzdHJhdGlvbklucHV0KTogUmVnaXN0cmF0aW9uIHtcclxuICAgIGNvbnN0IGNlc2l1bUV2ZW50T2JzZXJ2YWJsZSA9IHRoaXMuZXZlbnRCdWlsZGVyLmdldChldmVudCwgbW9kaWZpZXIpO1xyXG4gICAgY29uc3Qgc3RvcHBlciA9IG5ldyBTdWJqZWN0PGFueT4oKTtcclxuXHJcbiAgICBjb25zdCByZWdpc3RyYXRpb24gPSBuZXcgUmVnaXN0cmF0aW9uKHVuZGVmaW5lZCwgc3RvcHBlciwgcHJpb3JpdHksIGZhbHNlKTtcclxuICAgIGxldCBvYnNlcnZhYmxlOiBPYnNlcnZhYmxlPEV2ZW50UmVzdWx0PjtcclxuXHJcbiAgICBpZiAoIUNlc2l1bURyYWdEcm9wSGVscGVyLmRyYWdFdmVudHMuaGFzKGV2ZW50KSkge1xyXG4gICAgICBvYnNlcnZhYmxlID0gY2VzaXVtRXZlbnRPYnNlcnZhYmxlLnBpcGUoXHJcbiAgICAgICAgZmlsdGVyKCgpID0+ICFyZWdpc3RyYXRpb24uaXNQYXVzZWQpLFxyXG4gICAgICAgIG1hcCgobW92ZW1lbnQpID0+IHRoaXMudHJpZ2dlclBpY2sobW92ZW1lbnQsIHBpY2tPcHRpb24sIHBpY2tDb25maWcpKSxcclxuICAgICAgICBmaWx0ZXIoKHJlc3VsdCkgPT4gcmVzdWx0LmNlc2l1bUVudGl0aWVzICE9PSBudWxsIHx8IGVudGl0eVR5cGUgPT09IHVuZGVmaW5lZCksXHJcbiAgICAgICAgbWFwKChwaWNrc0FuZE1vdmVtZW50KSA9PiB0aGlzLmFkZEVudGl0aWVzKHBpY2tzQW5kTW92ZW1lbnQsIGVudGl0eVR5cGUsIHBpY2tPcHRpb24sIHBpY2tGaWx0ZXIpKSxcclxuICAgICAgICBmaWx0ZXIoKHJlc3VsdCkgPT4gcmVzdWx0LmVudGl0aWVzICE9PSBudWxsIHx8IChlbnRpdHlUeXBlID09PSB1bmRlZmluZWQgJiYgIXBpY2tGaWx0ZXIpKSxcclxuICAgICAgICBzd2l0Y2hNYXAoKGVudGl0aWVzQW5kTW92ZW1lbnQpID0+IHRoaXMucGxvbnRlcihlbnRpdGllc0FuZE1vdmVtZW50LCBwaWNrT3B0aW9uKSksXHJcbiAgICAgICAgdGFrZVVudGlsKHN0b3BwZXIpKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG9ic2VydmFibGUgPSB0aGlzLmNyZWF0ZURyYWdFdmVudCh7XHJcbiAgICAgICAgZXZlbnQsXHJcbiAgICAgICAgbW9kaWZpZXIsXHJcbiAgICAgICAgZW50aXR5VHlwZSxcclxuICAgICAgICBwaWNrOiBwaWNrT3B0aW9uLFxyXG4gICAgICAgIHByaW9yaXR5LFxyXG4gICAgICAgIHBpY2tGaWx0ZXIsXHJcbiAgICAgICAgcGlja0NvbmZpZ1xyXG4gICAgICB9KS5waXBlKHRha2VVbnRpbChzdG9wcGVyKSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVnaXN0cmF0aW9uLm9ic2VydmFibGUgPSBvYnNlcnZhYmxlO1xyXG4gICAgcmV0dXJuIHJlZ2lzdHJhdGlvbjtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgY3JlYXRlRHJhZ0V2ZW50KHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGV2ZW50LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbW9kaWZpZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlbnRpdHlUeXBlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGljazogcGlja09wdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByaW9yaXR5LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGlja0ZpbHRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpY2tDb25maWcsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgfTogRXZlbnRSZWdpc3RyYXRpb25JbnB1dCk6IE9ic2VydmFibGU8RXZlbnRSZXN1bHQ+IHtcclxuICAgIGNvbnN0IHsgbW91c2VEb3duRXZlbnQsIG1vdXNlVXBFdmVudCB9ID0gQ2VzaXVtRHJhZ0Ryb3BIZWxwZXIuZ2V0RHJhZ0V2ZW50VHlwZXMoZXZlbnQpO1xyXG5cclxuICAgIGNvbnN0IG1vdXNlVXBPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KG1vdXNlVXBFdmVudCk7XHJcbiAgICBjb25zdCBtb3VzZU1vdmVPYnNlcnZhYmxlID0gdGhpcy5ldmVudEJ1aWxkZXIuZ2V0KENlc2l1bUV2ZW50Lk1PVVNFX01PVkUpO1xyXG5cclxuICAgIGNvbnN0IG1vdXNlRG93blJlZ2lzdHJhdGlvbiA9IHRoaXMuY3JlYXRlRXZlbnRSZWdpc3RyYXRpb24oe1xyXG4gICAgICBldmVudDogbW91c2VEb3duRXZlbnQsXHJcbiAgICAgIG1vZGlmaWVyLFxyXG4gICAgICBlbnRpdHlUeXBlLFxyXG4gICAgICBwaWNrOiBwaWNrT3B0aW9uLFxyXG4gICAgICBwcmlvcml0eSxcclxuICAgICAgcGlja0ZpbHRlcixcclxuICAgICAgcGlja0NvbmZpZyxcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGRyb3BTdWJqZWN0ID0gbmV3IFN1YmplY3Q8RXZlbnRSZXN1bHQ+KCk7XHJcbiAgICBjb25zdCBkcmFnT2JzZXJ2ZXIgPSBtb3VzZURvd25SZWdpc3RyYXRpb24ub2JzZXJ2YWJsZS5waXBlKG1lcmdlTWFwKGUgPT4ge1xyXG4gICAgICBsZXQgbGFzdE1vdmU6IGFueSA9IG51bGw7XHJcbiAgICAgIGNvbnN0IGRyYWdTdGFydFBvc2l0aW9uWCA9IGUubW92ZW1lbnQuc3RhcnRQb3NpdGlvbi54O1xyXG4gICAgICBjb25zdCBkcmFnU3RhcnRQb3NpdGlvblkgPSBlLm1vdmVtZW50LnN0YXJ0UG9zaXRpb24ueTtcclxuICAgICAgcmV0dXJuIG1vdXNlTW92ZU9ic2VydmFibGUucGlwZShtYXAoKG1vdmVtZW50KSA9PiB7XHJcbiAgICAgICAgbGFzdE1vdmUgPSB7XHJcbiAgICAgICAgICBtb3ZlbWVudDoge1xyXG4gICAgICAgICAgICBkcm9wOiBmYWxzZSxcclxuICAgICAgICAgICAgc3RhcnRQb3NpdGlvbjoge1xyXG4gICAgICAgICAgICAgIHg6IGRyYWdTdGFydFBvc2l0aW9uWCxcclxuICAgICAgICAgICAgICB5OiBkcmFnU3RhcnRQb3NpdGlvblksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIGVuZFBvc2l0aW9uOiBtb3ZlbWVudC5lbmRQb3NpdGlvbixcclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBlbnRpdGllczogZS5lbnRpdGllcyxcclxuICAgICAgICAgIGNlc2l1bUVudGl0aWVzOiBlLmNlc2l1bUVudGl0aWVzXHJcbiAgICAgICAgfTtcclxuICAgICAgICByZXR1cm4gbGFzdE1vdmU7XHJcbiAgICAgIH0pLCB0YWtlVW50aWwobW91c2VVcE9ic2VydmFibGUpLCB0YXAoe1xyXG4gICAgICAgIGNvbXBsZXRlOiAoKSA9PiB7XHJcbiAgICAgICAgICAvLyBPbiBjb21wbGV0ZVxyXG4gICAgICAgICAgaWYgKGxhc3RNb3ZlKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGRyb3BFdmVudCA9IE9iamVjdC5hc3NpZ24oe30sIGxhc3RNb3ZlKTtcclxuICAgICAgICAgICAgZHJvcEV2ZW50Lm1vdmVtZW50LmRyb3AgPSB0cnVlO1xyXG4gICAgICAgICAgICBkcm9wU3ViamVjdC5uZXh0KGRyb3BFdmVudCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICB9KSk7XHJcbiAgICB9KSk7XHJcblxyXG4gICAgcmV0dXJuIG1lcmdlKGRyYWdPYnNlcnZlciwgZHJvcFN1YmplY3QpO1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgdHJpZ2dlclBpY2sobW92ZW1lbnQ6IGFueSwgcGlja09wdGlvbnM6IFBpY2tPcHRpb25zLCBwaWNrQ29uZmlnOiBQaWNrQ29uZmlndXJhdGlvbikge1xyXG4gICAgbGV0IHBpY2tzOiBhbnkgPSBbXTtcclxuICAgIHN3aXRjaCAocGlja09wdGlvbnMpIHtcclxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX09ORTpcclxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0FMTDpcclxuICAgICAgICBwaWNrcyA9IHRoaXMuc2NlbmUuZHJpbGxQaWNrKG1vdmVtZW50LmVuZFBvc2l0aW9uLCBwaWNrQ29uZmlnLmRyaWxsUGlja0xpbWl0LCBwaWNrQ29uZmlnLnBpY2tXaWR0aCwgcGlja0NvbmZpZy5waWNrSGVpZ2h0KTtcclxuICAgICAgICBwaWNrcyA9IHBpY2tzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiBwaWNrcztcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5QSUNLX0ZJUlNUOlxyXG4gICAgICAgIGNvbnN0IHBpY2sgPSB0aGlzLnNjZW5lLnBpY2sobW92ZW1lbnQuZW5kUG9zaXRpb24sIHBpY2tDb25maWcucGlja1dpZHRoLCBwaWNrQ29uZmlnLnBpY2tIZWlnaHQpO1xyXG4gICAgICAgIHBpY2tzID0gcGljayA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IFtwaWNrXTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBQaWNrT3B0aW9ucy5OT19QSUNLOlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBkZWZhdWx0OlxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIFBpY2tzIGNhbiBiZSBjZXNpdW0gZW50aXR5IG9yIGNlc2l1bSBwcmltaXRpdmVcclxuICAgIGlmIChwaWNrcykge1xyXG4gICAgICBwaWNrcyA9IHBpY2tzLm1hcCgocGljazogYW55KSA9PiBwaWNrLmlkICYmIHBpY2suaWQgaW5zdGFuY2VvZiBFbnRpdHkgPyBwaWNrLmlkIDogcGljay5wcmltaXRpdmUpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7IG1vdmVtZW50OiBtb3ZlbWVudCwgY2VzaXVtRW50aXRpZXM6IHBpY2tzIH07XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGFkZEVudGl0aWVzKHBpY2tzQW5kTW92ZW1lbnQ6IGFueSwgZW50aXR5VHlwZTogYW55LCBwaWNrT3B0aW9uOiBQaWNrT3B0aW9ucywgcGlja0ZpbHRlcj86IChhbnkpID0+IGJvb2xlYW4pOiBFdmVudFJlc3VsdCB7XHJcblxyXG4gICAgaWYgKHBpY2tzQW5kTW92ZW1lbnQuY2VzaXVtRW50aXRpZXMgPT09IG51bGwpIHtcclxuICAgICAgcGlja3NBbmRNb3ZlbWVudC5lbnRpdGllcyA9IG51bGw7XHJcbiAgICAgIHJldHVybiBwaWNrc0FuZE1vdmVtZW50O1xyXG4gICAgfVxyXG4gICAgbGV0IGVudGl0aWVzID0gW107XHJcbiAgICBpZiAocGlja09wdGlvbiAhPT0gUGlja09wdGlvbnMuTk9fUElDSykge1xyXG4gICAgICBpZiAoZW50aXR5VHlwZSkge1xyXG4gICAgICAgIGVudGl0aWVzID0gcGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5hY0VudGl0eSkuZmlsdGVyKChhY0VudGl0eTogYW55KSA9PiB7XHJcbiAgICAgICAgICByZXR1cm4gYWNFbnRpdHkgJiYgYWNFbnRpdHkgaW5zdGFuY2VvZiBlbnRpdHlUeXBlO1xyXG4gICAgICAgIH0pO1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIGVudGl0aWVzID0gcGlja3NBbmRNb3ZlbWVudC5jZXNpdW1FbnRpdGllcy5tYXAoKHBpY2s6IGFueSkgPT4gcGljay5hY0VudGl0eSk7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVudGl0aWVzID0gVXRpbHNTZXJ2aWNlLnVuaXF1ZShlbnRpdGllcyk7XHJcbiAgICAgIGVudGl0aWVzID0gKHBpY2tGaWx0ZXIgJiYgZW50aXRpZXMpID8gZW50aXRpZXMuZmlsdGVyKHBpY2tGaWx0ZXIpIDogZW50aXRpZXM7XHJcbiAgICAgIGlmIChlbnRpdGllcy5sZW5ndGggPT09IDApIHtcclxuICAgICAgICBlbnRpdGllcyA9IG51bGw7XHJcbiAgICAgIH1cclxuICAgIH1cclxuXHJcbiAgICBwaWNrc0FuZE1vdmVtZW50LmVudGl0aWVzID0gZW50aXRpZXM7XHJcblxyXG4gICAgcmV0dXJuIHBpY2tzQW5kTW92ZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHBsb250ZXIoZW50aXRpZXNBbmRNb3ZlbWVudDogRXZlbnRSZXN1bHQsIHBpY2tPcHRpb246IFBpY2tPcHRpb25zKTogT2JzZXJ2YWJsZTxFdmVudFJlc3VsdD4ge1xyXG4gICAgaWYgKHBpY2tPcHRpb24gPT09IFBpY2tPcHRpb25zLlBJQ0tfT05FICYmIGVudGl0aWVzQW5kTW92ZW1lbnQuZW50aXRpZXMgIT09IG51bGwgJiYgZW50aXRpZXNBbmRNb3ZlbWVudC5lbnRpdGllcy5sZW5ndGggPiAxKSB7XHJcbiAgICAgIHJldHVybiB0aGlzLnBsb250ZXJTZXJ2aWNlLnBsb250ZXJJdChlbnRpdGllc0FuZE1vdmVtZW50KTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIHJldHVybiBvYnNlcnZhYmxlT2YoZW50aXRpZXNBbmRNb3ZlbWVudCk7XHJcbiAgICB9XHJcbiAgfVxyXG59XHJcbiJdfQ==