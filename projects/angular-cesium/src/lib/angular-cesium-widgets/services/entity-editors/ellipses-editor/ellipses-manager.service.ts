import { Injectable } from '@angular/core';
import { EditableEllipse } from '../../../models/editable-ellipse';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { EllipseEditOptions } from '../../../models/ellipse-edit-options';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';

@Injectable()
export class EllipsesManagerService {
  private ellipses = new Map<string, EditableEllipse>();

  createEditableEllipse(id: string,
                        editEllipsesLayer: AcLayerComponent,
                        editPointsLayer: AcLayerComponent,
                        coordinateConverter: CoordinateConverter,
                        ellipseOptions: EllipseEditOptions): EditableEllipse {
    const editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
    this.ellipses.set(id, editableEllipse);
    return editableEllipse;
  }

  dispose(id: string) {
    this.ellipses.get(id).dispose();
    this.ellipses.delete(id);
  }

  get(id: string): EditableEllipse {
    return this.ellipses.get(id);
  }

  clear() {
    this.ellipses.forEach(ellipse => ellipse.dispose());
    this.ellipses.clear();
  }
}
