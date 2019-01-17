import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
  selector: 'dynamic-circle-layer',
  templateUrl: 'dynamic-circle-layer.component.html',
  styleUrls: ['dynamic-circle-layer.component.css'],
  providers: [TracksDataProvider]
})
export class DynamicCircleLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

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
