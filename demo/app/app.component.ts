import { Component } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/models/map-layer-provider-options.enum';
import { ViewerConfiguration } from '../../src/services/viewer-configuration/viewer-configuration.service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	providers: [WebSocketSupplier, ViewerConfiguration]
})

export class AppComponent {
	arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
	flyToOptions = {
		duration: 2,
		destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
	};
	showMap = true;

	setShowMap(event){
		this.showMap = event;
	}
	constructor(viewerConf: ViewerConfiguration) {
		viewerConf.viewerOptions = {
			geocoder: false,
			timeline: false,
		};
	}

}
