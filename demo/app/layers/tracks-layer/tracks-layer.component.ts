import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';

@Component({
	selector: 'tracks-layer',
	templateUrl: './tracks-layer.component.html',
	styleUrls: ['./tracks-layer.component.css']
})
export class TracksLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	tracks$: Observable<AcNotification>;
	Cesium = Cesium;
	showTracks = true;

	constructor() {
	}

	ngOnInit() {
		const socket = io.connect('http://localhost:3000');
		this.tracks$ = Observable.create((observer) => {
			socket.on('birds', (data) => {
				data.forEach(
					(acNotification) => {
						let action;
						if (acNotification.action === 'ADD_OR_UPDATE') {
							action = ActionType.ADD_UPDATE;
						}
						else if (acNotification.action === 'DELETE') {
							action = ActionType.DELETE;
						}
						acNotification.actionType = action;
						acNotification.entity = this.convertToCesiumObj(acNotification.entity);
						observer.next(acNotification);
					});
			});
		});
	}

	convertToCesiumObj(entity): any {
		entity.scale = entity.id === 1 ? 0.3 : 0.15;
		entity.color = entity.id === 1 ? Cesium.Color.RED : undefined;
		entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat);
		return entity;
	}

	removeAll() {
		this.layer.removeAll();
	}

	setShow($event) {
		this.showTracks = $event;
	}
}
