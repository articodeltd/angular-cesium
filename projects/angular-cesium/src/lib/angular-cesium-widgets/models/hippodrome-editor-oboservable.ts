import { Cartesian3 } from 'cesium';
import { EditPoint } from './edit-point';
import { EditorObservable } from './editor-observable';
import { HippodromeEditUpdate } from './hippodrome-edit-update';
import { PointProps } from './point-edit-options';

export class HippodromeEditorObservable extends EditorObservable<HippodromeEditUpdate> {
  setManually: (firstPosition: Cartesian3,
                secondPosition: Cartesian3,
                widthMeters?: number,
                firstPointProp?: PointProps,
                secondPointProp?: PointProps) => void;
  getCurrentPoints: () => EditPoint[];
  getCurrentWidth: () => number; // meters
}
