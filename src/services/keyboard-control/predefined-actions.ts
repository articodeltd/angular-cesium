import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { KeyboardControlActionFn } from './keyboard-control.service';

export const PREDEFINED_KEYBOARD_ACTIONS: {[key: number]: KeyboardControlActionFn} = {
  [KeyboardAction.CAMERA_FORWARD]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveForward(moveRate);
  },
  [KeyboardAction.CAMERA_BACKWARD]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveBackward(moveRate);
  },
  [KeyboardAction.CAMERA_UP]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveUp(moveRate);
  },
  [KeyboardAction.CAMERA_DOWN]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveDown(moveRate);
  },
  [KeyboardAction.CAMERA_RIGHT]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveRight(moveRate);
  },
  [KeyboardAction.CAMERA_LEFT]: (camera, scene) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / 100.0;
    camera.moveLeft(moveRate);
  }
};
