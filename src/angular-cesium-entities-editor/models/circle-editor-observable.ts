import { EditorObservable } from './editor-observable';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CircleEditUpdate } from './circle-edit-update';
import { PointProps } from './polyline-edit-options';
import { CircleProps } from './circle-edit-options';

export class CircleEditorObservable extends EditorObservable<CircleEditUpdate> {
  setManually:  (center: Cartesian3, radius: number, centerPointProp?: PointProps,
                 radiusPointProp?: PointProps, circleProp?: CircleProps) => void;
  circleEditValue: () => CircleEditUpdate;
}
