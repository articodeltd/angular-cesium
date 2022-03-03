import { Cartesian3 } from 'cesium';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { Injectable } from '@angular/core';
import { PointEditOptions } from '../../../models/point-edit-options';
import { EditablePoint } from '../../../models/editable-point';

@Injectable()
export class PointsManagerService {
  points: Map<string, EditablePoint> = new Map<string, EditablePoint>();

  createEditablePoint(id: string,
                      editPointLayer: AcLayerComponent,
                      coordinateConverter: CoordinateConverter,
                      editOptions?: PointEditOptions,
                      position?: Cartesian3) {
    const editablePoint = new EditablePoint(
      id,
      editPointLayer,
      coordinateConverter,
      editOptions,
      position);
    this.points.set(id, editablePoint
    );
  }

  enableAll() {
    this.points.forEach(point => point.enableEdit = true);
  }

  disableAll() {
    this.points.forEach(point => point.enableEdit = false);
  }

  dispose(id: string) {
    const point = this.points.get(id);
    if (point.getCurrentPoint()) {
      point.dispose();
    }
    this.points.delete(id);
  }

  get(id: string): EditablePoint {
    return this.points.get(id);
  }

  clear() {
    this.points.forEach(point => point.dispose());
    this.points.clear();
  }
}
