import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolygonEditUpdate } from './polygon-edit-update';
import { PointProps } from './polyline-edit-options';

export class HippodromeEditorObservable extends EditorObservable<PolygonEditUpdate> {
	setManually: (firstPosition: Cartesian3,
                secondPosition: Cartesian3,
                widthMeters?: number,
                firstPointProp?: PointProps,
                secondPointProp?: PointProps) => void;
	polygonEditValue: () => PolygonEditUpdate;
	getCurrentPoints: () => EditPoint[];
}
