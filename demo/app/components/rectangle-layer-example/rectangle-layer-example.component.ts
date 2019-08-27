import { from as observableFrom, Observable, Subject } from 'rxjs';
import { merge } from 'rxjs/operators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { AcEntity, AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'rectangle-layer-example',
  templateUrl: 'rectangle-layer-example.component.html',
})
export class RectangleLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent, {static: false}) layer: AcLayerComponent;

  rectangles$: Observable<AcNotification>;
  show = true;
  updater = new Subject<AcNotification>();

  constructor() {
  }

  ngOnInit() {
    const entX: any = new AcEntity({
      coordinates: new Cesium.Rectangle(
        -115.0,
        32.0,
        -102.0,
        35.0
      ),
      outline: true,
      outlineColor: Cesium.Color.BLUE,
      fill: true,
      material: Cesium.Color.TRANSPARENT,
    });

    const entY: any = new AcEntity({
      coordinates: new Cesium.Rectangle(
        -108.0,
        40.0,
        -104.0,
        42.0
      ),
      outline: true,
      outlineColor: Cesium.Color.BLUE,
      fill: true,
      material: Cesium.Color.TRANSPARENT,

    });
    this.rectangles$ = observableFrom([
      {
        id: '0',
        entity: new AcEntity({
          coordinates: new Cesium.Rectangle(
            -108.0,
            25.0,
            -100.0,
            30.0
          ),
          extrudedHeight: 0,
          perPositionHeight: true,
          material: Cesium.Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }),
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
      entX.outlineColor = Cesium.Color.RED;
      entX.material = Cesium.Color.BLUE;
      this.updater.next({
        id: 'x',
        actionType: ActionType.ADD_UPDATE,
        entity: entX
      });
    }, 4500);

    setTimeout(() => {
      entY.outlineColor = Cesium.Color.RED;
      entY.material = Cesium.Color.YELLOW;
      this.updater.next({
        id: 'y',
        actionType: ActionType.ADD_UPDATE,
        entity: entY
      });
    }, 5000);
  }
}
