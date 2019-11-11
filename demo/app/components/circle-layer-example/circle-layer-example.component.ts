import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'circle-layer-example',
  templateUrl: 'circle-layer-example.component.html',
  styleUrls: ['circle-layer-example.component.css'],
  providers: [TracksDataProvider]
})
export class CircleLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent, {static: false}) layer: AcLayerComponent;

  circles$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private tracksDataProvider: TracksDataProvider, private mockDataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.circles$ = this.mockDataProvider.getDataSteam$().pipe(map(entity => ({
        id: entity.id,
        actionType: ActionType.ADD_UPDATE,
        entity: entity,
      }
    )));
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }
}
