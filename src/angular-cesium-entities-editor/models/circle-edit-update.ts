import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { BasicEditUpdate } from './basic-edit-update';
import { CircleEditOptions } from './circle-edit-options';

export interface CircleEditUpdate extends BasicEditUpdate {
  startDragPosition?: Cartesian3;
  endDragPosition?: Cartesian3;
  center?: Cartesian3;
  radiusPoint?: Cartesian3;
  radius?: number;
  circleOptions?: CircleEditOptions;
}
