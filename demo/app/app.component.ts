import { Component, ViewEncapsulation } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/models/map-layer-provider-options.enum';
import { ViewerConfiguration } from '../../src/services/viewer-configuration/viewer-configuration.service';
import {DomSanitizer} from '@angular/platform-browser';
import {MdIconRegistry} from '@angular/material';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	providers: [WebSocketSupplier, ViewerConfiguration],
	encapsulation: ViewEncapsulation.None
})

export class AppComponent {
	arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
	flyToOptions = {
		duration: 2,
		destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
	};

	constructor(viewerConf: ViewerConfiguration, iconRegistry: MdIconRegistry, sanitizer: DomSanitizer) {
		iconRegistry.addSvgIcon(
			'settings',
			sanitizer.bypassSecurityTrustResourceUrl('/assets/settings.svg'));
		viewerConf.viewerOptions = {
			selectionIndicator: false,
			timeline: false,
			infoBox: false,
			baseLayerPicker: false,
			animation: false,
			homeButton: false,
			geocoder: false,
			navigationHelpButton: false,
			navigationInstructionsInitiallyVisible: false,
		};

		viewerConf.viewerModifier = (viewer) => {
			viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
			viewer.bottomContainer.remove();
		};


	}

}
