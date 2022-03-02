import { Observable, of, of as observableOf } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Cartesian3 } from 'cesium';
import { AcNotification, ActionType, CesiumService } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'ellipsoid-layer-example',
  template: `
    <ac-layer acFor="let entity of entities$" [context]="this" [debug]="true">
      <ac-ellipsoid-desc props="{
														position: entity.position,
                            radii: defaultRadii,
                            material: Color.RED.withAlpha(0.5),
                            outline: true,
                            outlineColor: Color.BLACK
														}">
      </ac-ellipsoid-desc>
    </ac-layer>
  `,
  providers: []
})
export class EllipsoidLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;
  defaultRadii = new Cartesian3(300000.0, 300000.0, 300000.0);

  constructor(private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.entities$ = this.dataProvider.get$(1).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }
}
