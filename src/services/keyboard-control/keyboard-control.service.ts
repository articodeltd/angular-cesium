import { isNumber } from 'util';
import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { CesiumService } from '../cesium/cesium.service';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';

export type KeyboardControlActionFn = (camera: any, scene: any, params: any, key: string) => boolean | void;
export type KeyboardControlValidationFn = (camera: any, scene: any, params: any, key: string) => boolean;

export interface KeyboardControlParams {
  action: KeyboardAction | KeyboardControlActionFn;
  validation?: KeyboardControlValidationFn;
  params?: { [paramName: string]: any };
}

export interface KeyboardControlDefinition {
  [keyboardCharCode: string]: KeyboardControlParams;
}

/**
 *  Service that manages keyboard keys and execute actions per request.
 *  Inject the keyboard control service into any layer, under your `ac-map` component,
 *  And defined you keyboard handlers using `setKeyboardControls`.
 *
 * <caption>Simple Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: { action: KeyboardAction.CAMERA_FORWARD },
 *       S: { action: KeyboardAction.CAMERA_BACKWARD },
 *       D: { action: KeyboardAction.CAMERA_RIGHT },
 *       A: { action: KeyboardAction.CAMERA_LEFT },
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 *
 * <caption>Advanced Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   private myCustomValue = 10;
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: {
 *          action: KeyboardAction.CAMERA_FORWARD,
 *          validate: (camera, scene, params, key) => {
 *            // Replace `checkCamera` you with your validation logic
 *            if (checkCamera(camera) || params.customParams === true) {
 *              return true;
 *            }
 *
 *            return false;
 *          },
 *          params: () => {
 *            return {
 *              myValue: this.myCustomValue,
 *            };
 *          },
 *        }
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 *
 */
@Injectable()
export class KeyboardControlService {
  private _currentDefinitions: KeyboardControlDefinition = null;
  private _viewer: any;
  private _scene: any;
  private _canvas: HTMLCanvasElement;
  private _activeDefinitions: KeyboardControlParams[] = [];
  private _keyMappingFn: Function = this.defaultKeyMappingFn;

  /**
   * Creats the keyboard control service.
   * @constructor
   */
  constructor(private cesiumService: CesiumService, @Inject(DOCUMENT) private document: any) {
  }

  /**
   * Initializes the keyboard control service.
   * @constructor
   */
  init() {
    this._viewer = this.cesiumService.getViewer();
    this._canvas = this.cesiumService.getCanvas();
    this._scene = this.cesiumService.getScene();
    this._canvas.addEventListener('click', () => {
      this._canvas.focus();
    });

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  /**
   * Sets the current map keyboard control configuration.
   * The configuration is a key mapping between a key string and a KeyboardControlDefinition:
   * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
   * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
   * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
   * - `params` is an object (or function that returns object) that will be passed into the action executor.
   * @param {KeyboardControlDefinition} definitions
   * @param {Function} keyMappingFn - Mapping function for custom keys
   */
  setKeyboardControls(definitions: KeyboardControlDefinition, keyMappingFn?: (keyEvent: KeyboardEvent) => string) {
    if (!definitions) {
      return this.removeKeyboardControls();
    }

    if (!this._currentDefinitions) {
      this.registerEvents();
    }

    this._currentDefinitions = definitions;
    this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;

    Object.keys(this._currentDefinitions).forEach(key => {
      this._activeDefinitions[key] = null;
    });
  }

  /**
   * Removes the current set of keyboard control items, and unregister from map events.
   */
  removeKeyboardControls() {
    this.unregisterEvents();
    this._currentDefinitions = null;
  }

  /**
   * Returns the current action that handles `char` key string, or `null` if not exists
   * @param {string} char
   */
  private getAction(char: string): KeyboardControlParams {
    return this._currentDefinitions[char] || null;
  }

  /**
   * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
   * @param {KeyboardEvent} keyEvent
   */
  private defaultKeyMappingFn(keyEvent: KeyboardEvent): string {
    return String.fromCharCode(keyEvent.keyCode);
  }

  /**
   * document's `keydown` event handler
   * @param {KeyboardEvent} e
   */
  private handleKeydown(e: KeyboardEvent) {
    const char = this._keyMappingFn(e);
    const action = this.getAction(char);

    if (action) {
      this._activeDefinitions[char] = action;
    }
  }

  /**
   * document's `keyup` event handler
   * @param {KeyboardEvent} e
   */
  private handleKeyup(e: KeyboardEvent) {
    const char = this._keyMappingFn(e);
    const action = this.getAction(char);

    if (action) {
      this._activeDefinitions[char] = null;
    }
  }

  /**
   * `tick` event handler that triggered by Cesium render loop
   */
  private handleTick() {
    const activeKeys = Object.keys(this._activeDefinitions);

    activeKeys.forEach(key => {
      const action = this._activeDefinitions[key];

      if (action !== null) {
        this.executeAction(action, key);
      }
    });
  }

  /**
   *
   * Params resolve function, returns object.
   * In case of params function, executes it and returns it's return value.
   * @param {any} paramsDef
   * @param {Camera} camera
   * @param {Scene} scene
   *
   * @returns {object}
   */
  private getParams(paramsDef: any, camera, scene): { [paramName: string]: any } {
    if (!paramsDef) {
      return {};
    }

    if (typeof paramsDef === 'function') {
      return paramsDef(camera, scene);
    }

    return paramsDef;
  }

  /**
   *
   * Executes a given `KeyboardControlParams` object.
   *
   * @param {KeyboardControlParams} execution
   * @param {string} key
   *
   */
  private executeAction(execution: KeyboardControlParams, key: string) {
    if (!this._currentDefinitions) {
      return;
    }

    let execute = true;
    const camera = this._viewer.camera;
    const params = this.getParams(execution.params, camera, this._scene);

    if (execution.validation) {
      execute = execution.validation(camera, this._scene, params, key);
    }

    if (execute === true) {
      if (isNumber(execution.action)) {
        const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];

        if (predefinedAction) {
          predefinedAction(camera, this._scene, params, key);
        }
      } else if (typeof execution.action === 'function') {
        const shouldCancelEvent = execution.action(camera, this._scene, params, key);

        if (shouldCancelEvent === true) {
          this._activeDefinitions[key] = null;
        }
      }
    }
  }

  /**
   * Registers to keydown, keyup of `document`, and `tick` of Cesium.
   */
  private registerEvents() {
    this.document.addEventListener('keydown', this.handleKeydown);
    this.document.addEventListener('keyup', this.handleKeyup);
    this._viewer.clock.onTick.addEventListener(this.handleTick);
  }

  /**
   * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
   */
  private unregisterEvents() {
    this.document.removeEventListener('keydown', this.handleKeydown);
    this.document.removeEventListener('keyup', this.handleKeyup);
    this._viewer.clock.onTick.removeEventListener(this.handleTick);
  }
}
