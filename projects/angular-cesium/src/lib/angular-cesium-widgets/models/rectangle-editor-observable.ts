import { Cartesian3 } from 'cesium';
import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { RectangleEditUpdate } from './rectangle-edit-update';
import { PointProps } from './point-edit-options';

export class RectangleEditorObservable extends EditorObservable<RectangleEditUpdate> {
  setManually: (
    firstPosition: Cartesian3,
    secondPosition: Cartesian3,
    firstPointProp?: PointProps,
    secondPointProp?: PointProps
  ) => void;
  getCurrentPoints: () => EditPoint[];
}

