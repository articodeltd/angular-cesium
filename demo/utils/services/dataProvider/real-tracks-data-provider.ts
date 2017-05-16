import { Injectable } from '@angular/core';
import gql from 'graphql-tag';
import { Apollo } from 'apollo-angular';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcNotification } from '../../../../src/models/ac-notification';
import { Observable } from 'rxjs/Observable';
import { Track } from './track.model';
import { Subject } from 'rxjs/Subject';

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
	private readonly INTERPOLATION_RATE = 500;
	private readonly POLLING_RATE = 10000;
	private readonly RECONNECT_MS = 5000;
	private tracksCache = new Map<string, AcNotification>();

	constructor(private apollo: Apollo) {
	}

	private convertToCesiumEntity(trackData): AcNotification {
		const track = Object.assign({}, trackData);
		track.scale = 0.2;
		track.image = '/assets/fighter-jet.png';
		track.position = Cesium.Cartesian3.fromDegrees(trackData.position.long, trackData.position.lat);
		track.alt = trackData.position.alt;
		return { id: track.id, entity: track, actionType: ActionType.ADD_UPDATE };
	}

	private saveInCache(track: AcNotification) {
		this.tracksCache.set(track.id, track);
	}

	getPositionDelta(startingPosition, finalPosition, legs: number) {
		return {
			x: (finalPosition.x - startingPosition.x) / legs,
			y: (finalPosition.y - startingPosition.y) / legs,
			z: (finalPosition.z - startingPosition.z) / legs,
		};
	}

	addPositionDelta(position, delta) {
		position.x += delta.x;
		position.y += delta.y;
		position.z += delta.z;
	}

	private createInterpolatedTracksObservable(serverDataObservable: Observable<any>) {
		const interpolationSubject = new Subject<AcNotification>();
		const interpolationLegs = this.POLLING_RATE / this.INTERPOLATION_RATE;
		serverDataObservable.subscribe(serverTracks => {
			const serverTrackNotifications = serverTracks.map(track => {
				const trackNotification = this.convertToCesiumEntity(track);
				if (!this.tracksCache.has(track.id)) {
					this.saveInCache(trackNotification);
				}
				return trackNotification;
			});

			Observable.interval(this.INTERPOLATION_RATE)
				.timeInterval()
				.take(interpolationLegs)
				.subscribe(({ value }) => {
					serverTrackNotifications.forEach(notification => {
						const serverTrack = notification.entity;
						const cachedTrackNotification = this.tracksCache.get(serverTrack.id);
						const cachedTrack = <Track>cachedTrackNotification.entity;
						if (!serverTrack.positionDelta) {
							serverTrack.positionDelta =
								this.getPositionDelta(cachedTrack.position, serverTrack.position, interpolationLegs);
						}

						if (value === interpolationLegs - 1) {
							serverTrack.positionDelta = undefined;
							cachedTrackNotification.entity = serverTrack;
							interpolationSubject.next(cachedTrackNotification);
						}
						else {
							this.addPositionDelta(cachedTrack.position, serverTrack.positionDelta);
							interpolationSubject.next(cachedTrackNotification);
						}
					});
				});
		});

		return interpolationSubject;
	}

	tryReconnect(err) {
		console.log(`Error connecting to Graphql: ${err}. Try to reconnect in ${this.RECONNECT_MS} ...`);
		return Observable.timer(this.RECONNECT_MS)
			.flatMap(() =>
				this.apollo.watchQuery<any>({
					query: TracksDataQuery,
					pollInterval: this.POLLING_RATE,
					fetchPolicy: 'network-only'
				})
					.catch(error => this.tryReconnect(error)));
	}

	get() {
		const watchQuery$ = this.apollo.watchQuery<any>({
			query: TracksDataQuery,
			pollInterval: this.POLLING_RATE, fetchPolicy: 'network-only'
		});

		const fromServerTracks$ = watchQuery$
			.catch(err => this.tryReconnect(err))
			.map(({ data }) => data.tracks);

		return this.createInterpolatedTracksObservable(fromServerTracks$);
	}
}
