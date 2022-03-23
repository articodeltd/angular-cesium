import { Observable } from 'rxjs';
import { CesiumEvent } from '../consts/cesium-event.enum';
import { CesiumEventModifier } from '../consts/cesium-event-modifier.enum';
export declare class CesiumPureEventObserver {
    protected event: CesiumEvent;
    protected modifier: CesiumEventModifier;
    observer: Observable<any>;
    constructor(event: CesiumEvent, modifier: CesiumEventModifier);
    init(eventsHandler: any): Observable<any>;
}
