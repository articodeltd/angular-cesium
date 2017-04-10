import { Component, OnChanges, OnInit, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CesiumService } from '../../services/cesium/cesium.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { PlonterService } from '../../services/plonter/plonter.service';

/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * @example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
@Component({
	selector: 'ac-map',
	template: '<ng-content></ng-content>',
	providers: [CesiumService, BillboardDrawerService, CesiumEventBuilder, MapEventsManagerService, PlonterService]
})
export class AcMapComponent implements OnChanges, OnInit {
	private static readonly DEFAULT_MINIMUM_ZOOM = 1.0;
	private static readonly DEFAULT_MAXIMUM_ZOOM = Number.POSITIVE_INFINITY;
	private static readonly DEFAULT_TILT_ENABLE = true;

	/**
	 * in meters
	 * @type {number}
	 */
	@Input()
	minimumZoom: number = AcMapComponent.DEFAULT_MINIMUM_ZOOM;

	/**
	 * in meters
	 * @type {number}
	 */
	@Input()
	maximumZoom: number = AcMapComponent.DEFAULT_MAXIMUM_ZOOM;

	/**
	 * Sets the enableTilt of screenSpaceCameraController
	 * @type {boolean}
	 */
	@Input()
	enableTilt: boolean = AcMapComponent.DEFAULT_TILT_ENABLE;

	/**
	 * flyTo options according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
	 */
	@Input()
	flyTo: any;

	private mapContainer: HTMLElement;

	constructor(private _cesiumService: CesiumService, private _elemRef: ElementRef, @Inject(DOCUMENT) private document: any) {
		this.mapContainer = this.document.createElement('div');
		this.mapContainer.className = 'map-container';
		// this.mapContainer.style.height = '100%';
		this._elemRef.nativeElement.appendChild(this.mapContainer);
		this._cesiumService.init(this.mapContainer);
	}

	ngOnInit() {
		this._cesiumService.setMinimumZoom(this.minimumZoom);
		this._cesiumService.setMaximumZoom(this.maximumZoom);
		this._cesiumService.setEnableTilt(this.enableTilt);
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['flyTo']) {
			this._cesiumService.flyTo(changes['flyTo'].currentValue);
		}
	}
}
