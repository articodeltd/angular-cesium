import { Component, OnInit, Input, OnDestroy, SimpleChanges, OnChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { MapLayerProviderOptions } from '../../models/map-layer-provider-options.enum';
import { Checker } from '../../utils/checker';

/**
 *  This component is used for adding a map provider service to the map (ac-map).
 *  The component must be a child of <ac-map>.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-map-layer-provider [options]="optionsObject" [provider]="myProvider"&gt;
 *    &lt;/ac-map-layer-provider&gt;
 *  ```
 */
@Component({
	selector: 'ac-map-layer-provider',
	template: '',
})
export class AcMapLayerProviderComponent implements OnInit, OnChanges, OnDestroy {
	private static createWebMapServiceProvider(options) {
		return new Cesium.WebMapServiceImageryProvider(options);
	}

	private static createWebMapTileServiceProvider(options) {
		return new Cesium.WebMapTileServiceImageryProvider(options);
	}

	private static createArcGisMapServerProvider(options) {
		return new Cesium.ArcGisMapServerImageryProvider(options);
	}

	private static createOfflineMapProvider() {
		return Cesium.createTileMapServiceImageryProvider({
			url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
		});
	}

	/**
	 * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
	 * @type {{Object}}
	 */
	@Input()
	options: { url?: string } = {};

	/**
	 * the provider
	 * @type {MapLayerProviderOptions}
	 */
	@Input()
	provider: MapLayerProviderOptions = MapLayerProviderOptions.OFFLINE;

	/**
	 * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
	 * @type {Number}
	 */
	@Input()
	index: Number;

	/**
	 * show (optional) - Determines if the map layer is shown.
	 * @type {Boolean}
	 */
	@Input()
	show = true;

	private imageryLayer;
	private imageryLayers;
	private layerProvider;

	constructor(private cesiumService: CesiumService) {
		this.imageryLayers = this.cesiumService.getScene().imageryLayers;
	}

	ngOnInit() {
		if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
			throw new Error('options must have a url');
		}

		switch (this.provider) {
			case MapLayerProviderOptions.WebMapService:
				this.layerProvider = AcMapLayerProviderComponent.createWebMapServiceProvider(this.options);
				break;
			case MapLayerProviderOptions.WebMapTileService:
				this.layerProvider = AcMapLayerProviderComponent.createWebMapTileServiceProvider(this.options);
				break;
			case MapLayerProviderOptions.ArcGisMapServer:
				this.layerProvider = AcMapLayerProviderComponent.createArcGisMapServerProvider(this.options);
				break;
			case MapLayerProviderOptions.OFFLINE:
				break;
			default:
				this.layerProvider = AcMapLayerProviderComponent.createOfflineMapProvider();
				break;
		}
		if (this.show) {
			this.imageryLayer = this.imageryLayers.addImageryProvider(this.layerProvider, this.index);
		}
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['show'] && !changes['show'].isFirstChange() ) {
			const showValue = changes['show'].currentValue;
			if (showValue) {
				if (this.imageryLayer) {
					this.imageryLayers.add(this.imageryLayer, this.index);
				}
				else {
					this.imageryLayer = this.imageryLayers.addImageryProvider(this.layerProvider, this.index);
				}
			}
			else if (this.imageryLayer) {
				this.imageryLayers.remove(this.imageryLayer, false);
			}
		}
	}

	ngOnDestroy(): void {
		if (this.imageryLayer) {
			this.imageryLayers.remove(this.imageryLayer, true);
		}
	}
}
