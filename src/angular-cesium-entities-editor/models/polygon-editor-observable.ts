import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolygonEditUpdate } from './polygon-edit-update';
import { PointProps } from './polyline-edit-options';
import { PolygonProps } from './polygon-edit-options';


export class PolygonEditorObservable extends EditorObservable<PolygonEditUpdate> {
  setPolygonManually: (points: {position: Cartesian3, pointProp?: PointProps}[] | Cartesian3[], polygonProps?: PolygonProps) => void;
  polygonEditValue: () => PolygonEditUpdate;
  getCurrentPoints: () => EditPoint[];
}
