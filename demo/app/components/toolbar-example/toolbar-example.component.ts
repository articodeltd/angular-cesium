import { Component, OnInit } from '@angular/core';
import { CameraService } from '../../../../src/angular-cesium/services/camera/camera.service';

@Component({
  selector : 'toolbar-example',
  templateUrl : 'toolbar-example.component.html',
})
export class ToolbarExampleComponent implements OnInit {
  
  constructor(private cameraService: CameraService) {
  }
  
  ngOnInit() {
  }
  
  rangeAndBearing() {
  
  }
  
  goHome() {
    this.cameraService.cameraFlyTo({destination : Cesium.Cartesian3.fromDegrees( 35.21, 31.77, 200000)})
  }
  
}
