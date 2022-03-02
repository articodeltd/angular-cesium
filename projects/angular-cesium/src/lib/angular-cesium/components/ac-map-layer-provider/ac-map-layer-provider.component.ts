import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { buildModuleUrl } from 'cesium';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
import { MapLayerProviderOptions } from '../../models';
declare var Cesium: any;

/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
@Component({
  selector: 'ac-map-layer-provider',
  template: '',
})
export class AcMapLayerProviderComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
   */
  @Input()
  options: { url?: string } = {};

  /**
   * the provider
   */
  @Input()
  provider: any = MapLayerProviderOptions.OFFLINE;

  /**
   * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
   */
  @Input()
  index: Number;

  /**
   * show (optional) - Determines if the map layer is shown.
   */
  @Input()
  show = true;

  /**
   * The alpha blending value of this layer: 0.0 to 1.0
   */
  @Input()
  alpha = 1.0;

  /**
   * The brightness of this layer: 0.0 to 1.0
   */
  @Input()
  brightness = 1.0;

  /**
   * The contrast of this layer: 0.0 to 1.0
   */
  @Input()
  contrast = 1.0;

  public imageryLayer: any;
  public imageryLayersCollection: any;
  public layerProvider: any;

  constructor(private cesiumService: CesiumService) {
    this.imageryLayersCollection = this.cesiumService.getScene().imageryLayers;
  }

  private createOfflineMapProvider() {
    return Cesium.createTileMapServiceImageryProvider({
      url: buildModuleUrl('Assets/Textures/NaturalEarthII')
    });
  }

  ngOnInit() {
    if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
      throw new Error('options must have a url');
    }
    switch (this.provider) {
      case MapLayerProviderOptions.WebMapService:
      case MapLayerProviderOptions.WebMapTileService:
      case MapLayerProviderOptions.ArcGisMapServer:
      case MapLayerProviderOptions.SingleTileImagery:
      case MapLayerProviderOptions.BingMaps:
      case MapLayerProviderOptions.GoogleEarthEnterpriseMaps:
      case MapLayerProviderOptions.MapBox:
      case MapLayerProviderOptions.MapboxStyleImageryProvider:
      case MapLayerProviderOptions.UrlTemplateImagery:
      case MapLayerProviderOptions.MapTileService:
      case MapLayerProviderOptions.OpenStreetMap:
        this.layerProvider = new this.provider(this.options);
        break;
      case MapLayerProviderOptions.OFFLINE:
        this.layerProvider = this.createOfflineMapProvider();
        break;
      default:
        console.log('ac-map-layer-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
        this.layerProvider = this.createOfflineMapProvider();
        break;
    }
    if (this.show) {
      this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
      this.imageryLayer.alpha = this.alpha;
      this.imageryLayer.contrast = this.contrast;
      this.imageryLayer.brightness = this.brightness;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && !changes['show'].isFirstChange()) {
      const showValue = changes['show'].currentValue;
      if (showValue) {
        if (this.imageryLayer) {
          this.imageryLayersCollection.add(this.imageryLayer, this.index);
        } else {
          this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
          this.imageryLayer.alpha = this.alpha;
          this.imageryLayer.contrast = this.contrast;
          this.imageryLayer.brightness = this.brightness;
        }
      } else if (this.imageryLayer) {
        this.imageryLayersCollection.remove(this.imageryLayer, false);
      }
    }

    if (changes['alpha'] && !changes['alpha'].isFirstChange() && this.imageryLayer) {
      this.imageryLayer.alpha = this.alpha;
    }
    if (changes['contrast'] && !changes['contrast'].isFirstChange() && this.imageryLayer) {
      this.imageryLayer.contrast = this.contrast;
    }
    if (changes['brightness'] && !changes['brightness'].isFirstChange() && this.imageryLayer) {
      this.imageryLayer.brightness = this.brightness;
    }
  }

  ngOnDestroy(): void {
    if (this.imageryLayer) {
      this.imageryLayersCollection.remove(this.imageryLayer, true);
    }
  }
}
