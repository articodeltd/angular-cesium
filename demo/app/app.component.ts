import { Component, ViewEncapsulation } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/models/map-layer-provider-options.enum';
import { ViewerConfiguration } from '../../src/services/viewer-configuration/viewer-configuration.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MdDialog, MdIconRegistry } from '@angular/material';
import { AppSettingsService } from './services/app-settings-service/app-settings-service';

@Component({
	selector: 'app-root',
	templateUrl: 'app.component.html',
	styleUrls: ['app.component.css'],
	providers: [WebSocketSupplier, ViewerConfiguration, AppSettingsService],
	encapsulation: ViewEncapsulation.None
})

export class AppComponent {
	arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
	flyToOptions = {
		duration: 2,
		destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
	};

	constructor(public appSettingsService: AppSettingsService,
							viewerConf: ViewerConfiguration,
							iconRegistry: MdIconRegistry,
							sanitizer: DomSanitizer,
							private dialog: MdDialog) {
		Cesium.BingMapsApi.defaultKey = 'AtIXLwI-EOgRtuDna0r-bcIAfj7G_cN6fb98u3A1DbgEEW-SquLhxEi8KnGrlJkA';
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

		this.appSettingsService.showTracksLayer = true;
	}
	
	settingsClick(sidenav) {
		this.dialog.closeAll();
		sidenav.open();
	}

}
