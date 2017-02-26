import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEventBuilder } from './cesium-event-builder';
import { EventRegistrationInput } from './event-registration-input';
import { DisposableObservable } from './disposable-observable';
import { PickOptions } from './consts/pickOptions.enum';
import { CesiumEvent } from './consts/cesium-event.enum';
import { CesiumEventModifier } from './consts/cesium-event-modifier.enum';
import { UtilsService } from '../../../utils/services/utils/utils.service';
import { PlonterService } from '../plonter/plonter.service';

/**
 * Manages all map events. Notice events will run outside of Agular zone
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
	            private eventBuilder: CesiumEventBuilder,
	            private plonterService: PlonterService) {
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

		const eventRegistration = this.createEventRegistration(input.event, input.modifier, input.entityType, input.pick, input.priority);
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

	private createEventRegistration(event: CesiumEvent, modifier: CesiumEventModifier, entityType, pickOption: PickOptions, priority: number): Registration {
		const cesiumEventObservable = this.eventBuilder.get(event, modifier);
		const stopper = new Subject();

		let registration = new Registration(undefined, stopper, priority, false);
		let observable: Observable<EventResult>;

		observable = cesiumEventObservable
			.filter(() => !registration.isPaused)
			.map((movement) => this.triggerPick(movement, pickOption))
			.filter((result) => result.primitives !== null)
			.map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption))
			.filter((result) => result.entities !== null)
			.switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption))
			.takeUntil(stopper);

		registration.observable = observable;
		return registration;
	}

	private triggerPick(movement: any, pickOptions: PickOptions) {
		let picks: any = [];
		switch (pickOptions) {
			case PickOptions.PICK_ONE:
			case PickOptions.PICK_ALL:
				picks = this.scene.drillPick(movement.endPosition);
				picks = picks.length == 0 ? null : picks;
				break;
			case PickOptions.PICK_FIRST:
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

			entities = UtilsService.unique(entities);
			if (entities.length === 0) {
				entities = null;
			}
		}
		return Object.assign(picksAndMovement, {entities: entities});
	}

	private plonter(entitiesAndMovement: EventResult, pickOption: PickOptions): Observable<EventResult> {
		if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities.length > 1) {
			return this.plonterService.plonterIt(entitiesAndMovement);
		} else {
			return Observable.of(entitiesAndMovement);
		}
	}
}
export interface EventResult {
	movement: any,
	primitives: any[],
	entities: any[]
}
class Registration {
	constructor(public observable: Observable<EventResult>,
	            public  stopper: Subject<any>,
	            public  priority: number,
	            public  isPaused: boolean) {
	}
}