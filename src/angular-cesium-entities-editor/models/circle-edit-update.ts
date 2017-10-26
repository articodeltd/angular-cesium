import { EditModes } from './edit-mode.enum';
import { EditActions } from './edit-actions.enum';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';

export interface CircleEditUpdate {
  id: string,
  editMode: EditModes,
  editAction: EditActions,
  center?: Cartesian3
  radiusPoint?: Cartesian3
}
