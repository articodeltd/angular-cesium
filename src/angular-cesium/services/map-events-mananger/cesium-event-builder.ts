import { Observable, ConnectableObservable } from 'rxjs';
import { CesiumService } from '../cesium/cesium.service';
import { CesiumEvent } from './consts/cesium-event.enum';
import { CesiumEventModifier } from './consts/cesium-event-modifier.enum';
import { Injectable } from '@angular/core';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumLongPressObserver } from './cesium-long-press-observer';

@Injectable()
export class CesiumEventBuilder {
	private eventsHandler: any;
	private cesiumEventsObservables = new Map<string, ConnectableObservable<any>>();

	public static longPressEvents: Set<CesiumEvent> = new Set([
		CesiumEvent.LONG_LEFT_PRESS,
		CesiumEvent.LONG_RIGHT_PRESS,
		CesiumEvent.LONG_MIDDLE_PRESS
	]);

	constructor(cesiumService: CesiumService) {
		this.eventsHandler = cesiumService.getViewer().screenSpaceEventHandler;
	}

	static getEventFullName(event: CesiumEvent, modifier?: CesiumEventModifier): string {
		if (modifier)
			return `${event}_${modifier}`;
		else
			return event.toString();
	}

	get(event: CesiumEvent, modifier: CesiumEventModifier = undefined): Observable<any> {
		const eventName = CesiumEventBuilder.getEventFullName(event, modifier);
		if (this.cesiumEventsObservables.has(eventName)) {
			return this.cesiumEventsObservables.get(eventName);
		} else {
			const eventObserver = this.createCesiumEventObservable(event, modifier);
			this.cesiumEventsObservables.set(eventName, eventObserver);
			return eventObserver;
		}
	}

	private createCesiumEventObservable(event: CesiumEvent, modifier?: CesiumEventModifier): ConnectableObservable<any> {
		let cesiumEventObservable: ConnectableObservable<any> = undefined;
		if (CesiumEventBuilder.longPressEvents.has(event)) {
			cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
		}
		else {
			cesiumEventObservable = new CesiumPureEventObserver(event, modifier).init(this.eventsHandler).publish();
		}
		cesiumEventObservable.connect();
		return cesiumEventObservable;
	}

	private createSpecialCesiumEventObservable(event: CesiumEvent, modifier: CesiumEventModifier): ConnectableObservable<any> {
		// could support more events if needed
		return new CesiumLongPressObserver(event, modifier, this).init();
	}
}

