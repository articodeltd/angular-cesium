import { EditPoint } from './edit-point';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { BasicEditUpdate } from './basic-edit-update';
import { PointEditOptions } from './point-edit-options';

export interface PointEditUpdate extends BasicEditUpdate<PointEditUpdate> {
  position?: Cartesian3;
  updatedPosition?: Cartesian3;
  draggedPosition?: Cartesian3;
  point?: EditPoint;
  pointOptions?: PointEditOptions;
}
