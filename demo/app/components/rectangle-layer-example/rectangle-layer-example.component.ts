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
    this.rectangles$ = observableFrom([
      {
        id: '0',
        entity: new AcEntity({
          coordinates: new Cesium.Rectangle(
            -1.88496,
            0.436332,
            -1.74533,
            0.523599
          ),
          extrudedHeight: 0,
          height: 0,
          material: Cesium.Color.ORANGE.withAlpha(0.5),
          outline: true,
          outlineColor: Cesium.Color.BLACK
        }),
        actionType: ActionType.ADD_UPDATE
      }
    ]).pipe(merge(this.updater));

  }
}
