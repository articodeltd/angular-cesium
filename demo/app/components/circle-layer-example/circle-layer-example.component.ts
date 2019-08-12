import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
  selector: 'circle-layer-example',
  templateUrl: 'circle-layer-example.component.html',
  styleUrls: ['circle-layer-example.component.css'],
  providers: [TracksDataProvider]
})
export class DynamicCircleLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent, {static: false}) layer: AcLayerComponent;

  circles$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private tracksDataProvider: TracksDataProvider) {
  }

  ngOnInit() {
    this.circles$ = this.tracksDataProvider.get();
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }
}
