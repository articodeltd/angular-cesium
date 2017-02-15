import { Injectable, NgZone } from '@angular/core';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
@Injectable()
export class CesiumService {
	private cesiumViewer: any;

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
}
