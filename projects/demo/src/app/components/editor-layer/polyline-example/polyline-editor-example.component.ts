import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Color, Math as cMath, Cartesian3, Cesium3DTileset, IonResource } from 'cesium';
import {
  CameraService,
  CesiumEvent,
  CesiumService,
  EditActions,
  LabelProps,
  MapEventsManagerService, MapsManagerService,
  PickOptions,
  PolylineEditorObservable,
  PolylineEditUpdate,
  PolylinesEditorService
} from 'angular-cesium';

@Component({
  selector: 'polyline-editor-example',
  templateUrl: 'polyline-editor-example.component.html',
  styleUrls: ['./polyline-editor-example.component.css'],
  providers: [PolylinesEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolylineEditorExampleComponent implements OnInit {

  editing$: PolylineEditorObservable;
  enableEditing = true;
  tileset: any;
  tilesLocation = {longitude: 0.5433407074863252, latitude: 0.523107775892968, height: 450};

  constructor(private polylineEditor: PolylinesEditorService,
              private cesiumService: CesiumService,
              private camService: CameraService,
              private m: MapsManagerService,
              private mapsManager: MapEventsManagerService) {
  }

  ngOnInit(): void {
  }

  startEdit3D() {
    const viewer = this.cesiumService.getViewer();
    if (!this.tileset) {
      this.tileset = viewer.scene.primitives.add(
        new Cesium3DTileset({
          url: IonResource.fromAssetId(29328)
        })
      );
    }
    this.camService.cameraFlyTo({
      destination: Cartesian3.fromRadians(this.tilesLocation.longitude, this.tilesLocation.latitude, this.tilesLocation.height),
      orientation : {
        pitch : cMath.toRadians(-35.0),
      }});

    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.polylineEditor.create({ clampHeightTo3D: true });
    this.editing$.subscribe((editUpdate: PolylineEditUpdate) => {

      // if (editUpdate.editAction === EditActions.ADD_POINT) {
      //   console.log(editUpdate.points); // point = position with id
      //   console.log(editUpdate.positions); // or just position
      //   console.log(editUpdate.updatedPosition); // added position
      // }
    });
  }

  startEdit() {
    if (this.editing$) {
      this.stopEdit();
    }
    this.editing$ = this.polylineEditor.create();
    this.editing$.subscribe((editUpdate: PolylineEditUpdate) => {

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
      Cartesian3.fromDegrees(-90, 33),
      Cartesian3.fromDegrees(-80, 30)];
    this.editing$ = this.polylineEditor.edit(initialPos, {
      polylineProps: {
        width: 3,
      },
    });
    this.editing$.setLabelsRenderFn((update: PolylineEditUpdate) => {
      let counter = 0;
      const newLabels: LabelProps[] = [];
      update.positions.forEach(position => newLabels.push({
        text: `Point ${counter++}`,
        scale: 0.6,
        eyeOffset: new Cartesian3(10, 10, -1000),
        fillColor: Color.BLUE,
      }));
      return newLabels;
    });
    setTimeout(() =>
      this.editing$.updateLabels(
        this.editing$.getLabels().map(label => {
          label.text += '*';
          label.fillColor = Color.RED;
          label.showBackground = true;
          return label;
        })
      ), 2000);
    this.editing$.subscribe((editUpdate: PolylineEditUpdate) => {
      if (editUpdate.editAction === EditActions.DRAG_POINT_FINISH) {
        console.log(editUpdate.points); // point = position with id
        console.log(editUpdate.positions); // or just position
        console.log(editUpdate.updatedPosition); // added position
      }
    });
    this.editing$.subscribe((editUpdate: PolylineEditUpdate) => {

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
      firstPoint.setPosition(Cartesian3.fromDegrees(20, 20));
      const newUpdatedPoints = polylinePoints.map(p => ({
        position: p.getPosition(),
        pointProps: p.props,
      }));
      this.editing$.setManually(newUpdatedPoints);

      // or add new point
      const polylinePositions = this.editing$.getCurrentPoints().map(p => p.getPosition());
      const newPosition = Cartesian3.fromDegrees(30, 24);
      polylinePositions.push(newPosition);
      this.editing$.setManually(polylinePositions);
    }
  }
}
