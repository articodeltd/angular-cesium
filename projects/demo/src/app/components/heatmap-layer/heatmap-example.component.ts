import { Component, OnInit, ViewChild } from '@angular/core';
import { Cartesian3, Rectangle } from 'cesium';
import { AcLayerComponent, AcNotification, ActionType, CesiumService, CoordinateConverter } from 'angular-cesium';
import { Subject } from 'rxjs';
// import { CesiumHeatMapMaterialCreator } from 'angular-cesium';

@Component({
  selector: 'heatmap-example',
  templateUrl: 'heatmap-example.component.html',
  providers: [CoordinateConverter]
})
export class HeatmapExampleComponent implements OnInit {
  @ViewChild(AcLayerComponent) layer: AcLayerComponent;

  entities$: Subject<AcNotification> = new Subject();
  Cesium = Cesium;
  show = true;
  rect = Rectangle.fromDegrees(-120, 35, -90, 40);
  circleRadius = 500000;
  circleCenter = Cartesian3.fromDegrees(-100, 24);

  circleHeatMapMaterial: any;
  rectHeatMapMaterial: any;
  viewer: any;

  constructor(cesiumService: CesiumService) {
    this.viewer = cesiumService.getViewer();
    setTimeout(() => {

      this.entities$.next({
        id: '1',
        actionType: ActionType.ADD_UPDATE,
        entity: {
          rectangle: this.rect,
          center: this.circleCenter,
          circleMaterial: this.circleHeatMapMaterial,
          rectMaterial: this.rectHeatMapMaterial,
        },
      });
    }, 1000);
  }

  ngOnInit() {
    const userHeatmapOptions = {
      radius: 2000,
      minOpacity: 0,
      maxOpacity: 0.9,
    } as any;

    // const mCreator = new CesiumHeatMapMaterialCreator();
    // const containingRect = CesiumHeatMapMaterialCreator.calcCircleContainingRect(this.circleCenter, this.circleRadius);
    // this.circleHeatMapMaterial = mCreator.create(containingRect, {
    //   heatPointsData: [
    //     {
    //       x: -100.0,
    //       y: 24.0,
    //       value: 95
    //     }
    //   ],
    //   min: 0,
    //   max: 100,
    // }, userHeatmapOptions);


    // this.rectHeatMapMaterial = mCreator.create(this.rect, {
    //   heatPointsData: [
    //     {
    //       x: -100,
    //       y: 34.0,
    //       value: 50,
    //     },
    //     {
    //       x: -95,
    //       y: 34.0,
    //       value: 80,
    //     },
    //   ]
    // }, {
    //   radius: 400,
    // });

  }

  removeAll() {
    this.layer.removeAll();
  }

  setShow($event: boolean) {
    this.show = $event;
  }
}

