import { Component, OnChanges, OnInit, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CesiumService } from '../../services/cesium/cesium.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { PlonterService } from '../../services/plonter/plonter.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { ViewersManagerService } from '../../services/viewers-service/viewers-manager.service';

/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getViewer()
 * 2. Use ViewerManagerService.getCesiumViewer(mapId).
 * 		mapId auto-generated string: 'default-map-id-[index]'
 *
 * @example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
@Component({
	selector: 'ac-map',
	template: `
			<ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
			<ng-content></ng-content>
	`,
	providers: [CesiumService, BillboardDrawerService, CesiumEventBuilder, MapEventsManagerService, PlonterService,
	LabelDrawerService, DynamicPolylineDrawerService, DynamicEllipseDrawerService, PointDrawerService, ArcDrawerService]
})
export class AcMapComponent implements OnChanges, OnInit {
	private static readonly DEFAULT_MINIMUM_ZOOM = 1.0;
	private static readonly DEFAULT_MAXIMUM_ZOOM = Number.POSITIVE_INFINITY;
	private static readonly DEFAULT_TILT_ENABLE = true;
	private static defaultIdCounter = 1;
  
  /**
	 * Disable default plonter context menu
   */
	@Input()
  disableDefaultPlonter = false;
	
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
	 * Set the id name of the map
	 * default: 'default-map-id-[index]'
   * @type {string}
   */
	@Input()
	id;

	/**
	 * flyTo options according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
	 */
	@Input()
	flyTo: any;

	private mapContainer: HTMLElement;

	constructor(private _cesiumService: CesiumService,
							private _elemRef: ElementRef,
							@Inject(DOCUMENT) private document: any,
							private viewersManager: ViewersManagerService) {
		this.mapContainer = this.document.createElement('div');
		this.mapContainer.className = 'map-container';
		this._elemRef.nativeElement.appendChild(this.mapContainer);
		this._cesiumService.init(this.mapContainer);
	}

	ngOnInit() {
		this._cesiumService.setMinimumZoom(this.minimumZoom);
		this._cesiumService.setMaximumZoom(this.maximumZoom);
		this._cesiumService.setEnableTilt(this.enableTilt);
		this.viewersManager.setViewer(this.id, this.getCesiumViewer());
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['flyTo']) {
			this._cesiumService.flyTo(changes['flyTo'].currentValue);
		}
	}
  
  /**
   * @returns {any} map cesium viewer
   */
	getCesiumViewer() {
		return this._cesiumService.getViewer();
	}
	
	getId() {
		return this.id;
	}
}
