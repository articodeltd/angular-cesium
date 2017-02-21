import { Component, OnInit } from '@angular/core';
import { Parse } from '../angular2-parse/src/services/parse/parse.service';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../angular-cesium/components/ac-map-layer-provider/enums/map-layer-provider-options.enum';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	providers: [Parse, WebSocketSupplier]
})

export class AppComponent implements OnInit {
	arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;

	constructor() {
	}

	ngOnInit() {
	}
}
