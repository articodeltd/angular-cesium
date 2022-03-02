import { Cartesian3 } from 'cesium';
import { EditorObservable } from './editor-observable';
//import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { EllipseEditUpdate } from './ellipse-edit-update';
import { PointProps } from './point-edit-options';
import { EllipseProps } from './ellipse-edit-options';

export class EllipseEditorObservable extends EditorObservable<EllipseEditUpdate> {
  setManually: (
    center: Cartesian3,
    majorRadius: number,
    rotation?: number,
    minorRadius?: number,
    centerPointProp?: PointProps,
    radiusPointProp?: PointProps,
    ellipseProp?: EllipseProps,
  ) => void;
  getCenter: () => Cartesian3;
  getMinorRadius: () => number; // meters
  getMajorRadius: () => number; // meters
}
