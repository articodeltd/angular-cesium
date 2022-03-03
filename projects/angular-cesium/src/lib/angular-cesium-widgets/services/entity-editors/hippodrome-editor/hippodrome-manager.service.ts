import { Injectable } from '@angular/core';
import { Cartesian3 } from 'cesium';
import { EditableHippodrome } from '../../../models/editable-hippodrome';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';

@Injectable()
export class HippodromeManagerService {
  hippodromes: Map<string, EditableHippodrome> = new Map<string, EditableHippodrome>();

  createEditableHippodrome(id: string, editHippodromeLayer: AcLayerComponent, editPointsLayer: AcLayerComponent,
                           coordinateConverter: CoordinateConverter, hippodromeEditOptions?: HippodromeEditOptions,
                           positions?: Cartesian3[]) {
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
