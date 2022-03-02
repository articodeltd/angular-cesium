import { Component, OnInit } from '@angular/core';
import { Color, Cartesian3, PolylineGlowMaterialProperty, PolylineOutlineMaterialProperty } from 'cesium';
import { AcNotification, ActionType } from 'angular-cesium';
import { map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

@Component({
  selector: 'polyline-layer-example',
  template: `
      <ac-layer acFor="let polyline of polylines$" [context]="this" [show]="show">
          <ac-polyline-desc props="{
              width : 8,
              positions: polyline.positions,
              material: polyline.material,
            }">
          </ac-polyline-desc>
      </ac-layer>

  `,
})
export class PolylineLayerExampleComponent implements OnInit {
  polylines$: Observable<AcNotification>;

  entities = [{
    id: '1',
    material: Color.RED.withAlpha(0.5),
    positions: Cartesian3.fromDegreesArray([-75, 35, -125, 35]),
    },
    {
      id: '2',
      material: new PolylineGlowMaterialProperty({
        glowPower: 0.2,
        taperPower: 0.5,
        color: Color.CORNFLOWERBLUE
      }),
      positions: Cartesian3.fromDegreesArray([-75, 37, -125, 37]),
    },
    {
      id: '3',
      material:  new PolylineOutlineMaterialProperty({
        color : Color.ORANGE,
        outlineWidth : 2,
        outlineColor : Color.BLACK
      }),
      positions: Cartesian3.fromDegreesArray([-75, 39, -125, 39]),
    }
  ];
  Cesium = Cesium;
  show = true;

  constructor() {
  }

  ngOnInit() {
    this.polylines$ = from(this.entities).pipe(map(entity => ({
      id: entity.id,
      actionType: ActionType.ADD_UPDATE,
      entity: entity,
    })));
  }

  setShow($event: boolean) {
    this.show = $event;
  }

}
