import { Observable, of, of as observableOf } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType, CesiumService } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'cylinder-layer-example',
  template: `
    <ac-layer acFor="let entity of entities$" [context]="this">
      <ac-cylinder-desc props="{
														position: entity.position,
														length : 400000.0,
                            topRadius : 200000.0,
                            bottomRadius : 200000.0,
                            material : Color.GREEN.withAlpha(0.5),
														}">
      </ac-cylinder-desc>
    </ac-layer>
  `,
  providers: []
})
export class CylinderLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.entities$ = this.dataProvider.get$(20).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }
}
