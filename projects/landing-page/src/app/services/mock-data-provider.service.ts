import { Injectable } from '@angular/core';
import { from, interval } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { Math as cMath, Cartesian3, Cartographic } from 'cesium';

const getMovementDistance = intervalMs =>
  (cMath.toRadians(0.01) * intervalMs) / 1000;
const getMaxHeadingChange = intervalMs => ((Math.PI / 2) * intervalMs) / 1000;
const getChanceToChangeDirection = intervalMs => (0.333 * intervalMs) / 1000;

interface CubicArea {
  maxLon: number;
  minLon: number;
  maxLat: number;
  minLat: number;
  minHeight?: number;
  maxHeight?: number;
}

@Injectable({
  providedIn: 'root'
})
export class MockDataProviderService {
  constructor() {
  }

  dataStream$;

  get$(amount = 5) {
    const staticEntities = this.initEntities(amount);
    return from(staticEntities);
  }

  getDataSteam$(amount = 50, intervalMs = 1000, restrictedArea?: CubicArea) {
    if (this.dataStream$) {
      return this.dataStream$;
    }

    const staticEntities = this.initRandom(amount, restrictedArea);
    const movementDistance = getMovementDistance(intervalMs);
    const maxHeadingChange = getMaxHeadingChange(intervalMs);
    const chanceToChangeDirection = getChanceToChangeDirection(intervalMs);

    this.dataStream$ = interval(intervalMs).pipe(
      map(intervalValue => {
        return staticEntities.map(entity => {
          const nextEntityState = this.getNextEntityState(
            entity,
            movementDistance,
            maxHeadingChange,
            chanceToChangeDirection,
            restrictedArea
          );
          entity.position.longitude = nextEntityState.position.longitude;
          entity.position.latitude = nextEntityState.position.latitude;
          entity.position.height = nextEntityState.position.height;
          entity.heading = nextEntityState.heading;
          return entity;
        });
      }),
      flatMap(entity => entity)
    );

    return this.dataStream$;
  }

  private getNextEntityState(
    entity,
    movementDistance,
    maxHeadingChange,
    chanceToChangeDirection,
    restrictedArea?: CubicArea
  ) {
    const position = entity.position;
    let heading =
      Math.random() <= chanceToChangeDirection
        ? entity.heading + Math.random() * randomSign() * maxHeadingChange
        : entity.heading;
    let nextState = {
      position: {
        latitude: position.latitude + Math.cos(heading) * movementDistance,
        longitude: position.longitude + Math.sin(heading) * movementDistance,
        height: position.height
      },
      heading
    };

    if (restrictedArea) {
      while (
        nextState.position.latitude > restrictedArea.maxLat ||
        nextState.position.latitude < restrictedArea.minLat ||
        nextState.position.longitude > restrictedArea.maxLon ||
        nextState.position.longitude < restrictedArea.minLon
        ) {
        heading = heading += Math.PI / 2;
        nextState = {
          position: {
            latitude: position.latitude + Math.cos(heading) * movementDistance,
            longitude:
              position.longitude + Math.sin(heading) * movementDistance,
            height: position.height
          },
          heading
        };
      }
    }

    return nextState;
  }

  private initEntities(amount) {
    const staticEntities = [];
    for (let i = 0; i < amount; i++) {
      staticEntities.push({
        id: i.toString(),
        position: Cartesian3.fromDegrees(-100.0 + i * 5, 40.0)
      });
    }
    return staticEntities;
  }

  private initRandom(amount, restrictedArea?: CubicArea) {
    const staticEntities = [];
    for (let i = 0; i < amount; i++) {
      const lat = restrictedArea
        ? restrictedArea.minLat +
        Math.random() * (restrictedArea.maxLat - restrictedArea.minLat)
        : 70 * Math.random() * randomSign();
      const long = restrictedArea
        ? restrictedArea.minLon +
        Math.random() * (restrictedArea.maxLon - restrictedArea.minLon)
        : 180 * Math.random() * randomSign();
      const height =
        ((restrictedArea && restrictedArea.minHeight) || 0) +
        (restrictedArea && restrictedArea.minHeight && restrictedArea.maxHeight
          ? restrictedArea.maxHeight - restrictedArea.minHeight
          : 10000) *
        Math.random();
      staticEntities.push({
        id: i.toString(),
        position: new Cartographic(long, lat, height),
        heading: Math.random() * 2 * Math.PI
      });
    }
    return staticEntities;
  }
}

const randomSign = () => Math.round(Math.random()) * 2 - 1;
