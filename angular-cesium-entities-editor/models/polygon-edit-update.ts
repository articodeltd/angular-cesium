import { EditModes } from './edit-mode.enum';
import { EditActions } from './edit-actions.enum';

export interface PolygonEditUpdate {
  id: any,
  editMode: EditModes,
  editAction: EditActions,
  positions?: any[];
  updatedPosition?: any
}
