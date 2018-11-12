import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';
import { AcMapComponent } from '../../components/ac-map/ac-map.component';

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
@Injectable()
export class CesiumService {
  private cesiumViewer: any;
  private map: AcMapComponent;

  constructor(private ngZone: NgZone, private viewerFactory: ViewerFactory, @Optional() private viewerConfiguration: ViewerConfiguration) {}

  init(mapContainer: HTMLElement, map: AcMapComponent) {
    this.map = map;
    this.ngZone.runOutsideAngular(() => {
      const options = this.viewerConfiguration ? this.viewerConfiguration.viewerOptions : undefined;
      this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);

      if (
        this.viewerConfiguration &&
        this.viewerConfiguration.viewerModifier &&
        typeof this.viewerConfiguration.viewerModifier === 'function'
      ) {
        this.viewerConfiguration.viewerModifier(this.cesiumViewer);
      }
    });
  }

  /**
   * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
   * @returns {any}
   */
  getViewer() {
    return this.cesiumViewer;
  }

  /**
   * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
   * @returns {{Scene}|any}
   */
  getScene() {
    return this.cesiumViewer.scene;
  }

  /**
   * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
   * @returns {{HTMLCanvasElement}|any}
   */
  getCanvas(): HTMLCanvasElement {
    return this.cesiumViewer.canvas as HTMLCanvasElement;
  }

  getMap(): AcMapComponent {
    return this.map;
  }
}
