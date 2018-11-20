import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraService, CesiumService } from '../../../../src/angular-cesium';
import { PolylineEditorObservable } from '../../../../src/angular-cesium-widgets/models/polyline-editor-observable';
import {
  RangeAndBearingComponent,
  CirclesEditorService,
  EllipsesEditorService,
  PolygonsEditorService,
  HippodromeEditorService,
} from '../../../../src/angular-cesium-widgets';
import { ZoomToRectangleService } from '../../../../src/angular-cesium-widgets/services/zoom-to-rectangle.service';

@Component({
  selector: 'toolbar-example',
  templateUrl: 'toolbar-example.component.html',
  providers: [ZoomToRectangleService, CirclesEditorService, EllipsesEditorService, PolygonsEditorService, HippodromeEditorService],
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
    private hippodromesEditor: HippodromeEditorService,
  ) {
    this.zoomToRectangleService.init(cesiumService, cameraService);
  }

  ngOnInit() {}

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
    this.cameraService.cameraFlyTo({ destination: Cesium.Cartesian3.fromDegrees(35.21, 31.77, 200000) });
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

  drawHippodrome() {
    this.hippodromesEditor.create();
  }
}
