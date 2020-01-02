import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { PointProps } from './point-edit-options';
import { PolylineProps } from './polyline-edit-options';
import { PickConfiguration } from '../../angular-cesium';

export interface EditorEditOptions {
  addPointEvent?: CesiumEvent;
  addPointModifier?: CesiumEventModifier;
  dragPointEvent?: CesiumEvent;
  dragShapeEvent?: CesiumEvent;
  pointProps?: PointProps;
  polylineProps?: PolylineProps;
  allowDrag?: boolean;
  pickConfiguration?: PickConfiguration;
}
