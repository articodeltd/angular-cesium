import { Component, OnInit, ViewChild } from '@angular/core';
import { AcLabelComponent } from '../../../../src/components/ac-label/ac-label.component';

@Component({
	selector: 'draw-on-map-layer',
	templateUrl: 'draw-on-map-layer.component.html',
	styleUrls: [],
	providers: []
})

export class DrawOnMapComponent implements OnInit {
	private position: any;
	private positions: any;
	private redMatirial: any;
	private aquamarine: any;
	private longitude: number;
	private latitude: number;

	@ViewChild(AcLabelComponent) label: AcLabelComponent;

	constructor() {}

	ngOnInit() {
		this.longitude = 35.1;
		this.latitude = 0.1;
		this.position = Cesium.Cartesian3.fromDegrees(34.0, 32.0);
		this.positions = Cesium.Cartesian3.fromDegreesArray(
			[
				34.1, 35.1,
				this.longitude, this.latitude
			]);
		this.redMatirial = new Cesium.Material({
			fabric: {
				type: 'Color',
				uniforms: {
					color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
				}
			}
		});
		this.aquamarine = Cesium.Color.AQUAMARINE;

		setTimeout(() => {
			this.label.removeFromMap();
		}, 10000);

		setInterval(() => {
			this.positions = Cesium.Cartesian3.fromDegreesArray(
				[
					34.1, 35.1,
					++this.longitude, ++this.latitude
				]);
		}, 500);
	}
}