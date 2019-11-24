import { Injectable } from '@angular/core';
import { from, interval } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MockDataProviderService {

  constructor() {
  }

  get$(amount = 5) {
    const staticEntities = this.initEntities(amount);
    return from(staticEntities);
  }

  getDataSteam$(amount = 50, intervalMs = 1000) {
    const staticEntities = this.initRandom(amount);

    return interval(intervalMs).pipe(
      map(intervalValue => {
        return staticEntities.map(entity => {
          const cartographic = Cesium.Cartographic.fromCartesian(entity.position);
          cartographic.longitude += Cesium.Math.toRadians(0.08 * intervalValue);
          cartographic.latitude += Cesium.Math.toRadians(0.08 * intervalValue);
          entity.position = Cesium.Cartographic.toCartesian(cartographic);
          return entity;
        });
      }),
      flatMap(entity => entity));
  }

  private initEntities(amount) {
    const staticEntities = [];
    for (let i = 0; i < amount; i++) {
      staticEntities.push({
        id: i.toString(),
        position: Cesium.Cartesian3.fromDegrees(-100.0 + (i * 5), 40.0),
      });
    }
    return staticEntities;
  }

  private initRandom(amount) {
    const randomSign = () => Math.round(Math.random()) * 2 - 1;
    const staticEntities = [];
    for (let i = 0; i < amount; i++) {
      const lat = 70 * Math.random() * randomSign();
      const long = 180 * Math.random() * randomSign();
      const altitude = 50000 * Math.random();
      staticEntities.push({
        id: i.toString(),
        position: Cesium.Cartesian3.fromDegrees(long, lat, altitude),
      });
    }
    return staticEntities;
  }
}
