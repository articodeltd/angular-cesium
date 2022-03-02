import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { Color } from 'cesium';
import { AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'point-layer-example',
  template: `
      <ac-layer acFor="let point of entities$" [context]="this" [show]="show">
          <ac-point-desc props="{
              position: point.position,
              pixelSize : 10,
              outlineColor: Color.CORNFLOWERBLUE,
              outlineWidth: 2,
           }">
          </ac-point-desc>
      </ac-layer>
  `,
  styleUrls: [],
})
export class PointLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  Cesium = Cesium;
  entities$: Observable<AcNotification>;
  show = true;

  constructor(private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.entities$ = this.dataProvider.getDataSteam$().pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }

}
