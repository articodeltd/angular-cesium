import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

import { AcNotification } from "../../angular-cesium/models/ac-notification";
import { ActionType } from "../../angular-cesium/models/action-type.enum";
import { AsyncService } from "../../utils/services/async/async.service";
import { AcLayerComponent } from "../../angular-cesium/components/ac-layer/ac-layer.component";

@Component({
	selector: 'ac-static-circle-layer',
	templateUrl: 'static-circle-layer.component.html',
})
export class StaticCircleLayerComponent implements OnInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	tracks$: Observable<AcNotification>;
	Cesium = Cesium;
	showTracks = true;

	constructor(private asyncService: AsyncService) {
	}

	ngOnInit() {
		let socket = io.connect('http://localhost:3000');
		this.tracks$ = Observable.create((observer) => {
			socket.on('birds', (data) => {
				this.asyncService.forEach(
					data,
					(acEntity) => {
						let action;
						if (acEntity.action === "ADD_OR_UPDATE") {
							action = ActionType.ADD_UPDATE;
						}
						else if (acEntity.action === "DELETE") {
							action = ActionType.DELETE
						}
						acEntity.actionType = action;
						acEntity.entity = this.convertToCesiumObj();
						observer.next(acEntity);
					},
					2000);
			});
		})
	}

	convertToCesiumObj(): any {
		return {
			geometry: {
				center: Cesium.Cartesian3.fromDegrees(Math.random() * 90, Math.random() * 90),
				radius: 100000.0
			},
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
			},
			appearance: new Cesium.PerInstanceColorAppearance({
				translucent: false,
				closed: true
			})
		}
	}

	removeAll() {
		this.layer.removeAll();
	}
}
