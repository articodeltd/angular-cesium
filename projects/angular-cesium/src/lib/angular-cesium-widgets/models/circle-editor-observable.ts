import { EditorObservable } from './editor-observable';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CircleEditUpdate } from './circle-edit-update';
import { PointProps } from './polyline-edit-options';
import { EllipseProps } from './ellipse-edit-options';

export class CircleEditorObservable extends EditorObservable<CircleEditUpdate> {
  setManually: (center: Cartesian3, radius: number, centerPointProp?: PointProps,
                radiusPointProp?: PointProps, circleProp?: EllipseProps) => void;
  getCenter: () => Cartesian3;
  getRadius: () => number; // meters
}
