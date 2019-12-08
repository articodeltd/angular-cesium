import { from, Observable } from 'rxjs';
import { AfterViewInit, Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { map } from 'rxjs/operators';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';

@Component({
  selector: 'billboard-layer-example',
  template: `
    <ac-layer acFor="let entity of entities$" [context]="this" [debug]="true">
      <ac-billboard-desc props="{ position: entity.position,
                            image : 'https://preview.ibb.co/cpDuwF/angular_cesium.png',
                            scale: 0.1,
														}">
      </ac-billboard-desc>
    </ac-layer>
  `,
})
export class BillboardLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;

  constructor(private dataProvider: MockDataProviderService) {}
  ngOnInit() {
    this.entities$ = this.dataProvider.getDataSteam$().pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }
}
