import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcLayerComponent, AcNotification } from 'angular-cesium';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';

@Component({
  selector: 'point-layer',
  templateUrl: 'point-layer.component.html',
  styleUrls: [],
})
export class PointLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  points$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private tracksDataProvider: TracksDataProvider) {
  }

  ngOnInit() {
    this.points$ = this.tracksDataProvider.get();
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }

}
