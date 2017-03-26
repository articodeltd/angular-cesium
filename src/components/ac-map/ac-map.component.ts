import { Component, OnChanges, OnInit, ElementRef, Inject, Input, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import { CesiumService } from '../../services/cesium/cesium.service';
import { BillboardDrawerService } from '../../services/billboard-drawer/billboard-drawer.service';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { PlonterService } from '../../services/plonter/plonter.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/label-drawer/label-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/dynamic-polyline-drawer/dynamic-polyline-drawer.service';

/**
 * This is a map implementation.
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
	providers: [CesiumService, BillboardDrawerService, CesiumEventBuilder, MapEventsManagerService, PlonterService,
	LayerService, ComputationCache, LabelDrawerService, DynamicPolylineDrawerService]
})
export class AcMapComponent implements OnChanges, OnInit {
	private static readonly DEFAULT_MINIMUM_ZOOM = 1.0;
	private static readonly DEFAULT_MAXIMUM_ZOOM = Number.POSITIVE_INFINITY;
	private static readonly DEFAULT_TILT_ENABLE = true;

	@Input()
	minimumZoom: number = AcMapComponent.DEFAULT_MINIMUM_ZOOM;

	@Input()
	maximumZoom: number = AcMapComponent.DEFAULT_MAXIMUM_ZOOM;

	@Input()
	enableTilt: boolean = AcMapComponent.DEFAULT_TILT_ENABLE;

	@Input()
	flyTo: any;

	constructor(private _cesiumService: CesiumService, private _elemRef: ElementRef, @Inject(DOCUMENT) private document: any) {
		const mapContainer = this.document.createElement('div');
		this._elemRef.nativeElement.appendChild(mapContainer);
		this._cesiumService.init(mapContainer);
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
