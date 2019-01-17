import { interval as observableInterval, Observable, Subject, timer as observableTimer } from 'rxjs';

import { catchError, map, mergeMap, take, takeUntil, timeInterval } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { ActionType } from 'angular-cesium';
import { AcNotification } from 'angular-cesium';
import { Track } from './sim-tracks-data-provider';
import { Apollo } from 'apollo-angular';

const TracksDataQuery = gql`
  query TracksData {
    tracks{
      callsign
      id
      groundSpeed
      heading
      position {
        lat
        long
        alt
      }
    }
  }
`;

@Injectable()
export class RealTracksDataProvider {
  private readonly INTERPOLATION_RATE = 1000;
  private readonly POLLING_RATE = 10000;
  private readonly RECONNECT_MS = 5000;
  private readonly MAX_MOVEMENT_DISTANCE = 0.1;
  private tracksCache = new Map<string, AcNotification>();
  private lastIntervalStopper: Subject<any>;

  constructor(private apollo: Apollo) {
  }

  private convertToCesiumEntity(trackData: any): AcNotification {
    const track = Object.assign({}, trackData);
    track.scale = 0.2;
    track.image = 'assets/fighter-jet.png';
    track.alt = trackData.position.alt;
    track.position = Cesium.Cartesian3.fromDegrees(trackData.position.long, trackData.position.lat);
    track.futurePosition = this.getFuturePosition(trackData.position, trackData.heading);
    return {id: track.id, entity: new Track(track), actionType: ActionType.ADD_UPDATE};
  }

  private saveInCache(track: AcNotification) {
    this.tracksCache.set(track.id, track);
  }

  getFuturePosition(position: any, heading: number) {
    return Cesium.Cartesian3.fromDegrees(
      position.long + (Math.sin(heading) * this.MAX_MOVEMENT_DISTANCE),
      position.lat + (Math.cos(heading) * this.MAX_MOVEMENT_DISTANCE)
    );
  }

  getPositionDelta(startingPosition: any, finalPosition: any, legs: number) {
    return {
      x: (finalPosition.x - startingPosition.x) / legs,
      y: (finalPosition.y - startingPosition.y) / legs,
      z: (finalPosition.z - startingPosition.z) / legs,
    };
  }

  addPositionDelta(position: any, delta: any) {
    position.x += delta.x;
    position.y += delta.y;
    position.z += delta.z;
  }

  private createInterpolatedTracksObservable(serverDataObservable: Observable<any>) {
    const interpolationSubject = new Subject<AcNotification>();
    const interpolationLegs = this.POLLING_RATE / this.INTERPOLATION_RATE;
    serverDataObservable.subscribe(serverTracks => {
      if (this.lastIntervalStopper) {
        this.lastIntervalStopper.next(0);
      }
      const serverTrackNotifications = serverTracks.map((track: any) => {
        const trackNotification = this.convertToCesiumEntity(track);
        if (!this.tracksCache.has(track.id)) {
          this.saveInCache(trackNotification);
        }
        return trackNotification;
      });

      const stopper$ = new Subject();

      observableInterval(this.INTERPOLATION_RATE).pipe(
        timeInterval(),
        take(interpolationLegs - 1),
        takeUntil(stopper$), )
        .subscribe(() => {
            serverTrackNotifications.forEach((notification: any) => {
              const serverTrack = notification.entity;
              const cachedTrackNotification = this.tracksCache.get(serverTrack.id);
              const cachedTrack = <any>cachedTrackNotification.entity;
              if (!serverTrack.positionDelta) {
                serverTrack.positionDelta =
                  this.getPositionDelta(cachedTrack.position, serverTrack.position, interpolationLegs);
              }

              this.addPositionDelta(cachedTrack.position, serverTrack.positionDelta);
              this.addPositionDelta(cachedTrack.futurePosition, serverTrack.positionDelta);
              interpolationSubject.next(cachedTrackNotification);
            });
          },
          () => {
          },
          () => {
            serverTrackNotifications.forEach((notification: any) => {
              const serverTrack = notification.entity;
              const cachedTrackNotification = this.tracksCache.get(serverTrack.id);
              serverTrack.positionDelta = undefined;
              cachedTrackNotification.entity = serverTrack;
              interpolationSubject.next(cachedTrackNotification);
              this.lastIntervalStopper = undefined;
            });

          });

      this.lastIntervalStopper = stopper$;
    });

    return interpolationSubject;
  }

  tryReconnect(err: any): any {
    console.log(`Error connecting to Graphql: ${err}. Try to reconnect in ${this.RECONNECT_MS} ...`);
    return observableTimer(this.RECONNECT_MS).pipe(
      mergeMap(() =>
        this.apollo.watchQuery<any>({
          query: TracksDataQuery,
          pollInterval: this.POLLING_RATE,
          fetchPolicy: 'network-only'
        }).valueChanges.pipe(
          catchError(error => this.tryReconnect(error)))));
  }

  get() {
    const watchQuery$ = this.apollo.watchQuery<any>({
      query: TracksDataQuery,
      pollInterval: this.POLLING_RATE, fetchPolicy: 'network-only'
    });

    const fromServerTracks$ = watchQuery$.valueChanges.pipe(
      catchError(err => this.tryReconnect(err)),
      map((reuslt: any) => reuslt.data.tracks), );


    return this.createInterpolatedTracksObservable(fromServerTracks$);
  }
}
