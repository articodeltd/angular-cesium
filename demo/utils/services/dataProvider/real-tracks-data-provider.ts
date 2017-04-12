import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcNotification } from '../../../../src/models/ac-notification'; import {
  Observable,
  Observer
} from 'rxjs'; import { GeoUtilsService } from '../../../../src/services/geo-utils/geo-utils.service'; import { Track } from './track.model'; import { CesiumService } from '../../../../src/services/cesium/cesium.service';

const TracksDataQuery = gql`
    query TracksData {
        tracks{
            callsign
            id
            groundSpeed
            azimuth
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
  private readonly KNOTS_METER_PER_SEC = 0.5144444;
  private readonly INTERPOLATE_RATE = 500;
  private readonly POLLING_RATE = 5000;
  private tracksCache = new Map<number,AcNotification>();

  constructor(private apollo: Apollo, private cesiumService: CesiumService) {
  }

  private convertToCesiumEntity(trackData): AcNotification {
    const track = Object.assign({}, trackData);
    track.scale = 0.2;
    track.color = undefined;
    track.image = "/assets/angry-bird-blue-icon.png";
    track.position = Cesium.Cartesian3.fromDegrees(trackData.position.long, trackData.position.lat);
    return {id: track.id, entity: track, actionType: ActionType.ADD_UPDATE}
  }

  private saveInCache(track: AcNotification) {
    this.tracksCache.set(track.id, track);
  }

  private changeLocation(trackNotification: AcNotification) {
    const track = <Track>trackNotification.entity;
    if (track.groundSpeed) {
      const distanceMeter = this.KNOTS_METER_PER_SEC * track.groundSpeed * this.INTERPOLATE_RATE / 1000;
      const radianAzimuth = track.azimuth * (Math.PI / 180);
      track.position = GeoUtilsService.pointByLocationDistanceAndAzimuth(track.position, distanceMeter, radianAzimuth, true);
      trackNotification.entity = track;
    }
    return trackNotification;
  }

  private createInterpolateObserver() {
    const interpolate = Observable.interval(this.INTERPOLATE_RATE)
      .flatMap(() => Array.from(this.tracksCache.values()))
      .map(this.changeLocation.bind(this))
      .do(this.saveInCache.bind(this))
    return interpolate;
  }

  get() {
    const interpolateTracks$ = this.createInterpolateObserver();

    const formServerTracks$ = this.apollo.watchQuery<any>({query: TracksDataQuery, pollInterval: this.POLLING_RATE})
      .map(({data}) => data.tracks)
      .flatMap(track => track)
      .map(this.convertToCesiumEntity)
      .do(this.saveInCache.bind(this));

    return Observable.merge(interpolateTracks$, formServerTracks$);
  }
}