import { Inject, Injectable } from '@angular/core';
import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { CesiumService } from '../cesium/cesium.service';
import { DOCUMENT } from '@angular/platform-browser';
import { isNumber } from 'util';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';

export type KeyboardControlActionFn = (camera: any, scene: any, params: any, key: string) => boolean | void;
export type KeyboardControlValidationFn = (camera: any, scene: any, params: any, key: string) => boolean;

export interface KeyboardControlParams {
  action: KeyboardAction | KeyboardControlActionFn;
  validation?: KeyboardControlValidationFn;
  params?: { [paramName: string]: any };
}

interface KeyboardControlDefinition {
  [keyboardCharCode: string]: KeyboardControlParams;
}

@Injectable()
export class KeyboardControlService {
  private _currentDefinitions: KeyboardControlDefinition = null;
  private _viewer: any;
  private _scene: any;
  private _canvas: HTMLCanvasElement;
  private _activeDefinitions: KeyboardControlParams[] = [];
  private _eventHandler = null;

  constructor(private cesiumService: CesiumService, @Inject(DOCUMENT) private document: HTMLDocument) {
  }

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

  setKeyboardControls(definitions: KeyboardControlDefinition) {
    if (!definitions) {
      return this.removeKeyboardControls();
    }

    if (!this._currentDefinitions) {
      this.registerEvents();
    }

    this._currentDefinitions = definitions;

    Object.keys(this._currentDefinitions).forEach(key => {
      this._activeDefinitions[key] = null;
    });
  }

  removeKeyboardControls() {
    this.unregisterEvents();
    this._currentDefinitions = null;
  }

  getAction(char: string): KeyboardControlParams {
    return this._currentDefinitions[char] || null;
  }

  private handleKeydown(e: KeyboardEvent) {
    const keyCode = e.keyCode;
    const char = String.fromCharCode(keyCode);
    const action = this.getAction(char);

    if (action) {
      this._activeDefinitions[char] = action;
    }
  }

  private handleKeyup(e: KeyboardEvent) {
    const keyCode = e.keyCode;
    const char = String.fromCharCode(keyCode);
    const action = this.getAction(char);

    if (action) {
      this._activeDefinitions[char] = null;
    }
  }

  private handleTick() {
    const activeKeys = Object.keys(this._activeDefinitions);

    activeKeys.forEach(key => {
      const action = this._activeDefinitions[key];

      if (action !== null) {
        this.executeAction(action, key);
      }
    });
  }

  private getParams(paramsDef, camera, scene) {
    if (!paramsDef) {
      return {};
    }

    if (typeof paramsDef === 'function') {
      return paramsDef(camera, scene);
    }

    return paramsDef;
  }

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

  registerEvents() {
    this.document.addEventListener('keydown', this.handleKeydown);
    this.document.addEventListener('keyup', this.handleKeyup);
    this._viewer.clock.onTick.addEventListener(this.handleTick);
  }

  unregisterEvents() {
    this.document.removeEventListener('keydown', this.handleKeydown);
    this.document.removeEventListener('keyup', this.handleKeyup);
    this._viewer.clock.onTick.removeEventListener(this.handleTick);
  }
}
