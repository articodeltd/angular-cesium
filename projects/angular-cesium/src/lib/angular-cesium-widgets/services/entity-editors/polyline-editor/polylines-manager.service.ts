import { Cartesian3 } from 'cesium';
import { CoordinateConverter } from './../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { AcLayerComponent } from './../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { Injectable } from '@angular/core';
import { PolygonEditOptions } from '../../../models/polygon-edit-options';
import { EditablePolyline } from '../../../models/editable-polyline';

@Injectable()
export class PolylinesManagerService {
  polylines: Map<string, EditablePolyline> = new Map<string, EditablePolyline>();

  createEditablePolyline(id: string, editPolylinesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent,
                         coordinateConverter: CoordinateConverter, polylineOptions?: PolygonEditOptions, positions?: Cartesian3[]) {
    const editablePolyline = new EditablePolyline(
      id,
      editPolylinesLayer,
      editPointsLayer,
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
