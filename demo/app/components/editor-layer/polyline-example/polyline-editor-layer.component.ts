import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { EditActions, LabelProps, PolygonEditUpdate, PolylineEditorObservable, PolylinesEditorService } from 'angular-cesium';

@Component({
  selector: 'polyline-editor-layer',
  templateUrl: 'polyline-editor-layer.component.html',
  styleUrls: ['./polyline-editor-layer.component.css'],
  providers: [PolylinesEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
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
    this.editing$ = this.polylineEditor.create();
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
    this.editing$ = this.polylineEditor.edit(initialPos, {
      polylineProps: {
        width: 3,
      },
    });
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
      const polylinePoints = this.editing$.getCurrentPoints();
      const firstPoint = polylinePoints[0];
      firstPoint.setPosition(Cesium.Cartesian3.fromDegrees(20, 20));
      const newUpdatedPoints = polylinePoints.map(p => ({
        position: p.getPosition(),
        pointProps: p.props,
      }));
      this.editing$.setManually(newUpdatedPoints);

      // or add new point
      const polylinePositions = this.editing$.getCurrentPoints().map(p => p.getPosition());
      const newPosition = Cesium.Cartesian3.fromDegrees(30, 24);
      polylinePositions.push(newPosition);
      this.editing$.setManually(polylinePositions);
    }
  }
}
