import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { ActionType } from '../../angular-cesium/models/action-type.enum';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';
import { AsyncService } from "../../utils/services/async/async.service";

@Component({
	selector: 'polygon-layer',
	templateUrl: './polygon-layer.component.html',
	styleUrls: ['./polygon-layer.component.css']
})
export class PolygonLayerComponent implements OnInit, AfterViewInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	polygons$: Observable<AcNotification>;

	constructor(private asyncService: AsyncService) {
	}

	ngOnInit() {
		let socket = io.connect('http://localhost:3000');
		this.polygons$ = Observable.create((observer) => {
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
						acEntity.entity = this.convertToCesiumObj(acEntity);
						observer.next(acEntity);
					},
					2000);
			});
		})
	}

	oneAndOnlyMaterial = new Cesium.PerInstanceColorAppearance({
		translucent: false,
		closed: true
	});

	convertToCesiumObj(data): any {
		return {
			geometry: {
				height: 15000.0,
				polygonHierarchy: new Cesium.PolygonHierarchy(
					Cesium.Cartesian3.fromDegreesArray([
						30 * Math.random(), 30 * Math.random(),
						30 * Math.random(), 30 * Math.random(),
						30 * Math.random(), 30 * Math.random(),
						30 * Math.random(), 30 * Math.random(),
						30 * Math.random(), 30 * Math.random()
					])
				)
			},
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
			},
			appearance: this.oneAndOnlyMaterial
		}
	}

	removeAll() {
		this.layer.removeAll();
	}

	ngAfterViewInit() {

	}
}
