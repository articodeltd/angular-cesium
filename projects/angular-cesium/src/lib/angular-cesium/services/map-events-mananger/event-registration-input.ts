import { CesiumEvent } from './consts/cesium-event.enum';
import { CesiumEventModifier } from './consts/cesium-event-modifier.enum';
import { PickOptions } from './consts/pickOptions.enum';

export interface PickConfiguration {
  pickHeight?: number;
  pickWidth?: number;
  drillPickLimit?: number;
}

/**
 * Interface for Event Registration Input
 * __usage:__
 * ```
 * MapEventsManagerService.register(eventRegistrationInput).subscribe()
 * ```
 */
export interface EventRegistrationInput {
  event: CesiumEvent;
  modifier?: CesiumEventModifier;
  entityType?: any;
  priority?: number;
  pick?: PickOptions;
  pickFilter?: (any) => boolean;
  pickConfig?: PickConfiguration;
}
