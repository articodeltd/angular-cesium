import { from as observableFrom, Observable, Subject } from 'rxjs';

import { merge } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Cartesian3, Color } from 'cesium';
import { AcEntity, AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'polygon-layer-example',
  template: `
      <ac-layer acFor="let polygon of polygons$" [context]="this" [show]="true">
          <ac-polygon-desc props="{
            hierarchy: polygon.hierarchy,
            material: polygon.material,
            height: polygon.height,
            outline: polygon.outline,
            outlineColor: polygon.outlineColor,
            extrudedHeight: polygon.extrudedHeight,
            perPositionHeight: polygon.perPositionHeight,
            show: polygon.show
    }">
          </ac-polygon-desc>
      </ac-layer>

  `,
})
export class PolygonLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  polygons$: Observable<AcNotification>;
  show = true;
  updater = new Subject<AcNotification>();

  constructor() {
  }

  ngOnInit() {
    const entX: any = new AcEntity({
      hierarchy: Cartesian3.fromDegreesArray([
        -115.0, 37.0,
        -115.0, 32.0,
        -107.0, 33.0,
        -102.0, 31.0,
        -102.0, 35.0]),
      outline: true,
      outlineColor: Color.BLUE,
      fill: true,
      perPositionHeight: true,
      material: Color.TRANSPARENT,
    });

    const entY: any = new AcEntity({
      hierarchy: Cartesian3.fromDegreesArray([
        -108.0, 42.0,
        -100.0, 42.0,
        -104.0, 40.0,
      ]),
      outline: true,
      outlineColor: Color.BLUE,
      fill: true,
      perPositionHeight: true,
      material: Color.TRANSPARENT,

    });
    this.polygons$ = observableFrom([
      {
        id: '0',
        entity: new AcEntity({
          hierarchy: Cartesian3.fromDegreesArrayHeights([-108.0, 25.0, 100000,
            -100.0, 25.0, 100000,
            -100.0, 30.0, 100000,
            -108.0, 30.0, 300000]),
          extrudedHeight: 0,
          perPositionHeight: true,
          material: Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Color.BLACK
        }),
        actionType: ActionType.ADD_UPDATE
      },
      {
        id: '1',
        entity: new AcEntity({
            hierarchy: {
              positions: Cartesian3.fromDegreesArray([-99.0, 30.0,
                -85.0, 30.0,
                -85.0, 40.0,
                -99.0, 40.0]),
              holes: [{
                positions: Cartesian3.fromDegreesArray([
                  -97.0, 31.0,
                  -97.0, 39.0,
                  -87.0, 39.0,
                  -87.0, 31.0
                ]),
                holes: [{
                  positions: Cartesian3.fromDegreesArray([
                    -95.0, 33.0,
                    -89.0, 33.0,
                    -89.0, 37.0,
                    -95.0, 37.0
                  ]),
                  holes: [{
                    positions: Cartesian3.fromDegreesArray([
                      -93.0, 34.0,
                      -91.0, 34.0,
                      -91.0, 36.0,
                      -93.0, 36.0
                    ])
                  }]
                }]
              }]
            },
            material: Color.BLUE.withAlpha(0.5),
            height: 0,
            outline: true
          }
        ),
        actionType: ActionType.ADD_UPDATE
      }
    ]).pipe(merge(this.updater));

    setTimeout(() => {
      entX.show = true;
      this.updater.next({
        id: 'x',
        actionType: ActionType.ADD_UPDATE,
        entity: entX
      });
    }, 3000);

    setTimeout(() => {
      entY.show = true;
      this.updater.next({
        id: 'y',
        actionType: ActionType.ADD_UPDATE,
        entity: entY
      });
    }, 3000);

    setTimeout(() => {
      entX.show = false;
      this.updater.next({
        id: 'x',
        actionType: ActionType.ADD_UPDATE,
        entity: entX
      });
    }, 4000);


    setTimeout(() => {
      entX.show = true;
      entX.outlineColor = Color.RED;
      entX.material = Color.BLUE;
      this.updater.next({
        id: 'x',
        actionType: ActionType.ADD_UPDATE,
        entity: entX
      });
    }, 4500);

    setTimeout(() => {
      entY.outlineColor = Color.RED;
      entY.material = Color.YELLOW;
      this.updater.next({
        id: 'y',
        actionType: ActionType.ADD_UPDATE,
        entity: entY
      });
    }, 5000);
  }
}
