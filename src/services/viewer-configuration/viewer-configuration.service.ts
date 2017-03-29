import { Injectable } from '@angular/core';

/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ){
  *   viewerConfiguration.viewerOptions = { timeline: false };
  * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
@Injectable()
export class ViewerConfiguration {

  /**
   * cesium viewer options According to [Viewer]{@link https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=vie}
   */
  private _viewerOptions: any;

  get viewerOptions(): any {
    return this._viewerOptions;
  }

  set viewerOptions(value: any) {
    this._viewerOptions = value;
  }
}
