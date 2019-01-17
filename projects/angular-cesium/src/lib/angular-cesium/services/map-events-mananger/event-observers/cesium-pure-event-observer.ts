import { Observable, Subscriber } from 'rxjs';
import { CesiumEvent } from '../consts/cesium-event.enum';
import { CesiumEventModifier } from '../consts/cesium-event-modifier.enum';

export class CesiumPureEventObserver {
  public observer: Observable<any>;

  constructor(protected event: CesiumEvent, protected modifier: CesiumEventModifier) {
  }

  init(eventsHandler: any): Observable<any> {
    this.observer = Observable.create((observer: Subscriber<any>) => {
        eventsHandler.setInputAction((movement: any) => {
          if (movement.position) {
            movement.startPosition = movement.position;
            movement.endPosition = movement.position;
          }
          observer.next(movement);
        }, this.event, this.modifier);
      }
    );
    return this.observer;
  }
}
