import {CesiumEvent} from "./consts/cesium-event.enum";
import {CesiumEventModifier} from "./consts/cesium-event-modifier.enum";
import {PickOptions} from "./consts/pickOptions.enum";
export interface EventRegistrationInput{
    event: CesiumEvent;
    modifier?: CesiumEventModifier;
    entityType?;
    priority?: number ;
    pick?: PickOptions;
}