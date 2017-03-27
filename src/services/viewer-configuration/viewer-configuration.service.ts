import { Injectable } from '@angular/core';

/**
 * Service for setting cesium viewer map options.
 * According to [Viewer]{@link https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=vie}
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * @example
 * constructor(viewerConf :ViewerConfiguration ){
  *   viewerConfiguration.viewerOptions = { timeline: false };
  * }
 *
 * +notice this configuration will for all ac-map-components in your component.
 */
@Injectable()
export class ViewerConfiguration {
  private _viwerOptions: any;

  get viwerOptions(): any {
    return this._viwerOptions;
  }

  set viwerOptions(value: any) {
    this._viwerOptions = value;
  }
}