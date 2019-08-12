import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification } from 'angular-cesium';
import { Observable } from 'rxjs';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
  selector: 'ellipse-layer-example',
  templateUrl: 'ellipse-layer-example.component.html',
  styleUrls: ['ellipse-layer-example.component.css'],
  providers: [TracksDataProvider]
})
export class DynamicEllipseLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent, {static: false}) layer: AcLayerComponent;

  ellipses$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private tracksDataProvider: TracksDataProvider) {
  }

  ngOnInit() {
    this.ellipses$ = this.tracksDataProvider.get();
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }
}
