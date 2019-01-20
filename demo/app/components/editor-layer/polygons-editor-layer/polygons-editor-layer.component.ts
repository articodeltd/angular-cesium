import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { EditActions, LabelProps, PolygonEditorObservable, PolygonEditUpdate, PolygonsEditorService } from 'angular-cesium';

@Component({
  selector: 'polygons-editor-layer',
  templateUrl: 'polygons-editor-layer.component.html',
  styleUrls: ['./polygons-editor-layer.component.css'],
  providers: [PolygonsEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    // create accepts PolygonEditOptions object
    this.editing$ = this.polygonsEditor.create();
    this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {
      console.log(editUpdate.points); // point = position with id
      console.log(editUpdate.positions); // or just position
      console.log(editUpdate.updatedPosition); // added position
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
    this.editing$.setLabelsRenderFn((update: PolygonEditUpdate) => {
      let counter = 0;
      const newLabels: LabelProps[] = [];
      update.positions.forEach(position => newLabels.push({
        text: `Point ${counter++}`,
        scale: 0.6,
        eyeOffset: new Cesium.Cartesian3(10, 10, -1000),
        fillColor: Cesium.Color.BLUE,
      }));
      return newLabels;
    });
    setTimeout(() =>
      this.editing$.updateLabels(
        this.editing$.getLabels().map(label => {
          label.text += '*';
          label.fillColor = Cesium.Color.RED;
          label.showBackground = true;
          return label;
        })
      ), 2000);
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
      const newUpdatedPoints = polygonPoints.map(p => ({
        position: p.getPosition(),
        pointProps: p.props,
      }));
      this.editing$.setManually(newUpdatedPoints);


      // or add new point
      const polygonPositions = this.editing$.getCurrentPoints().map(p => p.getPosition());
      const newPosition = Cesium.Cartesian3.fromDegrees(30, 24);
      polygonPositions.push(newPosition);
      this.editing$.setManually(polygonPositions);
    }
  }
}
