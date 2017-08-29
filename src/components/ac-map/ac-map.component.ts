import {
	AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnInit,
	SimpleChanges
} from '@angular/core';
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
import { MapsManagerService } from '../../services/maps-manager/maps-manager.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';
import { CameraService } from '../../services/camera/camera.service';
import { SceneMode } from '../../models/scene-mode.enum';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getCesiumViewer()
 * 2. Use MapManagerService.getMap().getCesiumViewer() or if more then one map: MapManagerService.getMap(mapId).getCesiumViewer()
 *
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
    MapLayersService,
    CameraService,
  ]
})
export class AcMapComponent implements OnChanges, OnInit, AfterViewInit {

  /**
   * Disable default plonter context menu
   */
  @Input()
  disableDefaultPlonter = false;

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

  /**
   * Sets the map's SceneMode
   */
  @Input()
  sceneMode: SceneMode;

  private mapContainer: HTMLElement;

  constructor(private _cesiumService: CesiumService,
              private _cameraService: CameraService,
              private _elemRef: ElementRef,
              @Inject(DOCUMENT) private document: any,
              private mapsManagerService: MapsManagerService,
              private billboardDrawerService: BillboardDrawerService,
              private labelDrawerService: LabelDrawerService,
              private ellipseDrawerService: EllipseDrawerService,
              private polylineDrawerService: PolylineDrawerService,
              private polygonDrawerService: PolygonDrawerService,
              private arcDrawerService: ArcDrawerService,
              private pointDrawerService: PointDrawerService,
              private mapEventsManager: MapEventsManagerService,
              private keyboardControlService: KeyboardControlService,
              private mapLayersService: MapLayersService) {
    this.mapContainer = this.document.createElement('div');
    this.mapContainer.className = 'map-container';
    this._elemRef.nativeElement.appendChild(this.mapContainer);
    this._cesiumService.init(this.mapContainer);
    this._cameraService.init(this._cesiumService);
  }

  ngOnInit() {
    this.mapsManagerService.registerMap(this.id, this);
    this.mapEventsManager.init();
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
    if (changes['sceneMode']) {
      this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
    }
    if (changes['flyTo']) {
      this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
    }
  }
	
	ngAfterViewInit(): void {
    this.mapLayersService.drawAllLayers();
	}

  /**
   * @returns {CesiumService} ac-map's cesium service
   */
  getCesiumSerivce() {
    return this._cesiumService;
  }

  /**
   * @returns {Viewer} map's cesium viewer
   */
  getCesiumViewer() {
    return this._cesiumService.getViewer();
  }

  /**
   * @returns {CameraService} map's scene's camera
   */
  getCameraService(): CameraService {
    return this._cameraService;
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
  getMapEventsManager(): MapEventsManagerService {
    return this.mapEventsManager;
  }

  /**
   * @returns {KeyboardControlService}
   */
  getKeyboardControlService() {
    return this.keyboardControlService;
  }
}
