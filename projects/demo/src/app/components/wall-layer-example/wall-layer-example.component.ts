import { from, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { Color, Cartesian3 } from 'cesium';
import { AcNotification, ActionType } from 'angular-cesium';
import { map } from 'rxjs/operators';

@Component({
  selector: 'wall-layer-example',
  template: `
      <ac-layer acFor="let entity of entities$" [context]="this">
          <ac-wall-desc props="{
														positions: entity.positions,
														minimumHeights: entity.minimumHeights,
														material: entity.material,
														outline: !!entity.outline
														}">
          </ac-wall-desc>
      </ac-layer>
  `,
  providers: []
})
export class WallLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;
  entities = [
    {
      id: '1',
      positions : Cartesian3.fromDegreesArrayHeights([-115.0, 44.0, 200000.0,
        -90.0, 44.0, 200000.0]),
      minimumHeights : [100000.0, 100000.0],
      material : Color.RED
    },
    {
      id: '2',
      positions : Cartesian3.fromDegreesArrayHeights([-107.0, 43.0, 100000.0,
        -97.0, 43.0, 100000.0,
        -97.0, 40.0, 100000.0,
        -107.0, 40.0, 100000.0,
        -107.0, 43.0, 100000.0]),
      material : Color.GREEN,
      outline : true
    },
  ];

  constructor() {
  }

  ngOnInit() {
    this.entities$ = from(this.entities).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }

}
