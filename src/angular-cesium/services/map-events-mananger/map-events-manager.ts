import {Injectable} from "@angular/core";
import {Observable, Subject} from "rxjs";
import {CesiumService} from "../cesium/cesium.service";
import {CesiumEventBuilder} from "./cesium-event-builder";
import {EventRegistrationInput} from "./event-registration-input";
import {DisposableObservable} from "./disposable-observable";
import {PickOptions} from "./consts/pickOptions.enum";
import {CesiumEvent} from "./consts/cesium-event.enum";
import {CesiumEventModifier} from "./consts/cesium-event-modifier.enum";
import {PlonterService} from "../plonter/plonter.service";

/**
 * Manages all map events
 * usage : MapEventsManagerService.register({event, modifier, priority, entityType, pickOption}).subscribe()
 * priority - the bigger the number the bigger the priority. default : 0.
 * entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 */
@Injectable()
export class MapEventsManagerService {

    private scene;
    private registrationsObservables = new Map<string, any[]>();

    constructor(cesiumService: CesiumService,
                private eventBuilder: CesiumEventBuilder,
                private plonterService : PlonterService) {
        this.scene = cesiumService.getScene();
    }

    register(input: EventRegistrationInput): DisposableObservable<EventResult> {
        if (this.scene === undefined) {
            throw 'CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map';
        }
        if (input.pick === undefined) {
            input.pick = PickOptions.NO_PICK;
        }
        if (input.priority === undefined) {
            input.priority = 0;
        }
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw 'MapEventsManagerService: can\'t register an event with entityType and PickOptions.NO_PICK - It doesn\'t make sense ';
        }

        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);

        // create registrations list
        if (!this.registrationsObservables.has(eventName)) {
            this.registrationsObservables.set(eventName, []);
        }

        const eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority);
        const registrationObservable: any = eventRegistration.observable;
        registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
        this.registrationsObservables.get(eventName).push(eventRegistration);

        this.sortRegistrationsByPriority(eventName);
        return <DisposableObservable<EventResult>> registrationObservable;
    }

    private disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        const registrations = this.registrationsObservables.get(eventName);
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }

    private sortRegistrationsByPriority(eventName: string) {
        const registrations = this.registrationsObservables.get(eventName);
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

    private createEventRegistration(event: CesiumEvent, modifier: CesiumEventModifier, entityType, pickOption: PickOptions, priority: number): Registration {
        // TODO run outside zone
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        const stopper = new Subject();

        let registration = new Registration(undefined, stopper, priority, false);
        let observable: Observable<EventResult>;

        observable = cesiumEventObservable
            .filter(() => !registration.isPaused)
            .map((movement) => this.triggerPick(movement, pickOption))
            .filter((result) => result.primitives !== null)
            .map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption))
            .flatMap((entitiesAndMovement)=> this.plonter(entitiesAndMovement,pickOption))
            .filter((result) => result.entities !== null)
            .takeUntil(stopper);

        registration.observable = observable;
        return registration;
    }

    private triggerPick(movement: any, pickOptions: PickOptions) {
        let picks: any = [];
        switch (pickOptions) {
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition);
                picks = picks.length == 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                // TODO plonter
                const pick = this.scene.pick(movement.endPosition);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
            default:
                break;
        }

        return {movement: movement, primitives: picks};
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
            // best way to do unique on objects
            entities = entities.reduce((accumulator, currentValue) => {
                if (accumulator.indexOf(currentValue) < 0)
                    accumulator.push(currentValue);
                return accumulator;
            }, []);
            if (entities.length === 0) {
                entities = null;
            }
        }
        return Object.assign(picksAndMovement, {entities: entities});
    }

    private plonter(entitiesAndMovement: EventResult, pickOption: PickOptions) : Observable<EventResult> {
        if (pickOption === PickOptions.PICK_FIRST){
            return this.plonterService.plonterIt(entitiesAndMovement);
        }else {
            return Observable.of(entitiesAndMovement);
        }
    }
}
export interface EventResult {
    movement: any,
    primitives: any,
    entities: any
}
class Registration {
    constructor(public observable: Observable<EventResult>,
                public  stopper: Subject<any>,
                public  priority: number,
                public  isPaused: boolean) {
    }
}