import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class CesiumService {
	cesium: any;
	cesiumViewer: any;

	constructor(private ngZone: NgZone) {
		this.cesium = Cesium;
	}

	init(mapContainer: HTMLElement) {
		this.ngZone.runOutsideAngular(() => {
			window['CESIUM_BASE_URL'] = './assets/Cesium';
			this.cesiumViewer = new this.cesium.Viewer(mapContainer,
				{
					baseLayerPicker: false,
					geocoder: false
				});
		});
	}

	getViewer() {
		return this.cesiumViewer;
	}

	getScene() {
		return this.cesiumViewer.scene;
	}
}
