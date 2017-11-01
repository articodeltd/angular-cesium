import { Component, OnInit } from '@angular/core';
import { PolygonEditUpdate } from '../../../../../src/angular-cesium-entities-editor/models/polygon-edit-update';
import { EditActions } from '../../../../../src/angular-cesium-entities-editor/models/edit-actions.enum';
import { PolygonEditorObservable } from '../../../../../src/angular-cesium-entities-editor/models/polygon-editor-observable';
import { PolygonsEditorService } from '../../../../../src/angular-cesium-entities-editor/services/entity-editors/polygons-editor/polygons-editor.service';

@Component({
  selector : 'polygons-editor-layer',
  templateUrl : 'polygons-editor-layer.component.html',
  styleUrls : ['./polygons-editor-layer.component.css']
})
export class PolygonsEditorLayerComponent implements OnInit {
  
  editing$: PolygonEditorObservable;
  enableEditing = true;
  
  constructor(private polygonsEditor: PolygonsEditorService) {
  }
  
  ngOnInit(): void {
  }
  
  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.polygonsEditor.create({allowDrag : false});
    this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {
      if (editUpdate.editAction === EditActions.ADD_POINT) {
        console.log(editUpdate.points); // point = position with id
        console.log(editUpdate.positions); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
  }
  
  stopEdit() {
    if (this.editing$) {
      this.editing$.dispose();
      this.editing$ = undefined;
    }
  }
  
  
  editFromExisting() {
    if (this.editing$) {
      this.stopEdit();
    }
    const initialPos = [
      Cesium.Cartesian3.fromDegrees(20, 40),
      Cesium.Cartesian3.fromDegrees(45, 40),
      Cesium.Cartesian3.fromDegrees(30, 20)];
    this.editing$ = this.polygonsEditor.edit(initialPos);
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
      // update current point
      const polygonPoints = this.editing$.getCurrentPoints();
      const firstPoint = polygonPoints[0];
      firstPoint.setPosition(Cesium.Cartesian3.fromDegrees(20, 20));
      this.editing$.setPolygonManually(polygonPoints);
      
      
      // or add new point
      const polygonPositions = this.editing$.getCurrentPoints().map(p => p.getPosition());
      const newPosition = Cesium.Cartesian3.fromDegrees(30, 24);
      polygonPositions.push(newPosition);
      this.editing$.setPolygonManually(polygonPositions);
    }
  }
}
