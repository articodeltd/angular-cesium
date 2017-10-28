import { PolylineEditOptions } from './polyline-edit-options';
import { CesiumEvent } from '../../angular-cesium/services/map-events-mananger/consts/cesium-event.enum';

export interface PolygonProps {
	material?: any;
}

export interface PolygonEditOptions extends PolylineEditOptions {
	defaultPolygonOptions?: PolygonProps;
	dragShapeEvent?: CesiumEvent; // TODO
	
}
