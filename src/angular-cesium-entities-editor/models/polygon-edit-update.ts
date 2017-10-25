import { EditModes } from './edit-mode.enum';
import { EditActions } from './edit-actions.enum';
import { EditPoint } from './edit-point';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';

export interface PolygonEditUpdate {
  id: string,
  editMode: EditModes,
  editAction: EditActions,
  positions?: Cartesian3[],
  updatedPosition?: Cartesian3,
  points?: EditPoint[],
  updatedPoint?: EditPoint,
}
