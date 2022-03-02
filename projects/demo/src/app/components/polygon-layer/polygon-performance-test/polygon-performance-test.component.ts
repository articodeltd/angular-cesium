import { Observable, range as observableRange } from 'rxjs';

import { map } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { Color, Cartesian3 } from 'cesium';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';

@Component({
  selector: 'polygon-performance-test',
  template: `
    <ac-layer acFor="let polygon of polygons$" [context]="this" [show]="true">
      <ac-polygon-desc props="{
        hierarchy: polygon.hierarchy,
        material: polygon.material,
        height: polygon.height,
        outline: true,
    		}">
      </ac-polygon-desc>
  `,
})
export class PolygonPerformanceTestComponent implements OnInit {

  COUNT = 10000;
  POLYGON_POINTS_NUM = 500;
  polygons$: Observable<AcNotification>;
  show = true;

  constructor() {
  }

  ngOnInit() {
    this.polygons$ = observableRange(1, this.COUNT).pipe(map(index => {
      const entity = new AcEntity({
        hierarchy: this.createPosition(index),
        material: Color.fromRandom(),
        height: 0,

      });
      return {
        entity,
        id: index.toString(),
        actionType: ActionType.ADD_UPDATE,
      } as AcNotification;
    }));
  }

  createPosition(index: number) {
    const degArray = [];

    const initialLat = (index / 1000) * 10;
    let lat = 40 - initialLat;
    let lon = -100 + index * 2;
    for (let i = 0; i < this.POLYGON_POINTS_NUM; i++) {
      const quarter = Math.floor(i / (this.POLYGON_POINTS_NUM / 4));
      const latSign = quarter === 2 || quarter === 3 ? 1 : -1;
      const lonSign = quarter === 0 || quarter === 3 ? 1 : -1;


      lat = lat + (latSign * 0.01);
      lon = lon + (lonSign * 0.01);
      degArray.push(lon, lat);
    }

    return Cartesian3.fromDegreesArray(degArray);
  }
}
