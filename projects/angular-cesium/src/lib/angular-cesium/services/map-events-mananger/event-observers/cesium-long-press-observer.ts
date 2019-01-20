import { ConnectableObservable, of as observableOf } from 'rxjs';

import { delay, mergeMap, publish, takeUntil } from 'rxjs/operators';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
import { CesiumEventModifier } from '../consts/cesium-event-modifier.enum';
import { CesiumEventBuilder } from '../cesium-event-builder';

export class CesiumLongPressObserver extends CesiumPureEventObserver {
  public static LONG_PRESS_EVENTS_DURATION = 250;

  constructor(protected event: CesiumEvent,
              protected modifier: CesiumEventModifier,
              private eventFactory: CesiumEventBuilder) {
    super(event, modifier);
  }

  init(): ConnectableObservable<any> {
    let startEvent: CesiumEvent;
    let stopEvent: CesiumEvent;

    if (this.event === CesiumEvent.LONG_LEFT_PRESS) {
      startEvent = CesiumEvent.LEFT_DOWN;
      stopEvent = CesiumEvent.LEFT_UP;
    } else if (this.event === CesiumEvent.LONG_RIGHT_PRESS) {
      startEvent = CesiumEvent.RIGHT_DOWN;
      stopEvent = CesiumEvent.RIGHT_UP;
    } else if (this.event === CesiumEvent.LONG_MIDDLE_PRESS) {
      startEvent = CesiumEvent.MIDDLE_DOWN;
      stopEvent = CesiumEvent.MIDDLE_UP;
    }

    const startEventObservable = this.eventFactory.get(startEvent, this.modifier);
    const stopEventObservable = this.eventFactory.get(stopEvent, this.modifier);

    // publish for preventing side effect
    const longPressObservable = publish()(startEventObservable.pipe(
      mergeMap((e) => observableOf(e).pipe(
        delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION),
        takeUntil(stopEventObservable))),
    ));
    return longPressObservable;
  }
}
