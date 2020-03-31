import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';
import { Observable } from 'rxjs';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'circle-layer-example',
  templateUrl: 'circle-layer-example.component.html',
  styleUrls: ['circle-layer-example.component.css'],
})
export class CircleLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  circles$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private mockDataProvider: MockDataProviderService) {
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
