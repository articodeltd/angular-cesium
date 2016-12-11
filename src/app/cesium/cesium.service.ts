import { Injectable } from '@angular/core';
// import * as Cesium from 'cesium';


@Injectable()
export class CesiumService {
  cesium: any;

  constructor() {
    this.cesium = Cesium;
  }
}
