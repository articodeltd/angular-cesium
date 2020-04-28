import { Injectable } from '@angular/core';
import { EditableCircle } from '../../../models/editable-circle';
import { AcLayerComponent } from '../../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CircleEditOptions } from '../../../models/circle-edit-options';

@Injectable()
export class CirclesManagerService {
  private circles = new Map<string, EditableCircle>();

  createEditableCircle(id: string,
                       editCirclesLayer: AcLayerComponent,
                       editPointsLayer: AcLayerComponent,
                       editArcsLayer: AcLayerComponent,
                       circleOptions: CircleEditOptions): EditableCircle {
    const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
    this.circles.set(id, editableCircle);
    return editableCircle;
  }

  dispose(id: string) {
    const circle = this.circles.get(id);
    if (circle) {
      circle.dispose();
    }
    this.circles.delete(id);
  }

  get(id: string): EditableCircle {
    return this.circles.get(id);
  }

  clear() {
    this.circles.forEach(circle => circle.dispose());
    this.circles.clear();
  }
}
