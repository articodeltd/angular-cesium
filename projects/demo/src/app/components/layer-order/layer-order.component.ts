import { Observable, of as observableOf } from 'rxjs';

import { filter, map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { AcEntity, AcNotification, ActionType, CesiumEvent, MapEventsManagerService, PickOptions } from 'angular-cesium';
import { TracksDataProvider } from '../../utils/services/dataProvider/tracksDataProvider.service';
import { WebSocketSupplier } from '../../utils/services/webSocketSupplier/webSocketSupplier';

@Component({
  selector: 'layer-order-example',
  template: `
    <ac-layer acFor="let track of simTracks1$" [context]="this" [zIndex]="firstZIndex">
      <ac-ellipse-desc props="{
														position: track.position,
														semiMajorAxis:450000.0,
														semiMinorAxis:280000.0,
														granularity:0.014,
														material: Cesium.Color.GREEN
					}"></ac-ellipse-desc>
    </ac-layer>

    <ac-layer acFor="let track of simTracks2$" [context]="this" [zIndex]="secondZIndex">
      <ac-ellipse-desc props="{
														position: track.position,
														semiMajorAxis:500000.0,
														semiMinorAxis:200000.0,
														granularity:0.014,
														material: Cesium.Color.RED
					}"></ac-ellipse-desc>
    </ac-layer>

    <ac-layer acFor="let polygon of polygons$" [context]="this" [zIndex]="thirdZIndex">
      <ac-polygon-desc props="{
														hierarchy: polygon.hierarchy,
                            material: polygon.material
					}"></ac-polygon-desc>
    </ac-layer>

    <button mat-raised-button style="position: fixed; top: 200px;left: 200px" (click)="changeZIndex()">
      change order
    </button>
  `,
  providers: [TracksDataProvider]
})
export class LayerOrderComponent implements OnInit {

  Cesium = Cesium;
  simTracks1$: Observable<AcNotification> = observableOf({
    id: '1',
    actionType: ActionType.ADD_UPDATE,
    entity: new AcEntity({
      position: Cesium.Cartesian3.fromDegrees(-90, 40),
    })
  });
  simTracks2$: Observable<AcNotification> = observableOf({
    id: '2',
    actionType: ActionType.ADD_UPDATE,
    entity: new AcEntity({
      position: Cesium.Cartesian3.fromDegrees(-90, 40),
    })
  });

  polygons$: Observable<AcNotification> = observableOf({
    id: '30',
    entity: new AcEntity({
      hierarchy: Cesium.Cartesian3.fromDegreesArrayHeights([-90, 40, 0,
        -100.0, 25.0, 0,
        -100.0, 30.0, 0,
        -108.0, 30.0, 0]),
      perPositionHeight: false,
      material: Cesium.Color.ORANGE,
      outline: true,
      outlineColor: Cesium.Color.BLACK,
    }),
    actionType: ActionType.ADD_UPDATE
  });

  show = true;
  firstZIndex = 0;
  secondZIndex = 1;
  thirdZIndex = 2;

  constructor(webSocketSupllier: WebSocketSupplier, private eventManager: MapEventsManagerService) {
  }

  ngOnInit() {
    this.eventManager.register({
      event: CesiumEvent.LEFT_CLICK,
      pick: PickOptions.PICK_FIRST
    }).pipe(
      map((result) => result.cesiumEntities),
      filter(result => result !== null && result !== undefined), )
      .subscribe((result) => {
        console.log(result[0]);
        alert(result[0].ellipse.material.color._value);
      });
  }

  changeZIndex() {
    this.firstZIndex = (this.firstZIndex + 1) % 3;
    this.secondZIndex = (this.secondZIndex + 1) % 3;
    this.thirdZIndex = (this.thirdZIndex + 1) % 3;
  }
}
