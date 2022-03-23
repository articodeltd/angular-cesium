import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
@Injectable()
export class CesiumService {
  private cesiumViewer: any;
  private mapContainer: HTMLElement;

  constructor(private ngZone: NgZone, private viewerFactory: ViewerFactory, @Optional() private viewerConfiguration: ViewerConfiguration) {
  }

  init(mapContainer: HTMLElement) {
    this.mapContainer = mapContainer;
    this.ngZone.runOutsideAngular(() => {
      const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
      this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);

      const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
      if (typeof viewerModifier === 'function') {
        viewerModifier(this.cesiumViewer);
      }
    });
  }

  /**
   * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
   * @returns cesiumViewer
   */
  getViewer() {
    return this.cesiumViewer;
  }

  /**
   * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
   * @returns cesium scene
   */
  getScene() {
    return this.cesiumViewer.scene;
  }

  /**
   * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
   * @returns cesium canvas
   */
  getCanvas(): HTMLCanvasElement {
    return this.cesiumViewer.canvas as HTMLCanvasElement;
  }

  getMapContainer(): HTMLElement {
    return this.mapContainer;
  }
}
