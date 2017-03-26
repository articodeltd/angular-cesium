import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/models/map-layer-provider-options.enum';
import { AcLabelDescComponent } from '../../src/components/ac-label-desc/ac-label-desc.component';
import { AcDynamicPolylineDescComponent } from '../../src/components/ac-dynamic-polyline-desc/ac-dynamic-polyline-desc.component';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	providers: [WebSocketSupplier]
})

export class AppComponent implements OnInit {
	private arcGisMapServerProvider: MapLayerProviderOptions;
	flyToOptions = {
		duration: 2,
		destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
	};
	private position: any;
	private positions: any;
	private redMatirial: any;
	private aquamarine: any;
	private longitude: number;
	private latitude: number;

	@ViewChild(AcLabelDescComponent) label: AcLabelDescComponent;
	@ViewChild(AcDynamicPolylineDescComponent) polyline: AcDynamicPolylineDescComponent;

	constructor() {
	}

	ngOnInit() {
		this.longitude = 35.1;
		this.latitude = 0.1;
		this.arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
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
