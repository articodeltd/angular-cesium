import { EventRegistrationInput } from '../map-events-mananger/event-registration-input';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';

export interface EventSelectionInput extends EventRegistrationInput {
	pick: PickOptions;
}
