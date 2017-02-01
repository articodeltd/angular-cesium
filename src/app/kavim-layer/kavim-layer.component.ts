import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../angular-cesium/models/ac-notification';
import { ActionType } from '../../angular-cesium/models/action-type.enum';
import { AcLayerComponent } from '../../angular-cesium/components/ac-layer/ac-layer.component';

@Component({
	selector: 'kavim-layer',
	templateUrl: './kavim-layer.component.html',
	styleUrls: ['./kavim-layer.component.css']
})
export class KavimLayerComponent implements OnInit, AfterViewInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	kavim$: Observable<AcNotification>;

	private Cartesian3: any;

	constructor() {

		this.Cartesian3 = [
			-73.10, 37.57,
			-75.02, 36.53,
			-78.50, 33.14,
			-78.12, 23.46];
		const kav1: AcNotification = {
			id: 0,
			actionType: ActionType.ADD_UPDATE,
			entity: {
				width: 2,
				positions: Cesium.Cartesian3.fromDegreesArray([
					-75.10, 39.57,
					-77.02, 38.53,
					-80.50, 35.14,
					-80.12, 25.46]),
				material: new Cesium.Material({
					fabric: {
						type: 'Color',
						uniforms: {
							color: new Cesium.Color(1.0, 1.0, 0.0, 1.0)
						}
					}
				})
			}
		};
		const kav2: AcNotification = {
			id: 1,
			actionType: ActionType.ADD_UPDATE,
			entity: {
				width: 8,
				positions: Cesium.Cartesian3.fromDegreesArray([
					-73.10, 37.57,
					-75.02, 36.53,
					-78.50, 33.14,
					-78.12, 23.46]),
				material: new Cesium.Material({
					fabric: {
						type: 'Color',
						uniforms: {
							color: new Cesium.Color(1.0, 1.0, 0.0, 0.3)
						}
					}
				})
			}
		};
		const kavimArray = [kav1, kav2];
		this.kavim$ = Observable.from(kavimArray);

		setTimeout(() => {
			kav1.entity['positions'] = Cesium.Cartesian3.fromDegreesArray([
				-75.10, 39.57,
				-77.02, 38.53,
				-77.12, 38.63,
				-80.12, 25.46]);
			this.layer.update(kav1);
		}, 5000);
		setInterval(() => {
			this.changePosition();
			kav2.entity['positions'] = Cesium.Cartesian3.fromDegreesArray(this.Cartesian3);
			kav2.entity['material'] = new Cesium.Material({
				fabric: {
					type: 'Color',
					uniforms: {
						color: new Cesium.Color(1.0, 1.0, Math.random() * 5, 0.3)
					}
				}
			});
			this.layer.update(kav2);
		}, 500);

	}

	ngOnInit() {
	}

	ngAfterViewInit() {

	}

	changePosition() {
		for (let position in this.Cartesian3) {
			this.Cartesian3[position] += 0.01;
		}
	}

}