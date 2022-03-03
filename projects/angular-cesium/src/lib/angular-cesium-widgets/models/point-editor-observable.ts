import { Cartesian3 } from 'cesium';
import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PointProps } from './point-edit-options';
import { PointEditUpdate } from './point-edit-update';

export class PointEditorObservable extends EditorObservable<PointEditUpdate> {
  setManually: (point: { position: Cartesian3, pointProp?: PointProps } | Cartesian3, pointProps?: PointProps) => void;
  getCurrentPoint: () => EditPoint;
}
