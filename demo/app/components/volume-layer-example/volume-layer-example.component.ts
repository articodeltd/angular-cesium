import { from, Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { AcNotification, ActionType } from 'angular-cesium';
import { MockDataProviderService } from '../../utils/services/dataProvider/mock-data-provider.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'volume-layer-example',
  template: `
      <ac-layer acFor="let entity of entities$" [context]="this">
          <ac-polyline-volume-desc props="{
														positions: entity.positions,
														shape: entity.shape,
														material: entity.material,
														cornerType: entity.cornerType,
														outline: !!entity.outline
														}">
          </ac-polyline-volume-desc>
      </ac-layer>
  `,
  providers: []
})
export class VolumeLayerExampleComponent implements OnInit {

  entities$: Observable<AcNotification>;
  Cesium = Cesium;
  show = true;
  entities = [
    {
      id: '1',
      positions: Cesium.Cartesian3.fromDegreesArray([-85.0, 32.0,
        -85.0, 36.0,
        -89.0, 36.0]),
      shape: this.computeCircle(60000.0),
      cornerType: Cesium.CornerType.BEVELED,
      material: Cesium.Color.RED
    },
    {
      id: '2',
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([-90.0, 32.0, 0.0,
        -90.0, 36.0, 100000.0,
        -94.0, 36.0, 0.0]),
      shape: [new Cesium.Cartesian2(-50000, -50000),
        new Cesium.Cartesian2(50000, -50000),
        new Cesium.Cartesian2(50000, 50000),
        new Cesium.Cartesian2(-50000, 50000)],
      cornerType: Cesium.CornerType.BEVELED,
      material: Cesium.Color.GREEN.withAlpha(0.5),
      outline: true
    },
    {
      id: '3',
      positions: Cesium.Cartesian3.fromDegreesArrayHeights([-95.0, 32.0, 0.0,
        -95.0, 36.0, 100000.0,
        -99.0, 36.0, 200000.0]),
      shape: this.computeStar(7, 70000, 50000),
      cornerType: Cesium.CornerType.MITERED,
      material: Cesium.Color.BLUE,
      outline: true
    }
  ];

  constructor(private dataProvider: MockDataProviderService) {
  }

  ngOnInit() {
    this.entities$ = from(this.entities).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }

  computeCircle(radius) {
    const positions = [];
    for (let i = 0; i < 360; i++) {
      const radians = Cesium.Math.toRadians(i);
      positions.push(new Cesium.Cartesian2(radius * Math.cos(radians), radius * Math.sin(radians)));
    }
    return positions;
  }

  computeStar(arms, rOuter, rInner) {
    const angle = Math.PI / arms;
    const length = 2 * arms;
    const positions = new Array(length);
    for (let i = 0; i < length; i++) {
      const r = (i % 2) === 0 ? rOuter : rInner;
      positions[i] = new Cesium.Cartesian2(Math.cos(i * angle) * r, Math.sin(i * angle) * r);
    }
    return positions;
  }

}
