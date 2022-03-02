import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Color, Cartesian3 } from 'cesium';
import { CoordinateConverter, EllipseEditorObservable, EllipseEditUpdate, EllipsesEditorService, LabelProps } from 'angular-cesium';

@Component({
  selector: 'ellipses-editor-example',
  templateUrl: 'ellipses-editor-example.component.html',
  styleUrls: ['./ellipses-editor-example.component.css'],
  providers: [EllipsesEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EllipsesEditorExampleComponent implements OnInit {
  editing$: EllipseEditorObservable;
  enableEditing = true;

  constructor(private ellipsesEditor: EllipsesEditorService,
              private coordinateConverter: CoordinateConverter) {
  }

  ngOnInit(): void {
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.ellipsesEditor.create( );
    this.editing$.setLabelsRenderFn((update: EllipseEditUpdate) => {
      const newLabels: LabelProps[] = [];
      newLabels.push(
        {text: ''},
        {
          text: Math.round(update.majorRadius).toString() + 'm',
          scale: 0.5,
          fillColor: Color.BLUE,
        },
      );

      if (update.minorRadius > 0) {
        newLabels.push({
          text: Math.round(update.majorRadius).toString() + 'm',
          scale: 0.5,
          fillColor: Color.BLUE,
        });
      }
      return newLabels;
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
    this.editing$ = this.ellipsesEditor.edit(Cartesian3.fromDegrees(-70, 0), 800000, 20, 400000);
    this.editing$.setLabelsRenderFn((update: EllipseEditUpdate) => {
      const newLabels: LabelProps[] = [];
      newLabels.push(
        {text: ''},
        {
          text: Math.round(update.majorRadius).toString() + 'm',
          scale: 0.3,
          fillColor: Color.BLUE,
        },
      );

      if (update.minorRadius > 0) {
        newLabels.push({
          text: Math.round(update.minorRadius).toString() + 'm',
          scale: 0.3,
          fillColor: Color.BLUE,
        });
      }
      return newLabels;
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

  updateEllipseManually() {
    if (this.editing$) {
      this.editing$.setManually(Cartesian3.fromDegrees(-80, 0), 500000, 300000);
    }
  }
}
