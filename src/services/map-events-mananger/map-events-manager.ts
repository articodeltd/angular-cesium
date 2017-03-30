import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEventBuilder } from './cesium-event-builder';
import { EventRegistrationInput } from './event-registration-input';
import { DisposableObservable } from './disposable-observable';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { CesiumEventModifier } from './consts/cesium-event-modifier.enum';

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
export class MapEventsManagerService {

    private scene;
    private eventRegistrations = new Map<string, Registration[]>();

    constructor(cesiumService: CesiumService,
                private eventBuilder: CesiumEventBuilder) {
        this.scene = cesiumService.getScene();
    }

    register(input: EventRegistrationInput): DisposableObservable<EventResult> {
        if (this.scene === undefined) {
            throw 'CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map';
        }

        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;

        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw 'MapEventsManagerService: can\'t register an event with entityType and PickOptions.NO_PICK - It doesn\'t make sense ';
        }

        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);

        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }

        const eventRegistration = this.createEventRegistration(input.event, input.modifier, input.priority);
        const registrationObservable: any = eventRegistration.observable;
        registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
        this.eventRegistrations.get(eventName).push(eventRegistration);

        this.sortRegistrationsByPriority(eventName);
        return <DisposableObservable<EventResult>> registrationObservable;
    }

    private disposeObservable(eventRegistration, eventName) {
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

    private createEventRegistration(event: CesiumEvent, modifier: CesiumEventModifier, priority: number): Registration {
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        const stopper = new Subject();

        let registration = new Registration(undefined, stopper, priority, false);
        let observable: Observable<EventResult>;

        observable = cesiumEventObservable
            .filter(() => !registration.isPaused)
            .takeUntil(stopper);

        registration.observable = observable;
        return registration;
    }
}

export interface EventResult {
    movement: any;
    primitives: any[];
    entities: any[];
}

class Registration {
    constructor(public observable: Observable<EventResult>,
                public  stopper: Subject<any>,
                public  priority: number,
                public  isPaused: boolean) {
    }
}
