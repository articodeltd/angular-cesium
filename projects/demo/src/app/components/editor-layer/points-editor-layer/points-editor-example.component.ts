import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Color, Cartesian3 } from 'cesium';
import { EditActions,
  LabelProps,
  PointEditorObservable,
  PointEditUpdate,
  PointsEditorService
} from '../../../../../../angular-cesium/dist';

@Component({
  selector: 'points-editor-example',
  templateUrl: 'points-editor-example.component.html',
  styleUrls: ['./points-editor-example.component.css'],
  providers: [PointsEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsEditorExampleComponent implements OnInit {
  counter = 0;
  editing$: PointEditorObservable;
  enableEditing = true;
  tileset: any;
  tilesLocation = {longitude: 0.5433407074863252, latitude: 0.523107775892968, height: 450};

  constructor(private pointEditor: PointsEditorService) {
  }

  ngOnInit(): void {
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.pointEditor.create();
    this.editing$.subscribe((editUpdate: PointEditUpdate) => {

      if (editUpdate.editAction === EditActions.ADD_LAST_POINT) {
        console.log(editUpdate.point); // point = position with id
        console.log(editUpdate.position); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
      if (editUpdate.editAction === EditActions.DRAG_POINT_FINISH) {
        console.log(editUpdate.point); // point = position with id
        console.log(editUpdate.position); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
  }

  stopEdit() {
    if (this.editing$) {
      this.editing$.dispose();
      this.editing$ = undefined;
      this.enableEditing = true;
    }
  }


  editFromExisting() {
    if (this.editing$) {
      this.stopEdit();
    }
    const initialPos = Cartesian3.fromDegrees(-80, 35);
    this.editing$ = this.pointEditor.edit(initialPos, {
      pointProps: {
        color: Color.WHITE.withAlpha(0.5),
        outlineColor: Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 10,
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
      },
    });
    this.editing$.setLabelsRenderFn((update: PointEditUpdate) => {

      const newLabels: LabelProps[] = [];
      newLabels.push({
        text: `Point (${update.position.x},${update.position.y})`,
        scale: 0.6,
        eyeOffset: new Cartesian3(10, 10, -1000),
        fillColor: Color.BLUE,
      });
      return newLabels;
    });
    setTimeout(() => {
      if (this.editing$) {
        return this.editing$.updateLabels(
          this.editing$.getLabels().map(label => {
            label.text += '*';
            label.fillColor = Color.RED;
            label.showBackground = true;
            return label;
          })
        )
      }
    }, 2000);
    this.editing$.subscribe((editUpdate: PointEditUpdate) => {
      if (editUpdate.editAction === EditActions.DRAG_POINT) {
        console.log(editUpdate.point); // point = position with id
        console.log(editUpdate.position); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
    this.editing$.subscribe((editUpdate: PointEditUpdate) => {

      if (editUpdate.editAction === EditActions.DRAG_POINT_FINISH) {
        console.log(editUpdate.point); // point = position with id
        console.log(editUpdate.position); // or just position
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
      // this.pointEditor.enableAll();
    } else {
      this.editing$.disable();
      // this.pointEditor.disableAll();
    }
  }

  updatePointManually() {
    if (this.editing$ && this.enableEditing) {
      // Only effects if in edit mode
      // update current point
      const point = this.editing$.getCurrentPoint();
      point.setPosition(Cartesian3.fromDegrees(20, 20));
      console.log("pos: "+point.getPosition())
      const newUpdatedPoints = {
        position: point.getPosition(),
        pointProp: point.props,
      };
      this.editing$.setManually(newUpdatedPoints);

    }
  }
}
