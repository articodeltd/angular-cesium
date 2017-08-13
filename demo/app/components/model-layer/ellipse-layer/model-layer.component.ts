import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { TracksDataProvider } from "../../../../utils/services/dataProvider/tracksDataProvider.service";
import { AcLayerComponent } from "../../../../../src/components/ac-layer/ac-layer.component";
import { AcNotification } from "../../../../../src/models/ac-notification";

@Component({
  selector: 'model-layer',
  templateUrl: 'model-layer.component.html',
  styleUrls: ['model-layer.component.css'],
  providers: [TracksDataProvider]
})
export class ModelLayerComponent implements OnInit {
  readonly url: string = 'https://cesiumjs.org/Cesium/Apps/SampleData/models/CesiumAir/Cesium_Air.glb';
  @ViewChild(AcLayerComponent) readonly layer:AcLayerComponent;
  readonly Cesium = Cesium;

  models$:Observable<AcNotification>;
  show = true;

  constructor(private tracksDataProvider:TracksDataProvider) {
  }

  getOrientation(model: any) {
    var heading = Cesium.Math.toRadians(135);
    var pitch = 0;
    var roll = 0;
    var hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll);

    return Cesium.Transforms.headingPitchRollQuaternion(model.position, hpr);
  }

  ngOnInit() {
    this.models$ = this.tracksDataProvider.get();
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event) {
    this.show = $event
  }
}
