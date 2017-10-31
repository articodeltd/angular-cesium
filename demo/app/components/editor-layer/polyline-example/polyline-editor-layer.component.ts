import { Component, OnInit } from '@angular/core';
import { PolygonEditUpdate } from '../../../../../src/angular-cesium-entities-editor/models/polygon-edit-update';
import { EditActions } from '../../../../../src/angular-cesium-entities-editor/models/edit-actions.enum';
import { PolylinesEditorService } from '../../../../../src/angular-cesium-entities-editor/services/entity-editors/polyline-editor/polylines-editor.service';
import { PolylineEditorObservable } from '../../../../../src/angular-cesium-entities-editor/models/polyline-editor-observable';

@Component({
  selector: 'polyline-editor-layer',
  templateUrl: 'polyline-editor-layer.component.html',
  styleUrls: ['./polyline-editor-layer.component.css']
})
export class PolylineEditorLayerComponent implements OnInit {

  editing$: PolylineEditorObservable;
  enableEditing = true;

  constructor(private polylineEditor: PolylinesEditorService) {
  }

  ngOnInit(): void {
    // this.startEdit();
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.polylineEditor.create({allowDrag: false});
    this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {

      if (editUpdate.editAction === EditActions.ADD_POINT) {
        console.log(editUpdate.points); // point = position with id
        console.log(editUpdate.positions); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
  }

  stopEdit() {
    this.editing$.dispose();
    this.editing$ = undefined;
  }


  editFromExisting() {
    if (this.editing$) {
      this.stopEdit();
    }
    const initialPos = [
      Cesium.Cartesian3.fromDegrees(20, 40),
      Cesium.Cartesian3.fromDegrees(45, 40),
      Cesium.Cartesian3.fromDegrees(30, 20)];
    this.editing$ = this.polylineEditor.edit(initialPos);
    this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {

      if (editUpdate.editAction === EditActions.DRAG_POINT_FINISH) {
        console.log(editUpdate.points); // point = position with id
        console.log(editUpdate.positions); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
  }

  toggleEnableEditing() {
    // Only effects if in edit mode (all polygon points were created)
    if (!this.editing$) {
      return;
    }
    this.enableEditing = !this.enableEditing;
    if (this.enableEditing) {
      this.editing$.enable();
    } else {
      this.editing$.disable();
    }
  }

  updatePointManually() {
    if (this.editing$) {
      // Only effects if in edit mode (all polygon points were created)
      const polygonPoints = this.editing$.getCurrentPoints();

      const firstPoint = polygonPoints[0];
      firstPoint.setPosition(Cesium.Cartesian3.fromDegrees(20, 20));
      this.editing$.setPointsManually(polygonPoints);
    }
  }
}
