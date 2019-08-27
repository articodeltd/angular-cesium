import { Injectable } from '@angular/core';
import { EditableRectangle } from '../../../models/editable-rectangle';
import { Cartesian3 } from '../../../../angular-cesium/models/cartesian3';
import { RectangleEditOptions } from '../../../models/rectangle-edit-options';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';

@Injectable()
export class RectanglesManagerService {
  rectangles: Map<string, EditableRectangle> = new Map<string, EditableRectangle>();

  createEditableRectangle(id: string, editRectanglesLayer: AcLayerComponent, editPointsLayer: AcLayerComponent,
                        editPolylinesLayer: AcLayerComponent, coordinateConverter: CoordinateConverter,
                        rectangleOptions?: RectangleEditOptions, positions?: Cartesian3[]) {
    const editableRectangle = new EditableRectangle(
      id,
      editRectanglesLayer,
      editPointsLayer,
      editPolylinesLayer,
      coordinateConverter,
      rectangleOptions,
      positions);
    this.rectangles.set(id, editableRectangle
    );
  }

  dispose(id: string) {
    this.rectangles.get(id).dispose();
    this.rectangles.delete(id);
  }

  get(id: string): EditableRectangle {
    return this.rectangles.get(id);
  }

  clear() {
    this.rectangles.forEach(rectangle => rectangle.dispose());
    this.rectangles.clear();
  }
}

