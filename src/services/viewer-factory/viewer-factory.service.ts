;
import { Injectable } from '@angular/core';

@Injectable()
export class ViewerFactory {
  cesium: any;
  viewersMap = new Map<string, any>();

  constructor() {
    this.cesium = Cesium;
  }
  
  /**
   *
   * @param {string} id of the map
   * @returns Cesium viewer object
   */
  getViewer(id: string) {
    return this.viewersMap.get(id);
  }
  
  /**
   * Creates a viewer with default or custom options
   * @param mapContainer - container to initialize the viewer on
   * @param options - Options to create the viewer with - Optional
   * @param viewerId - map id name
   *
   * @returns {any} new viewer
   */
  createViewer(mapContainer: HTMLElement, viewerId: string, options?: any ) {
    // For backwards compatibility, TODO: should be removed
    if (!window['CESIUM_BASE_URL']) {
      window['CESIUM_BASE_URL'] = '/node_modules/cesium/Build/Cesium';
    }
    
    let viewer = null;
    if (options) {
      viewer = new this.cesium.Viewer(mapContainer, options);
    } else {
      viewer = new this.cesium.Viewer(mapContainer,
        {
          // Poor internet connection - use default globe image, TODO: should be removed
          imageryProvider : Cesium.createTileMapServiceImageryProvider({
            url : Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
          }),
          baseLayerPicker : false,
          geocoder : false
        });
    }
    
    this.viewersMap.set(viewerId, viewer);
    return viewer;
  }
}
