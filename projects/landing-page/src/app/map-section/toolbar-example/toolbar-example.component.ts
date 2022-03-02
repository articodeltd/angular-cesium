import { Component, OnInit, ViewChild } from '@angular/core';
import { Cartesian3 } from 'cesium';
import {
  CameraService,
  CesiumService,
  CirclesEditorService,
  EllipsesEditorService,
  HippodromeEditorService, PointsEditorService,
  PolygonsEditorService,
  PolylineEditorObservable,
  RangeAndBearingComponent,
  RectanglesEditorService,
  ZoomToRectangleService
} from 'angular-cesium';

@Component({
  selector: 'toolbar-example',
  templateUrl: 'toolbar-example.component.html',
  styleUrls: ['toolbar-example.scss'],
  providers: [
    ZoomToRectangleService,
    CirclesEditorService,
    EllipsesEditorService,
    PolygonsEditorService,
    RectanglesEditorService,
    HippodromeEditorService,
    PointsEditorService,
  ],
})
export class ToolbarExampleComponent implements OnInit {
  rnb: PolylineEditorObservable;
  @ViewChild('rangeAndBearing') private rangeAndBearing: RangeAndBearingComponent;

  constructor(
    private cameraService: CameraService,
    private zoomToRectangleService: ZoomToRectangleService,
    private cesiumService: CesiumService,
    private circlesEditor: CirclesEditorService,
    private ellipsesEditor: EllipsesEditorService,
    private polygonsEditor: PolygonsEditorService,
    private rectanglesEditor: RectanglesEditorService,
    private hippodromesEditor: HippodromeEditorService,
    private pointEditor: PointsEditorService,
  ) {
    this.zoomToRectangleService.init(cesiumService, cameraService);
  }

  ngOnInit() {
  }

  createRangeAndBearing() {
    if (this.rnb) {
      this.rnb.dispose();
    }

    this.rnb = this.rangeAndBearing.create();
  }

  zoomToRectangle() {
    this.zoomToRectangleService.activate();
  }

  goHome() {
    this.cameraService.cameraFlyTo({ destination: Cartesian3.fromDegrees(35.21, 31.77, 200000) });
  }

  drawCircle() {
    this.circlesEditor.create();
  }

  drawEllipse() {
    this.ellipsesEditor.create();
  }

  drawPolygon() {
    this.polygonsEditor.create();
  }

  drawRectangle() {
    this.rectanglesEditor.create({ rectangleProps: { height: undefined, extrudedHeight: undefined } });
  }

  drawHippodrome() {
    this.hippodromesEditor.create({ hippodromeProps: { width: 100 } });
  }

  drawPoint() {
    this.pointEditor.create();
  }
}
