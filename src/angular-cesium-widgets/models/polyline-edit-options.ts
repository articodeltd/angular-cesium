import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { EditorEditOptions } from './editor-edit-options';

export interface PointProps {
  color?: any;
  outlineColor?: any;
  outlineWidth?: number;
}

export interface PolylineProps {
  width?: any;
  material?: any
}

export interface PolylineEditOptions extends EditorEditOptions {
  addLastPointEvent?: CesiumEvent;
  addLastPointModifier?: CesiumEventModifier;
  removePointEvent?: CesiumEvent;
  removePointModifier?: CesiumEventModifier;
  showMiddlePoints?: boolean;
  maximumNumberOfPoints?: number
}
