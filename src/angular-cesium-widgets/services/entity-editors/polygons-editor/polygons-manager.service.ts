import { Injectable } from '@angular/core';
import { EditablePolygon } from '../../../models/editable-polygon';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';

@Injectable()
export class PolygonsManagerService {
	polygons: Map<string, EditablePolygon> = new Map<string, EditablePolygon>();
	
	createEditablePolygon(id: string, editPolygonsLayer, editPointsLayer, editPolylinesLayer,
												coordinateConverter, polygonOptions?: PolygonEditOptions, positions?: Cartesian3[]) {
		const editablePolygon = new EditablePolygon(
			id,
			editPolygonsLayer,
			editPointsLayer,
			editPolylinesLayer,
			coordinateConverter,
			polygonOptions,
			positions);
		this.polygons.set(id, editablePolygon
		);
	}

	dispose(id) {
		this.polygons.get(id).dispose();
		this.polygons.delete(id);
	}
	
	get(id: string): EditablePolygon {
		return this.polygons.get(id);
	}
	
	clear() {
		this.polygons.forEach(polygon => polygon.dispose());
		this.polygons.clear();
	}
}
