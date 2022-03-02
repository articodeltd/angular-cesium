import { Injectable } from '@angular/core';

import { Cartesian3, Cartographic, JulianDate } from 'cesium';
import { Math as cMath} from 'cesium';

import { CesiumService } from '../cesium/cesium.service';
import { SceneMode } from '../../models/scene-mode.enum';

/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
@Injectable()
export class CameraService {
  static PERFORMANCE_2D_ALTITUDE = 25000000;

  private viewer: any;
  private scene: any;
  private camera: any;
  private screenSpaceCameraController: any;
  private morphListenerCancelFn: any;
  private lastRotate: boolean;
  private lastTilt: boolean;
  private lastLook: boolean;
  private isSceneModePerformance2D = false;

  constructor() {
  }

  init(cesiumService: CesiumService) {
    this.viewer = cesiumService.getViewer();
    this.scene = cesiumService.getScene();
    this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
    this.camera = this.scene.camera;
    this.lastRotate = this.screenSpaceCameraController.enableRotate;
    this.lastTilt = this.screenSpaceCameraController.enableTilt;
    this.lastLook = this.screenSpaceCameraController.enableLook;
  }

  _listenToSceneModeMorph(callback: Function) {
    this.morphListenerCancelFn = this.scene.morphStart.addEventListener(
      callback
    );
  }

  _revertCameraProperties() {
    this.isSceneModePerformance2D = false;
    this.enableTilt(this.lastTilt);
    this.enableRotate(this.lastRotate);
    this.enableLook(this.lastLook);
  }

  /**
   * Gets the scene's camera
   */
  getCamera() {
    return this.camera;
  }

  /**
   * Gets the scene's screenSpaceCameraController
   */
  getScreenSpaceCameraController() {
    return this.screenSpaceCameraController;
  }

  /**
   * Gets the minimum zoom value in meters
   */
  getMinimumZoom(): number {
    return this.screenSpaceCameraController.minimumZoomDistance;
  }

  /**
   * Sets the minimum zoom value in meters
   * @param zoom amount
   */
  setMinimumZoom(amount: number): void {
    this.screenSpaceCameraController.minimumZoomDistance = amount;
  }

  /**
   * Gets the maximum zoom value in meters
   */
  getMaximumZoom(): number {
    return this.screenSpaceCameraController.maximumZoomDistance;
  }

  /**
   * Sets the maximum zoom value in meters
   * @param zoom amount
   */
  setMaximumZoom(amount: number): void {
    this.screenSpaceCameraController.maximumZoomDistance = amount;
  }

  /**
   * Sets if the camera is able to tilt
   */
  enableTilt(tilt: boolean): void {
    this.screenSpaceCameraController.enableTilt = tilt;
  }

  /**
   * Sets if the camera is able to rotate
   */
  enableRotate(rotate: boolean): void {
    this.screenSpaceCameraController.enableRotate = rotate;
  }

  /**
   * Sets if the camera is able to free-look
   */
  enableLook(lock: boolean): void {
    this.screenSpaceCameraController.enableLook = lock;
  }

  /**
   * Sets if the camera is able to translate
   */
  enableTranslate(translate: boolean): void {
    this.screenSpaceCameraController.enableTranslate = translate;
  }

  /**
   * Sets if the camera is able to zoom
   */
  enableZoom(zoom: boolean): void {
    this.screenSpaceCameraController.enableZoom = zoom;
  }

  /**
   * Sets if the camera receives inputs
   */
  enableInputs(inputs: boolean): void {
    this.screenSpaceCameraController.enableInputs = inputs;
  }

  /**
   * Sets the map's SceneMode
   * @param sceneMode - The SceneMode to morph the scene into.
   * @param duration - The duration of scene morph animations, in seconds
   */
  setSceneMode(sceneMode: SceneMode, duration?: number) {
    switch (sceneMode) {
      case SceneMode.SCENE3D: {
        if (this.isSceneModePerformance2D) {
          this._revertCameraProperties();
        }

        this.scene.morphTo3D(duration);

        break;
      }
      case SceneMode.COLUMBUS_VIEW: {
        if (this.isSceneModePerformance2D) {
          this._revertCameraProperties();
        }

        this.scene.morphToColumbusView(duration);

        break;
      }
      case SceneMode.SCENE2D: {
        if (this.isSceneModePerformance2D) {
          this._revertCameraProperties();
        }
        this.scene.morphTo2D(duration);

        break;
      }
      case SceneMode.PERFORMANCE_SCENE2D: {
        this.isSceneModePerformance2D = true;
        this.lastLook = this.screenSpaceCameraController.enableLook;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.screenSpaceCameraController.enableTilt = false;
        this.screenSpaceCameraController.enableRotate = false;
        this.screenSpaceCameraController.enableLook = false;
        if (this.morphListenerCancelFn) {
          this.morphListenerCancelFn();
        }
        this.scene.morphToColumbusView(duration);
        const morphCompleteEventListener = this.scene.morphComplete.addEventListener(
          () => {
            this.camera.setView({
              destination: Cartesian3.fromDegrees(
                0.0,
                0.0,
                Math.min(
                  CameraService.PERFORMANCE_2D_ALTITUDE,
                  this.getMaximumZoom()
                )
              ),
              orientation: {
                pitch: cMath.toRadians(-90)
              }
            });
            morphCompleteEventListener();
            this._listenToSceneModeMorph(
              this._revertCameraProperties.bind(this)
            );
          }
        );

        break;
      }
    }
  }

  /**
   * Flies the camera to a destination
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
   */
  cameraFlyTo(options: any) {
    return this.camera.flyTo(options);
  }

  /**
   * Flies the camera to a target
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
   * @returns Promise<boolean>
   */
  flyTo(target: any, options?: any) {
    return this.viewer.flyTo(target, options);
  }

  /**
   * Zooms amount along the camera's view vector.
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
   */
  zoomIn(amount: number) {
    return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
  }

  /**
   * Zooms amount along the opposite direction of the camera's view vector.
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
   */
  zoomOut(amount: number) {
    return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
  }

  /**
   * Zoom the camera to a target
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
   * @returns Promise<boolean>
   */
  zoomTo(target: any, offset?: any) {
    return this.viewer.zoomTo(target, offset);
  }

  /**
   * Flies the camera to a destination
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
   * @param options viewer options
   */
  setView(options: any) {
    this.camera.setView(options);
  }

  /**
   * Set camera's rotation
   */
  setRotation(degreesInRadians: number) {
    this.setView({orientation: {heading: degreesInRadians}});
  }

  /**
   * Locks or unlocks camera rotation
   */
  lockRotation(lock: boolean) {
    this.scene.screenSpaceCameraController.enableRotate = !lock;
  }

  /**
   * Make the camera track a specific entity
   * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
   * @param cesiumEntity - cesium entity( billboard, polygon...) to track
   * @param options - track entity options
   */
  trackEntity(
    cesiumEntity?: any,
    options?: { flyTo: boolean; flyToDuration?: number; altitude?: number }
  ) {
    const flyTo = (options && options.flyTo) || false;

    this.viewer.trackedEntity = undefined;
    return new Promise<void>(resolve => {
      if (flyTo) {
        const flyToDuration = (options && options.flyToDuration) || 1;
        const altitude = (options && options.altitude) || 10000;

        // Calc entity flyTo position and wanted altitude
        const entPosCar3 = cesiumEntity.position.getValue(JulianDate.now());
        const entPosCart = Cartographic.fromCartesian(entPosCar3);
        const zoomAmount = altitude - entPosCart.height;
        entPosCart.height = altitude;
        const flyToPosition = Cartesian3.fromRadians(
          entPosCart.longitude,
          entPosCart.latitude,
          entPosCart.height
        );

        this.cameraFlyTo({
          duration: flyToDuration,
          destination: flyToPosition,
          complete: () => {
            this.viewer.trackedEntity = cesiumEntity;
            setTimeout(() => {
              if (zoomAmount > 0) {
                this.camera.zoomOut(zoomAmount);
              } else {
                this.camera.zoomIn(zoomAmount);
              }
            }, 0);
            resolve();
          }
        });
      } else {
        this.viewer.trackedEntity = cesiumEntity;
        resolve();
      }
    });
  }

  untrackEntity() {
    this.trackEntity();
  }
}
