import { EditorObservable } from './editor-observable';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
import { CircleEditUpdate } from './circle-edit-update';

export class CircleEditorObservable extends EditorObservable<CircleEditUpdate> {
  setCircleManually: (center: Cartesian3, radius: number) => void;
  circleEditValue: () => CircleEditUpdate;
}
