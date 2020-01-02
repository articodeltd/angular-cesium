import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { EditorEditOptions } from './editor-edit-options';

export interface ClampTo3DOptions {
  clampToTerrain?: boolean;
  clampMostDetailed?: boolean;
  clampToHeightPickWidth?: number;
}

export interface PolylineProps {
  width?: number;
  material?: Function;

  clampToGround?: boolean;
  zIndex?: number;
  classificationType?: any;
}

export interface PolylineEditOptions extends EditorEditOptions {
  addLastPointEvent?: CesiumEvent;
  addLastPointModifier?: CesiumEventModifier;
  removePointEvent?: CesiumEvent;
  removePointModifier?: CesiumEventModifier;
  maximumNumberOfPoints?: number;
  clampHeightTo3D?: boolean;
  clampHeightTo3DOptions?: ClampTo3DOptions;
}
