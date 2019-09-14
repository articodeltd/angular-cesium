import { Component, OnInit, Input, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { Checker } from '../../utils/checker';
import { MapTerrainProviderOptions } from '../../models/map-terrain-provider-options.enum';

/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
@Component({
  selector: 'ac-map-terrain-provider',
  template: '',
})
export class AcMapTerrainProviderComponent implements OnInit, OnChanges, OnDestroy {

  /**
   * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
   */
  @Input()
  options: { url?: string } = {};

  /**
   * the provider
   */
  @Input()
  provider: any;

  /**
   * show (optional) - Determines if the map layer is shown.
   */
  @Input()
  show = true;

  private terrainProvider: any;
  private defaultTerrainProvider: any;

  constructor(private cesiumService: CesiumService) {
  }

  ngOnInit(): void {
    if (!Checker.present(this.options.url) && this.provider !== MapTerrainProviderOptions.Ellipsoid && this.provider !== MapTerrainProviderOptions.WorldTerrain) {
      throw new Error('options must have a url');
    }
    this.defaultTerrainProvider = this.cesiumService.getViewer().terrainProvider;
    switch (this.provider) {
      case MapTerrainProviderOptions.CesiumTerrain:
      case MapTerrainProviderOptions.ArcGISTiledElevation:
      case MapTerrainProviderOptions.GoogleEarthEnterprise:
      case MapTerrainProviderOptions.VRTheWorld:
      case MapTerrainProviderOptions.Ellipsoid:
        this.terrainProvider = new this.provider(this.options);
        break;
      case MapTerrainProviderOptions.WorldTerrain:
        this.terrainProvider = this.provider(this.options);
        break;
      default:
        console.log('ac-map-terrain-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
        this.terrainProvider = this.defaultTerrainProvider;
        break;
    }
    if (this.show) {
      this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['show'] && !changes['show'].isFirstChange()) {
      const showValue = changes['show'].currentValue;
      if (showValue) {
        if (this.terrainProvider) {
          this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
        }
      } else {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
      }
    }
  }

  ngOnDestroy(): void {
    this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
  }
}
