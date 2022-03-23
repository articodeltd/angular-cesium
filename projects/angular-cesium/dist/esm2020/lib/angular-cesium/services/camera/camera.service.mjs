import { Injectable } from '@angular/core';
import { Cartesian3, Cartographic, JulianDate } from 'cesium';
import { Math as cMath } from 'cesium';
import { SceneMode } from '../../models/scene-mode.enum';
import * as i0 from "@angular/core";
/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
export class CameraService {
    constructor() {
        this.isSceneModePerformance2D = false;
    }
    init(cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    }
    _listenToSceneModeMorph(callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
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
    getMinimumZoom() {
        return this.screenSpaceCameraController.minimumZoomDistance;
    }
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    setMinimumZoom(amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    }
    /**
     * Gets the maximum zoom value in meters
     */
    getMaximumZoom() {
        return this.screenSpaceCameraController.maximumZoomDistance;
    }
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    setMaximumZoom(amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    }
    /**
     * Sets if the camera is able to tilt
     */
    enableTilt(tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    }
    /**
     * Sets if the camera is able to rotate
     */
    enableRotate(rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    }
    /**
     * Sets if the camera is able to free-look
     */
    enableLook(lock) {
        this.screenSpaceCameraController.enableLook = lock;
    }
    /**
     * Sets if the camera is able to translate
     */
    enableTranslate(translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    }
    /**
     * Sets if the camera is able to zoom
     */
    enableZoom(zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    }
    /**
     * Sets if the camera receives inputs
     */
    enableInputs(inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    }
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    setSceneMode(sceneMode, duration) {
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
                const morphCompleteEventListener = this.scene.morphComplete.addEventListener(() => {
                    this.camera.setView({
                        destination: Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
                        orientation: {
                            pitch: cMath.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener();
                    this._listenToSceneModeMorph(this._revertCameraProperties.bind(this));
                });
                break;
            }
        }
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    cameraFlyTo(options) {
        return this.camera.flyTo(options);
    }
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    flyTo(target, options) {
        return this.viewer.flyTo(target, options);
    }
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    zoomIn(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    zoomOut(amount) {
        return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    zoomTo(target, offset) {
        return this.viewer.zoomTo(target, offset);
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    setView(options) {
        this.camera.setView(options);
    }
    /**
     * Set camera's rotation
     */
    setRotation(degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    }
    /**
     * Locks or unlocks camera rotation
     */
    lockRotation(lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    }
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    trackEntity(cesiumEntity, options) {
        const flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise(resolve => {
            if (flyTo) {
                const flyToDuration = (options && options.flyToDuration) || 1;
                const altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                const entPosCar3 = cesiumEntity.position.getValue(JulianDate.now());
                const entPosCart = Cartographic.fromCartesian(entPosCar3);
                const zoomAmount = altitude - entPosCart.height;
                entPosCart.height = altitude;
                const flyToPosition = Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: () => {
                        this.viewer.trackedEntity = cesiumEntity;
                        setTimeout(() => {
                            if (zoomAmount > 0) {
                                this.camera.zoomOut(zoomAmount);
                            }
                            else {
                                this.camera.zoomIn(zoomAmount);
                            }
                        }, 0);
                        resolve();
                    }
                });
            }
            else {
                this.viewer.trackedEntity = cesiumEntity;
                resolve();
            }
        });
    }
    untrackEntity() {
        this.trackEntity();
    }
}
CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
CameraService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CameraService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2FtZXJhLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUM5RCxPQUFPLEVBQUUsSUFBSSxJQUFJLEtBQUssRUFBQyxNQUFNLFFBQVEsQ0FBQztBQUd0QyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sOEJBQThCLENBQUM7O0FBRXpEOzs7O0dBSUc7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQWF4QjtRQUZRLDZCQUF3QixHQUFHLEtBQUssQ0FBQztJQUd6QyxDQUFDO0lBRUQsSUFBSSxDQUFDLGFBQTRCO1FBQy9CLElBQUksQ0FBQyxNQUFNLEdBQUcsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQ3hDLElBQUksQ0FBQyxLQUFLLEdBQUcsYUFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ3RDLElBQUksQ0FBQywyQkFBMkIsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLDJCQUEyQixDQUFDO1FBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7UUFDaEMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsMkJBQTJCLENBQUMsWUFBWSxDQUFDO1FBQ2hFLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDLFVBQVUsQ0FBQztRQUM1RCxJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQywyQkFBMkIsQ0FBQyxVQUFVLENBQUM7SUFDOUQsQ0FBQztJQUVELHVCQUF1QixDQUFDLFFBQWtCO1FBQ3hDLElBQUks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QyxXQUFXLENBQzFDLFVBQVUsQ0FBQyxTQUFTLEVBQ3BCLFVBQVUsQ0FBQyxRQUFRLEVBQ25CLFVBQVUsQ0FBQyxNQUFNLENBQ2xCLENBQUM7Z0JBRUYsSUFBSSxDQUFDLFdBQVcsQ0FBQztvQkFDZixRQUFRLEVBQUUsYUFBYTtvQkFDdkIsV0FBVyxFQUFFLGFBQWE7b0JBQzFCLFFBQVEsRUFBRSxHQUFHLEVBQUU7d0JBQ2IsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLEdBQUcsWUFBWSxDQUFDO3dCQUN6QyxVQUFVLENBQUMsR0FBRyxFQUFFOzRCQUNkLElBQUksVUFBVSxHQUFHLENBQUMsRUFBRTtnQ0FDbEIsSUFBSSxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLENBQUM7NkJBQ2pDO2lDQUFNO2dDQUNMLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDOzZCQUNoQzt3QkFDSCxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7d0JBQ04sT0FBTyxFQUFFLENBQUM7b0JBQ1osQ0FBQztpQkFDRixDQUFDLENBQUM7YUFDSjtpQkFBTTtnQkFDTCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsR0FBRyxZQUFZLENBQUM7Z0JBQ3pDLE9BQU8sRUFBRSxDQUFDO2FBQ1g7UUFDSCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxhQUFhO1FBQ1gsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7O0FBMVRNLHFDQUF1QixHQUFHLFFBQVEsQ0FBQzswR0FEL0IsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBDYXJ0ZXNpYW4zLCBDYXJ0b2dyYXBoaWMsIEp1bGlhbkRhdGUgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBNYXRoIGFzIGNNYXRofSBmcm9tICdjZXNpdW0nO1xyXG5cclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IFNjZW5lTW9kZSB9IGZyb20gJy4uLy4uL21vZGVscy9zY2VuZS1tb2RlLmVudW0nO1xyXG5cclxuLyoqXHJcbiAqICBUaGUgc2VydmljZSBleHBvc2VzIHRoZSBzY2VuZSdzIGNhbWVyYSBhbmQgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXHJcbiAqICBTY2VuZU1vZGUuUEVSRk9STUFOQ0VfU0NFTkUyRCAtICBpcyBhIDNEIHNjZW5lIG1vZGUgdGhhdCBhY3RzIGxpa2UgQ2VzaXVtIDJEIG1vZGUsXHJcbiAqICBidXQgaXMgbW9yZSBlZmZpY2llbnQgcGVyZm9ybWFuY2Ugd2lzZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIENhbWVyYVNlcnZpY2Uge1xyXG4gIHN0YXRpYyBQRVJGT1JNQU5DRV8yRF9BTFRJVFVERSA9IDI1MDAwMDAwO1xyXG5cclxuICBwcml2YXRlIHZpZXdlcjogYW55O1xyXG4gIHByaXZhdGUgc2NlbmU6IGFueTtcclxuICBwcml2YXRlIGNhbWVyYTogYW55O1xyXG4gIHByaXZhdGUgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyOiBhbnk7XHJcbiAgcHJpdmF0ZSBtb3JwaExpc3RlbmVyQ2FuY2VsRm46IGFueTtcclxuICBwcml2YXRlIGxhc3RSb3RhdGU6IGJvb2xlYW47XHJcbiAgcHJpdmF0ZSBsYXN0VGlsdDogYm9vbGVhbjtcclxuICBwcml2YXRlIGxhc3RMb29rOiBib29sZWFuO1xyXG4gIHByaXZhdGUgaXNTY2VuZU1vZGVQZXJmb3JtYW5jZTJEID0gZmFsc2U7XHJcblxyXG4gIGNvbnN0cnVjdG9yKCkge1xyXG4gIH1cclxuXHJcbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICB0aGlzLnZpZXdlciA9IGNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XHJcbiAgICB0aGlzLnNjZW5lID0gY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xyXG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIgPSB0aGlzLnNjZW5lLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlcjtcclxuICAgIHRoaXMuY2FtZXJhID0gdGhpcy5zY2VuZS5jYW1lcmE7XHJcbiAgICB0aGlzLmxhc3RSb3RhdGUgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGU7XHJcbiAgICB0aGlzLmxhc3RUaWx0ID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlVGlsdDtcclxuICAgIHRoaXMubGFzdExvb2sgPSB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rO1xyXG4gIH1cclxuXHJcbiAgX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoY2FsbGJhY2s6IEZ1bmN0aW9uKSB7XHJcbiAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbiA9IHRoaXMuc2NlbmUubW9ycGhTdGFydC5hZGRFdmVudExpc3RlbmVyKFxyXG4gICAgICBjYWxsYmFja1xyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIF9yZXZlcnRDYW1lcmFQcm9wZXJ0aWVzKCkge1xyXG4gICAgdGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQgPSBmYWxzZTtcclxuICAgIHRoaXMuZW5hYmxlVGlsdCh0aGlzLmxhc3RUaWx0KTtcclxuICAgIHRoaXMuZW5hYmxlUm90YXRlKHRoaXMubGFzdFJvdGF0ZSk7XHJcbiAgICB0aGlzLmVuYWJsZUxvb2sodGhpcy5sYXN0TG9vayk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBHZXRzIHRoZSBzY2VuZSdzIGNhbWVyYVxyXG4gICAqL1xyXG4gIGdldENhbWVyYSgpIHtcclxuICAgIHJldHVybiB0aGlzLmNhbWVyYTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIHNjZW5lJ3Mgc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyXHJcbiAgICovXHJcbiAgZ2V0U2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogR2V0cyB0aGUgbWluaW11bSB6b29tIHZhbHVlIGluIG1ldGVyc1xyXG4gICAqL1xyXG4gIGdldE1pbmltdW1ab29tKCk6IG51bWJlciB7XHJcbiAgICByZXR1cm4gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgdGhlIG1pbmltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcclxuICAgKiBAcGFyYW0gem9vbSBhbW91bnRcclxuICAgKi9cclxuICBzZXRNaW5pbXVtWm9vbShhbW91bnQ6IG51bWJlcik6IHZvaWQge1xyXG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIubWluaW11bVpvb21EaXN0YW5jZSA9IGFtb3VudDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEdldHMgdGhlIG1heGltdW0gem9vbSB2YWx1ZSBpbiBtZXRlcnNcclxuICAgKi9cclxuICBnZXRNYXhpbXVtWm9vbSgpOiBudW1iZXIge1xyXG4gICAgcmV0dXJuIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBtYXhpbXVtIHpvb20gdmFsdWUgaW4gbWV0ZXJzXHJcbiAgICogQHBhcmFtIHpvb20gYW1vdW50XHJcbiAgICovXHJcbiAgc2V0TWF4aW11bVpvb20oYW1vdW50OiBudW1iZXIpOiB2b2lkIHtcclxuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLm1heGltdW1ab29tRGlzdGFuY2UgPSBhbW91bnQ7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB0aWx0XHJcbiAgICovXHJcbiAgZW5hYmxlVGlsdCh0aWx0OiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUaWx0ID0gdGlsdDtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIHJvdGF0ZVxyXG4gICAqL1xyXG4gIGVuYWJsZVJvdGF0ZShyb3RhdGU6IGJvb2xlYW4pOiB2b2lkIHtcclxuICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVJvdGF0ZSA9IHJvdGF0ZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSBpcyBhYmxlIHRvIGZyZWUtbG9va1xyXG4gICAqL1xyXG4gIGVuYWJsZUxvb2sobG9jazogYm9vbGVhbik6IHZvaWQge1xyXG4gICAgdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlTG9vayA9IGxvY2s7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB0cmFuc2xhdGVcclxuICAgKi9cclxuICBlbmFibGVUcmFuc2xhdGUodHJhbnNsYXRlOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVUcmFuc2xhdGUgPSB0cmFuc2xhdGU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIGlmIHRoZSBjYW1lcmEgaXMgYWJsZSB0byB6b29tXHJcbiAgICovXHJcbiAgZW5hYmxlWm9vbSh6b29tOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVab29tID0gem9vbTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFNldHMgaWYgdGhlIGNhbWVyYSByZWNlaXZlcyBpbnB1dHNcclxuICAgKi9cclxuICBlbmFibGVJbnB1dHMoaW5wdXRzOiBib29sZWFuKTogdm9pZCB7XHJcbiAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVJbnB1dHMgPSBpbnB1dHM7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcclxuICAgKiBAcGFyYW0gc2NlbmVNb2RlIC0gVGhlIFNjZW5lTW9kZSB0byBtb3JwaCB0aGUgc2NlbmUgaW50by5cclxuICAgKiBAcGFyYW0gZHVyYXRpb24gLSBUaGUgZHVyYXRpb24gb2Ygc2NlbmUgbW9ycGggYW5pbWF0aW9ucywgaW4gc2Vjb25kc1xyXG4gICAqL1xyXG4gIHNldFNjZW5lTW9kZShzY2VuZU1vZGU6IFNjZW5lTW9kZSwgZHVyYXRpb24/OiBudW1iZXIpIHtcclxuICAgIHN3aXRjaCAoc2NlbmVNb2RlKSB7XHJcbiAgICAgIGNhc2UgU2NlbmVNb2RlLlNDRU5FM0Q6IHtcclxuICAgICAgICBpZiAodGhpcy5pc1NjZW5lTW9kZVBlcmZvcm1hbmNlMkQpIHtcclxuICAgICAgICAgIHRoaXMuX3JldmVydENhbWVyYVByb3BlcnRpZXMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMuc2NlbmUubW9ycGhUbzNEKGR1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBTY2VuZU1vZGUuQ09MVU1CVVNfVklFVzoge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xyXG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5zY2VuZS5tb3JwaFRvQ29sdW1idXNWaWV3KGR1cmF0aW9uKTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBTY2VuZU1vZGUuU0NFTkUyRDoge1xyXG4gICAgICAgIGlmICh0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCkge1xyXG4gICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcygpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG8yRChkdXJhdGlvbik7XHJcblxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgU2NlbmVNb2RlLlBFUkZPUk1BTkNFX1NDRU5FMkQ6IHtcclxuICAgICAgICB0aGlzLmlzU2NlbmVNb2RlUGVyZm9ybWFuY2UyRCA9IHRydWU7XHJcbiAgICAgICAgdGhpcy5sYXN0TG9vayA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZUxvb2s7XHJcbiAgICAgICAgdGhpcy5sYXN0VGlsdCA9IHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQ7XHJcbiAgICAgICAgdGhpcy5sYXN0Um90YXRlID0gdGhpcy5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlO1xyXG4gICAgICAgIHRoaXMuc2NyZWVuU3BhY2VDYW1lcmFDb250cm9sbGVyLmVuYWJsZVRpbHQgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVSb3RhdGUgPSBmYWxzZTtcclxuICAgICAgICB0aGlzLnNjcmVlblNwYWNlQ2FtZXJhQ29udHJvbGxlci5lbmFibGVMb29rID0gZmFsc2U7XHJcbiAgICAgICAgaWYgKHRoaXMubW9ycGhMaXN0ZW5lckNhbmNlbEZuKSB7XHJcbiAgICAgICAgICB0aGlzLm1vcnBoTGlzdGVuZXJDYW5jZWxGbigpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLnNjZW5lLm1vcnBoVG9Db2x1bWJ1c1ZpZXcoZHVyYXRpb24pO1xyXG4gICAgICAgIGNvbnN0IG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyID0gdGhpcy5zY2VuZS5tb3JwaENvbXBsZXRlLmFkZEV2ZW50TGlzdGVuZXIoXHJcbiAgICAgICAgICAoKSA9PiB7XHJcbiAgICAgICAgICAgIHRoaXMuY2FtZXJhLnNldFZpZXcoe1xyXG4gICAgICAgICAgICAgIGRlc3RpbmF0aW9uOiBDYXJ0ZXNpYW4zLmZyb21EZWdyZWVzKFxyXG4gICAgICAgICAgICAgICAgMC4wLFxyXG4gICAgICAgICAgICAgICAgMC4wLFxyXG4gICAgICAgICAgICAgICAgTWF0aC5taW4oXHJcbiAgICAgICAgICAgICAgICAgIENhbWVyYVNlcnZpY2UuUEVSRk9STUFOQ0VfMkRfQUxUSVRVREUsXHJcbiAgICAgICAgICAgICAgICAgIHRoaXMuZ2V0TWF4aW11bVpvb20oKVxyXG4gICAgICAgICAgICAgICAgKVxyXG4gICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgb3JpZW50YXRpb246IHtcclxuICAgICAgICAgICAgICAgIHBpdGNoOiBjTWF0aC50b1JhZGlhbnMoLTkwKVxyXG4gICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIG1vcnBoQ29tcGxldGVFdmVudExpc3RlbmVyKCk7XHJcbiAgICAgICAgICAgIHRoaXMuX2xpc3RlblRvU2NlbmVNb2RlTW9ycGgoXHJcbiAgICAgICAgICAgICAgdGhpcy5fcmV2ZXJ0Q2FtZXJhUHJvcGVydGllcy5iaW5kKHRoaXMpXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZsaWVzIHRoZSBjYW1lcmEgdG8gYSBkZXN0aW5hdGlvblxyXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXHJcbiAgICovXHJcbiAgY2FtZXJhRmx5VG8ob3B0aW9uczogYW55KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYW1lcmEuZmx5VG8ob3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGbGllcyB0aGUgY2FtZXJhIHRvIGEgdGFyZ2V0XHJcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZXIjZmx5VG9cclxuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XHJcbiAgICovXHJcbiAgZmx5VG8odGFyZ2V0OiBhbnksIG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXdlci5mbHlUbyh0YXJnZXQsIG9wdGlvbnMpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBjYW1lcmEncyB2aWV3IHZlY3Rvci5cclxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0NhbWVyYS5odG1sI3pvb21JblxyXG4gICAqL1xyXG4gIHpvb21JbihhbW91bnQ6IG51bWJlcikge1xyXG4gICAgcmV0dXJuIHRoaXMuY2FtZXJhLnpvb21JbihhbW91bnQgfHwgdGhpcy5jYW1lcmEuZGVmYXVsdFpvb21BbW91bnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogWm9vbXMgYW1vdW50IGFsb25nIHRoZSBvcHBvc2l0ZSBkaXJlY3Rpb24gb2YgdGhlIGNhbWVyYSdzIHZpZXcgdmVjdG9yLlxyXG4gICAqIEFQSTogaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWwjem9vbU91dFxyXG4gICAqL1xyXG4gIHpvb21PdXQoYW1vdW50OiBudW1iZXIpIHtcclxuICAgIHJldHVybiB0aGlzLmNhbWVyYS56b29tT3V0KGFtb3VudCB8fCB0aGlzLmNhbWVyYS5kZWZhdWx0Wm9vbUFtb3VudCk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBab29tIHRoZSBjYW1lcmEgdG8gYSB0YXJnZXRcclxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciN6b29tVG9cclxuICAgKiBAcmV0dXJucyBQcm9taXNlPGJvb2xlYW4+XHJcbiAgICovXHJcbiAgem9vbVRvKHRhcmdldDogYW55LCBvZmZzZXQ/OiBhbnkpIHtcclxuICAgIHJldHVybiB0aGlzLnZpZXdlci56b29tVG8odGFyZ2V0LCBvZmZzZXQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogRmxpZXMgdGhlIGNhbWVyYSB0byBhIGRlc3RpbmF0aW9uXHJcbiAgICogQVBJOiBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9DYW1lcmEuaHRtbD9jbGFzc0ZpbHRlcj1jYW1lcmEjc2V0Vmlld1xyXG4gICAqIEBwYXJhbSBvcHRpb25zIHZpZXdlciBvcHRpb25zXHJcbiAgICovXHJcbiAgc2V0VmlldyhvcHRpb25zOiBhbnkpIHtcclxuICAgIHRoaXMuY2FtZXJhLnNldFZpZXcob3B0aW9ucyk7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBTZXQgY2FtZXJhJ3Mgcm90YXRpb25cclxuICAgKi9cclxuICBzZXRSb3RhdGlvbihkZWdyZWVzSW5SYWRpYW5zOiBudW1iZXIpIHtcclxuICAgIHRoaXMuc2V0Vmlldyh7b3JpZW50YXRpb246IHtoZWFkaW5nOiBkZWdyZWVzSW5SYWRpYW5zfX0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogTG9ja3Mgb3IgdW5sb2NrcyBjYW1lcmEgcm90YXRpb25cclxuICAgKi9cclxuICBsb2NrUm90YXRpb24obG9jazogYm9vbGVhbikge1xyXG4gICAgdGhpcy5zY2VuZS5zY3JlZW5TcGFjZUNhbWVyYUNvbnRyb2xsZXIuZW5hYmxlUm90YXRlID0gIWxvY2s7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBNYWtlIHRoZSBjYW1lcmEgdHJhY2sgYSBzcGVjaWZpYyBlbnRpdHlcclxuICAgKiBBUEk6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL1ZpZXdlci5odG1sP2NsYXNzRmlsdGVyPXZpZXdlciN0cmFja2VkRW50aXR5XHJcbiAgICogQHBhcmFtIGNlc2l1bUVudGl0eSAtIGNlc2l1bSBlbnRpdHkoIGJpbGxib2FyZCwgcG9seWdvbi4uLikgdG8gdHJhY2tcclxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIHRyYWNrIGVudGl0eSBvcHRpb25zXHJcbiAgICovXHJcbiAgdHJhY2tFbnRpdHkoXHJcbiAgICBjZXNpdW1FbnRpdHk/OiBhbnksXHJcbiAgICBvcHRpb25zPzogeyBmbHlUbzogYm9vbGVhbjsgZmx5VG9EdXJhdGlvbj86IG51bWJlcjsgYWx0aXR1ZGU/OiBudW1iZXIgfVxyXG4gICkge1xyXG4gICAgY29uc3QgZmx5VG8gPSAob3B0aW9ucyAmJiBvcHRpb25zLmZseVRvKSB8fCBmYWxzZTtcclxuXHJcbiAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gdW5kZWZpbmVkO1xyXG4gICAgcmV0dXJuIG5ldyBQcm9taXNlPHZvaWQ+KHJlc29sdmUgPT4ge1xyXG4gICAgICBpZiAoZmx5VG8pIHtcclxuICAgICAgICBjb25zdCBmbHlUb0R1cmF0aW9uID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5mbHlUb0R1cmF0aW9uKSB8fCAxO1xyXG4gICAgICAgIGNvbnN0IGFsdGl0dWRlID0gKG9wdGlvbnMgJiYgb3B0aW9ucy5hbHRpdHVkZSkgfHwgMTAwMDA7XHJcblxyXG4gICAgICAgIC8vIENhbGMgZW50aXR5IGZseVRvIHBvc2l0aW9uIGFuZCB3YW50ZWQgYWx0aXR1ZGVcclxuICAgICAgICBjb25zdCBlbnRQb3NDYXIzID0gY2VzaXVtRW50aXR5LnBvc2l0aW9uLmdldFZhbHVlKEp1bGlhbkRhdGUubm93KCkpO1xyXG4gICAgICAgIGNvbnN0IGVudFBvc0NhcnQgPSBDYXJ0b2dyYXBoaWMuZnJvbUNhcnRlc2lhbihlbnRQb3NDYXIzKTtcclxuICAgICAgICBjb25zdCB6b29tQW1vdW50ID0gYWx0aXR1ZGUgLSBlbnRQb3NDYXJ0LmhlaWdodDtcclxuICAgICAgICBlbnRQb3NDYXJ0LmhlaWdodCA9IGFsdGl0dWRlO1xyXG4gICAgICAgIGNvbnN0IGZseVRvUG9zaXRpb24gPSBDYXJ0ZXNpYW4zLmZyb21SYWRpYW5zKFxyXG4gICAgICAgICAgZW50UG9zQ2FydC5sb25naXR1ZGUsXHJcbiAgICAgICAgICBlbnRQb3NDYXJ0LmxhdGl0dWRlLFxyXG4gICAgICAgICAgZW50UG9zQ2FydC5oZWlnaHRcclxuICAgICAgICApO1xyXG5cclxuICAgICAgICB0aGlzLmNhbWVyYUZseVRvKHtcclxuICAgICAgICAgIGR1cmF0aW9uOiBmbHlUb0R1cmF0aW9uLFxyXG4gICAgICAgICAgZGVzdGluYXRpb246IGZseVRvUG9zaXRpb24sXHJcbiAgICAgICAgICBjb21wbGV0ZTogKCkgPT4ge1xyXG4gICAgICAgICAgICB0aGlzLnZpZXdlci50cmFja2VkRW50aXR5ID0gY2VzaXVtRW50aXR5O1xyXG4gICAgICAgICAgICBzZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgICAgICAgICBpZiAoem9vbUFtb3VudCA+IDApIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLnpvb21PdXQoem9vbUFtb3VudCk7XHJcbiAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHRoaXMuY2FtZXJhLnpvb21Jbih6b29tQW1vdW50KTtcclxuICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sIDApO1xyXG4gICAgICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcbiAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgdGhpcy52aWV3ZXIudHJhY2tlZEVudGl0eSA9IGNlc2l1bUVudGl0eTtcclxuICAgICAgICByZXNvbHZlKCk7XHJcbiAgICAgIH1cclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgdW50cmFja0VudGl0eSgpIHtcclxuICAgIHRoaXMudHJhY2tFbnRpdHkoKTtcclxuICB9XHJcbn1cclxuIl19