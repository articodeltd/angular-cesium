import { EditorObservable } from './editor-observable';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';

export class CircleEditorObservable<T> extends EditorObservable<T> {
  setCircleManually: (center: Cartesian3, radius: number) => void;
  circleEditValue: () => T;
}
