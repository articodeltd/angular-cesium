import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Color, Cartesian3 } from 'cesium';
import { CircleEditorObservable, CircleEditUpdate, CirclesEditorService, LabelProps } from 'angular-cesium';

@Component({
  selector: 'circles-editor-example',
  templateUrl: 'circles-editor-example.component.html',
  styleUrls: ['./circles-editor-example.component.css'],
  providers: [CirclesEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CirclesEditorExampleComponent implements OnInit {

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
    this.editing$ = this.circlesEditor.edit(Cartesian3.fromDegrees(-70, 0), 800000);
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
          eyeOffset: new Cartesian3(10, 10, -1000),
          fillColor: Color.BLUE,
        },
        {
          text: Math.round(update.radius).toString(),
          scale: 0.6,
          eyeOffset: new Cartesian3(10, 10, -1000),
          fillColor: Color.RED,
        },
      );
      return newLabels;
    });
    setTimeout(() =>
      this.editing$.updateLabels(
        this.editing$.getLabels().map(label => {
          label.text += '*';
          label.fillColor = Color.YELLOW;
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
      this.editing$.setManually(Cartesian3.fromDegrees(-80, 0), 500000);
    }
  }
}
