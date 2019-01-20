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
   *
   * @returns new viewer
   */
  createViewer(mapContainer: HTMLElement, options?: any) {
    let viewer = null;
    if (options) {
      viewer = new this.cesium.Viewer(mapContainer, {
        contextOptions: {
          webgl: {preserveDrawingBuffer: true}
        },
        ...options
      });
    } else {
      viewer = new this.cesium.Viewer(mapContainer,
        {
          // Poor internet connection - use default globe image, TODO: should be removed
          imageryProvider: Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
          }),
          baseLayerPicker: false,
          geocoder: false,
          contextOptions: {
            webgl: {preserveDrawingBuffer: true}
          },
        });
    }

    return viewer;
  }
}
