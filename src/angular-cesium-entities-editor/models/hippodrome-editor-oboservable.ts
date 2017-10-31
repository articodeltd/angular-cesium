import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolygonEditUpdate } from './polygon-edit-update';

export class HippodromeEditorObservable extends EditorObservable<PolygonEditUpdate> {
	setPointsManually: (points: EditPoint[]) => void;
	polygonEditValue: () => PolygonEditUpdate;
	getCurrentPoints: () => EditPoint[];
}
