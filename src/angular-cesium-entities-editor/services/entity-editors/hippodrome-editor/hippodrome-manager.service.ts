import { Injectable } from '@angular/core';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';

@Injectable()
export class HippodromeManagerService {
	hippodromes: Map<string, EditableHippodrome> = new Map<string, EditableHippodrome>();
	
	createEditableHippodrome(id: string, editHippodromeLayer, editPointsLayer,
													 coordinateConverter, hippodromeEditOptions?: HippodromeEditOptions, positions?: Cartesian3[]) {
		const editableHippodrome = new EditableHippodrome(
			id,
			editHippodromeLayer,
			editPointsLayer,
			coordinateConverter,
			hippodromeEditOptions,
			positions);
		this.hippodromes.set(id, editableHippodrome);
	}
	
	get(id: string): EditableHippodrome {
		return this.hippodromes.get(id);
	}
	
	clear() {
		this.hippodromes.forEach(hippodrome => hippodrome.dispose());
		this.hippodromes.clear();
	}
}
