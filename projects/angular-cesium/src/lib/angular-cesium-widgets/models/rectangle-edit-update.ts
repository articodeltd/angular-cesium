import { EditPoint } from './edit-point';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { Rectangle } from '../../angular-cesium/models/rectangle';
import { BasicEditUpdate } from './basic-edit-update';
import { RectangleEditOptions } from './rectangle-edit-options';

export interface RectangleEditUpdate extends BasicEditUpdate<RectangleEditUpdate> {
  coordinates?: Rectangle;
  updatedPosition?: Cartesian3;
  draggedPosition?: Cartesian3;
  points?: EditPoint[];
  updatedPoint?: EditPoint;
  rectangleOptions?: RectangleEditOptions;
}

