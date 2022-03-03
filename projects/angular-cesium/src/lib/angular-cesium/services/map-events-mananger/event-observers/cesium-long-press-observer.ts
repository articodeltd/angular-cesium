import { ConnectableObservable, merge, of as observableOf } from 'rxjs';
import { delay, filter, mergeMap, publish, takeUntil, tap } from 'rxjs/operators';
import { Cartesian2 } from 'cesium';
import { CesiumPureEventObserver } from './cesium-pure-event-observer';
import { CesiumEvent } from '../consts/cesium-event.enum';
import { CesiumEventModifier } from '../consts/cesium-event-modifier.enum';
import { CesiumEventBuilder } from '../cesium-event-builder';

export class CesiumLongPressObserver extends CesiumPureEventObserver {
  public static LONG_PRESS_EVENTS_DURATION = 250;
  public static LONG_PRESS_EVENTS_MIN_DISTANCE_PX = 10;

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

    // Save start event position
    let startEventPosition: Cartesian2 = null;
    const startEventObservable = this.eventFactory.get(startEvent, this.modifier)
      .pipe(tap((movement) => (startEventPosition = movement.endPosition)));

    // Prevent drag mistaken for long press by observing mouse move far from start event position
    const mouseMoveEventObservable = this.eventFactory.get(CesiumEvent.MOUSE_MOVE)
      .pipe(
        filter((movement) => 
          Math.abs(movement.endPosition.x - startEventPosition.x) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX ||
          Math.abs(movement.endPosition.y - startEventPosition.y) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX
        )
      );

    const stopEventObservable = merge(
      this.eventFactory.get(stopEvent, this.modifier),
      mouseMoveEventObservable 
    );

    // publish for preventing side effect
    const longPressObservable = publish()(startEventObservable.pipe(
      mergeMap((e) => observableOf(e).pipe(
        delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION),
        takeUntil(stopEventObservable))),
    ));
    return longPressObservable;
  }
}
