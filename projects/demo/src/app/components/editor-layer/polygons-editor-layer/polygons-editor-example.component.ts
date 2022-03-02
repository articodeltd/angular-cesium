import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
// tslint:disable-next-line:max-line-length
import { Color, Cartesian3, Cesium3DTileset, IonResource, Math as cMath } from 'cesium';
import {
  CameraService,
  CesiumService,
  EditActions,
  LabelProps,
  PolygonEditorObservable,
  PolygonEditUpdate,
  PolygonsEditorService
} from 'angular-cesium';

@Component({
  selector: 'polygons-editor-example',
  templateUrl: 'polygons-editor-example.component.html',
  styleUrls: ['./polygons-editor-example.component.css'],
  providers: [PolygonsEditorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolygonsEditorExampleComponent implements OnInit {
  editing$: PolygonEditorObservable;
  enableEditing = true;
  tileset: any;
  tilesLocation = {longitude: 0.5433407074863252, latitude: 0.523107775892968, height: 450};

  constructor(private polygonsEditor: PolygonsEditorService, private cesiumService: CesiumService, private camService: CameraService) {
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
    this.editing$ = this.polygonsEditor.create({
      clampHeightTo3D: true
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
      Cartesian3.fromDegrees(20, 40),
      Cartesian3.fromDegrees(45, 40),
      Cartesian3.fromDegrees(30, 20)];
    this.editing$ = this.polygonsEditor.edit(initialPos);
    this.editing$.setLabelsRenderFn((update: PolygonEditUpdate) => {
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
      firstPoint.setPosition(Cartesian3.fromDegrees(20, 20));
      const newUpdatedPoints = polygonPoints.map(p => ({
        position: p.getPosition(),
        pointProps: p.props,
      }));
      this.editing$.setManually(newUpdatedPoints);


      // or add new point
      const polygonPositions = this.editing$.getCurrentPoints().map(p => p.getPosition());
      const newPosition = Cartesian3.fromDegrees(30, 24);
      polygonPositions.push(newPosition);
      this.editing$.setManually(polygonPositions);
    }
  }
}
