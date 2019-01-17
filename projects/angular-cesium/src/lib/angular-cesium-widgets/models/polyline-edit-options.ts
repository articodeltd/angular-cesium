import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { EditorEditOptions } from './editor-edit-options';

export interface PointProps {
  color?: any;
  outlineColor?: any;
  outlineWidth?: number;
  virtualPointPixelSize?: number;
  pixelSize?: number;
  showVirtual?: boolean;
  show?: boolean;
}

export interface PolylineProps {
  width?: number;
  material?: Function;
}

export interface PolylineEditOptions extends EditorEditOptions {
  addLastPointEvent?: CesiumEvent;
  addLastPointModifier?: CesiumEventModifier;
  removePointEvent?: CesiumEvent;
  removePointModifier?: CesiumEventModifier;
  maximumNumberOfPoints?: number;
}
