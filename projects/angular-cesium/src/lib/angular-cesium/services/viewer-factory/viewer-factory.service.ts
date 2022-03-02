import { Injectable } from '@angular/core';

import { Viewer } from 'cesium';

@Injectable()
export class ViewerFactory {

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
      viewer = new Viewer(mapContainer, {
        contextOptions: {
          webgl: {preserveDrawingBuffer: true}
        },
        ...options
      });
    } else {
      viewer = new Viewer(mapContainer,
        {
          contextOptions: {
            webgl: {preserveDrawingBuffer: true}
          },
        });
    }

    return viewer;
  }
}
