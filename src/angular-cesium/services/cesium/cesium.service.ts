import { Injectable, NgZone } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';

@Injectable()
export class CesiumService {
	cesiumViewer: any;

	constructor(private ngZone: NgZone, private viewerFactory: ViewerFactory) {
	}

	init(mapContainer: HTMLElement) {
		this.ngZone.runOutsideAngular(() => {
			this.cesiumViewer = this.viewerFactory.createViewer(mapContainer);
		});
	}

	getViewer() {
		return this.cesiumViewer;
	}

	getScene() {
		return this.cesiumViewer.scene;
	}

	/**
	 * Gets the minimum zoom value in meters
	 * @returns {any}
	 */
	getMinimumZoom(): number {
		return this.getScene().screenSpaceCameraController.minimumZoomDistance;
	}

	/**
	 * Sets the minimum zoom value in meters
	 * @param amount - new value
	 */
	setMinimumZoom(amount: number): void {
		this.getScene().screenSpaceCameraController.minimumZoomDistance = amount;
	}

	/**
	 * Gets the maxmimum zoom value in meters
	 * @returns {any}
	 */
	getMaximumZoom(): number {
		return this.getScene().screenSpaceCameraController.maximumZoomDistance;
	}

	/**
	 * Sets the maximum zoom value in meters
	 * @param amount - new value
	 */
	setMaximumZoom(amount: number): void {
		this.getScene().screenSpaceCameraController.maximumZoomDistance = amount;
	}

	/**
	 * Sets the map to 2D mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 * Warning: for high performance use Columbus view & turn the tilt off.
	 */
	morphTo2D (duration: number = 2.0){
		new Cesium.SceneModePickerViewModel(this.getScene(), duration).morphTo2D();
	}

	/**
	 * Sets the map to 3D mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 */
	morphTo3D(duration: number = 2.0){
		new Cesium.SceneModePickerViewModel(this.getScene(), duration).morphTo3D();
	}

	/**
	 * Sets the map to Columbus view mode.
	 * @param {number} [2.0] duration - The duration of scene morph animations, in seconds
	 */
	morphToColumbusView(duration: number = 2.0){
		new Cesium.SceneModePickerViewModel(this.getScene(), duration).morphToColumbusView();
	}

}
