import { Injectable } from '@angular/core';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { EditablePolyline } from '../../../models/editable-polyline';

@Injectable()
export class PolylinesManagerService {
	polylines: Map<string, EditablePolyline> = new Map<string, EditablePolyline>();
	
	createEditablePolyline(id: string, editPolylinesLayer, editPointsLayer,
												coordinateConverter, polylineOptions?: PolygonEditOptions, positions?: Cartesian3[]) {
		const editablePolyline = new EditablePolyline(
			id,
			editPolylinesLayer,
			editPointsLayer,
			editPolylinesLayer,
			coordinateConverter,
			polylineOptions,
			positions);
		this.polylines.set(id, editablePolyline
		);
	}
	
	get(id: string): EditablePolyline {
		return this.polylines.get(id);
	}
	
	clear() {
		this.polylines.forEach(polyline => polyline.dispose());
		this.polylines.clear();
	}
}
