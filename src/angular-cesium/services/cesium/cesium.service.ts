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
	 * Gets the maxmimum zoom value in meters
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
}
