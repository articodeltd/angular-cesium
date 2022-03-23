import { AfterViewInit, ElementRef, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
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
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { MapsManagerService } from '../../services/maps-manager/maps-manager.service';
import { ScreenshotService } from '../../services/screenshot/screenshot.service';
import * as i0 from "@angular/core";
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
export declare class AcMapComponent implements OnChanges, OnInit, AfterViewInit, OnDestroy {
    private _cesiumService;
    private _cameraService;
    private _elemRef;
    private document;
    private mapsManagerService;
    private billboardDrawerService;
    private labelDrawerService;
    private ellipseDrawerService;
    private polylineDrawerService;
    private polygonDrawerService;
    private arcDrawerService;
    private pointDrawerService;
    private czmlDrawerService;
    private mapEventsManager;
    private keyboardControlService;
    private mapLayersService;
    private screenshotService;
    contextMenuService: ContextMenuService;
    private coordinateConverter;
    /**
     * Disable default plonter context menu
     */
    disableDefaultPlonter: boolean;
    /**
     * Set the id name of the map
     * default: 'default-map-id-[index]'
     */
    mapId: string;
    /**
     * flyTo options according to https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    flyTo: any;
    /**
     * Sets the map's SceneMode
     */
    sceneMode: SceneMode;
    /**
     * Optional - the container element's id in which the map's canvas will be appended to.
     * If not supplied - the container element will be the parent element of ac-map;
     */
    containerId: string;
    private mapContainer;
    constructor(_cesiumService: CesiumService, _cameraService: CameraService, _elemRef: ElementRef, document: any, mapsManagerService: MapsManagerService, billboardDrawerService: BillboardDrawerService, labelDrawerService: LabelDrawerService, ellipseDrawerService: EllipseDrawerService, polylineDrawerService: PolylineDrawerService, polygonDrawerService: PolygonDrawerService, arcDrawerService: ArcDrawerService, pointDrawerService: PointDrawerService, czmlDrawerService: CzmlDrawerService, mapEventsManager: MapEventsManagerService, keyboardControlService: KeyboardControlService, mapLayersService: MapLayersService, screenshotService: ScreenshotService, contextMenuService: ContextMenuService, coordinateConverter: CoordinateConverter);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngAfterViewInit(): void;
    ngOnDestroy(): void;
    /**
     * @returns ac-map's cesium service
     */
    getCesiumService(): CesiumService;
    /**
     * @returns map's cesium viewer
     */
    getCesiumViewer(): any;
    getCameraService(): CameraService;
    getId(): string;
    getMapContainer(): HTMLElement;
    getMapEventsManager(): MapEventsManagerService;
    getContextMenuService(): ContextMenuService;
    getScreenshotService(): ScreenshotService;
    getKeyboardControlService(): KeyboardControlService;
    getCoordinateConverter(): CoordinateConverter;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcMapComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcMapComponent, "ac-map", never, { "disableDefaultPlonter": "disableDefaultPlonter"; "mapId": "mapId"; "flyTo": "flyTo"; "sceneMode": "sceneMode"; "containerId": "containerId"; }, {}, never, ["*"]>;
}
