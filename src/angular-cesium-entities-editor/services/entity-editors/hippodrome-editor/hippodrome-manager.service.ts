import { Injectable } from '@angular/core';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { EditableHippodrome } from '../../../models/editable-hippodrome';

@Injectable()
export class HippodromeManagerService {
	hippodromes: Map<string, EditableHippodrome> = new Map<string, EditableHippodrome>();
	
	createEditableHippodrome(id: string, editHippodromeLayer, editPointsLayer,
													 coordinateConverter, polylineOptions?: PolygonEditOptions, positions?: Cartesian3[]) {
		const editablePolyline = new EditableHippodrome(
			id,
			editHippodromeLayer,
			editPointsLayer,
			coordinateConverter,
			polylineOptions,
			positions);
		this.hippodromes.set(id, editablePolyline
		);
	}
	
	get(id: string): EditableHippodrome {
		return this.hippodromes.get(id);
	}
	
	clear() {
		this.hippodromes.forEach(hippodrome => hippodrome.dispose());
		this.hippodromes.clear();
	}
}
