import { Cartesian3 } from 'cesium';
import { EditorObservable } from './editor-observable';
import { EllipseEditUpdate } from './ellipse-edit-update';
import { PointProps } from './point-edit-options';
import { EllipseProps } from './ellipse-edit-options';
export declare class EllipseEditorObservable extends EditorObservable<EllipseEditUpdate> {
    setManually: (center: Cartesian3, majorRadius: number, rotation?: number, minorRadius?: number, centerPointProp?: PointProps, radiusPointProp?: PointProps, ellipseProp?: EllipseProps) => void;
    getCenter: () => Cartesian3;
    getMinorRadius: () => number;
    getMajorRadius: () => number;
}
