import { Component, OnInit, ViewChild } from '@angular/core';
import { CameraService } from '../../../../src/angular-cesium';
import { PolylineEditorObservable } from '../../../../src/angular-cesium-widgets/models/polyline-editor-observable';
import { RangeAndBearingComponent } from '../../../../src/angular-cesium-widgets';

@Component({
  selector: 'toolbar-example',
  templateUrl: 'toolbar-example.component.html',
})
export class ToolbarExampleComponent implements OnInit {

  rnb: PolylineEditorObservable;
  @ViewChild('rangeAndBearing') private rangeAndBearing: RangeAndBearingComponent;

  constructor(private cameraService: CameraService) {
  }

  ngOnInit() {
  }

  createRangeAndBearing() {
    if (this.rnb) {
      this.rnb.dispose();
    }

    this.rnb = this.rangeAndBearing.create();
  }

  goHome() {
    this.cameraService.cameraFlyTo({ destination: Cesium.Cartesian3.fromDegrees(35.21, 31.77, 200000) })
  }

}
