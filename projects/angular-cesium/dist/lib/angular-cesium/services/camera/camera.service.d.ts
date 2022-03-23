import { CesiumService } from '../cesium/cesium.service';
import { SceneMode } from '../../models/scene-mode.enum';
import * as i0 from "@angular/core";
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
export declare class CameraService {
    static PERFORMANCE_2D_ALTITUDE: number;
    private viewer;
    private scene;
    private camera;
    private screenSpaceCameraController;
    private morphListenerCancelFn;
    private lastRotate;
    private lastTilt;
    private lastLook;
    private isSceneModePerformance2D;
    constructor();
    init(cesiumService: CesiumService): void;
    _listenToSceneModeMorph(callback: Function): void;
    _revertCameraProperties(): void;
    /**
     * Gets the scene's camera
     */
    getCamera(): any;
    /**
     * Gets the scene's screenSpaceCameraController
     */
    getScreenSpaceCameraController(): any;
    /**
     * Gets the minimum zoom value in meters
     */
    getMinimumZoom(): number;
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    setMinimumZoom(amount: number): void;
    /**
     * Gets the maximum zoom value in meters
     */
    getMaximumZoom(): number;
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    setMaximumZoom(amount: number): void;
    /**
     * Sets if the camera is able to tilt
     */
    enableTilt(tilt: boolean): void;
    /**
     * Sets if the camera is able to rotate
     */
    enableRotate(rotate: boolean): void;
    /**
     * Sets if the camera is able to free-look
     */
    enableLook(lock: boolean): void;
    /**
     * Sets if the camera is able to translate
     */
    enableTranslate(translate: boolean): void;
    /**
     * Sets if the camera is able to zoom
     */
    enableZoom(zoom: boolean): void;
    /**
     * Sets if the camera receives inputs
     */
    enableInputs(inputs: boolean): void;
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    setSceneMode(sceneMode: SceneMode, duration?: number): void;
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    cameraFlyTo(options: any): any;
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    flyTo(target: any, options?: any): any;
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    zoomIn(amount: number): any;
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    zoomOut(amount: number): any;
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    zoomTo(target: any, offset?: any): any;
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    setView(options: any): void;
    /**
     * Set camera's rotation
     */
    setRotation(degreesInRadians: number): void;
    /**
     * Locks or unlocks camera rotation
     */
    lockRotation(lock: boolean): void;
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    trackEntity(cesiumEntity?: any, options?: {
        flyTo: boolean;
        flyToDuration?: number;
        altitude?: number;
    }): Promise<void>;
    untrackEntity(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<CameraService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CameraService>;
}
