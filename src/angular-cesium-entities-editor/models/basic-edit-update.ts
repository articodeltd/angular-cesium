import { EditModes } from './edit-mode.enum';
import { EditActions } from './edit-actions.enum';

export interface BasicEditUpdate {
  id: string;
  editMode: EditModes;
  editAction: EditActions;
}
