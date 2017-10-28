import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { BasicEditUpdate } from './basic-edit-update';

export interface CircleEditUpdate extends BasicEditUpdate {
  dragPosition?: Cartesian3;
  center?: Cartesian3;
  radiusPoint?: Cartesian3;
  radius?: number;
}
