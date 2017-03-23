import { Component, OnInit, ViewChild } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/models/map-layer-provider-options.enum';
import { AcLabelDescComponent } from '../../src/components/ac-label-desc/ac-label-desc.component';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	providers: [WebSocketSupplier]
})

export class AppComponent implements OnInit {
	arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
	position = Cesium.Cartesian3.fromDegrees(34.0, 32.0);
	positions = Cesium.Cartesian3.fromDegreesArray(
		[
			34.1, 35.1,
			35.1, 50.0,
		]);
	redMatirial = new Cesium.Material({
		fabric : {
			type : 'Color',
			uniforms : {
				color : new Cesium.Color(1.0, 0.0, 0.0, 1.0)
			}
		}
	});
	aquamarine = Cesium.Color.AQUAMARINE;

	@ViewChild(AcLabelDescComponent) label: AcLabelDescComponent;
	constructor() {
	}

	ngOnInit() {
		setTimeout(()=>{
			this.label.removeFromMap();
			console.log('remove label');
		},10000);
	}
}
