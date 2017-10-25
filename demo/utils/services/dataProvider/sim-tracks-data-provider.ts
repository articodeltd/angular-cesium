import { Injectable } from '@angular/core';
import { WebSocketSupplier } from '../webSocketSupplier/webSocketSupplier';
import { Observable } from 'rxjs/Observable';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { AcEntity } from '../../../../src/angular-cesium/models/ac-entity';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';

@Injectable()
export class SimTracksDataProvider {
	
	constructor(private webSocketSupplier: WebSocketSupplier) {
	}
	
	get(): Observable<AcNotification> {
		const socket = this.webSocketSupplier.get();
		const simTracks$ = Observable.create((observer) => {
			socket.on('birds', (data) => {
				data.forEach(
					(acNotification) => {
						if (acNotification.action === 'ADD_OR_UPDATE') {
							acNotification.actionType = ActionType.ADD_UPDATE;
							acNotification.entity = new AcEntity(this.convertToCesiumObj(acNotification.entity));
						}
						else if (acNotification.action === 'DELETE') {
							acNotification.actionType = ActionType.DELETE;
						}
						observer.next(acNotification);
					});
			});
		});
		
		return simTracks$;
	}
	
	convertToCesiumObj(entity): any {
		const fixedHeading = entity.heading - (Math.PI / 2);
		const pitch = Cesium.Math.toRadians(0.0);
		const roll = Cesium.Math.toRadians(0.0);
		
		entity.scale = entity.id === 1 ? 0.3 : 0.15;
		entity.alt = Math.round(entity.position.altitude);
		entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat, entity.alt);
		entity.futurePosition =
			Cesium.Cartesian3.fromDegrees(entity.futurePosition.long, entity.futurePosition.lat, entity.futurePosition.altitude);
		const hpr = new Cesium.HeadingPitchRoll(fixedHeading, pitch, roll);
		entity.orientation = Cesium.Transforms.headingPitchRollQuaternion(entity.position, hpr);
		return entity;
	}
}