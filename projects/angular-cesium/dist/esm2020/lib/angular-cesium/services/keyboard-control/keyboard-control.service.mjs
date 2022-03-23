import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { PREDEFINED_KEYBOARD_ACTIONS } from './predefined-actions';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
var KeyEventState;
(function (KeyEventState) {
    KeyEventState[KeyEventState["IGNORED"] = 0] = "IGNORED";
    KeyEventState[KeyEventState["NOT_PRESSED"] = 1] = "NOT_PRESSED";
    KeyEventState[KeyEventState["PRESSED"] = 2] = "PRESSED";
})(KeyEventState || (KeyEventState = {}));
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
export class KeyboardControlService {
    /**
     * Creats the keyboard control service.
     */
    constructor(ngZone, cesiumService, document) {
        this.ngZone = ngZone;
        this.cesiumService = cesiumService;
        this.document = document;
        this._currentDefinitions = null;
        this._activeDefinitions = {};
        this._keyMappingFn = this.defaultKeyMappingFn;
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
    setKeyboardControls(definitions, keyMappingFn, outsideOfAngularZone = false) {
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
    getAction(char) {
        return this._currentDefinitions[char] || null;
    }
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    defaultKeyMappingFn(keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    }
    /**
     * document's `keydown` event handler
     */
    handleKeydown(e) {
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
    handleKeyup(e) {
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
    handleTick() {
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
    getParams(paramsDef, keyboardEvent) {
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
    executeAction(execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        const params = this.getParams(execution.params, keyboardEvent);
        if (typeof execution.action == 'number') {
            const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
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
    registerEvents(outsideOfAngularZone) {
        const registerToEvents = () => {
            this.document.addEventListener('keydown', this.handleKeydown);
            this.document.addEventListener('keyup', this.handleKeyup);
            this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
        };
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    }
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     */
    unregisterEvents() {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    }
}
KeyboardControlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService, deps: [{ token: i0.NgZone }, { token: i1.CesiumService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
KeyboardControlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i1.CesiumService }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoia2V5Ym9hcmQtY29udHJvbC5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9rZXlib2FyZC1jb250cm9sL2tleWJvYXJkLWNvbnRyb2wuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsTUFBTSxFQUFFLFVBQVUsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUMzRCxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFHM0MsT0FBTyxFQUFFLDJCQUEyQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7OztBQWlCbkUsSUFBSyxhQUlKO0FBSkQsV0FBSyxhQUFhO0lBQ2hCLHVEQUFPLENBQUE7SUFDUCwrREFBVyxDQUFBO0lBQ1gsdURBQU8sQ0FBQTtBQUNULENBQUMsRUFKSSxhQUFhLEtBQWIsYUFBYSxRQUlqQjtBQVFEOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBdUdHO0FBRUgsTUFBTSxPQUFPLHNCQUFzQjtJQUtqQzs7T0FFRztJQUNILFlBQW9CLE1BQWMsRUFBVSxhQUE0QixFQUE0QixRQUFhO1FBQTdGLFdBQU0sR0FBTixNQUFNLENBQVE7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUE0QixhQUFRLEdBQVIsUUFBUSxDQUFLO1FBUHpHLHdCQUFtQixHQUE4QixJQUFJLENBQUM7UUFDdEQsdUJBQWtCLEdBQWtELEVBQUUsQ0FBQztRQUN2RSxrQkFBYSxHQUFhLElBQUksQ0FBQyxtQkFBbUIsQ0FBQztJQU0zRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJO1FBQ0YsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FB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b3J0IHsgSW5qZWN0LCBJbmplY3RhYmxlLCBOZ1pvbmUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgRE9DVU1FTlQgfSBmcm9tICdAYW5ndWxhci9jb21tb24nO1xyXG5pbXBvcnQgeyBLZXlib2FyZEFjdGlvbiB9IGZyb20gJy4uLy4uL21vZGVscy9hYy1rZXlib2FyZC1hY3Rpb24uZW51bSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQUkVERUZJTkVEX0tFWUJPQVJEX0FDVElPTlMgfSBmcm9tICcuL3ByZWRlZmluZWQtYWN0aW9ucyc7XHJcblxyXG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xBY3Rpb25GbiA9IChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBwYXJhbXM6IGFueSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW4gfCB2b2lkO1xyXG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xWYWxpZGF0aW9uRm4gPSAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgcGFyYW1zOiBhbnksIGV2ZW50OiBLZXlib2FyZEV2ZW50KSA9PiBib29sZWFuO1xyXG5leHBvcnQgdHlwZSBLZXlib2FyZENvbnRyb2xEb25lRm4gPSAoY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSwgZXZlbnQ6IEtleWJvYXJkRXZlbnQpID0+IGJvb2xlYW47XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleWJvYXJkQ29udHJvbFBhcmFtcyB7XHJcbiAgYWN0aW9uOiBLZXlib2FyZEFjdGlvbiB8IEtleWJvYXJkQ29udHJvbEFjdGlvbkZuO1xyXG4gIHZhbGlkYXRpb24/OiBLZXlib2FyZENvbnRyb2xWYWxpZGF0aW9uRm47XHJcbiAgcGFyYW1zPzogeyBbcGFyYW1OYW1lOiBzdHJpbmddOiBhbnkgfTtcclxuICBkb25lPzogS2V5Ym9hcmRDb250cm9sRG9uZUZuO1xyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIEtleWJvYXJkQ29udHJvbERlZmluaXRpb24ge1xyXG4gIFtrZXlib2FyZENoYXJDb2RlOiBzdHJpbmddOiBLZXlib2FyZENvbnRyb2xQYXJhbXM7XHJcbn1cclxuXHJcbmVudW0gS2V5RXZlbnRTdGF0ZSB7XHJcbiAgSUdOT1JFRCxcclxuICBOT1RfUFJFU1NFRCxcclxuICBQUkVTU0VELFxyXG59XHJcblxyXG5pbnRlcmZhY2UgQWN0aXZlRGVmaW5pdGlvbiB7XHJcbiAga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudDtcclxuICBzdGF0ZTogS2V5RXZlbnRTdGF0ZTtcclxuICBhY3Rpb246IEtleWJvYXJkQ29udHJvbFBhcmFtcztcclxufVxyXG5cclxuLyoqXHJcbiAqICBTZXJ2aWNlIHRoYXQgbWFuYWdlcyBrZXlib2FyZCBrZXlzIGFuZCBleGVjdXRlIGFjdGlvbnMgcGVyIHJlcXVlc3QuXHJcbiAqICBJbmplY3QgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZSBpbnRvIGFueSBsYXllciwgdW5kZXIgeW91ciBgYWMtbWFwYCBjb21wb25lbnQsXHJcbiAqICBBbmQgZGVmaW5lZCB5b3Uga2V5Ym9hcmQgaGFuZGxlcnMgdXNpbmcgYHNldEtleWJvYXJkQ29udHJvbHNgLlxyXG4gKlxyXG4gKiA8Y2FwdGlvbj5TaW1wbGUgRXhhbXBsZTwvY2FwdGlvbj5cclxuICogYGBgdHlwZXNjcmlwdFxyXG4gKiBDb21wb25lbnQoe1xyXG4gKiAgIHNlbGVjdG9yOiAna2V5Ym9hcmQtY29udHJvbC1sYXllcicsXHJcbiAqICAgdGVtcGxhdGU6ICcnLFxyXG4gKiB9KVxyXG4gKiBleHBvcnQgY2xhc3MgS2V5Ym9hcmRDb250cm9sTGF5ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcbiAqICAgY29uc3RydWN0b3IocHJpdmF0ZSBrZXlib2FyZENvbnRyb2xTZXJ2aWNlOiBLZXlib2FyZENvbnRyb2xTZXJ2aWNlKSB7fVxyXG4gKlxyXG4gKiAgIG5nT25Jbml0KCkge1xyXG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnNldEtleWJvYXJkQ29udHJvbHMoe1xyXG4gKiAgICAgICBXOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0ZPUldBUkQgfSxcclxuICogICAgICAgUzogeyBhY3Rpb246IEtleWJvYXJkQWN0aW9uLkNBTUVSQV9CQUNLV0FSRCB9LFxyXG4gKiAgICAgICBEOiB7IGFjdGlvbjogS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1JJR0hUIH0sXHJcbiAqICAgICAgIEE6IHsgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfTEVGVCB9LFxyXG4gKiAgICAgfSk7XHJcbiAqICAgIH1cclxuICpcclxuICogICBuZ09uRGVzdHJveSgpIHtcclxuICogICAgIHRoaXMua2V5Ym9hcmRDb250cm9sU2VydmljZS5yZW1vdmVLZXlib2FyZENvbnRyb2xzKCk7XHJcbiAqICAgfVxyXG4gKiB9XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiA8Y2FwdGlvbj5BZHZhbmNlZCBFeGFtcGxlPC9jYXB0aW9uPlxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIENvbXBvbmVudCh7XHJcbiAqICAgc2VsZWN0b3I6ICdrZXlib2FyZC1jb250cm9sLWxheWVyJyxcclxuICogICB0ZW1wbGF0ZTogJycsXHJcbiAqIH0pXHJcbiAqIGV4cG9ydCBjbGFzcyBLZXlib2FyZENvbnRyb2xMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25EZXN0cm95IHtcclxuICogICBjb25zdHJ1Y3Rvcihwcml2YXRlIGtleWJvYXJkQ29udHJvbFNlcnZpY2U6IEtleWJvYXJkQ29udHJvbFNlcnZpY2UpIHt9XHJcbiAqXHJcbiAqICAgcHJpdmF0ZSBteUN1c3RvbVZhbHVlID0gMTA7XHJcbiAqXHJcbiAqICAgbmdPbkluaXQoKSB7XHJcbiAqICAgICB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2Uuc2V0S2V5Ym9hcmRDb250cm9scyh7XHJcbiAqICAgICAgIFc6IHtcclxuICogICAgICAgICAgYWN0aW9uOiBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRk9SV0FSRCxcclxuICogICAgICAgICAgdmFsaWRhdGU6IChjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleSkgPT4ge1xyXG4gKiAgICAgICAgICAgIC8vIFJlcGxhY2UgYGNoZWNrQ2FtZXJhYCB5b3Ugd2l0aCB5b3VyIHZhbGlkYXRpb24gbG9naWNcclxuICogICAgICAgICAgICBpZiAoY2hlY2tDYW1lcmEoY2FtZXJhKSB8fCBwYXJhbXMuY3VzdG9tUGFyYW1zID09PSB0cnVlKSB7XHJcbiAqICAgICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICogICAgICAgICAgICB9XHJcbiAqXHJcbiAqICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gKiAgICAgICAgICB9LFxyXG4gKiAgICAgICAgICBwYXJhbXM6ICgpID0+IHtcclxuICogICAgICAgICAgICByZXR1cm4ge1xyXG4gKiAgICAgICAgICAgICAgbXlWYWx1ZTogdGhpcy5teUN1c3RvbVZhbHVlLFxyXG4gKiAgICAgICAgICAgIH07XHJcbiAqICAgICAgICAgIH0sXHJcbiAqICAgICAgICB9XHJcbiAqICAgICB9KTtcclxuICogICAgfVxyXG4gKlxyXG4gKiAgIG5nT25EZXN0cm95KCkge1xyXG4gKiAgICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLnJlbW92ZUtleWJvYXJkQ29udHJvbHMoKTtcclxuICogICB9XHJcbiAqIH1cclxuICogYGBgXHJcbiAqIDxiPlByZWRlZmluZWQga2V5Ym9hcmQgYWN0aW9uczo8L2I+XHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9GT1JXQVJEYCAtIE1vdmVzIHRoZSBjYW1lcmEgZm9yd2FyZCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xyXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9CQUNLV0FSRGAgLSBNb3ZlcyB0aGUgY2FtZXJhIGJhY2t3YXJkLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYG1vdmVSYXRlYCB0aGF0IGNvbnRyb2xzXHJcbiAqIHRoZSBmYWN0b3Igb2YgbW92ZW1lbnQsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGhlaWdodC5cclxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1VQYCAtIE1vdmVzIHRoZSBjYW1lcmEgdXAsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcclxuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxyXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfRE9XTmAgLSBNb3ZlcyB0aGUgY2FtZXJhIGRvd24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbW92ZVJhdGVgIHRoYXQgY29udHJvbHNcclxuICogdGhlIGZhY3RvciBvZiBtb3ZlbWVudCwgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgaGVpZ2h0LlxyXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUklHSFRgIC0gTW92ZXMgdGhlIGNhbWVyYSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xyXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MRUZUYCAtIE1vdmVzIHRoZSBjYW1lcmEgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBtb3ZlUmF0ZWAgdGhhdCBjb250cm9sc1xyXG4gKiB0aGUgZmFjdG9yIG9mIG1vdmVtZW50LCBhY2NvcmRpbmcgdG8gdGhlIGNhbWVyYSBoZWlnaHQuXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX1JJR0hUYCAtIENoYW5nZXMgdGhlIGNhbWVyYSB0byBsb29rIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0XHJcbiAqIGNvbnRyb2xzIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cclxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfTEVGVGAgLSBDaGFuZ2VzIHRoZSBjYW1lcmEgdG8gbG9vayB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0XHJcbiAqIGNvbnRyb2xzIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cclxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX0xPT0tfVVBgIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgdXAsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgbG9va0ZhY3RvcmAgdGhhdCBjb250cm9sc1xyXG4gKiB0aGUgZmFjdG9yIG9mIGxvb2tpbmcsIGFjY29yZGluZyB0byB0aGUgY2FtZXJhIGN1cnJlbnQgcG9zaXRpb24uXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9MT09LX0RPV05gIC0gQ2hhbmdlcyB0aGUgY2FtZXJhIHRvIGxvb2sgZG93biwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBsb29rRmFjdG9yYCB0aGF0IGNvbnRyb2xzXHJcbiAqIHRoZSBmYWN0b3Igb2YgbG9va2luZywgYWNjb3JkaW5nIHRvIHRoZSBjYW1lcmEgY3VycmVudCBwb3NpdGlvbi5cclxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1RXSVNUX1JJR0hUYCAtIFR3aXN0cyB0aGUgY2FtZXJhIHRvIHRoZSByaWdodCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbW91bnRgIHRoYXQgY29udHJvbHNcclxuICogdGhlIHR3aXN0IGFtb3VudFxyXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfVFdJU1RfTEVGVGAgLSBUd2lzdHMgdGhlIGNhbWVyYSB0byB0aGUgbGVmdCwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkIGBhbW91bnRgIHRoYXQgY29udHJvbHNcclxuICogdGhlIHR3aXN0IGFtb3VudFxyXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfUk9UQVRFX1JJR0hUYCAtIFJvdGF0ZXMgdGhlIGNhbWVyYSB0byB0aGUgcmlnaHQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcclxuICogdGhlIHJvdGF0aW9uIGFuZ2xlXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfTEVGVGAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgdG8gdGhlIGxlZnQsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcclxuICogdGhlIHJvdGF0aW9uIGFuZ2xlXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfVVBgIC0gUm90YXRlcyB0aGUgY2FtZXJhIHVwd2FyZHMsIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZCBgYW5nbGVgIHRoYXQgY29udHJvbHNcclxuICogdGhlIHJvdGF0aW9uIGFuZ2xlXHJcbiAqICsgYEtleWJvYXJkQWN0aW9uLkNBTUVSQV9ST1RBVEVfRE9XTmAgLSBSb3RhdGVzIHRoZSBjYW1lcmEgZG93bndhcmRzLCBhY2NlcHRzIGEgbnVtZXJpYyBwYXJhbWV0ZXIgbmFtZWQgYGFuZ2xlYCB0aGF0IGNvbnRyb2xzXHJcbiAqIHRoZSByb3RhdGlvbiBhbmdsZVxyXG4gKiArIGBLZXlib2FyZEFjdGlvbi5DQU1FUkFfWk9PTV9JTmAgLSBab29tIGluIGludG8gdGhlIGN1cnJlbnQgY2FtZXJhIGNlbnRlciBwb3NpdGlvbiwgYWNjZXB0cyBhIG51bWVyaWMgcGFyYW1ldGVyIG5hbWVkXHJcbiAqIGBhbW91bnRgIHRoYXQgY29udHJvbHMgdGhlIGFtb3VudCBvZiB6b29tIGluIG1ldGVycy5cclxuICogKyBgS2V5Ym9hcmRBY3Rpb24uQ0FNRVJBX1pPT01fT1VUYCAtICBab29tIG91dCBmcm9tIHRoZSBjdXJyZW50IGNhbWVyYSBjZW50ZXIgcG9zaXRpb24sIGFjY2VwdHMgYSBudW1lcmljIHBhcmFtZXRlciBuYW1lZFxyXG4gKiBgYW1vdW50YCB0aGF0IGNvbnRyb2xzIHRoZSBhbW91bnQgb2Ygem9vbSBpbiBtZXRlcnMuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBLZXlib2FyZENvbnRyb2xTZXJ2aWNlIHtcclxuICBwcml2YXRlIF9jdXJyZW50RGVmaW5pdGlvbnM6IEtleWJvYXJkQ29udHJvbERlZmluaXRpb24gPSBudWxsO1xyXG4gIHByaXZhdGUgX2FjdGl2ZURlZmluaXRpb25zOiB7IFtkZWZpbml0aW9uS2V5OiBzdHJpbmddOiBBY3RpdmVEZWZpbml0aW9uIH0gPSB7fTtcclxuICBwcml2YXRlIF9rZXlNYXBwaW5nRm46IEZ1bmN0aW9uID0gdGhpcy5kZWZhdWx0S2V5TWFwcGluZ0ZuO1xyXG5cclxuICAvKipcclxuICAgKiBDcmVhdHMgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZS5cclxuICAgKi9cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIG5nWm9uZTogTmdab25lLCBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQ6IGFueSkge1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogSW5pdGlhbGl6ZXMgdGhlIGtleWJvYXJkIGNvbnRyb2wgc2VydmljZS5cclxuICAgKi9cclxuICBpbml0KCkge1xyXG4gICAgY29uc3QgY2FudmFzID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldENhbnZhcygpO1xyXG4gICAgY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKCkgPT4ge1xyXG4gICAgICBjYW52YXMuZm9jdXMoKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHRoaXMuaGFuZGxlS2V5ZG93biA9IHRoaXMuaGFuZGxlS2V5ZG93bi5iaW5kKHRoaXMpO1xyXG4gICAgdGhpcy5oYW5kbGVLZXl1cCA9IHRoaXMuaGFuZGxlS2V5dXAuYmluZCh0aGlzKTtcclxuICAgIHRoaXMuaGFuZGxlVGljayA9IHRoaXMuaGFuZGxlVGljay5iaW5kKHRoaXMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogU2V0cyB0aGUgY3VycmVudCBtYXAga2V5Ym9hcmQgY29udHJvbCBkZWZpbml0aW9ucy5cclxuICAgKiBUaGUgZGVmaW5pdGlvbnMgaXMgYSBrZXkgbWFwcGluZyBiZXR3ZWVuIGEga2V5IHN0cmluZyBhbmQgYSBLZXlib2FyZENvbnRyb2xEZWZpbml0aW9uOlxyXG4gICAqIC0gYGFjdGlvbmAgaXMgYSBwcmVkZWZpbmUgYWN0aW9uIGZyb20gYEtleWJvYXJkQWN0aW9uYCBlbnVtLCBvciBhIGN1c3RvbSBtZXRob2Q6XHJcbiAgICogYChjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleSkgPT4gYm9vbGVhbiB8IHZvaWRgIC0gcmV0dXJuaW5nIGZhbHNlIHdpbGwgY2FuY2VsIHRoZSBjdXJyZW50IGtleWRvd24uXHJcbiAgICogLSBgdmFsaWRhdGlvbmAgaXMgYSBtZXRob2QgdGhhdCB2YWxpZGF0ZXMgaWYgdGhlIGV2ZW50IHNob3VsZCBvY2N1ciBvciBub3QgKGBjYW1lcmEsIHNjZW5lLCBwYXJhbXMsIGtleWApXHJcbiAgICogLSBgcGFyYW1zYCBpcyBhbiBvYmplY3QgKG9yIGZ1bmN0aW9uIHRoYXQgcmV0dXJucyBvYmplY3QpIHRoYXQgd2lsbCBiZSBwYXNzZWQgaW50byB0aGUgYWN0aW9uIGV4ZWN1dG9yLlxyXG4gICAqIC0gYGRvbmVgIGlzIGEgZnVuY3Rpb24gdGhhdCB3aWxsIGJlIHRyaWdnZXJlZCB3aGVuIGBrZXl1cGAgaXMgdHJpZ2dlcmVkLlxyXG4gICAqIEBwYXJhbSBkZWZpbml0aW9ucyBLZXlib2FyZCBDb250cm9sIERlZmluaXRpb25cclxuICAgKiBAcGFyYW0ga2V5TWFwcGluZ0ZuIC0gTWFwcGluZyBmdW5jdGlvbiBmb3IgY3VzdG9tIGtleXNcclxuICAgKiBAcGFyYW0gb3V0c2lkZU9mQW5ndWxhclpvbmUgLSBpZiBrZXkgZG93biBldmVudHMgd2lsbCBydW4gb3V0c2lkZSBvZiBhbmd1bGFyIHpvbmUuXHJcbiAgICovXHJcbiAgc2V0S2V5Ym9hcmRDb250cm9scyhkZWZpbml0aW9uczogS2V5Ym9hcmRDb250cm9sRGVmaW5pdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgIGtleU1hcHBpbmdGbj86IChrZXlFdmVudDogS2V5Ym9hcmRFdmVudCkgPT4gc3RyaW5nLFxyXG4gICAgICAgICAgICAgICAgICAgICAgb3V0c2lkZU9mQW5ndWxhclpvbmUgPSBmYWxzZSkge1xyXG4gICAgaWYgKCFkZWZpbml0aW9ucykge1xyXG4gICAgICByZXR1cm4gdGhpcy5yZW1vdmVLZXlib2FyZENvbnRyb2xzKCk7XHJcbiAgICB9XHJcblxyXG4gICAgaWYgKCF0aGlzLl9jdXJyZW50RGVmaW5pdGlvbnMpIHtcclxuICAgICAgdGhpcy5yZWdpc3RlckV2ZW50cyhvdXRzaWRlT2ZBbmd1bGFyWm9uZSk7XHJcbiAgICB9XHJcblxyXG4gICAgdGhpcy5fY3VycmVudERlZmluaXRpb25zID0gZGVmaW5pdGlvbnM7XHJcbiAgICB0aGlzLl9rZXlNYXBwaW5nRm4gPSBrZXlNYXBwaW5nRm4gfHwgdGhpcy5kZWZhdWx0S2V5TWFwcGluZ0ZuO1xyXG5cclxuICAgIE9iamVjdC5rZXlzKHRoaXMuX2N1cnJlbnREZWZpbml0aW9ucykuZm9yRWFjaChrZXkgPT4ge1xyXG4gICAgICB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1trZXldID0ge1xyXG4gICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLk5PVF9QUkVTU0VELFxyXG4gICAgICAgIGFjdGlvbjogbnVsbCxcclxuICAgICAgICBrZXlib2FyZEV2ZW50OiBudWxsLFxyXG4gICAgICB9O1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBSZW1vdmVzIHRoZSBjdXJyZW50IHNldCBvZiBrZXlib2FyZCBjb250cm9sIGl0ZW1zLCBhbmQgdW5yZWdpc3RlciBmcm9tIG1hcCBldmVudHMuXHJcbiAgICovXHJcbiAgcmVtb3ZlS2V5Ym9hcmRDb250cm9scygpIHtcclxuICAgIHRoaXMudW5yZWdpc3RlckV2ZW50cygpO1xyXG4gICAgdGhpcy5fY3VycmVudERlZmluaXRpb25zID0gbnVsbDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgYWN0aW9uIHRoYXQgaGFuZGxlcyBgY2hhcmAga2V5IHN0cmluZywgb3IgYG51bGxgIGlmIG5vdCBleGlzdHNcclxuICAgKi9cclxuICBwcml2YXRlIGdldEFjdGlvbihjaGFyOiBzdHJpbmcpOiBLZXlib2FyZENvbnRyb2xQYXJhbXMge1xyXG4gICAgcmV0dXJuIHRoaXMuX2N1cnJlbnREZWZpbml0aW9uc1tjaGFyXSB8fCBudWxsO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVGhlIGRlZmF1bHQgYGRlZmF1bHRLZXlNYXBwaW5nRm5gIHRoYXQgbWFwcyBgS2V5Ym9hcmRFdmVudGAgaW50byBhIGtleSBzdHJpbmcuXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBkZWZhdWx0S2V5TWFwcGluZ0ZuKGtleUV2ZW50OiBLZXlib2FyZEV2ZW50KTogc3RyaW5nIHtcclxuICAgIHJldHVybiBTdHJpbmcuZnJvbUNoYXJDb2RlKGtleUV2ZW50LmtleUNvZGUpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogZG9jdW1lbnQncyBga2V5ZG93bmAgZXZlbnQgaGFuZGxlclxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFuZGxlS2V5ZG93bihlOiBLZXlib2FyZEV2ZW50KSB7XHJcbiAgICBjb25zdCBjaGFyID0gdGhpcy5fa2V5TWFwcGluZ0ZuKGUpO1xyXG4gICAgY29uc3QgYWN0aW9uID0gdGhpcy5nZXRBY3Rpb24oY2hhcik7XHJcblxyXG4gICAgaWYgKGFjdGlvbikge1xyXG4gICAgICBjb25zdCBhY3Rpb25TdGF0ZSA9IHRoaXMuX2FjdGl2ZURlZmluaXRpb25zW2NoYXJdO1xyXG5cclxuICAgICAgaWYgKGFjdGlvblN0YXRlLnN0YXRlICE9PSBLZXlFdmVudFN0YXRlLklHTk9SRUQpIHtcclxuICAgICAgICBsZXQgZXhlY3V0ZSA9IHRydWU7XHJcblxyXG4gICAgICAgIGNvbnN0IHBhcmFtcyA9IHRoaXMuZ2V0UGFyYW1zKGFjdGlvbi5wYXJhbXMsIGUpO1xyXG5cclxuICAgICAgICBpZiAoYWN0aW9uLnZhbGlkYXRpb24pIHtcclxuICAgICAgICAgIGV4ZWN1dGUgPSBhY3Rpb24udmFsaWRhdGlvbih0aGlzLmNlc2l1bVNlcnZpY2UsIHBhcmFtcywgZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiAoZXhlY3V0ZSA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNbY2hhcl0gPSB7XHJcbiAgICAgICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLlBSRVNTRUQsXHJcbiAgICAgICAgICAgIGFjdGlvbixcclxuICAgICAgICAgICAga2V5Ym9hcmRFdmVudDogZSxcclxuICAgICAgICAgIH07XHJcbiAgICAgICAgfVxyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBkb2N1bWVudCdzIGBrZXl1cGAgZXZlbnQgaGFuZGxlclxyXG4gICAqL1xyXG4gIHByaXZhdGUgaGFuZGxlS2V5dXAoZTogS2V5Ym9hcmRFdmVudCkge1xyXG4gICAgY29uc3QgY2hhciA9IHRoaXMuX2tleU1hcHBpbmdGbihlKTtcclxuICAgIGNvbnN0IGFjdGlvbiA9IHRoaXMuZ2V0QWN0aW9uKGNoYXIpO1xyXG5cclxuICAgIGlmIChhY3Rpb24pIHtcclxuICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNbY2hhcl0gPSB7XHJcbiAgICAgICAgc3RhdGU6IEtleUV2ZW50U3RhdGUuTk9UX1BSRVNTRUQsXHJcbiAgICAgICAgYWN0aW9uOiBudWxsLFxyXG4gICAgICAgIGtleWJvYXJkRXZlbnQ6IGUsXHJcbiAgICAgIH07XHJcblxyXG4gICAgICBpZiAoYWN0aW9uLmRvbmUgJiYgdHlwZW9mIGFjdGlvbi5kb25lID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgYWN0aW9uLmRvbmUodGhpcy5jZXNpdW1TZXJ2aWNlLCBlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYHRpY2tgIGV2ZW50IGhhbmRsZXIgdGhhdCB0cmlnZ2VyZWQgYnkgQ2VzaXVtIHJlbmRlciBsb29wXHJcbiAgICovXHJcbiAgcHJpdmF0ZSBoYW5kbGVUaWNrKCkge1xyXG4gICAgY29uc3QgYWN0aXZlS2V5cyA9IE9iamVjdC5rZXlzKHRoaXMuX2FjdGl2ZURlZmluaXRpb25zKTtcclxuXHJcbiAgICBhY3RpdmVLZXlzLmZvckVhY2goa2V5ID0+IHtcclxuICAgICAgY29uc3QgYWN0aW9uU3RhdGUgPSB0aGlzLl9hY3RpdmVEZWZpbml0aW9uc1trZXldO1xyXG5cclxuICAgICAgaWYgKGFjdGlvblN0YXRlICE9PSBudWxsICYmIGFjdGlvblN0YXRlLmFjdGlvbiAhPT0gbnVsbCAmJiBhY3Rpb25TdGF0ZS5zdGF0ZSA9PT0gS2V5RXZlbnRTdGF0ZS5QUkVTU0VEKSB7XHJcbiAgICAgICAgdGhpcy5leGVjdXRlQWN0aW9uKGFjdGlvblN0YXRlLmFjdGlvbiwga2V5LCBhY3Rpb25TdGF0ZS5rZXlib2FyZEV2ZW50KTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKlxyXG4gICAqIFBhcmFtcyByZXNvbHZlIGZ1bmN0aW9uLCByZXR1cm5zIG9iamVjdC5cclxuICAgKiBJbiBjYXNlIG9mIHBhcmFtcyBmdW5jdGlvbiwgZXhlY3V0ZXMgaXQgYW5kIHJldHVybnMgaXQncyByZXR1cm4gdmFsdWUuXHJcbiAgICpcclxuICAgKi9cclxuICBwcml2YXRlIGdldFBhcmFtcyhwYXJhbXNEZWY6IGFueSwga2V5Ym9hcmRFdmVudDogS2V5Ym9hcmRFdmVudCk6IHsgW3BhcmFtTmFtZTogc3RyaW5nXTogYW55IH0ge1xyXG4gICAgaWYgKCFwYXJhbXNEZWYpIHtcclxuICAgICAgcmV0dXJuIHt9O1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0eXBlb2YgcGFyYW1zRGVmID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIHJldHVybiBwYXJhbXNEZWYodGhpcy5jZXNpdW1TZXJ2aWNlLCBrZXlib2FyZEV2ZW50KTtcclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gcGFyYW1zRGVmO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICpcclxuICAgKiBFeGVjdXRlcyBhIGdpdmVuIGBLZXlib2FyZENvbnRyb2xQYXJhbXNgIG9iamVjdC5cclxuICAgKlxyXG4gICAqL1xyXG4gIHByaXZhdGUgZXhlY3V0ZUFjdGlvbihleGVjdXRpb246IEtleWJvYXJkQ29udHJvbFBhcmFtcywga2V5OiBzdHJpbmcsIGtleWJvYXJkRXZlbnQ6IEtleWJvYXJkRXZlbnQpIHtcclxuICAgIGlmICghdGhpcy5fY3VycmVudERlZmluaXRpb25zKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBwYXJhbXMgPSB0aGlzLmdldFBhcmFtcyhleGVjdXRpb24ucGFyYW1zLCBrZXlib2FyZEV2ZW50KTtcclxuXHJcbiAgICBpZiAodHlwZW9mIGV4ZWN1dGlvbi5hY3Rpb24gPT0gJ251bWJlcicpIHtcclxuICAgICAgY29uc3QgcHJlZGVmaW5lZEFjdGlvbiA9IFBSRURFRklORURfS0VZQk9BUkRfQUNUSU9OU1tleGVjdXRpb24uYWN0aW9uIGFzIG51bWJlcl07XHJcblxyXG4gICAgICBpZiAocHJlZGVmaW5lZEFjdGlvbikge1xyXG4gICAgICAgIHByZWRlZmluZWRBY3Rpb24odGhpcy5jZXNpdW1TZXJ2aWNlLCBwYXJhbXMsIGtleWJvYXJkRXZlbnQpO1xyXG4gICAgICB9XHJcbiAgICB9IGVsc2UgaWYgKHR5cGVvZiBleGVjdXRpb24uYWN0aW9uID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIGNvbnN0IHNob3VsZENhbmNlbEV2ZW50ID0gZXhlY3V0aW9uLmFjdGlvbih0aGlzLmNlc2l1bVNlcnZpY2UsIHBhcmFtcywga2V5Ym9hcmRFdmVudCk7XHJcblxyXG4gICAgICBpZiAoc2hvdWxkQ2FuY2VsRXZlbnQgPT09IGZhbHNlKSB7XHJcbiAgICAgICAgdGhpcy5fYWN0aXZlRGVmaW5pdGlvbnNba2V5XSA9IHtcclxuICAgICAgICAgIHN0YXRlOiBLZXlFdmVudFN0YXRlLklHTk9SRUQsXHJcbiAgICAgICAgICBhY3Rpb246IG51bGwsXHJcbiAgICAgICAgICBrZXlib2FyZEV2ZW50OiBudWxsLFxyXG4gICAgICAgIH07XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlZ2lzdGVycyB0byBrZXlkb3duLCBrZXl1cCBvZiBgZG9jdW1lbnRgLCBhbmQgYHRpY2tgIG9mIENlc2l1bS5cclxuICAgKi9cclxuICBwcml2YXRlIHJlZ2lzdGVyRXZlbnRzKG91dHNpZGVPZkFuZ3VsYXJab25lOiBib29sZWFuKSB7XHJcbiAgICBjb25zdCByZWdpc3RlclRvRXZlbnRzID0gKCkgPT4ge1xyXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xyXG4gICAgICB0aGlzLmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleXVwJywgdGhpcy5oYW5kbGVLZXl1cCk7XHJcbiAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jbG9jay5vblRpY2suYWRkRXZlbnRMaXN0ZW5lcih0aGlzLmhhbmRsZVRpY2spO1xyXG4gICAgfTtcclxuXHJcbiAgICBpZiAob3V0c2lkZU9mQW5ndWxhclpvbmUpIHtcclxuICAgICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIocmVnaXN0ZXJUb0V2ZW50cyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICByZWdpc3RlclRvRXZlbnRzKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBVbnJlZ2lzdGVycyB0byBrZXlkb3duLCBrZXl1cCBvZiBgZG9jdW1lbnRgLCBhbmQgYHRpY2tgIG9mIENlc2l1bS5cclxuICAgKi9cclxuICBwcml2YXRlIHVucmVnaXN0ZXJFdmVudHMoKSB7XHJcbiAgICB0aGlzLmRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzLmhhbmRsZUtleWRvd24pO1xyXG4gICAgdGhpcy5kb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXl1cCcsIHRoaXMuaGFuZGxlS2V5dXApO1xyXG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNsb2NrLm9uVGljay5yZW1vdmVFdmVudExpc3RlbmVyKHRoaXMuaGFuZGxlVGljayk7XHJcbiAgfVxyXG59XHJcbiJdfQ==