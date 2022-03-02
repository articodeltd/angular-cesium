import { Component, OnInit } from '@angular/core';
import { Cartesian3 } from 'cesium';
import {
  CameraService,
  CesiumService, EditActions, LabelProps,
  MapEventsManagerService,
  MapsManagerService,
  PolylineEditUpdate,
  RectangleEditorObservable, RectangleEditUpdate,
  RectanglesEditorService
} from 'angular-cesium';

@Component({
  selector: 'rectangle-editor-example',
  templateUrl: './rectangle-editor-example.component.html',
  styleUrls: ['./rectangle-editor-example.component.css'],
  providers: [RectanglesEditorService]
})
export class RectangleEditorExampleComponent implements OnInit {

  editing$: RectangleEditorObservable;
  enableEditing = true;

  constructor(private rectangleEditor: RectanglesEditorService,
              private cesiumService: CesiumService,
              private camService: CameraService,
              private m: MapsManagerService,
              private mapsManager: MapEventsManagerService) {
  }

  ngOnInit(): void {
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.rectangleEditor.create();
    this.editing$.subscribe((editUpdate: RectangleEditUpdate) => {

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
      Cartesian3.fromDegrees(-80, 35),
      Cartesian3.fromDegrees(-90, 33)];
    this.editing$ = this.rectangleEditor.edit(initialPos, {
      polylineProps: {
        width: 3,
      },
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

}
