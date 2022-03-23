import { Cartesian3 } from 'cesium';
import { BasicEditUpdate } from './basic-edit-update';
import { CircleEditOptions } from './circle-edit-options';
export interface CircleEditUpdate extends BasicEditUpdate<CircleEditUpdate> {
    startDragPosition?: Cartesian3;
    endDragPosition?: Cartesian3;
    center?: Cartesian3;
    radiusPoint?: Cartesian3;
    radius?: number;
    circleOptions?: CircleEditOptions;
}
