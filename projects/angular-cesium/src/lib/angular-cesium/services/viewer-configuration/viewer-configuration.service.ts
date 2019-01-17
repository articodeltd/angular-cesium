import { Injectable } from '@angular/core';

/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
@Injectable()
export class ViewerConfiguration {
  /**
   * cesium viewer options According to [Viewer]{@link https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=vie}
   */
  private _viewerOptions: object | object[];
  private _viewerModifier: Function | Function[];
  private nextViewerOptionsIndex = 0;
  private nextViewerModifierIndex = 0;

  get viewerOptions(): object | object[] {
    return this._viewerOptions;
  }

  Ï;

  getNextViewerOptions(): object | object[] {
    if (this._viewerOptions instanceof Array) {
      return this._viewerOptions[this.nextViewerOptionsIndex++];
    } else {
      return this._viewerOptions;
    }
  }

  /**
   * Can be used to set initial map viewer options.
   * If there is more than one map you can give the function an array of options.
   * The map initialized first will be set with the first option object in the options array and so on.
   */
  set viewerOptions(value: object | object[]) {
    this._viewerOptions = value;
  }

  get viewerModifier(): Function | Function[] {
    return this._viewerModifier;
  }

  getNextViewerModifier(): Function | Function[] {
    if (this._viewerModifier instanceof Array) {
      return this._viewerModifier[this.nextViewerModifierIndex++];
    } else {
      return this._viewerModifier;
    }
  }

  /**
   * Can be used to set map viewer options after the map has been initialized.
   * If there is more than one map you can give the function an array of functions.
   * The map initialized first will be set with the first option object in the options array and so on.
   */
  set viewerModifier(value: Function | Function[]) {
    this._viewerModifier = value;
  }
}
