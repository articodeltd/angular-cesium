import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { CircleEditorObservable, CircleEditUpdate, CirclesEditorService, LabelProps } from 'angular-cesium';

@Component({
  selector: 'circles-editor-layer',
  templateUrl: 'circles-editor-layer.component.html',
  styleUrls: ['./circles-editor-layer.component.css'],
  providers: [CirclesEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclesEditorLayerComponent implements OnInit {

  editing$: CircleEditorObservable;
  enableEditing = true;

  constructor(private circlesEditor: CirclesEditorService) {
  }

  ngOnInit(): void {
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.circlesEditor.create();
    this.editing$.subscribe((editUpdate: CircleEditUpdate) => {
      // current edit value
      console.log(editUpdate);
      // or
      console.log('center', this.editing$.getCenter());
      console.log('radius', this.editing$.getRadius());
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
    this.editing$ = this.circlesEditor.edit(Cesium.Cartesian3.fromDegrees(-70, 0), 800000);
    this.editing$.subscribe((editUpdate: CircleEditUpdate) => {
      console.log(editUpdate);
      console.log('center', this.editing$.getCenter());
      console.log('radius', this.editing$.getRadius());
    });
    this.editing$.setLabelsRenderFn((update: CircleEditUpdate) => {
      const newLabels: LabelProps[] = [];
      newLabels.push(
        {
          text: 'Center',
          scale: 0.6,
          eyeOffset: new Cesium.Cartesian3(10, 10, -1000),
          fillColor: Cesium.Color.BLUE,
        },
        {
          text: Math.round(update.radius).toString(),
          scale: 0.6,
          eyeOffset: new Cesium.Cartesian3(10, 10, -1000),
          fillColor: Cesium.Color.RED,
        },
      );
      return newLabels;
    });
    setTimeout(() =>
      this.editing$.updateLabels(
        this.editing$.getLabels().map(label => {
          label.text += '*';
          label.fillColor = Cesium.Color.YELLOW;
          return label;
        })
      ), 2000);
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

  updateCircleManually() {
    if (this.editing$) {
      this.editing$.setManually(Cesium.Cartesian3.fromDegrees(-80, 0), 500000);
    }
  }
}
