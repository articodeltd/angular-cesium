import { Cartesian3 } from 'cesium';
import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolygonEditUpdate } from './polygon-edit-update';
import { PointProps } from './point-edit-options';
import { PolygonProps } from './polygon-edit-options';


export class PolygonEditorObservable extends EditorObservable<PolygonEditUpdate> {
  setManually: (points: { position: Cartesian3, pointProp?: PointProps }[] | Cartesian3[],
                polygonProps?: PolygonProps) => void;
  getCurrentPoints: () => EditPoint[];
}
