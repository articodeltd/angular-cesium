import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolylineEditUpdate } from './polyline-edit-update';

export class PolylineEditorObservable extends EditorObservable<PolylineEditUpdate> {
	setPointsManually: (points: EditPoint[]) => void;
	polylineEditValue: () => PolylineEditUpdate;
	getCurrentPoints: () => EditPoint[];
}
