import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { PolygonEditUpdate } from './polygon-edit-update';
import { PointProps } from './polyline-edit-options';
import { Cartesian3 } from '../../angular-cesium/models/cartesian3';

export class HippodromeEditorObservable extends EditorObservable<PolygonEditUpdate> {
  setManually: (firstPosition: Cartesian3,
                secondPosition: Cartesian3,
                widthMeters?: number,
                firstPointProp?: PointProps,
                secondPointProp?: PointProps) => void;
  getCurrentPoints: () => EditPoint[];
  getCurrentWidth: () => number; // meters
}
