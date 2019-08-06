import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { EditorEditOptions } from './editor-edit-options';

export interface EllipseProps {
  material?: any;
  outline: boolean;
  outlineWidth?: number;
  outlineColor?: any;
  granularity?: number;
  fill?: boolean;

  zIndex?: number;
  classificationType?: any;
  shadows?: any;
}

export interface EllipseEditOptions extends EditorEditOptions {
  ellipseProps?: EllipseProps;
  circleToEllipseTransformEvent?: CesiumEvent;
  circleToEllipseTransformEventModifier?: CesiumEventModifier;
  circleToEllipseTransformation?: boolean;
}
