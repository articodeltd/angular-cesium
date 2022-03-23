import { DOCUMENT } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { SceneMode } from '../../models/scene-mode.enum';
import { CameraService } from '../../services/camera/camera.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { MapsManagerService } from '../../services/maps-manager/maps-manager.service';
import { PlonterService } from '../../services/plonter/plonter.service';
import { ScreenshotService } from '../../services/screenshot/screenshot.service';

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
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `,
  providers: [
    CesiumService,
    BillboardDrawerService,
    CesiumEventBuilder,
    KeyboardControlService,
    MapEventsManagerService,
    PlonterService,
    LabelDrawerService,
    PolylineDrawerService,
    PolylinePrimitiveDrawerService,
    EllipseDrawerService,
    PointDrawerService,
    ArcDrawerService,
    CzmlDrawerService,
    PolygonDrawerService,
    MapLayersService,
    CameraService,
    ScreenshotService,
    ContextMenuService,
    CoordinateConverter,
  ],
})
export class AcMapComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
  /**
   * Disable default plonter context menu
   */
  @Input()
  disableDefaultPlonter = false;

  /**
   * Set the id name of the map
   * default: 'default-map-id-[index]'
   */
  @Input()
  mapId: string;

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

  /**
   * Optional - the container element's id in which the map's canvas will be appended to.
   * If not supplied - the container element will be the parent element of ac-map;
   */
  @Input()
  containerId: string;

  private mapContainer: HTMLElement;

  constructor(
    private _cesiumService: CesiumService,
    private _cameraService: CameraService,
    private _elemRef: ElementRef,
    @Inject(DOCUMENT) private document,
    private mapsManagerService: MapsManagerService,
    private billboardDrawerService: BillboardDrawerService,
    private labelDrawerService: LabelDrawerService,
    private ellipseDrawerService: EllipseDrawerService,
    private polylineDrawerService: PolylineDrawerService,
    private polygonDrawerService: PolygonDrawerService,
    private arcDrawerService: ArcDrawerService,
    private pointDrawerService: PointDrawerService,
    private czmlDrawerService: CzmlDrawerService,
    private mapEventsManager: MapEventsManagerService,
    private keyboardControlService: KeyboardControlService,
    private mapLayersService: MapLayersService,
    private screenshotService: ScreenshotService,
    public contextMenuService: ContextMenuService,
    private coordinateConverter: CoordinateConverter,
  ) {
    this.mapContainer = this.document.createElement('div');
    this.mapContainer.style.width = '100%';
    this.mapContainer.style.height = '100%';
    this.mapContainer.className = 'map-container';
    this._cesiumService.init(this.mapContainer);
    this._cameraService.init(this._cesiumService);
    this.mapEventsManager.init();
    this.billboardDrawerService.init();
    this.labelDrawerService.init();
    this.ellipseDrawerService.init();
    this.polylineDrawerService.init();
    this.polygonDrawerService.init();
    this.arcDrawerService.init();
    this.pointDrawerService.init();
    this.czmlDrawerService.init();
    this.keyboardControlService.init();
    this.contextMenuService.init(this.mapEventsManager);
  }

  ngOnInit() {
    this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
    if (!this.containerId) {
      this._elemRef.nativeElement.appendChild(this.mapContainer);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['sceneMode']) {
      this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
    }
    if (changes['flyTo']) {
      this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
    }
    if (changes['containerId'] && !changes['containerId'].firstChange) {
      const element = this.document.getElementById(changes['containerId'].currentValue);
      if (element) {
        element.appendChild(this.mapContainer);
      } else {
        throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
      }
    }
  }

  ngAfterViewInit(): void {
    this.mapLayersService.drawAllLayers();
    if (this.containerId) {
      setTimeout(() => {
        const element = this.document.getElementById(this.containerId);
        if (element) {
          element.appendChild(this.mapContainer);
        } else {
          throw new Error(`No element found with id: ${this.containerId}`);
        }
      }, 0);
    }
  }

  ngOnDestroy(): void {
    this.mapContainer.remove();
    this.mapsManagerService._removeMapById(this.mapId);
  }

  /**
   * @returns ac-map's cesium service
   */
  getCesiumService() {
    return this._cesiumService;
  }

  /**
   * @returns map's cesium viewer
   */
  getCesiumViewer() {
    return this._cesiumService.getViewer();
  }


  getCameraService(): CameraService {
    return this._cameraService;
  }

  getId() {
    return this.mapId;
  }


  getMapContainer() {
    return this.mapContainer;
  }


  getMapEventsManager(): MapEventsManagerService {
    return this.mapEventsManager;
  }

  getContextMenuService(): ContextMenuService {
    return this.contextMenuService;
  }

  getScreenshotService() {
    return this.screenshotService;
  }

  getKeyboardControlService() {
    return this.keyboardControlService;
  }

  getCoordinateConverter() {
    return this.coordinateConverter;
  }
}
