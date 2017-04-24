import { Injectable, NgZone, Optional } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { ViewerConfiguration } from '../viewer-configuration/viewer-configuration.service';

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
@Injectable()
export class CesiumService {
	private cesiumViewer: any;

	constructor(private ngZone: NgZone, private viewerFactory: ViewerFactory, @Optional() private viewConf: ViewerConfiguration) {
	}

	init(mapContainer: HTMLElement) {
		this.ngZone.runOutsideAngular(() => {
			const options = this.viewConf ? this.viewConf.viewerOptions : undefined ;
			this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
		});
	}

	/**
	 * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
	 * @returns {any}
	 */
	getViewer() {
		return this.cesiumViewer;
	}

	/**
	 * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
	 * @returns {{Scene}|any}
	 */
	getScene() {
		return this.cesiumViewer.scene;
	}

	/**
	 * Gets the minimum zoom value in meters
	 * @returns {number}
	 */
	getMinimumZoom(): number {
		return this.getScene().screenSpaceCameraController.minimumZoomDistance;
	}

	/**
	 * Sets the minimum zoom value in meters
	 * @param {number} amount
	 */
	setMinimumZoom(amount: number): void {
		this.getScene().screenSpaceCameraController.minimumZoomDistance = amount;
	}

	/**
	 * Gets the maximum zoom value in meters
	 * @returns {number}
	 */
	getMaximumZoom(): number {
		return this.getScene().screenSpaceCameraController.maximumZoomDistance;
	}

	/**
	 * Sets the maximum zoom value in meters
	 * @param {number} amount
	 */
	setMaximumZoom(amount: number): void {
		this.getScene().screenSpaceCameraController.maximumZoomDistance = amount;
	}

	/**
	 * Sets the enableTilt of screenSpaceCameraController
	 * @param {boolean} isTilt
	 */
	setEnableTilt(isTilt: boolean): void {
		this.getScene().screenSpaceCameraController.enableTilt = isTilt;
	}

	/**
	 * Sets the map to 2D mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 * Warning: for high performance use Columbus view & turn the tilt off.
	 */
	morphTo2D(duration = 2.0) {
		this.getScene().morphTo2D(duration);
	}

	/**
	 * Sets the map to 3D mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 */
	morphTo3D(duration = 2.0) {
		this.getScene().morphTo3D(duration);
	}

	/**
	 * Sets the map to Columbus view mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 */
	morphToColumbusView(duration = 2.0) {
		this.getScene().morphToColumbusView(duration);
	}

	/**
	 * according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
	 * @param options
	 */
	flyTo(options: any) {
		this.getViewer().camera.flyTo(options);
	}
}
