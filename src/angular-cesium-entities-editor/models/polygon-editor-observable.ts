import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';

export class PolygonEditorObservable<T> extends EditorObservable<T> {
  setPointsManually: (points: EditPoint[]) => void;
  polygonEditValue: () => T;
  getCurrentPoints: () => EditPoint[];
}
