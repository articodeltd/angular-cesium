import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { KeyboardControlActionFn } from './keyboard-control.service';

const CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
const CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
const CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
const CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;

export const PREDEFINED_KEYBOARD_ACTIONS: {[key: number]: KeyboardControlActionFn} = {
  [KeyboardAction.CAMERA_FORWARD]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveForward(moveRate);
  },
  [KeyboardAction.CAMERA_BACKWARD]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveBackward(moveRate);
  },
  [KeyboardAction.CAMERA_UP]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveUp(moveRate);
  },
  [KeyboardAction.CAMERA_DOWN]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveDown(moveRate);
  },
  [KeyboardAction.CAMERA_RIGHT]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveRight(moveRate);
  },
  [KeyboardAction.CAMERA_LEFT]: (camera, scene, params: any) => {
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveLeft(moveRate);
  },
  [KeyboardAction.CAMERA_LOOK_RIGHT]: (camera, scene, params: any) => {
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookRight(currentPosition.latitude * lookFactor);
  },
  [KeyboardAction.CAMERA_LOOK_LEFT]: (camera, scene, params: any) => {
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookLeft(currentPosition.latitude * lookFactor);
  },
  [KeyboardAction.CAMERA_LOOK_UP]: (camera, scene, params: any) => {
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookUp(currentPosition.longitude * (lookFactor * -1));
  },
  [KeyboardAction.CAMERA_LOOK_DOWN]: (camera, scene, params: any) => {
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookDown(currentPosition.longitude * (lookFactor * -1));
  },
  [KeyboardAction.CAMERA_TWIST_RIGHT]: (camera, scene, params: any) => {
    const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
    camera.twistRight(lookFactor);
  },
  [KeyboardAction.CAMERA_TWIST_LEFT]: (camera, scene, params: any) => {
    const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
    camera.twistLeft(lookFactor);
  },
  [KeyboardAction.CAMERA_ROTATE_RIGHT]: (camera, scene, params: any) => {
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateRight(lookFactor);
  },
  [KeyboardAction.CAMERA_ROTATE_LEFT]: (camera, scene, params: any) => {
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateLeft(lookFactor);
  },
  [KeyboardAction.CAMERA_ROTATE_UP]: (camera, scene, params: any) => {
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateUp(lookFactor);
  },
  [KeyboardAction.CAMERA_ROTATE_DOWN]: (camera, scene, params: any) => {
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateDown(lookFactor);
  },
  [KeyboardAction.CAMERA_ZOOM_IN]: (camera, scene, params: any) => {
    const amount = params.amount;
    camera.zoomIn(amount);
  },
  [KeyboardAction.CAMERA_ZOOM_OUT]: (camera, scene, params: any) => {
    const amount = params.amount;
    camera.zoomOut(amount);
  },
};
