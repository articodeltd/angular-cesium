import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';

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
	hippodromeProps?: HippodromeProps;
}