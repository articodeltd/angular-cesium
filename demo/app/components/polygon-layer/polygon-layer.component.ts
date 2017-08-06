import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification } from '../../../../src/models/ac-notification';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcEntity } from '../../../../src/models/ac-entity';

@Component({
  selector: 'polygon-layer',
  templateUrl: 'polygon-layer.component.html',
  styleUrls: ['polygon-layer.component.css'],
})
export class PolygonLayerComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  polygons$: Observable<AcNotification>;
  show = true;

  constructor() {
  }

  ngOnInit() {
    this.polygons$ = Observable.from([
      {
        id: '0',
        entity: new AcEntity({
          hierarchy: Cesium.Cartesian3.fromDegreesArray([-115.0, 37.0,
            -115.0, 32.0,
            -107.0, 33.0,
            -102.0, 31.0,
            -102.0, 35.0]),
          material: Cesium.Color.RED

        }),
        actionType: ActionType.ADD_UPDATE
      },
      {
        id: '1',
        entity: new AcEntity({
          hierarchy: Cesium.Cartesian3.fromDegreesArray([-108.0, 42.0,
            -100.0, 42.0,
            -104.0, 40.0]),
          extrudedHeight: 500000.0,
          material: Cesium.Color.GREEN,
          closeTop: false,
          closeBottom: false
        }),
        actionType: ActionType.ADD_UPDATE
      },
      {
        id: '2',
        entity: new AcEntity({
          hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([-108.0, 25.0, 100000,
            -100.0, 25.0, 100000,
            -100.0, 30.0, 100000,
            -108.0, 30.0, 300000]),
          extrudedHeight: 0,
          perPositionHeight: true,
          material: Cesium.Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }),
        actionType: ActionType.ADD_UPDATE
      },
      {
        id: '3',
        entity: new AcEntity({
          hierarchy: {
            positions: Cesium.Cartesian3.fromDegreesArray([-99.0, 30.0,
              -85.0, 30.0,
              -85.0, 40.0,
              -99.0, 40.0]),
            holes: [{
              positions: Cesium.Cartesian3.fromDegreesArray([
                -97.0, 31.0,
                -97.0, 39.0,
                -87.0, 39.0,
                -87.0, 31.0
              ]),
              holes: [{
                positions: Cesium.Cartesian3.fromDegreesArray([
                  -95.0, 33.0,
                  -89.0, 33.0,
                  -89.0, 37.0,
                  -95.0, 37.0
                ]),
                holes: [{
                  positions: Cesium.Cartesian3.fromDegreesArray([
                    -93.0, 34.0,
                    -91.0, 34.0,
                    -91.0, 36.0,
                    -93.0, 36.0
                  ])
                }]
              }]
            }]
          },
          material: Cesium.Color.BLUE.withAlpha(0.5),
          height: 0,
          outline: true
        }),
        actionType: ActionType.ADD_UPDATE
      }
    ]);
  }
}
