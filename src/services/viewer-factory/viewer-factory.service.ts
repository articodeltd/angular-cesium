;
import { Injectable } from '@angular/core';

@Injectable()
export class ViewerFactory {
  cesium: any;

  constructor() {
    this.cesium = Cesium;
  }

  /**
   * Creates a viewer with default or custom options
   * @param mapContainer - container to initialize the viewer on
   * @param options - Options to create the viewer with - Optional

   * @returns {any} new viewer
   */
  createViewer(mapContainer: HTMLElement, options?: any) {
    // For backwards compatibility, TODO: should be removed
    if (!window['CESIUM_BASE_URL']) {
      window['CESIUM_BASE_URL'] = '/node_modules/cesium/Build/Cesium';
    }

    if (options) {
      return new this.cesium.Viewer(mapContainer, options);
    } else {
      return new this.cesium.Viewer(mapContainer,
        {
          // Poor internet connection - use default globe image, TODO: should be removed
          imageryProvider : Cesium.createTileMapServiceImageryProvider({
            url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
          }),
          baseLayerPicker : false,
          geocoder : false
        });
    }
  }
}
