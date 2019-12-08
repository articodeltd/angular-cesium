import { Injectable } from '@angular/core';
import { WebSocketSupplier } from '../webSocketSupplier/webSocketSupplier';
import { Observable, Subscriber } from 'rxjs';
import { AcEntity, AcNotification, ActionType } from 'angular-cesium';
import { publish } from 'rxjs/operators';

export class Track extends AcEntity {
}

@Injectable()
export class SimTracksDataProvider {
  private _socket: any;
  private tracks$;

  constructor(private webSocketSupplier: WebSocketSupplier) {
    this._socket = webSocketSupplier.get();
    this.tracks$ = publish()(Observable.create((observer: Subscriber<any>) => {
      this._socket.on('birds', (data: any) => {
        data.forEach(
          (acNotification: any) => {
            let action;
            if (acNotification.action === 'ADD_OR_UPDATE') {
              action = ActionType.ADD_UPDATE;
            } else if (acNotification.action === 'DELETE') {
              action = ActionType.DELETE;
            }
            acNotification.actionType = action;
            acNotification.entity = new Track(this.convertToCesiumObj(acNotification.entity));
            observer.next(acNotification);
          });
      });
    }));

    this.tracks$.connect();
  }

  get(): Observable<AcNotification> {
    return this.tracks$;
  }

  convertToCesiumObj(entity: any): any {
    const fixedHeading = entity.heading - (Math.PI / 2);
    const pitch = Cesium.Math.toRadians(0.0);
    const roll = Cesium.Math.toRadians(0.0);

    entity.scale = entity.id === 1 ? 0.3 : 0.15;
    entity.alt = Math.round(entity.position.altitude);
    entity.array = this.getArrayBySize(entity, Math.round(Math.random() * 3));
    entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat, entity.alt);
    entity.futurePosition =
      Cesium.Cartesian3.fromDegrees(entity.futurePosition.long, entity.futurePosition.lat, entity.futurePosition.altitude);
    const hpr = new Cesium.HeadingPitchRoll(fixedHeading, pitch, roll);
    entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(entity.position, hpr);
    return entity;
  }

  getArrayBySize(entity: any, size: number) {
    const arr = [
      {
        pos: Cesium.Cartesian3.fromDegrees(entity.position.long + 1, entity.position.lat + 1, entity.alt),
        innerArray: [
          {
            pos: Cesium.Cartesian3.fromDegrees(entity.position.long + 1.5, entity.position.lat + 1.5, entity.alt),
            id: '0'
          },
        ],
        id: '0'
      },
      {
        pos: Cesium.Cartesian3.fromDegrees(entity.position.long + 1, entity.position.lat - 1, entity.alt),
        innerArray: [
          {
            pos: Cesium.Cartesian3.fromDegrees(entity.position.long + 1.5, entity.position.lat - 1.5, entity.alt),
            id: '0'
          },
        ],
        id: '1'
      },
      {
        pos: Cesium.Cartesian3.fromDegrees(entity.position.long - 1, entity.position.lat + 1, entity.alt),
        innerArray: [
          {
            pos: Cesium.Cartesian3.fromDegrees(entity.position.long - 1.5, entity.position.lat + 1.5, entity.alt),
            id: '0'
          },
        ],
        id: '2'
      },
      {
        pos: Cesium.Cartesian3.fromDegrees(entity.position.long - 1, entity.position.lat - 1, entity.alt),
        innerArray: [
          {
            pos: Cesium.Cartesian3.fromDegrees(entity.position.long - 1.5, entity.position.lat - 1.5, entity.alt),
            id: '0'
          },
        ],
        id: '3'
      },
    ];

    return arr.slice(0, size);
  }
}
