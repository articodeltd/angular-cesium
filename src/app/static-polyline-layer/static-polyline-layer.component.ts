import { Component, OnInit, ViewChild } from "@angular/core";
import { Observable } from "rxjs";

import { AcNotification } from "../../angular-cesium/models/ac-notification";
import { ActionType } from "../../angular-cesium/models/action-type.enum";
import { AsyncService } from "../../utils/services/async/async.service";
import { AcLayerComponent } from "../../angular-cesium/components/ac-layer/ac-layer.component";


@Component({
	selector: 'static-polyline-layer',
	templateUrl: 'static-polyline-layer.component.html',
})
export class PolyLayerComponent implements OnInit {
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
				width: 1,
				height: 50,
				positions: Cesium.Cartesian3.fromDegreesArray(
					[
						Math.floor(Math.random() * 50), Math.floor(Math.random() * 50),
						Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)
					]),
			},
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
			},
			appearance: new Cesium.PolylineColorAppearance({
				closed: true,
				translucent: false
			})
		}
	}

	removeAll() {
		this.layer.removeAll();
	}
}
