import { Component, ElementRef, Inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { CesiumService } from '../../services/cesium/cesium.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { PlonterService } from '../../services/plonter/plonter.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { ViewersManagerService } from '../../services/viewers-service/viewers-manager.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';

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
      <ng-content></ng-content>`,
  providers: [
    CesiumService,
    BillboardDrawerService,
    CesiumEventBuilder,
    KeyboardControlService,
    MapEventsManagerService,
    PlonterService,
    LabelDrawerService,
    PolylineDrawerService,
    EllipseDrawerService,
    PointDrawerService,
    ArcDrawerService,
    PolygonDrawerService,
  ]
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
  id: string;

  /**
   * flyTo options according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
   */
  @Input()
  flyTo: any;

  private mapContainer: HTMLElement;

  constructor(private _cesiumService: CesiumService,
              private _elemRef: ElementRef,
              @Inject(DOCUMENT) private document: any,
              private viewersManager: ViewersManagerService,
              private billboardDrawerService: BillboardDrawerService,
              private labelDrawerService: LabelDrawerService,
              private ellipseDrawerService: EllipseDrawerService,
              private polylineDrawerService: PolylineDrawerService,
              private polygonDrawerService: PolygonDrawerService,
              private arcDrawerService: ArcDrawerService,
              private pointDrawerService: PointDrawerService,
              private mapEventManager: MapEventsManagerService,
              private keyboardControlService: KeyboardControlService) {
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
    this.mapEventManager.init();
    this.billboardDrawerService.init();
    this.labelDrawerService.init();
    this.ellipseDrawerService.init();
    this.polylineDrawerService.init();
    this.polygonDrawerService.init();
    this.arcDrawerService.init();
    this.pointDrawerService.init();
    this.keyboardControlService.init();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['flyTo']) {
      this._cesiumService.flyTo(changes['flyTo'].currentValue);
    }
  }

  /**
   * @returns {Viewer} map cesium viewer
   */
  getCesiumViewer() {
    return this._cesiumService.getViewer();
  }

  /**
   * @returns {string} the map id
   */
  getId() {
    return this.id;
  }

  /**
   * @returns {MapEventsManagerService}
   */
  getMapEventManager() {
    return this.mapEventManager;
  }

  /**
   * @returns {KeyboardControlService}
   */
  getKeyboardControlService() {
    return this.keyboardControlService;
  }
}
