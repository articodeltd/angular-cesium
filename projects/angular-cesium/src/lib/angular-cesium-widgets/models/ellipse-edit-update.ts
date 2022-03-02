import { Cartesian3 } from 'cesium';
//import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { BasicEditUpdate } from './basic-edit-update';
import { EllipseEditOptions } from './ellipse-edit-options';
import { EditPoint } from './edit-point';

export interface EllipseEditUpdate extends BasicEditUpdate<EllipseEditUpdate> {
  startDragPosition?: Cartesian3;
  endDragPosition?: Cartesian3;
  updatedPoint?: EditPoint;
  updatedPosition?: Cartesian3;
  center?: Cartesian3;
  rotation?: number;
  majorRadius?: number;
  minorRadius?: number;
  ellipseOptions?: EllipseEditOptions;
  minorRadiusPointPosition?: Cartesian3;
  majorRadiusPointPosition?: Cartesian3;
}
