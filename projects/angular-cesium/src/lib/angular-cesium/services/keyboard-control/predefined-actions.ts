import { KeyboardAction } from '../../models/ac-keyboard-action.enum';
import { KeyboardControlActionFn } from './keyboard-control.service';
import { CesiumService } from '../cesium/cesium.service';

const CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
const CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
const CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
const CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;

export const PREDEFINED_KEYBOARD_ACTIONS: { [key: number]: KeyboardControlActionFn } = {
  /**
   * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_FORWARD]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveForward(moveRate);
  },
  /**
   * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_BACKWARD]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveBackward(moveRate);
  },
  /**
   * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_UP]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveUp(moveRate);
  },
  /**
   * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_DOWN]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveDown(moveRate);
  },
  /**
   * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_RIGHT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveRight(moveRate);
  },
  /**
   * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
   * the factor of movement, according to the camera height.
   */
  [KeyboardAction.CAMERA_LEFT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const scene = cesiumService.getScene();
    const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
    const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
    camera.moveLeft(moveRate);
  },
  /**
   * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
   * the factor of looking, according to the camera current position.
   */
  [KeyboardAction.CAMERA_LOOK_RIGHT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookRight(currentPosition.latitude * lookFactor);
  },
  /**
   * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
   * the factor of looking, according to the camera current position.
   */
  [KeyboardAction.CAMERA_LOOK_LEFT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookLeft(currentPosition.latitude * lookFactor);
  },
  /**
   * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
   * the factor of looking, according to the camera current position.
   */
  [KeyboardAction.CAMERA_LOOK_UP]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookUp(currentPosition.longitude * (lookFactor * -1));
  },
  /**
   * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
   * the factor of looking, according to the camera current position.
   */
  [KeyboardAction.CAMERA_LOOK_DOWN]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const currentPosition = camera.positionCartographic;
    const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
    camera.lookDown(currentPosition.longitude * (lookFactor * -1));
  },
  /**
   * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
   * the twist amount
   */
  [KeyboardAction.CAMERA_TWIST_RIGHT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
    camera.twistRight(lookFactor);
  },
  /**
   * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
   * the twist amount
   */
  [KeyboardAction.CAMERA_TWIST_LEFT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
    camera.twistLeft(lookFactor);
  },
  /**
   * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
   * the rotation angle
   */
  [KeyboardAction.CAMERA_ROTATE_RIGHT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateRight(lookFactor);
  },
  /**
   * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
   * the rotation angle
   */
  [KeyboardAction.CAMERA_ROTATE_LEFT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateLeft(lookFactor);
  },
  /**
   * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
   * the rotation angle
   */
  [KeyboardAction.CAMERA_ROTATE_UP]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateUp(lookFactor);
  },
  /**
   * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
   * the rotation angle
   */
  [KeyboardAction.CAMERA_ROTATE_DOWN]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
    camera.rotateDown(lookFactor);
  },
  /**
   * Zoom in into the current camera center position, accepts a numeric parameter named
   * `amount` that controls the amount of zoom in meters.
   */
  [KeyboardAction.CAMERA_ZOOM_IN]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const amount = params.amount;
    camera.zoomIn(amount);
  },
  /**
   * Zoom out from the current camera center position, accepts a numeric parameter named
   * `amount` that controls the amount of zoom in meters.
   */
  [KeyboardAction.CAMERA_ZOOM_OUT]: (cesiumService: CesiumService, params: any) => {
    const camera = cesiumService.getViewer().camera;
    const amount = params.amount;
    camera.zoomOut(amount);
  },
};
