import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'models-layer-example',
  template: `
    <ac-layer acFor="let track of entities$" [context]="this">
      <ac-model-desc props="{
                              position: track.position,
                              minimumPixelSize: 100,
                              maximumScale : 20000,
                              uri: 'http://www.angular-cesium.com/assets/CesiumAir/Cesium_Air.gltf',
														}">
      </ac-model-desc>
    </ac-layer>
  `,
})
export class ModelsLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;

  constructor(private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.entities$ = this.dataProvider.get$(50).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }


}
