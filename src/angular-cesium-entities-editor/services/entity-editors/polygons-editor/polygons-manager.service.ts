import { Injectable } from '@angular/core';
import { EditablePolygon } from '../../../models/editable-polygon';

@Injectable()
export class PolygonsManagerService {
	polygons: Map<string, EditablePolygon> = new Map<string, EditablePolygon>();
	
	createEditablePolygon(id: string, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, positions?) {
		this.polygons.set(id,
			new EditablePolygon(
				id,
				editPolygonsLayer,
				editPointsLayer,
				editPolylinesLayer,
				coordinateConverter)
		);
	}
	
	get(id: string): EditablePolygon {
		return this.polygons.get(id);
	}
	
	clear(){
		this.polygons.forEach(polygon => polygon.dispose());
		this.polygons.clear();
	}
	
}