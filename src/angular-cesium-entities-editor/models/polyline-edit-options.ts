
import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { CesiumEventModifier } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';

export interface PointProps {
	color?: any;
	outlineColor?: any;
	outlineWidth?: number;
}
export interface PolylineProps {
	width?: any;
	material: any
}
export interface PolylineEditOptions {
	addPointEvent?: CesiumEvent;
	addPointModifier?: CesiumEventModifier;
	addLastPointEvent?: CesiumEvent;
	addLastPointModifier?: CesiumEventModifier;
	removePointEvent?: CesiumEvent;
	removePointModifier?: CesiumEventModifier;
	dragPointEvent?: CesiumEvent;
	defaultPointOptions?: PointProps;
	defaultPolylineOptions?: PolylineProps;
	dragShapeEvent?: CesiumEvent;
}
