import { Inject, Injectable, NgZone } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { CesiumService } from '../cesium/cesium.service';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';

export type KeyboardControlActionFn = (cesiumService: CesiumService, params: any, event: KeyboardEvent) => boolean | void;
export type KeyboardControlValidationFn = (cesiumService: CesiumService, params: any, event: KeyboardEvent) => boolean;
export type KeyboardControlDoneFn = (cesiumService: CesiumService, event: KeyboardEvent) => boolean;

export interface KeyboardControlParams {
  action: KeyboardAction | KeyboardControlActionFn;
  validation?: KeyboardControlValidationFn;
  params?: { [paramName: string]: any };
  done?: KeyboardControlDoneFn;
}

export interface KeyboardControlDefinition {
  [keyboardCharCode: string]: KeyboardControlParams;
}

enum KeyEventState {
  IGNORED,
  NOT_PRESSED,
  PRESSED,
}

interface ActiveDefinition {
  keyboardEvent: KeyboardEvent;
  state: KeyEventState;
  action: KeyboardControlParams;
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
 * <b>Predefined keyboard actions:</b>
 * + `KeyboardAction.CAMERA_FORWARD` - Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_BACKWARD` - Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_UP` - Moves the camera up, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_DOWN` - Moves the camera down, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_RIGHT` - Moves the camera right, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LEFT` - Moves the camera left, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LOOK_RIGHT` - Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_LEFT` - Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_UP` - Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_DOWN` - Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_TWIST_RIGHT` - Twists the camera to the right, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_TWIST_LEFT` - Twists the camera to the left, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_ROTATE_RIGHT` - Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_LEFT` - Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_UP` - Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_DOWN` - Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ZOOM_IN` - Zoom in into the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 * + `KeyboardAction.CAMERA_ZOOM_OUT` -  Zoom out from the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 */
@Injectable()
export class KeyboardControlService {
  private _currentDefinitions: KeyboardControlDefinition = null;
  private _activeDefinitions: { [definitionKey: string]: ActiveDefinition } = {};
  private _keyMappingFn: Function = this.defaultKeyMappingFn;

  /**
   * Creats the keyboard control service.
   */
  constructor(private ngZone: NgZone, private cesiumService: CesiumService, @Inject(DOCUMENT) private document: any) {
  }

  /**
   * Initializes the keyboard control service.
   */
  init() {
    const canvas = this.cesiumService.getCanvas();
    canvas.addEventListener('click', () => {
      canvas.focus();
    });

    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleKeyup = this.handleKeyup.bind(this);
    this.handleTick = this.handleTick.bind(this);
  }

  /**
   * Sets the current map keyboard control definitions.
   * The definitions is a key mapping between a key string and a KeyboardControlDefinition:
   * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
   * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
   * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
   * - `params` is an object (or function that returns object) that will be passed into the action executor.
   * - `done` is a function that will be triggered when `keyup` is triggered.
   * @param definitions Keyboard Control Definition
   * @param keyMappingFn - Mapping function for custom keys
   * @param outsideOfAngularZone - if key down events will run outside of angular zone.
   */
  setKeyboardControls(definitions: KeyboardControlDefinition,
                      keyMappingFn?: (keyEvent: KeyboardEvent) => string,
                      outsideOfAngularZone = false) {
    if (!definitions) {
      return this.removeKeyboardControls();
    }

    if (!this._currentDefinitions) {
      this.registerEvents(outsideOfAngularZone);
    }

    this._currentDefinitions = definitions;
    this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;

    Object.keys(this._currentDefinitions).forEach(key => {
      this._activeDefinitions[key] = {
        state: KeyEventState.NOT_PRESSED,
        action: null,
        keyboardEvent: null,
      };
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
   */
  private getAction(char: string): KeyboardControlParams {
    return this._currentDefinitions[char] || null;
  }

  /**
   * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
   */
  private defaultKeyMappingFn(keyEvent: KeyboardEvent): string {
    return String.fromCharCode(keyEvent.keyCode);
  }

  /**
   * document's `keydown` event handler
   */
  private handleKeydown(e: KeyboardEvent) {
    const char = this._keyMappingFn(e);
    const action = this.getAction(char);

    if (action) {
      const actionState = this._activeDefinitions[char];

      if (actionState.state !== KeyEventState.IGNORED) {
        let execute = true;

        const params = this.getParams(action.params, e);

        if (action.validation) {
          execute = action.validation(this.cesiumService, params, e);
        }

        if (execute === true) {
          this._activeDefinitions[char] = {
            state: KeyEventState.PRESSED,
            action,
            keyboardEvent: e,
          };
        }
      }
    }
  }

  /**
   * document's `keyup` event handler
   */
  private handleKeyup(e: KeyboardEvent) {
    const char = this._keyMappingFn(e);
    const action = this.getAction(char);

    if (action) {
      this._activeDefinitions[char] = {
        state: KeyEventState.NOT_PRESSED,
        action: null,
        keyboardEvent: e,
      };

      if (action.done && typeof action.done === 'function') {
        action.done(this.cesiumService, e);
      }
    }
  }

  /**
   * `tick` event handler that triggered by Cesium render loop
   */
  private handleTick() {
    const activeKeys = Object.keys(this._activeDefinitions);

    activeKeys.forEach(key => {
      const actionState = this._activeDefinitions[key];

      if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
        this.executeAction(actionState.action, key, actionState.keyboardEvent);
      }
    });
  }

  /**
   *
   * Params resolve function, returns object.
   * In case of params function, executes it and returns it's return value.
   *
   */
  private getParams(paramsDef: any, keyboardEvent: KeyboardEvent): { [paramName: string]: any } {
    if (!paramsDef) {
      return {};
    }

    if (typeof paramsDef === 'function') {
      return paramsDef(this.cesiumService, keyboardEvent);
    }

    return paramsDef;
  }

  /**
   *
   * Executes a given `KeyboardControlParams` object.
   *
   */
  private executeAction(execution: KeyboardControlParams, key: string, keyboardEvent: KeyboardEvent) {
    if (!this._currentDefinitions) {
      return;
    }

    const params = this.getParams(execution.params, keyboardEvent);

    if (typeof execution.action === 'number') {
      const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action as number];

      if (predefinedAction) {
        predefinedAction(this.cesiumService, params, keyboardEvent);
      }
    } else if (typeof execution.action === 'function') {
      const shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);

      if (shouldCancelEvent === false) {
        this._activeDefinitions[key] = {
          state: KeyEventState.IGNORED,
          action: null,
          keyboardEvent: null,
        };
      }
    }
  }

  /**
   * Registers to keydown, keyup of `document`, and `tick` of Cesium.
   */
  private registerEvents(outsideOfAngularZone: boolean) {
    const registerToEvents = () => {
      this.document.addEventListener('keydown', this.handleKeydown);
      this.document.addEventListener('keyup', this.handleKeyup);
      this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
    };

    if (outsideOfAngularZone) {
      this.ngZone.runOutsideAngular(registerToEvents);
    } else {
      registerToEvents();
    }
  }

  /**
   * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
   */
  private unregisterEvents() {
    this.document.removeEventListener('keydown', this.handleKeydown);
    this.document.removeEventListener('keyup', this.handleKeyup);
    this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
  }
}
