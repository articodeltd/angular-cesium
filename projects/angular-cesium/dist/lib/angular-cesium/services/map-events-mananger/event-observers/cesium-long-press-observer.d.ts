import { ConnectableObservable } from 'rxjs';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
import { CesiumEventModifier } from '../consts/cesium-event-modifier.enum';
import { CesiumEventBuilder } from '../cesium-event-builder';
export declare class CesiumLongPressObserver extends CesiumPureEventObserver {
    protected event: CesiumEvent;
    protected modifier: CesiumEventModifier;
    private eventFactory;
    static LONG_PRESS_EVENTS_DURATION: number;
    static LONG_PRESS_EVENTS_MIN_DISTANCE_PX: number;
    constructor(event: CesiumEvent, modifier: CesiumEventModifier, eventFactory: CesiumEventBuilder);
    init(): ConnectableObservable<any>;
}
