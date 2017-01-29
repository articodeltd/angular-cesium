import {Observable, ConnectableObservable} from "rxjs";
import {CesiumService} from "../cesium/cesium.service";
import {CesiumEvent} from "./consts/cesium-event.enum";
import {CesiumEventModifier} from "./consts/cesium-event-modifier.enum";
import {Injectable} from "@angular/core";

class CesiumPureEventObserver {
    public observer: Observable<any>;

    constructor(protected event: CesiumEvent,
                protected modifier: CesiumEventModifier) {
    }

    init(eventsHandler: any): Observable<any> {
        this.observer = Observable.create((observer) => {
                eventsHandler.setInputAction((movement) => {
                    if (movement.position) {
                        movement.startPosition = movement.position;
                        movement.endPosition = movement.position;
                    }
                    observer.next(movement)
                }, this.event, this.modifier);
            }
        );
        return this.observer;
    }
}

class CesiumLongDownObserver extends CesiumPureEventObserver {
    private LONG_PRESS_EVENTS_DURATION = 250; // TODO make it configurable ?

    constructor(protected event: CesiumEvent,
                protected modifier: CesiumEventModifier,
                private eventFactory: CesiumEventBuilder) {
        super(event, modifier)
    };

    init() {
        let startEvent: CesiumEvent;
        let stopEvent: CesiumEvent;

        if (this.event === CesiumEvent.LONG_LEFT_DOWN) {
            startEvent = CesiumEvent.LEFT_DOWN;
            stopEvent = CesiumEvent.LEFT_UP;
        }

        else if (this.event === CesiumEvent.LONG_RIGHT_DOWN) {
            startEvent = CesiumEvent.RIGHT_DOWN;
            stopEvent = CesiumEvent.RIGHT_UP;
        }

        else if (this.event === CesiumEvent.LONG_MIDDLE_DOWN) {
            startEvent = CesiumEvent.MIDDLE_DOWN;
            stopEvent = CesiumEvent.MIDDLE_UP;
        }

        const startEventObservable = this.eventFactory.get(startEvent, this.modifier);
        const stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);

        // publish for preventing side effect
        const longPressObservable = startEventObservable
            .flatMap((e) => Observable.of(e).delay(this.LONG_PRESS_EVENTS_DURATION).takeUntil(stopEventObservable)).publish();

        return longPressObservable;
    }

}

@Injectable()
export class CesiumEventBuilder {
    private eventsHandler: any;
    private cesiumEventsObservables = new Map<string, ConnectableObservable<any>>();

    public static longDownEvents: Set<CesiumEvent> = new Set([
        CesiumEvent.LONG_LEFT_DOWN,
        CesiumEvent.LONG_RIGHT_DOWN,
        CesiumEvent.LONG_MIDDLE_DOWN
    ]);

    constructor(cesiumService: CesiumService) {
        this.eventsHandler = cesiumService.getViewer().screenSpaceEventHandler;
    }

    static getEventFullName(event: CesiumEvent, modifier: CesiumEventModifier = undefined): string {
        if(modifier)
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

    private createCesiumEventObservable(event: CesiumEvent, modifier: CesiumEventModifier = undefined): ConnectableObservable<any> {
        let cesiumEventObservable: ConnectableObservable<any> = undefined;
        if (CesiumEventBuilder.longDownEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = new CesiumPureEventObserver(event, modifier).init(this.eventsHandler).publish();
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    }

    private createSpecialCesiumEventObservable(event: CesiumEvent, modifier: CesiumEventModifier): ConnectableObservable<any> {
        if (CesiumEventBuilder.longDownEvents.has(event)) {
            return new CesiumLongDownObserver(event, modifier, this).init();
        }
    }
}

