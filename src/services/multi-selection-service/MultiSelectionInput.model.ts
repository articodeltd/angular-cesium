import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { EventSelectionInput } from '../map-selection-service/EventSelectionInput.model';

export interface MultiSelectionInput extends EventSelectionInput {
	pick: PickOptions.MULTI_PICK;
}
