import { BehaviorSubject, Observable } from 'rxjs';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Rectangle, Color } from 'cesium';
import { AcEntity, AcLayerComponent, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'rectangle-layer-example',
  template: `
      <ac-layer acFor="let rectangle of rectangles$" [context]="this" [show]="true">
          <ac-rectangle-desc props="{
              coordinates: rectangle.coordinates,
              material: rectangle.material,
              height: rectangle.height,
              outline: rectangle.outline,
              outlineColor: rectangle.outlineColor,
              extrudedHeight: rectangle.extrudedHeight,
              show: rectangle.show
        }">
          </ac-rectangle-desc>
      </ac-layer>


  `,
})
export class RectangleLayerExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  rectangles$: Observable<AcNotification>;
  show = true;
  initialValue = {
    id: '0',
    entity: new AcEntity({
      coordinates: new Rectangle(
        -1.88496,
        0.436332,
        -1.74533,
        0.523599
      ),
      extrudedHeight: 0,
      height: 0,
      material: Color.ORANGE.withAlpha(0.5),
      outline: true,
      outlineColor: Color.BLACK
    }),
    actionType: ActionType.ADD_UPDATE
  };
  updater = new BehaviorSubject<AcNotification>(this.initialValue);

  constructor() {
  }

  ngOnInit() {
    this.rectangles$ = this.updater.asObservable();
  }
}
