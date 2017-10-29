import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { PointProps } from './polyline-edit-options';

export interface HippodromeProps {
	width?: number;
	material?: any;
	outline?: boolean;
	outlineColor?: any;
	outlineWidth?: number;
}

export interface HippodromeEditOptions {
	addPointEvent?: CesiumEvent;
	addPointModifier?: CesiumEventModifier;
	dragPointEvent?: CesiumEvent;
	dragShapeEvent?: CesiumEvent;
	hippodromeProps?: HippodromeProps;
	defaultPointOptions?: PointProps;
}
