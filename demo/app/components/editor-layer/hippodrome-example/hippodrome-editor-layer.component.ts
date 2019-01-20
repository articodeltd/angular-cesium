import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { EditActions, HippodromeEditorObservable, HippodromeEditorService, HippodromeEditUpdate, LabelProps } from 'angular-cesium';

@Component({
  selector: 'hippodrome-editor-layer',
  templateUrl: 'hippodrome-editor-layer.component.html',
  styleUrls: ['./hippodrome-editor-layer.component.css'],
  providers: [HippodromeEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HippodromeEditorLayerComponent implements OnInit {
  editing$: HippodromeEditorObservable;
  enableEditing = true;

  constructor(private hippodromeEditor: HippodromeEditorService) {
  }

  ngOnInit(): void {
    // this.startEdit();
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.hippodromeEditor.create({
      hippodromeProps: {
        outline: true,
        outlineWidth: 2,
      },
    });
    this.editing$.subscribe((editUpdate: HippodromeEditUpdate) => {

      if (editUpdate.editAction === EditActions.DRAG_POINT || editUpdate.editAction === EditActions.ADD_POINT) {
        console.log('width', this.editing$.getCurrentWidth());
        console.log('positions', this.editing$.getCurrentPoints());

        // or
        console.log('width', editUpdate.width);
        console.log('positions', editUpdate.points); // cartesian3
      }
    });
  }

  stopEdit() {
    this.editing$.dispose();
  }


  editFromExisting() {
    if (this.editing$) {
      this.stopEdit();
    }
    const initialPos = [
      Cesium.Cartesian3.fromDegrees(20, 40),
      Cesium.Cartesian3.fromDegrees(30, 20)];
    this.editing$ = this.hippodromeEditor.edit(initialPos);
    this.editing$.setLabelsRenderFn((update: HippodromeEditUpdate) => {
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
    this.editing$.subscribe((editUpdate: HippodromeEditUpdate) => {
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
      // Only effects if in edit mode (after initial shape was created)
      const hippodromePoints = this.editing$.getCurrentPoints();

      const firstPointPos = hippodromePoints[0].getPosition();
      const newSecondPos = Cesium.Cartesian3.fromDegrees(20, 20);
      const newWidth = 250000.0;
      this.editing$.setManually(firstPointPos, newSecondPos, newWidth);
    }
  }
}
