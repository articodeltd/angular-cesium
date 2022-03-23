import * as i0 from '@angular/core';
import { Injectable, Optional, EventEmitter, Inject, Component, Input, ChangeDetectionStrategy, ViewContainerRef, ViewChild, Directive, Output, forwardRef, Pipe, NgModule, InjectionToken, TemplateRef, ContentChild, ContentChildren, HostListener } from '@angular/core';
import * as i4 from '@angular/common';
import { DOCUMENT, CommonModule } from '@angular/common';
import * as Cesium$1 from 'cesium';
import { Viewer, Cartesian3, Math as Math$1, JulianDate, Cartographic, SceneTransforms, Cartesian2, PrimitiveCollection, Ellipsoid, PolylineCollection, Material, CustomDataSource, CallbackProperty, CzmlDataSource, Color, Entity, SceneMode as SceneMode$1, GeometryInstance, Primitive, CircleGeometry, PolylineGeometry, PolygonGeometry, EllipseGeometry, LabelCollection, BillboardCollection, PointPrimitiveCollection, buildModuleUrl, Cesium3DTileset, Cesium3DTileStyle, DistanceDisplayCondition, AssociativeArray, defined, ShadowMode, ColorMaterialProperty, ColorGeometryInstanceAttribute, ShowGeometryInstanceAttribute, DistanceDisplayConditionGeometryInstanceAttribute, HeightReference, HorizontalOrigin, LabelStyle, VerticalOrigin, PolygonHierarchy, ClassificationType, sampleTerrain, Rectangle } from 'cesium';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
import { tap, filter, publish, mergeMap, delay, takeUntil, map, switchMap, merge as merge$1 } from 'rxjs/operators';
import { Observable, merge, of, Subject, from, BehaviorSubject, fromEvent } from 'rxjs';
import { EllipsePrimitive } from 'primitive-primitives';
import { when } from 'when';
import * as i1 from '@auscope/angular2parse';
import { PIPES_CONFIG, Angular2ParseModule } from '@auscope/angular2parse';
import { JsonStringMapper } from 'json-string-mapper';
import { get } from 'lodash';

class ViewerFactory {
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    createViewer(mapContainer, options) {
        let viewer = null;
        if (options) {
            viewer = new Viewer(mapContainer, Object.assign({ contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                } }, options));
        }
        else {
            viewer = new Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
            });
        }
        return viewer;
    }
}
ViewerFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewerFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory, decorators: [{
            type: Injectable
        }] });

/**
 * Service for setting cesium viewer map options.
 * defaulty angular-cesium doesnt provide this service and viewer is created with default options.
 * In order set specific options you must set this service as provider in your component and
 * set the wanted options.
 * ```typescript
 * constructor(viewerConf :ViewerConfiguration ) {
 *   viewerConf.viewerOptions = { timeline: false };
 * }
 * ```
 * notice this configuration will be for all <ac-maps> in your component.
 */
class ViewerConfiguration {
    constructor() {
        this.nextViewerOptionsIndex = 0;
        this.nextViewerModifierIndex = 0;
    }
    get viewerOptions() {
        return this._viewerOptions;
    }
    getNextViewerOptions() {
        if (this._viewerOptions instanceof Array) {
            return this._viewerOptions[this.nextViewerOptionsIndex++];
        }
        else {
            return this._viewerOptions;
        }
    }
    /**
     * Can be used to set initial map viewer options.
     * If there is more than one map you can give the function an array of options.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerOptions(value) {
        this._viewerOptions = value;
    }
    get viewerModifier() {
        return this._viewerModifier;
    }
    getNextViewerModifier() {
        if (this._viewerModifier instanceof Array) {
            return this._viewerModifier[this.nextViewerModifierIndex++];
        }
        else {
            return this._viewerModifier;
        }
    }
    /**
     * Can be used to set map viewer options after the map has been initialized.
     * If there is more than one map you can give the function an array of functions.
     * The map initialized first will be set with the first option object in the options array and so on.
     */
    set viewerModifier(value) {
        this._viewerModifier = value;
    }
}
ViewerConfiguration.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewerConfiguration.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerConfiguration, decorators: [{
            type: Injectable
        }] });

/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
class CesiumService {
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    init(mapContainer) {
        this.mapContainer = mapContainer;
        this.ngZone.runOutsideAngular(() => {
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        });
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas() {
        return this.cesiumViewer.canvas;
    }
    getMapContainer() {
        return this.mapContainer;
    }
}
CesiumService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService, deps: [{ token: i0.NgZone }, { token: ViewerFactory }, { token: ViewerConfiguration, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: ViewerFactory }, { type: ViewerConfiguration, decorators: [{
                        type: Optional
                    }] }];
    } });

/**
 * Cesium scene modes
 */
var SceneMode;
(function (SceneMode) {
    SceneMode[SceneMode["SCENE3D"] = 0] = "SCENE3D";
    SceneMode[SceneMode["COLUMBUS_VIEW"] = 1] = "COLUMBUS_VIEW";
    SceneMode[SceneMode["SCENE2D"] = 2] = "SCENE2D";
    SceneMode[SceneMode["PERFORMANCE_SCENE2D"] = 3] = "PERFORMANCE_SCENE2D";
})(SceneMode || (SceneMode = {}));

/**
 *  The service exposes the scene's camera and screenSpaceCameraController
 *  SceneMode.PERFORMANCE_SCENE2D -  is a 3D scene mode that acts like Cesium 2D mode,
 *  but is more efficient performance wise.
 */
class CameraService {
    constructor() {
        this.isSceneModePerformance2D = false;
    }
    init(cesiumService) {
        this.viewer = cesiumService.getViewer();
        this.scene = cesiumService.getScene();
        this.screenSpaceCameraController = this.scene.screenSpaceCameraController;
        this.camera = this.scene.camera;
        this.lastRotate = this.screenSpaceCameraController.enableRotate;
        this.lastTilt = this.screenSpaceCameraController.enableTilt;
        this.lastLook = this.screenSpaceCameraController.enableLook;
    }
    _listenToSceneModeMorph(callback) {
        this.morphListenerCancelFn = this.scene.morphStart.addEventListener(callback);
    }
    _revertCameraProperties() {
        this.isSceneModePerformance2D = false;
        this.enableTilt(this.lastTilt);
        this.enableRotate(this.lastRotate);
        this.enableLook(this.lastLook);
    }
    /**
     * Gets the scene's camera
     */
    getCamera() {
        return this.camera;
    }
    /**
     * Gets the scene's screenSpaceCameraController
     */
    getScreenSpaceCameraController() {
        return this.screenSpaceCameraController;
    }
    /**
     * Gets the minimum zoom value in meters
     */
    getMinimumZoom() {
        return this.screenSpaceCameraController.minimumZoomDistance;
    }
    /**
     * Sets the minimum zoom value in meters
     * @param zoom amount
     */
    setMinimumZoom(amount) {
        this.screenSpaceCameraController.minimumZoomDistance = amount;
    }
    /**
     * Gets the maximum zoom value in meters
     */
    getMaximumZoom() {
        return this.screenSpaceCameraController.maximumZoomDistance;
    }
    /**
     * Sets the maximum zoom value in meters
     * @param zoom amount
     */
    setMaximumZoom(amount) {
        this.screenSpaceCameraController.maximumZoomDistance = amount;
    }
    /**
     * Sets if the camera is able to tilt
     */
    enableTilt(tilt) {
        this.screenSpaceCameraController.enableTilt = tilt;
    }
    /**
     * Sets if the camera is able to rotate
     */
    enableRotate(rotate) {
        this.screenSpaceCameraController.enableRotate = rotate;
    }
    /**
     * Sets if the camera is able to free-look
     */
    enableLook(lock) {
        this.screenSpaceCameraController.enableLook = lock;
    }
    /**
     * Sets if the camera is able to translate
     */
    enableTranslate(translate) {
        this.screenSpaceCameraController.enableTranslate = translate;
    }
    /**
     * Sets if the camera is able to zoom
     */
    enableZoom(zoom) {
        this.screenSpaceCameraController.enableZoom = zoom;
    }
    /**
     * Sets if the camera receives inputs
     */
    enableInputs(inputs) {
        this.screenSpaceCameraController.enableInputs = inputs;
    }
    /**
     * Sets the map's SceneMode
     * @param sceneMode - The SceneMode to morph the scene into.
     * @param duration - The duration of scene morph animations, in seconds
     */
    setSceneMode(sceneMode, duration) {
        switch (sceneMode) {
            case SceneMode.SCENE3D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo3D(duration);
                break;
            }
            case SceneMode.COLUMBUS_VIEW: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphToColumbusView(duration);
                break;
            }
            case SceneMode.SCENE2D: {
                if (this.isSceneModePerformance2D) {
                    this._revertCameraProperties();
                }
                this.scene.morphTo2D(duration);
                break;
            }
            case SceneMode.PERFORMANCE_SCENE2D: {
                this.isSceneModePerformance2D = true;
                this.lastLook = this.screenSpaceCameraController.enableLook;
                this.lastTilt = this.screenSpaceCameraController.enableTilt;
                this.lastRotate = this.screenSpaceCameraController.enableRotate;
                this.screenSpaceCameraController.enableTilt = false;
                this.screenSpaceCameraController.enableRotate = false;
                this.screenSpaceCameraController.enableLook = false;
                if (this.morphListenerCancelFn) {
                    this.morphListenerCancelFn();
                }
                this.scene.morphToColumbusView(duration);
                const morphCompleteEventListener = this.scene.morphComplete.addEventListener(() => {
                    this.camera.setView({
                        destination: Cartesian3.fromDegrees(0.0, 0.0, Math.min(CameraService.PERFORMANCE_2D_ALTITUDE, this.getMaximumZoom())),
                        orientation: {
                            pitch: Math$1.toRadians(-90)
                        }
                    });
                    morphCompleteEventListener();
                    this._listenToSceneModeMorph(this._revertCameraProperties.bind(this));
                });
                break;
            }
        }
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=cam#flyTo
     */
    cameraFlyTo(options) {
        return this.camera.flyTo(options);
    }
    /**
     * Flies the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#flyTo
     * @returns Promise<boolean>
     */
    flyTo(target, options) {
        return this.viewer.flyTo(target, options);
    }
    /**
     * Zooms amount along the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomIn
     */
    zoomIn(amount) {
        return this.camera.zoomIn(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zooms amount along the opposite direction of the camera's view vector.
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html#zoomOut
     */
    zoomOut(amount) {
        return this.camera.zoomOut(amount || this.camera.defaultZoomAmount);
    }
    /**
     * Zoom the camera to a target
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#zoomTo
     * @returns Promise<boolean>
     */
    zoomTo(target, offset) {
        return this.viewer.zoomTo(target, offset);
    }
    /**
     * Flies the camera to a destination
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Camera.html?classFilter=camera#setView
     * @param options viewer options
     */
    setView(options) {
        this.camera.setView(options);
    }
    /**
     * Set camera's rotation
     */
    setRotation(degreesInRadians) {
        this.setView({ orientation: { heading: degreesInRadians } });
    }
    /**
     * Locks or unlocks camera rotation
     */
    lockRotation(lock) {
        this.scene.screenSpaceCameraController.enableRotate = !lock;
    }
    /**
     * Make the camera track a specific entity
     * API: https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewer#trackedEntity
     * @param cesiumEntity - cesium entity( billboard, polygon...) to track
     * @param options - track entity options
     */
    trackEntity(cesiumEntity, options) {
        const flyTo = (options && options.flyTo) || false;
        this.viewer.trackedEntity = undefined;
        return new Promise(resolve => {
            if (flyTo) {
                const flyToDuration = (options && options.flyToDuration) || 1;
                const altitude = (options && options.altitude) || 10000;
                // Calc entity flyTo position and wanted altitude
                const entPosCar3 = cesiumEntity.position.getValue(JulianDate.now());
                const entPosCart = Cartographic.fromCartesian(entPosCar3);
                const zoomAmount = altitude - entPosCart.height;
                entPosCart.height = altitude;
                const flyToPosition = Cartesian3.fromRadians(entPosCart.longitude, entPosCart.latitude, entPosCart.height);
                this.cameraFlyTo({
                    duration: flyToDuration,
                    destination: flyToPosition,
                    complete: () => {
                        this.viewer.trackedEntity = cesiumEntity;
                        setTimeout(() => {
                            if (zoomAmount > 0) {
                                this.camera.zoomOut(zoomAmount);
                            }
                            else {
                                this.camera.zoomIn(zoomAmount);
                            }
                        }, 0);
                        resolve();
                    }
                });
            }
            else {
                this.viewer.trackedEntity = cesiumEntity;
                resolve();
            }
        });
    }
    untrackEntity() {
        this.trackEntity();
    }
}
CameraService.PERFORMANCE_2D_ALTITUDE = 25000000;
CameraService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CameraService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CameraService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

/**
 * Event options for registration on map-event-manager.
 */
var CesiumEvent;
(function (CesiumEvent) {
    CesiumEvent[CesiumEvent["MOUSE_MOVE"] = 15] = "MOUSE_MOVE";
    CesiumEvent[CesiumEvent["LEFT_CLICK"] = 2] = "LEFT_CLICK";
    CesiumEvent[CesiumEvent["LEFT_DOUBLE_CLICK"] = 3] = "LEFT_DOUBLE_CLICK";
    CesiumEvent[CesiumEvent["LEFT_DOWN"] = 0] = "LEFT_DOWN";
    CesiumEvent[CesiumEvent["LEFT_UP"] = 1] = "LEFT_UP";
    CesiumEvent[CesiumEvent["MIDDLE_CLICK"] = 12] = "MIDDLE_CLICK";
    // MIDDLE_DOUBLE_CLICK = ScreenSpaceEventType.MIDDLE_DOUBLE_CLICK,
    CesiumEvent[CesiumEvent["MIDDLE_DOWN"] = 10] = "MIDDLE_DOWN";
    CesiumEvent[CesiumEvent["MIDDLE_UP"] = 11] = "MIDDLE_UP";
    CesiumEvent[CesiumEvent["PINCH_START"] = 17] = "PINCH_START";
    CesiumEvent[CesiumEvent["PINCH_END"] = 18] = "PINCH_END";
    CesiumEvent[CesiumEvent["PINCH_MOVE"] = 19] = "PINCH_MOVE";
    CesiumEvent[CesiumEvent["RIGHT_CLICK"] = 7] = "RIGHT_CLICK";
    // RIGHT_DOUBLE_CLICK = ScreenSpaceEventType.RIGHT_DOUBLE_CLICK,
    CesiumEvent[CesiumEvent["RIGHT_DOWN"] = 5] = "RIGHT_DOWN";
    CesiumEvent[CesiumEvent["RIGHT_UP"] = 6] = "RIGHT_UP";
    CesiumEvent[CesiumEvent["WHEEL"] = 16] = "WHEEL";
    CesiumEvent[CesiumEvent["LONG_LEFT_PRESS"] = 110] = "LONG_LEFT_PRESS";
    CesiumEvent[CesiumEvent["LONG_RIGHT_PRESS"] = 111] = "LONG_RIGHT_PRESS";
    CesiumEvent[CesiumEvent["LONG_MIDDLE_PRESS"] = 112] = "LONG_MIDDLE_PRESS";
    CesiumEvent[CesiumEvent["LEFT_CLICK_DRAG"] = 113] = "LEFT_CLICK_DRAG";
    CesiumEvent[CesiumEvent["RIGHT_CLICK_DRAG"] = 114] = "RIGHT_CLICK_DRAG";
    CesiumEvent[CesiumEvent["MIDDLE_CLICK_DRAG"] = 115] = "MIDDLE_CLICK_DRAG";
})(CesiumEvent || (CesiumEvent = {}));

/**
 *  NO_PICK,    - will not pick entities
 *  PICK_FIRST  - first entity will be picked . use Cesium.scene.pick()
 *  PICK_ONE    - in case a few entities are picked plonter is resolved . use Cesium.scene.drillPick()
 *  PICK_ALL    - all entities are picked. use Cesium.scene.drillPick()
 */
var PickOptions;
(function (PickOptions) {
    PickOptions[PickOptions["NO_PICK"] = 0] = "NO_PICK";
    PickOptions[PickOptions["PICK_FIRST"] = 1] = "PICK_FIRST";
    PickOptions[PickOptions["PICK_ONE"] = 2] = "PICK_ONE";
    PickOptions[PickOptions["PICK_ALL"] = 3] = "PICK_ALL";
})(PickOptions || (PickOptions = {}));

/**
 * The Service manages a singleton context menu over the map. It should be initialized with MapEventsManager.
 * The Service allows opening and closing of the context menu and passing data to the context menu inner component.
 *
 * notice, `data` will be injected to your custom menu component into the `data` field in the component.
 * __Usage :__
 * ```
 *  ngOnInit() {
 *   this.clickEvent$ = this.eventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.PICK_ONE });
 *   this.clickEvent$.subscribe(result => {
 *    if (result.entities) {
 *      const pickedMarker = result.entities[0];
 *      this.contextMenuService.open(MapContextmenuComponent, pickedMarker.position, {
 *        data: {
 *          myData: data,
 *          onDelete: () => this.delete(pickedMarker.id)
 *        }
 *      });
 *    }
 *   });
 *  }
 *
 *
 *  private delete(id) {
 *    this.mapMenu.close();
 *    this.detailedSiteService.removeMarker(id);
 *  }
 * ```
 */
class ContextMenuService {
    constructor() {
        this._showContextMenu = false;
        this._contextMenuChangeNotifier = new EventEmitter();
        this._onOpen = new EventEmitter();
        this._onClose = new EventEmitter();
        this._defaultContextMenuOptions = {
            closeOnLeftCLick: true,
            closeOnLeftClickPriority: 10,
        };
    }
    get contextMenuChangeNotifier() {
        return this._contextMenuChangeNotifier;
    }
    get showContextMenu() {
        return this._showContextMenu;
    }
    get options() {
        return this._options;
    }
    get position() {
        return this._position;
    }
    get content() {
        return this._content;
    }
    get onOpen() {
        return this._onOpen;
    }
    get onClose() {
        return this._onClose;
    }
    init(mapEventsManager) {
        this.mapEventsManager = mapEventsManager;
    }
    open(contentComponent, position, options = {}) {
        this.close();
        this._content = contentComponent;
        this._position = position;
        this._options = Object.assign({}, this._defaultContextMenuOptions, options);
        this._showContextMenu = true;
        if (this.mapEventsManager && this._options.closeOnLeftCLick) {
            this.leftClickRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK,
                pick: PickOptions.NO_PICK,
                priority: this._options.closeOnLeftClickPriority,
            });
            this.leftClickSubscription = this.leftClickRegistration.subscribe(() => {
                this.leftClickSubscription.unsubscribe();
                this.close();
            });
        }
        this._contextMenuChangeNotifier.emit();
        this._onOpen.emit();
    }
    close() {
        this._content = undefined;
        this._position = undefined;
        this._options = undefined;
        this._showContextMenu = false;
        if (this.leftClickRegistration) {
            this.leftClickRegistration.dispose();
            this.leftClickRegistration = undefined;
        }
        if (this.leftClickSubscription) {
            this.leftClickSubscription.unsubscribe();
            this.leftClickSubscription = undefined;
        }
        this._contextMenuChangeNotifier.emit();
        this._onClose.emit();
    }
}
ContextMenuService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ContextMenuService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ContextMenuService, decorators: [{
            type: Injectable
        }] });

const LatLonVectors = geodesy['LatLonVectors']; // doesnt exists on typings
window['geodesy'] = geodesy;
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * @example
 * import { Component, OnInit } from '@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * @Component({
 * 		selector:'my-component',
 * 		template:'<div>{{showCartographic}}</div>',
 * 		providers:[CoordinateConverter]
 * })
 * export class MyComponent implements OnInit {
 * 		showCartographic;
 *
 * 		constructor(private coordinateConverter:CoordinateConverter){
 * 		}
 *
 * 		ngOnInit(){
 * 			this.showCartographic = this.coordinateConverter.degreesToCartographic(5, 5, 5);
 *  }
 * }
 *
 */
class CoordinateConverter {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    static cartesian3ToLatLon(cartesian3, ellipsoid) {
        const cart = Cartographic.fromCartesian(cartesian3, ellipsoid);
        return {
            lon: Math$1.toDegrees(cart.longitude),
            lat: Math$1.toDegrees(cart.latitude),
            height: cart.height
        };
    }
    screenToCartesian3(screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            const screenPosition = Object.assign({}, screenPos);
            if (addMapCanvasBoundsToPos) {
                const mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            const camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    }
    screenToCartographic(screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    }
    cartesian3ToCartographic(cartesian, ellipsoid) {
        return Cartographic.fromCartesian(cartesian, ellipsoid);
    }
    degreesToCartographic(longitude, latitude, height) {
        return Cartographic.fromDegrees(longitude, latitude, height);
    }
    radiansToCartographic(longitude, latitude, height) {
        return Cartographic.fromRadians(longitude, latitude, height);
    }
    degreesToUTM(longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    }
    UTMToDegrees(zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    }
    geodesyToCesiumObject(geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    }
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    midPointToCartesian3(first, second) {
        const toDeg = (rad) => Math$1.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const middlePoint = firstPoint.midpointTo(secondPoint);
        return Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    }
    middlePointByScreen(position0, position1) {
        const scene = this.cesiumService.getScene();
        const screenPosition1 = SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        const screenPosition2 = SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        const middleScreenPoint = new Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    }
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    bearingTo(first, second) {
        const toDeg = (rad) => Math$1.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    }
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    bearingToCartesian(firstCartesian3, secondCartesian3) {
        const firstCart = Cartographic.fromCartesian(firstCartesian3);
        const secondCart = Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    }
}
CoordinateConverter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter, deps: [{ token: CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CoordinateConverter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: CesiumService, decorators: [{
                        type: Optional
                    }] }];
    } });

/**
 *  Abstract drawer. All drawers extends this class.
 */
class BasicDrawerService {
    constructor() {
    }
    setPropsAssigner(assigner) {
        this._propsAssigner = assigner;
    }
}

/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
class PrimitivesDrawerService extends BasicDrawerService {
    constructor(drawerType, cesiumService) {
        super();
        this.drawerType = drawerType;
        this.cesiumService = cesiumService;
        this._show = true;
    }
    init() {
        this._cesiumCollection = new this.drawerType();
        this._primitiveCollectionWrap = new PrimitiveCollection();
        this._primitiveCollectionWrap.add(this._cesiumCollection);
        this.cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
    }
    add(cesiumProps, ...args) {
        return this._cesiumCollection.add(cesiumProps);
    }
    update(entity, cesiumProps, ...args) {
        if (this._propsAssigner) {
            this._propsAssigner(entity, cesiumProps);
        }
        else {
            Object.assign(entity, cesiumProps);
        }
    }
    remove(entity) {
        this._cesiumCollection.remove(entity);
    }
    removeAll() {
        this._cesiumCollection.removeAll();
    }
    setShow(showValue) {
        this._show = showValue;
        this._primitiveCollectionWrap.show = showValue;
    }
    getShow() {
        return this._show;
    }
}

class GeoUtilsService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    static pointByLocationDistanceAndAzimuth(currentLocation, meterDistance, radianAzimuth, deprecated) {
        const distance = meterDistance / Ellipsoid.WGS84.maximumRadius;
        const cartographicLocation = currentLocation instanceof Cartesian3 ? Cartographic.fromCartesian(currentLocation) : currentLocation;
        const cartesianLocation = currentLocation instanceof Cartesian3
            ? currentLocation
            : Cartesian3.fromRadians(currentLocation.longitude, currentLocation.latitude, currentLocation.height);
        let resultPosition;
        let resultDistance;
        let counter = 0;
        let distanceFactorRangeMax = 0.1;
        let distanceFactorRangeMin = -0.1;
        while (counter === 0 ||
            (counter < 16 && Math.max(resultDistance, meterDistance) / Math.min(resultDistance, meterDistance) > 1.000001)) {
            const factor = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            resultPosition = GeoUtilsService._pointByLocationDistanceAndAzimuth(cartographicLocation, distance * (1 + factor), radianAzimuth);
            resultDistance = this.distance(cartesianLocation, resultPosition);
            if (resultDistance > meterDistance) {
                distanceFactorRangeMax = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            else {
                distanceFactorRangeMin = distanceFactorRangeMin + (distanceFactorRangeMax - distanceFactorRangeMin) / 2;
            }
            counter++;
        }
        return resultPosition;
    }
    static _pointByLocationDistanceAndAzimuth(cartographicLocation, distance, radianAzimuth) {
        const curLat = cartographicLocation.latitude;
        const curLon = cartographicLocation.longitude;
        const destinationLat = Math.asin(Math.sin(curLat) * Math.cos(distance) + Math.cos(curLat) * Math.sin(distance) * Math.cos(radianAzimuth));
        let destinationLon = curLon +
            Math.atan2(Math.sin(radianAzimuth) * Math.sin(distance) * Math.cos(curLat), Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat));
        destinationLon = ((destinationLon + 3 * Math.PI) % (2 * Math.PI)) - Math.PI;
        return Cartesian3.fromRadians(destinationLon, destinationLat);
    }
    static distance(pos0, pos1) {
        return Cartesian3.distance(pos0, pos1);
    }
    static getPositionsDelta(position0, position1) {
        return {
            x: position1.x - position0.x,
            y: position1.y - position0.y,
            z: position1.z - position0.z,
        };
    }
    static addDeltaToPosition(position, delta, updateReference = false) {
        if (updateReference) {
            position.x += delta.x;
            position.y += delta.y;
            position.z += delta.z;
            const cartographic = Cartographic.fromCartesian(position);
            cartographic.height = 0;
            const cartesian = Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
            position.x = cartesian.x;
            position.y = cartesian.y;
            position.z = cartesian.z;
            return position;
        }
        else {
            const cartesian = new Cartesian3(position.x + delta.x, position.y + delta.y, position.z + delta.z);
            const cartographic = Cartographic.fromCartesian(cartesian);
            cartographic.height = 0;
            return Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height);
        }
    }
    static middleCartesian3Point(position0, position1) {
        return new Cartesian3(position1.x - position0.x / 2, position1.y - position0.y / 2, position1.z - position0.z / 2);
    }
    screenPositionToCartesian3(screenPos) {
        const camera = this.cesiumService.getViewer().camera;
        return camera.pickEllipsoid(screenPos);
    }
}
GeoUtilsService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: GeoUtilsService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
GeoUtilsService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: GeoUtilsService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: GeoUtilsService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
class ArcDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PolylineCollection, cesiumService);
    }
    _calculateArcPositions(cesiumProps) {
        const quality = cesiumProps.quality || 18;
        const delta = (cesiumProps.delta) / quality;
        const pointsArray = [];
        for (let i = 0; i < quality + 1; ++i) {
            const point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    }
    _calculateTriangle(cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    }
    _calculateArc(cesiumProps) {
        const arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    }
    add(cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            const material = Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    }
    update(primitive, cesiumProps) {
        if (!cesiumProps.constantColor && cesiumProps.color &&
            !primitive.material.uniforms.color.equals(cesiumProps.color)) {
            primitive.material.uniforms.color = cesiumProps.color;
        }
        primitive.width = cesiumProps.width !== undefined ? cesiumProps.width : primitive.width;
        primitive.show = cesiumProps.show !== undefined ? cesiumProps.show : primitive.show;
        primitive.distanceDisplayCondition = cesiumProps.distanceDisplayCondition !== undefined ?
            cesiumProps.distanceDisplayCondition : primitive.distanceDisplayCondition;
        primitive.positions = this._calculateArc(cesiumProps);
        return primitive;
    }
}
ArcDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ArcDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

class GraphicsType {
}
GraphicsType.ellipse = Cesium$1.EllipseGraphics;
GraphicsType.ellipsoid = Cesium$1.EllipsoidGraphics;
GraphicsType.polygon = Cesium$1.PolygonGraphics;
GraphicsType.polyline = Cesium$1.PolylineGraphics;
GraphicsType.polylineVolume = Cesium$1.PolylineVolumeGraphics;
GraphicsType.box = Cesium$1.BoxGraphics;
GraphicsType.corridor = Cesium$1.CorridorGraphics;
GraphicsType.cylinder = Cesium$1.CylinderGraphics;
GraphicsType.label = Cesium$1.LabelGraphics;
GraphicsType.billboard = Cesium$1.BillboardGraphics;
GraphicsType.model = Cesium$1.ModelGraphics;
GraphicsType.path = Cesium$1.PathGraphics;
GraphicsType.point = Cesium$1.PointGraphics;
GraphicsType.rectangle = Cesium$1.RectangleGraphics;
GraphicsType.wall = Cesium$1.WallGraphics;

class OptimizedEntityCollection {
    constructor(entityCollection, collectionSize = -1, updateRate = -1) {
        this.entityCollection = entityCollection;
        this._isSuspended = false;
        this._isHardSuspend = false;
        this._updateRate = updateRate;
        this._collectionSize = collectionSize;
    }
    setShow(show) {
        this.entityCollection.show = show;
    }
    get isSuspended() {
        return this._isSuspended;
    }
    get updateRate() {
        return this._updateRate;
    }
    set updateRate(value) {
        this._updateRate = value;
    }
    get collectionSize() {
        return this._collectionSize;
    }
    set collectionSize(value) {
        this._collectionSize = value;
    }
    collection() {
        return this.entityCollection;
    }
    isFree() {
        return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
    }
    add(entity) {
        this.suspend();
        return this.entityCollection.add(entity);
    }
    remove(entity) {
        this.suspend();
        return this.entityCollection.remove(entity);
    }
    removeNoSuspend(entity) {
        this.entityCollection.remove(entity);
    }
    removeAll() {
        this.suspend();
        this.entityCollection.removeAll();
    }
    onEventSuspension(callback, once = false) {
        this._onEventSuspensionCallback = { callback, once };
        return () => {
            this._onEventSuspensionCallback = undefined;
        };
    }
    onEventResume(callback, once = false) {
        this._onEventResumeCallback = { callback, once };
        if (!this._isSuspended) {
            this.triggerEventResume();
        }
        return () => {
            this._onEventResumeCallback = undefined;
        };
    }
    triggerEventSuspension() {
        if (this._onEventSuspensionCallback !== undefined) {
            const callback = this._onEventSuspensionCallback.callback;
            if (this._onEventSuspensionCallback.once) {
                this._onEventSuspensionCallback = undefined;
            }
            callback();
        }
    }
    triggerEventResume() {
        if (this._onEventResumeCallback !== undefined) {
            const callback = this._onEventResumeCallback.callback;
            if (this._onEventResumeCallback.once) {
                this._onEventResumeCallback = undefined;
            }
            callback();
        }
    }
    suspend() {
        if (this._updateRate < 0) {
            return;
        }
        if (this._isHardSuspend) {
            return;
        }
        if (!this._isSuspended) {
            this._isSuspended = true;
            this.entityCollection.suspendEvents();
            this.triggerEventSuspension();
            this._suspensionTimeout = setTimeout(() => {
                this.entityCollection.resumeEvents();
                this.triggerEventResume();
                this._isSuspended = false;
                this._suspensionTimeout = undefined;
            }, this._updateRate);
        }
    }
    hardSuspend() {
        this.entityCollection.suspendEvents();
        this._isHardSuspend = true;
    }
    hardResume() {
        this.entityCollection.resumeEvents();
        this._isHardSuspend = false;
    }
}

/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */
class EntitiesDrawerService extends BasicDrawerService {
    constructor(cesiumService, graphicsType, defaultOptions = {
        collectionMaxSize: -1,
        collectionSuspensionTime: -1,
        collectionsNumber: 1,
    }) {
        super();
        this.cesiumService = cesiumService;
        this.graphicsType = graphicsType;
        this.defaultOptions = defaultOptions;
        this.entityCollections = new Map();
        this.graphicsTypeName = "Unknown";
        // Fix bad enum compilation
        for (const i in GraphicsType) {
            if (GraphicsType[i] === this.graphicsType) {
                this.graphicsTypeName = i;
            }
        }
    }
    getFreeEntitiesCollection() {
        let freeEntityCollection = null;
        this.entityCollections.forEach(entityCollection => {
            if (entityCollection.isFree()) {
                freeEntityCollection = entityCollection;
            }
        });
        return freeEntityCollection;
    }
    init(options) {
        const finalOptions = options || this.defaultOptions;
        const dataSources = [];
        for (let i = 0; i < finalOptions.collectionsNumber; i++) {
            const dataSource = new CustomDataSource(this.graphicsTypeName);
            dataSources.push(dataSource);
            this.cesiumService.getViewer().dataSources.add(dataSource);
            this.entityCollections.set(dataSource.entities, new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime));
        }
        return dataSources;
    }
    add(cesiumProps) {
        const optimizedEntityCollection = this.getFreeEntitiesCollection();
        if (optimizedEntityCollection === null) {
            throw new Error('No more free entity collections');
        }
        const entityObject = {
            position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
            description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
            orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
            viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined,
            [this.graphicsTypeName]: cesiumProps,
        };
        if (cesiumProps.name !== undefined) {
            entityObject.name = cesiumProps.name;
        }
        if (cesiumProps.availability !== undefined) {
            entityObject.availability = cesiumProps.availability;
        }
        return optimizedEntityCollection.add(entityObject);
    }
    update(entity, cesiumProps) {
        this.suspendEntityCollection(entity);
        if (entity.position instanceof CallbackProperty) {
            if (entity.position._isConstant) {
                entity.position = cesiumProps.position;
            }
        }
        entity.position = cesiumProps.position !== undefined ? cesiumProps.position : undefined;
        entity.name = cesiumProps.name !== undefined ? cesiumProps.name : entity.name;
        entity.description = cesiumProps.description !== undefined ? cesiumProps.description : entity.description;
        entity.orientation = cesiumProps.orientation !== undefined ? cesiumProps.orientation : entity.orientation;
        entity.viewFrom = cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : entity.viewFrom;
        entity.availability = cesiumProps.availability !== undefined ? cesiumProps.availability : cesiumProps.availability;
        if (this._propsAssigner) {
            this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
        }
        else {
            Object.assign(entity[this.graphicsTypeName], cesiumProps);
        }
    }
    remove(entity) {
        const optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
        optimizedEntityCollection.remove(entity);
    }
    removeAll() {
        this.entityCollections.forEach(entityCollection => {
            entityCollection.removeAll();
        });
    }
    setShow(showValue) {
        this.entityCollections.forEach(entityCollection => {
            entityCollection.setShow(showValue);
        });
    }
    suspendEntityCollection(entity) {
        const id = entity.entityCollection;
        if (!this.entityCollections.has(id)) {
            throw new Error('No EntityCollection for entity.entityCollection');
        }
        const entityCollection = this.entityCollections.get(id);
        entityCollection.suspend();
    }
}

/**
 *  This drawer is responsible for drawing billboards.
 */
class BillboardDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.billboard);
    }
}
BillboardDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
BillboardDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing czml dataSources.
 */
class CzmlDrawerService extends BasicDrawerService {
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    init(options) {
        const dataSources = [];
        this.czmlStream = new CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
}
CzmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CzmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing ellipses.
 */
class EllipseDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.ellipse);
    }
}
EllipseDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipseDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
EllipseDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipseDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing labels.
 */
class LabelDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.label);
    }
}
LabelDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
LabelDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing points.
 */
class PointDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.point);
    }
}
PointDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PointDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing polygons.
 */
class PolygonDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polygon);
    }
}
PolygonDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolygonDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible of drawing polylines.
 */
class PolylineDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polyline);
    }
}
PolylineDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolylineDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible of drawing polylines as primitives.
 *  This drawer is more efficient than PolylineDrawerService when drawing dynamic polylines.
 */
class PolylinePrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PolylineCollection, cesiumService);
    }
    add(cesiumProps) {
        return this._cesiumCollection.add(this.withColorMaterial(cesiumProps));
    }
    update(cesiumObject, cesiumProps) {
        if (cesiumProps.material instanceof Color) {
            if (cesiumObject.material && cesiumObject.material.uniforms &&
                cesiumObject.material.uniforms.color instanceof Color) {
                this.withColorMaterial(cesiumProps);
            }
            else if (!cesiumObject.material.uniforms.color.equals(cesiumProps.material)) {
                cesiumObject.material.uniforms.color = cesiumProps.material;
            }
        }
        super.update(cesiumObject, cesiumProps);
    }
    withColorMaterial(cesiumProps) {
        if (cesiumProps.material instanceof Color) {
            const material = Material.fromType('Color');
            material.uniforms.color = cesiumProps.material;
            cesiumProps.material = material;
        }
        return cesiumProps;
    }
}
PolylinePrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolylinePrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinePrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

var KeyboardAction;
(function (KeyboardAction) {
    KeyboardAction[KeyboardAction["CAMERA_FORWARD"] = 0] = "CAMERA_FORWARD";
    KeyboardAction[KeyboardAction["CAMERA_BACKWARD"] = 1] = "CAMERA_BACKWARD";
    KeyboardAction[KeyboardAction["CAMERA_RIGHT"] = 2] = "CAMERA_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_LEFT"] = 3] = "CAMERA_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_UP"] = 4] = "CAMERA_UP";
    KeyboardAction[KeyboardAction["CAMERA_DOWN"] = 5] = "CAMERA_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_RIGHT"] = 6] = "CAMERA_LOOK_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_LEFT"] = 7] = "CAMERA_LOOK_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_UP"] = 8] = "CAMERA_LOOK_UP";
    KeyboardAction[KeyboardAction["CAMERA_LOOK_DOWN"] = 9] = "CAMERA_LOOK_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_TWIST_RIGHT"] = 10] = "CAMERA_TWIST_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_TWIST_LEFT"] = 11] = "CAMERA_TWIST_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_RIGHT"] = 12] = "CAMERA_ROTATE_RIGHT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_LEFT"] = 13] = "CAMERA_ROTATE_LEFT";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_UP"] = 14] = "CAMERA_ROTATE_UP";
    KeyboardAction[KeyboardAction["CAMERA_ROTATE_DOWN"] = 15] = "CAMERA_ROTATE_DOWN";
    KeyboardAction[KeyboardAction["CAMERA_ZOOM_IN"] = 16] = "CAMERA_ZOOM_IN";
    KeyboardAction[KeyboardAction["CAMERA_ZOOM_OUT"] = 17] = "CAMERA_ZOOM_OUT";
})(KeyboardAction || (KeyboardAction = {}));

const CAMERA_MOVEMENT_DEFAULT_FACTOR = 100.0;
const CAMERA_LOOK_DEFAULT_FACTOR = 0.01;
const CAMERA_TWIST_DEFAULT_FACTOR = 0.01;
const CAMERA_ROTATE_DEFAULT_FACTOR = 0.01;
const PREDEFINED_KEYBOARD_ACTIONS = {
    /**
     * Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_FORWARD]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveForward(moveRate);
    },
    /**
     * Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_BACKWARD]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveBackward(moveRate);
    },
    /**
     * Moves the camera up, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_UP]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveUp(moveRate);
    },
    /**
     * Moves the camera down, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_DOWN]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveDown(moveRate);
    },
    /**
     * Moves the camera right, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_RIGHT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveRight(moveRate);
    },
    /**
     * Moves the camera left, accepts a numeric parameter named `moveRate` that controls
     * the factor of movement, according to the camera height.
     */
    [KeyboardAction.CAMERA_LEFT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const scene = cesiumService.getScene();
        const cameraHeight = scene.globe.ellipsoid.cartesianToCartographic(camera.position).height;
        const moveRate = cameraHeight / (params.moveRate || CAMERA_MOVEMENT_DEFAULT_FACTOR);
        camera.moveLeft(moveRate);
    },
    /**
     * Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_RIGHT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const currentPosition = camera.positionCartographic;
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookRight(currentPosition.latitude * lookFactor);
    },
    /**
     * Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_LEFT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const currentPosition = camera.positionCartographic;
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookLeft(currentPosition.latitude * lookFactor);
    },
    /**
     * Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_UP]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const currentPosition = camera.positionCartographic;
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookUp(currentPosition.longitude * (lookFactor * -1));
    },
    /**
     * Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
     * the factor of looking, according to the camera current position.
     */
    [KeyboardAction.CAMERA_LOOK_DOWN]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const currentPosition = camera.positionCartographic;
        const lookFactor = params.lookFactor || CAMERA_LOOK_DEFAULT_FACTOR;
        camera.lookDown(currentPosition.longitude * (lookFactor * -1));
    },
    /**
     * Twists the camera to the right, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_RIGHT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistRight(lookFactor);
    },
    /**
     * Twists the camera to the left, accepts a numeric parameter named `amount` that controls
     * the twist amount
     */
    [KeyboardAction.CAMERA_TWIST_LEFT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.amount || CAMERA_TWIST_DEFAULT_FACTOR;
        camera.twistLeft(lookFactor);
    },
    /**
     * Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_RIGHT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateRight(lookFactor);
    },
    /**
     * Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_LEFT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateLeft(lookFactor);
    },
    /**
     * Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_UP]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateUp(lookFactor);
    },
    /**
     * Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
     * the rotation angle
     */
    [KeyboardAction.CAMERA_ROTATE_DOWN]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const lookFactor = params.angle || CAMERA_ROTATE_DEFAULT_FACTOR;
        camera.rotateDown(lookFactor);
    },
    /**
     * Zoom in into the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_IN]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const amount = params.amount;
        camera.zoomIn(amount);
    },
    /**
     * Zoom out from the current camera center position, accepts a numeric parameter named
     * `amount` that controls the amount of zoom in meters.
     */
    [KeyboardAction.CAMERA_ZOOM_OUT]: (cesiumService, params) => {
        const camera = cesiumService.getViewer().camera;
        const amount = params.amount;
        camera.zoomOut(amount);
    },
};

var KeyEventState;
(function (KeyEventState) {
    KeyEventState[KeyEventState["IGNORED"] = 0] = "IGNORED";
    KeyEventState[KeyEventState["NOT_PRESSED"] = 1] = "NOT_PRESSED";
    KeyEventState[KeyEventState["PRESSED"] = 2] = "PRESSED";
})(KeyEventState || (KeyEventState = {}));
/**
 *  Service that manages keyboard keys and execute actions per request.
 *  Inject the keyboard control service into any layer, under your `ac-map` component,
 *  And defined you keyboard handlers using `setKeyboardControls`.
 *
 * <caption>Simple Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: { action: KeyboardAction.CAMERA_FORWARD },
 *       S: { action: KeyboardAction.CAMERA_BACKWARD },
 *       D: { action: KeyboardAction.CAMERA_RIGHT },
 *       A: { action: KeyboardAction.CAMERA_LEFT },
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 *
 * <caption>Advanced Example</caption>
 * ```typescript
 * Component({
 *   selector: 'keyboard-control-layer',
 *   template: '',
 * })
 * export class KeyboardControlLayerComponent implements OnInit, OnDestroy {
 *   constructor(private keyboardControlService: KeyboardControlService) {}
 *
 *   private myCustomValue = 10;
 *
 *   ngOnInit() {
 *     this.keyboardControlService.setKeyboardControls({
 *       W: {
 *          action: KeyboardAction.CAMERA_FORWARD,
 *          validate: (camera, scene, params, key) => {
 *            // Replace `checkCamera` you with your validation logic
 *            if (checkCamera(camera) || params.customParams === true) {
 *              return true;
 *            }
 *
 *            return false;
 *          },
 *          params: () => {
 *            return {
 *              myValue: this.myCustomValue,
 *            };
 *          },
 *        }
 *     });
 *    }
 *
 *   ngOnDestroy() {
 *     this.keyboardControlService.removeKeyboardControls();
 *   }
 * }
 * ```
 * <b>Predefined keyboard actions:</b>
 * + `KeyboardAction.CAMERA_FORWARD` - Moves the camera forward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_BACKWARD` - Moves the camera backward, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_UP` - Moves the camera up, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_DOWN` - Moves the camera down, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_RIGHT` - Moves the camera right, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LEFT` - Moves the camera left, accepts a numeric parameter named `moveRate` that controls
 * the factor of movement, according to the camera height.
 * + `KeyboardAction.CAMERA_LOOK_RIGHT` - Changes the camera to look to the right, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_LEFT` - Changes the camera to look to the left, accepts a numeric parameter named `lookFactor` that
 * controls the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_UP` - Changes the camera to look up, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_LOOK_DOWN` - Changes the camera to look down, accepts a numeric parameter named `lookFactor` that controls
 * the factor of looking, according to the camera current position.
 * + `KeyboardAction.CAMERA_TWIST_RIGHT` - Twists the camera to the right, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_TWIST_LEFT` - Twists the camera to the left, accepts a numeric parameter named `amount` that controls
 * the twist amount
 * + `KeyboardAction.CAMERA_ROTATE_RIGHT` - Rotates the camera to the right, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_LEFT` - Rotates the camera to the left, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_UP` - Rotates the camera upwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ROTATE_DOWN` - Rotates the camera downwards, accepts a numeric parameter named `angle` that controls
 * the rotation angle
 * + `KeyboardAction.CAMERA_ZOOM_IN` - Zoom in into the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 * + `KeyboardAction.CAMERA_ZOOM_OUT` -  Zoom out from the current camera center position, accepts a numeric parameter named
 * `amount` that controls the amount of zoom in meters.
 */
class KeyboardControlService {
    /**
     * Creats the keyboard control service.
     */
    constructor(ngZone, cesiumService, document) {
        this.ngZone = ngZone;
        this.cesiumService = cesiumService;
        this.document = document;
        this._currentDefinitions = null;
        this._activeDefinitions = {};
        this._keyMappingFn = this.defaultKeyMappingFn;
    }
    /**
     * Initializes the keyboard control service.
     */
    init() {
        const canvas = this.cesiumService.getCanvas();
        canvas.addEventListener('click', () => {
            canvas.focus();
        });
        this.handleKeydown = this.handleKeydown.bind(this);
        this.handleKeyup = this.handleKeyup.bind(this);
        this.handleTick = this.handleTick.bind(this);
    }
    /**
     * Sets the current map keyboard control definitions.
     * The definitions is a key mapping between a key string and a KeyboardControlDefinition:
     * - `action` is a predefine action from `KeyboardAction` enum, or a custom method:
     * `(camera, scene, params, key) => boolean | void` - returning false will cancel the current keydown.
     * - `validation` is a method that validates if the event should occur or not (`camera, scene, params, key`)
     * - `params` is an object (or function that returns object) that will be passed into the action executor.
     * - `done` is a function that will be triggered when `keyup` is triggered.
     * @param definitions Keyboard Control Definition
     * @param keyMappingFn - Mapping function for custom keys
     * @param outsideOfAngularZone - if key down events will run outside of angular zone.
     */
    setKeyboardControls(definitions, keyMappingFn, outsideOfAngularZone = false) {
        if (!definitions) {
            return this.removeKeyboardControls();
        }
        if (!this._currentDefinitions) {
            this.registerEvents(outsideOfAngularZone);
        }
        this._currentDefinitions = definitions;
        this._keyMappingFn = keyMappingFn || this.defaultKeyMappingFn;
        Object.keys(this._currentDefinitions).forEach(key => {
            this._activeDefinitions[key] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: null,
            };
        });
    }
    /**
     * Removes the current set of keyboard control items, and unregister from map events.
     */
    removeKeyboardControls() {
        this.unregisterEvents();
        this._currentDefinitions = null;
    }
    /**
     * Returns the current action that handles `char` key string, or `null` if not exists
     */
    getAction(char) {
        return this._currentDefinitions[char] || null;
    }
    /**
     * The default `defaultKeyMappingFn` that maps `KeyboardEvent` into a key string.
     */
    defaultKeyMappingFn(keyEvent) {
        return String.fromCharCode(keyEvent.keyCode);
    }
    /**
     * document's `keydown` event handler
     */
    handleKeydown(e) {
        const char = this._keyMappingFn(e);
        const action = this.getAction(char);
        if (action) {
            const actionState = this._activeDefinitions[char];
            if (actionState.state !== KeyEventState.IGNORED) {
                let execute = true;
                const params = this.getParams(action.params, e);
                if (action.validation) {
                    execute = action.validation(this.cesiumService, params, e);
                }
                if (execute === true) {
                    this._activeDefinitions[char] = {
                        state: KeyEventState.PRESSED,
                        action,
                        keyboardEvent: e,
                    };
                }
            }
        }
    }
    /**
     * document's `keyup` event handler
     */
    handleKeyup(e) {
        const char = this._keyMappingFn(e);
        const action = this.getAction(char);
        if (action) {
            this._activeDefinitions[char] = {
                state: KeyEventState.NOT_PRESSED,
                action: null,
                keyboardEvent: e,
            };
            if (action.done && typeof action.done === 'function') {
                action.done(this.cesiumService, e);
            }
        }
    }
    /**
     * `tick` event handler that triggered by Cesium render loop
     */
    handleTick() {
        const activeKeys = Object.keys(this._activeDefinitions);
        activeKeys.forEach(key => {
            const actionState = this._activeDefinitions[key];
            if (actionState !== null && actionState.action !== null && actionState.state === KeyEventState.PRESSED) {
                this.executeAction(actionState.action, key, actionState.keyboardEvent);
            }
        });
    }
    /**
     *
     * Params resolve function, returns object.
     * In case of params function, executes it and returns it's return value.
     *
     */
    getParams(paramsDef, keyboardEvent) {
        if (!paramsDef) {
            return {};
        }
        if (typeof paramsDef === 'function') {
            return paramsDef(this.cesiumService, keyboardEvent);
        }
        return paramsDef;
    }
    /**
     *
     * Executes a given `KeyboardControlParams` object.
     *
     */
    executeAction(execution, key, keyboardEvent) {
        if (!this._currentDefinitions) {
            return;
        }
        const params = this.getParams(execution.params, keyboardEvent);
        if (typeof execution.action == 'number') {
            const predefinedAction = PREDEFINED_KEYBOARD_ACTIONS[execution.action];
            if (predefinedAction) {
                predefinedAction(this.cesiumService, params, keyboardEvent);
            }
        }
        else if (typeof execution.action === 'function') {
            const shouldCancelEvent = execution.action(this.cesiumService, params, keyboardEvent);
            if (shouldCancelEvent === false) {
                this._activeDefinitions[key] = {
                    state: KeyEventState.IGNORED,
                    action: null,
                    keyboardEvent: null,
                };
            }
        }
    }
    /**
     * Registers to keydown, keyup of `document`, and `tick` of Cesium.
     */
    registerEvents(outsideOfAngularZone) {
        const registerToEvents = () => {
            this.document.addEventListener('keydown', this.handleKeydown);
            this.document.addEventListener('keyup', this.handleKeyup);
            this.cesiumService.getViewer().clock.onTick.addEventListener(this.handleTick);
        };
        if (outsideOfAngularZone) {
            this.ngZone.runOutsideAngular(registerToEvents);
        }
        else {
            registerToEvents();
        }
    }
    /**
     * Unregisters to keydown, keyup of `document`, and `tick` of Cesium.
     */
    unregisterEvents() {
        this.document.removeEventListener('keydown', this.handleKeydown);
        this.document.removeEventListener('keyup', this.handleKeyup);
        this.cesiumService.getViewer().clock.onTick.removeEventListener(this.handleTick);
    }
}
KeyboardControlService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService, deps: [{ token: i0.NgZone }, { token: CesiumService }, { token: DOCUMENT }], target: i0.ɵɵFactoryTarget.Injectable });
KeyboardControlService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: KeyboardControlService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: CesiumService }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }];
    } });

class CesiumPureEventObserver {
    constructor(event, modifier) {
        this.event = event;
        this.modifier = modifier;
    }
    init(eventsHandler) {
        this.observer = Observable.create((observer) => {
            eventsHandler.setInputAction((movement) => {
                if (movement.position) {
                    movement.startPosition = movement.position;
                    movement.endPosition = movement.position;
                }
                observer.next(movement);
            }, this.event, this.modifier);
        });
        return this.observer;
    }
}

class CesiumLongPressObserver extends CesiumPureEventObserver {
    constructor(event, modifier, eventFactory) {
        super(event, modifier);
        this.event = event;
        this.modifier = modifier;
        this.eventFactory = eventFactory;
    }
    init() {
        let startEvent;
        let stopEvent;
        if (this.event === CesiumEvent.LONG_LEFT_PRESS) {
            startEvent = CesiumEvent.LEFT_DOWN;
            stopEvent = CesiumEvent.LEFT_UP;
        }
        else if (this.event === CesiumEvent.LONG_RIGHT_PRESS) {
            startEvent = CesiumEvent.RIGHT_DOWN;
            stopEvent = CesiumEvent.RIGHT_UP;
        }
        else if (this.event === CesiumEvent.LONG_MIDDLE_PRESS) {
            startEvent = CesiumEvent.MIDDLE_DOWN;
            stopEvent = CesiumEvent.MIDDLE_UP;
        }
        // Save start event position
        let startEventPosition = null;
        const startEventObservable = this.eventFactory.get(startEvent, this.modifier)
            .pipe(tap((movement) => (startEventPosition = movement.endPosition)));
        // Prevent drag mistaken for long press by observing mouse move far from start event position
        const mouseMoveEventObservable = this.eventFactory.get(CesiumEvent.MOUSE_MOVE)
            .pipe(filter((movement) => Math.abs(movement.endPosition.x - startEventPosition.x) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX ||
            Math.abs(movement.endPosition.y - startEventPosition.y) > CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX));
        const stopEventObservable = merge(this.eventFactory.get(stopEvent, this.modifier), mouseMoveEventObservable);
        // publish for preventing side effect
        const longPressObservable = publish()(startEventObservable.pipe(mergeMap((e) => of(e).pipe(delay(CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION), takeUntil(stopEventObservable)))));
        return longPressObservable;
    }
}
CesiumLongPressObserver.LONG_PRESS_EVENTS_DURATION = 250;
CesiumLongPressObserver.LONG_PRESS_EVENTS_MIN_DISTANCE_PX = 10;

class CesiumEventBuilder {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.cesiumEventsObservables = new Map();
    }
    static getEventFullName(event, modifier) {
        if (modifier) {
            return `${event}_${modifier}`;
        }
        else {
            return event.toString();
        }
    }
    init() {
        this.eventsHandler = this.cesiumService.getViewer().screenSpaceEventHandler;
    }
    get(event, modifier) {
        const eventName = CesiumEventBuilder.getEventFullName(event, modifier);
        if (this.cesiumEventsObservables.has(eventName)) {
            return this.cesiumEventsObservables.get(eventName);
        }
        else {
            const eventObserver = this.createCesiumEventObservable(event, modifier);
            this.cesiumEventsObservables.set(eventName, eventObserver);
            return eventObserver;
        }
    }
    createCesiumEventObservable(event, modifier) {
        let cesiumEventObservable;
        if (CesiumEventBuilder.longPressEvents.has(event)) {
            cesiumEventObservable = this.createSpecialCesiumEventObservable(event, modifier);
        }
        else {
            cesiumEventObservable = publish()(new CesiumPureEventObserver(event, modifier).init(this.eventsHandler));
        }
        cesiumEventObservable.connect();
        return cesiumEventObservable;
    }
    createSpecialCesiumEventObservable(event, modifier) {
        // could support more events if needed
        return new CesiumLongPressObserver(event, modifier, this).init();
    }
}
CesiumEventBuilder.longPressEvents = new Set([
    CesiumEvent.LONG_LEFT_PRESS,
    CesiumEvent.LONG_RIGHT_PRESS,
    CesiumEvent.LONG_MIDDLE_PRESS
]);
CesiumEventBuilder.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumEventBuilder.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumEventBuilder, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

const UtilsService = {
    unique: (array) => {
        return array.reduce((accumulator, currentValue) => {
            if (accumulator.indexOf(currentValue) < 0) {
                accumulator.push(currentValue);
            }
            return accumulator;
        }, []);
    }
};

class CesiumDragDropHelper {
    static getDragEventTypes(dragEvent) {
        let mouseDownEvent;
        let mouseUpEvent;
        if (dragEvent === CesiumEvent.LEFT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.LEFT_DOWN;
            mouseUpEvent = CesiumEvent.LEFT_UP;
        }
        else if (dragEvent === CesiumEvent.RIGHT_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.RIGHT_DOWN;
            mouseUpEvent = CesiumEvent.RIGHT_UP;
        }
        else if (dragEvent === CesiumEvent.MIDDLE_CLICK_DRAG) {
            mouseDownEvent = CesiumEvent.MIDDLE_DOWN;
            mouseUpEvent = CesiumEvent.MIDDLE_UP;
        }
        return { mouseDownEvent, mouseUpEvent };
    }
}
CesiumDragDropHelper.dragEvents = new Set([
    CesiumEvent.LEFT_CLICK_DRAG,
    CesiumEvent.RIGHT_CLICK_DRAG,
    CesiumEvent.MIDDLE_CLICK_DRAG
]);

/**
 * Service for solving plonter.
 * Used by map-event-manager and plonter context component
 */
class PlonterService {
    constructor() {
        this._entitesToPlonter = [];
        this._plonterChangeNotifier = new EventEmitter();
        this._plonterObserver = new Subject();
    }
    get plonterChangeNotifier() {
        return this._plonterChangeNotifier;
    }
    get plonterShown() {
        return this._plonterShown;
    }
    get entitesToPlonter() {
        return this._entitesToPlonter;
    }
    get plonterClickPosition() {
        return this._eventResult.movement;
    }
    plonterIt(eventResult) {
        this._eventResult = eventResult;
        this._entitesToPlonter = eventResult.entities;
        this._plonterShown = true;
        this._plonterChangeNotifier.emit();
        return this._plonterObserver;
    }
    resolvePlonter(entity) {
        this._plonterShown = false;
        this._eventResult.entities = [entity];
        this._plonterChangeNotifier.emit();
        this._plonterObserver.next(this._eventResult);
    }
}
PlonterService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PlonterService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PlonterService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class Registration {
    constructor(observable, stopper, priority, isPaused) {
        this.observable = observable;
        this.stopper = stopper;
        this.priority = priority;
        this.isPaused = isPaused;
    }
}
/**
 * Manages all map events. Notice events will run outside of Angular zone.
 * Provided by `<ac-map/>` component there for could be injected at any component under `<ac-map/>` hierarchy
 * or from the `<ac-map/>` component reference `acMapComponent.getMapEventsManager()`
 *
 * __usage:__
 * ```
 * MapEventsManagerService.register({event, modifier, priority, entityType, pickOption}).subscribe()
 * ```
 * __param:__ {CesiumEvent} event
 * __param:__ {CesiumEventModifier} modifier
 * __param:__ priority - the bigger the number the bigger the priority. default : 0.
 * __param:__ entityType - entity type class that you are interested like (Track). the class must extends AcEntity
 * __param:__ pickOption - self explained
 */
class MapEventsManagerService {
    constructor(cesiumService, eventBuilder, plonterService) {
        this.cesiumService = cesiumService;
        this.eventBuilder = eventBuilder;
        this.plonterService = plonterService;
        this.eventRegistrations = new Map();
    }
    init() {
        this.eventBuilder.init();
        this.scene = this.cesiumService.getScene();
    }
    /**
     * Register to map event
     * @param input Event Registration Input
     *
     * @returns DisposableObservable<EventResult>
     */
    register(input) {
        if (this.scene === undefined) {
            throw new Error('CesiumService has not been initialized yet - MapEventsManagerService must be injected  under ac-map');
        }
        input.pick = input.pick || PickOptions.NO_PICK;
        input.priority = input.priority || 0;
        input.pickConfig = input.pickConfig || {};
        if (input.entityType && input.pick === PickOptions.NO_PICK) {
            throw new Error('MapEventsManagerService: can\'t register an event ' +
                'with entityType and PickOptions.NO_PICK - It doesn\'t make sense ');
        }
        const eventName = CesiumEventBuilder.getEventFullName(input.event, input.modifier);
        if (!this.eventRegistrations.has(eventName)) {
            this.eventRegistrations.set(eventName, []);
        }
        const eventRegistration = this.createEventRegistration(input);
        const registrationObservable = eventRegistration.observable;
        registrationObservable.dispose = () => this.disposeObservable(eventRegistration, eventName);
        this.eventRegistrations.get(eventName).push(eventRegistration);
        this.sortRegistrationsByPriority(eventName);
        return registrationObservable;
    }
    disposeObservable(eventRegistration, eventName) {
        eventRegistration.stopper.next(1);
        const registrations = this.eventRegistrations.get(eventName);
        const index = registrations.indexOf(eventRegistration);
        if (index !== -1) {
            registrations.splice(index, 1);
        }
        this.sortRegistrationsByPriority(eventName);
    }
    sortRegistrationsByPriority(eventName) {
        const registrations = this.eventRegistrations.get(eventName);
        registrations.sort((a, b) => b.priority - a.priority);
        if (registrations.length === 0) {
            return;
        }
        // Active registrations by priority
        const currentPriority = registrations[0].priority;
        registrations.forEach((registration) => {
            registration.isPaused = registration.priority < currentPriority;
        });
    }
    createEventRegistration({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
        const cesiumEventObservable = this.eventBuilder.get(event, modifier);
        const stopper = new Subject();
        const registration = new Registration(undefined, stopper, priority, false);
        let observable;
        if (!CesiumDragDropHelper.dragEvents.has(event)) {
            observable = cesiumEventObservable.pipe(filter(() => !registration.isPaused), map((movement) => this.triggerPick(movement, pickOption, pickConfig)), filter((result) => result.cesiumEntities !== null || entityType === undefined), map((picksAndMovement) => this.addEntities(picksAndMovement, entityType, pickOption, pickFilter)), filter((result) => result.entities !== null || (entityType === undefined && !pickFilter)), switchMap((entitiesAndMovement) => this.plonter(entitiesAndMovement, pickOption)), takeUntil(stopper));
        }
        else {
            observable = this.createDragEvent({
                event,
                modifier,
                entityType,
                pick: pickOption,
                priority,
                pickFilter,
                pickConfig
            }).pipe(takeUntil(stopper));
        }
        registration.observable = observable;
        return registration;
    }
    createDragEvent({ event, modifier, entityType, pick: pickOption, priority, pickFilter, pickConfig, }) {
        const { mouseDownEvent, mouseUpEvent } = CesiumDragDropHelper.getDragEventTypes(event);
        const mouseUpObservable = this.eventBuilder.get(mouseUpEvent);
        const mouseMoveObservable = this.eventBuilder.get(CesiumEvent.MOUSE_MOVE);
        const mouseDownRegistration = this.createEventRegistration({
            event: mouseDownEvent,
            modifier,
            entityType,
            pick: pickOption,
            priority,
            pickFilter,
            pickConfig,
        });
        const dropSubject = new Subject();
        const dragObserver = mouseDownRegistration.observable.pipe(mergeMap(e => {
            let lastMove = null;
            const dragStartPositionX = e.movement.startPosition.x;
            const dragStartPositionY = e.movement.startPosition.y;
            return mouseMoveObservable.pipe(map((movement) => {
                lastMove = {
                    movement: {
                        drop: false,
                        startPosition: {
                            x: dragStartPositionX,
                            y: dragStartPositionY,
                        },
                        endPosition: movement.endPosition,
                    },
                    entities: e.entities,
                    cesiumEntities: e.cesiumEntities
                };
                return lastMove;
            }), takeUntil(mouseUpObservable), tap({
                complete: () => {
                    // On complete
                    if (lastMove) {
                        const dropEvent = Object.assign({}, lastMove);
                        dropEvent.movement.drop = true;
                        dropSubject.next(dropEvent);
                    }
                }
            }));
        }));
        return merge(dragObserver, dropSubject);
    }
    triggerPick(movement, pickOptions, pickConfig) {
        let picks = [];
        switch (pickOptions) {
            case PickOptions.PICK_ONE:
            case PickOptions.PICK_ALL:
                picks = this.scene.drillPick(movement.endPosition, pickConfig.drillPickLimit, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = picks.length === 0 ? null : picks;
                break;
            case PickOptions.PICK_FIRST:
                const pick = this.scene.pick(movement.endPosition, pickConfig.pickWidth, pickConfig.pickHeight);
                picks = pick === undefined ? null : [pick];
                break;
            case PickOptions.NO_PICK:
                break;
            default:
                break;
        }
        // Picks can be cesium entity or cesium primitive
        if (picks) {
            picks = picks.map((pick) => pick.id && pick.id instanceof Entity ? pick.id : pick.primitive);
        }
        return { movement: movement, cesiumEntities: picks };
    }
    addEntities(picksAndMovement, entityType, pickOption, pickFilter) {
        if (picksAndMovement.cesiumEntities === null) {
            picksAndMovement.entities = null;
            return picksAndMovement;
        }
        let entities = [];
        if (pickOption !== PickOptions.NO_PICK) {
            if (entityType) {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity).filter((acEntity) => {
                    return acEntity && acEntity instanceof entityType;
                });
            }
            else {
                entities = picksAndMovement.cesiumEntities.map((pick) => pick.acEntity);
            }
            entities = UtilsService.unique(entities);
            entities = (pickFilter && entities) ? entities.filter(pickFilter) : entities;
            if (entities.length === 0) {
                entities = null;
            }
        }
        picksAndMovement.entities = entities;
        return picksAndMovement;
    }
    plonter(entitiesAndMovement, pickOption) {
        if (pickOption === PickOptions.PICK_ONE && entitiesAndMovement.entities !== null && entitiesAndMovement.entities.length > 1) {
            return this.plonterService.plonterIt(entitiesAndMovement);
        }
        else {
            return of(entitiesAndMovement);
        }
    }
}
MapEventsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService, deps: [{ token: CesiumService }, { token: CesiumEventBuilder }, { token: PlonterService }], target: i0.ɵɵFactoryTarget.Injectable });
MapEventsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapEventsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }, { type: CesiumEventBuilder }, { type: PlonterService }]; } });

class MapLayersService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    registerLayerDataSources(dataSources, zIndex) {
        dataSources.forEach(ds => {
            ds.zIndex = zIndex;
            this.layersDataSources.push(ds);
        });
    }
    drawAllLayers() {
        this.layersDataSources.sort((a, b) => a.zIndex - b.zIndex);
        this.layersDataSources.forEach((dataSource) => {
            this.cesiumService.getViewer().dataSources.add(dataSource);
        });
    }
    updateAndRefresh(dataSources, newZIndex) {
        if (dataSources && dataSources.length) {
            dataSources.forEach((ds) => {
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources[index].zIndex = newZIndex;
                }
            });
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    }
    removeDataSources(dataSources) {
        dataSources.forEach(ds => {
            const index = this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                this.layersDataSources.splice(index, 1);
                this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        });
    }
}
MapLayersService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
MapLayersService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 * Take screenshot of your cesium globe.
 *
 * usage:
 * ```typescript
 * // get base 64 data url
 * const dataUrl = screenshotService.getMapScreenshotDataUrl();
 *
 * // or download as png
 * screenshotService.downloadMapScreenshot('my-map.png');
 *
 * ```
 *
 */
class ScreenshotService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    getMapScreenshotDataUrlBase64() {
        const canvas = this.cesiumService.getCanvas();
        return canvas.toDataURL();
    }
    downloadMapScreenshot(filename = 'map.png') {
        const dataUrl = this.getMapScreenshotDataUrlBase64();
        this.downloadURI(dataUrl, filename);
    }
    downloadURI(uri, name) {
        const link = document.createElement('a');
        link.download = name;
        link.href = uri;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}
ScreenshotService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ScreenshotService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ScreenshotService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
class MapsManagerService {
    constructor() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    getMap(id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    }
    _registerMap(id, acMap) {
        if (!this.firstMap) {
            this.firstMap = acMap;
        }
        const mapId = id ? id : this.generateDefaultId();
        if (this._Maps.has(mapId)) {
            throw new Error(`Map with id: ${mapId} already exist`);
        }
        this._Maps.set(mapId, acMap);
        return mapId;
    }
    _removeMapById(id) {
        return this._Maps.delete(id);
    }
    generateDefaultId() {
        this.defaultIdCounter++;
        return 'default-map-id-' + this.defaultIdCounter;
    }
    /**
     * Binds multiple 2D map's cameras together.
     * @param mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     */
    sync2DMapsCameras(mapsConfiguration) {
        const DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        const maps = mapsConfiguration.map(config => {
            const map = this.getMap(config.id);
            if (!map) {
                throw new Error(`Couldn't find map with id: ${config.id}`);
            }
            return { map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
        });
        maps.forEach(masterMapConfig => {
            const masterMap = masterMapConfig.map;
            const options = masterMapConfig.options;
            const masterCamera = masterMap.getCameraService().getCamera();
            const masterCameraCartographic = masterCamera.positionCartographic;
            masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
            const removeCallback = masterCamera.changed.addEventListener(() => {
                maps.forEach(slaveMapConfig => {
                    const slaveMap = slaveMapConfig.map;
                    const slaveMapOptions = slaveMapConfig.options;
                    if (slaveMap === masterMap) {
                        return;
                    }
                    const slaveCamera = slaveMap.getCameraService().getCamera();
                    const slaveCameraCartographic = slaveCamera.positionCartographic;
                    const position = Ellipsoid.WGS84.cartographicToCartesian(new Cartographic(masterCameraCartographic.longitude, masterCameraCartographic.latitude, slaveMapOptions.bindZoom ? masterCameraCartographic.height : slaveCameraCartographic.height));
                    if (slaveMap.getCesiumViewer().scene.mode !== SceneMode$1.MORPHING) {
                        slaveCamera.setView({
                            destination: position,
                            orientation: {
                                heading: slaveCamera.heading,
                                pitch: slaveCamera.pitch,
                            },
                        });
                    }
                });
            });
            this.eventRemoveCallbacks.push(removeCallback);
        });
    }
    /**
     * Unsyncs maps cameras
     */
    unsyncMapsCameras() {
        this.eventRemoveCallbacks.forEach(removeCallback => removeCallback());
        this.eventRemoveCallbacks = [];
    }
}
MapsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MapsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-map element.
 *  __Usage:__
 *  ```
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
class AcHtmlComponent {
    constructor(cesiumService, elementRef, renderer) {
        this.cesiumService = cesiumService;
        this.elementRef = elementRef;
        this.renderer = renderer;
        this.isDraw = false;
    }
    setScreenPosition(screenPosition) {
        if (screenPosition) {
            this.renderer.setStyle(this.elementRef.nativeElement, 'top', `${screenPosition.y}px`);
            this.renderer.setStyle(this.elementRef.nativeElement, 'left', `${screenPosition.x}px`);
        }
    }
    ngOnInit() {
        // this.cesiumService.getMap().getMapContainer().appendChild(this.elementRef.nativeElement);
        this.cesiumService.getMapContainer().appendChild(this.elementRef.nativeElement);
        if (this.props.show === false) {
            this.hideElement();
        }
    }
    remove() {
        if (this.isDraw) {
            this.isDraw = false;
            this.cesiumService.getScene().preRender.removeEventListener(this.preRenderEventListener);
            this.hideElement();
        }
    }
    hideElement() {
        this.renderer.setStyle(this.elementRef.nativeElement, 'display', `none`);
    }
    add() {
        if (!this.isDraw) {
            this.isDraw = true;
            this.preRenderEventListener = () => {
                const screenPosition = SceneTransforms.wgs84ToWindowCoordinates(this.cesiumService.getScene(), this.props.position);
                this.setScreenPosition(screenPosition);
            };
            this.renderer.setStyle(this.elementRef.nativeElement, 'display', `block`);
            this.cesiumService.getScene().preRender.addEventListener(this.preRenderEventListener);
        }
    }
    ngDoCheck() {
        if (this.props.show === undefined || this.props.show) {
            this.add();
        }
        else {
            this.remove();
        }
    }
    ngOnDestroy() {
        this.remove();
    }
}
AcHtmlComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlComponent, deps: [{ token: CesiumService }, { token: i0.ElementRef }, { token: i0.Renderer2 }], target: i0.ɵɵFactoryTarget.Component });
AcHtmlComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlComponent, selector: "ac-html", inputs: { props: "props" }, ngImport: i0, template: `<ng-content></ng-content>`, isInline: true, styles: [":host{position:absolute;z-index:100}\n"] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-html',
                    template: `<ng-content></ng-content>`,
                    styles: [`:host {
                position: absolute;
                z-index: 100;
				}`]
                }]
        }], ctorParameters: function () { return [{ type: CesiumService }, { type: i0.ElementRef }, { type: i0.Renderer2 }]; }, propDecorators: { props: [{
                type: Input
            }] } });

class AcDefaultPlonterComponent {
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
    }
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
}
AcDefaultPlonterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDefaultPlonterComponent, deps: [{ token: PlonterService }, { token: i0.ChangeDetectorRef }, { token: CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
AcDefaultPlonterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDefaultPlonterComponent, selector: "ac-default-plonter", providers: [CoordinateConverter], ngImport: i0, template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `, isInline: true, styles: [".plonter-context-menu{background-color:#fafafacc;box-shadow:1px 1px 5px #00000026}.plonter-item{cursor:pointer;padding:2px 15px;text-align:start}.plonter-item:hover{background-color:#00000026}\n"], components: [{ type: AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDefaultPlonterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-default-plonter',
                    template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `,
                    styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [CoordinateConverter],
                }]
        }], ctorParameters: function () { return [{ type: PlonterService }, { type: i0.ChangeDetectorRef }, { type: CoordinateConverter }]; } });

/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 *
 * usage:
 * ```typescript
 * // We want to open the context menu on mouse right click.
 * // Register to mouse right click with the MapEventsManager
 * this.mapEventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
 *    .subscribe(event => {
 *       const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition, true);
 *       if (!position) {
 *         return;
 *       }
 *       // Open the context menu on the position that was clicked and pass some data to MyCustomContextMenuComponent.
 *       this.contextMenuService.open(
 *         MyCustomContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
class AcContextMenuWrapperComponent {
    constructor(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ngOnInit() {
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe(() => this.cd.detectChanges());
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe(() => {
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.contextMenuService.content);
                this.viewContainerRef.clear();
                const componentRef = this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.data = this.contextMenuService.options.data;
                this.cd.detectChanges();
            });
    }
    ngOnDestroy() {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    }
}
AcContextMenuWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcContextMenuWrapperComponent, deps: [{ token: ContextMenuService }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Component });
AcContextMenuWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcContextMenuWrapperComponent, selector: "ac-context-menu-wrapper", viewQueries: [{ propertyName: "viewContainerRef", first: true, predicate: ["contextMenuContainer"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `, isInline: true, components: [{ type: AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcContextMenuWrapperComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-context-menu-wrapper',
                    template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: ContextMenuService }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }]; }, propDecorators: { viewContainerRef: [{
                type: ViewChild,
                args: ['contextMenuContainer', { read: ViewContainerRef }]
            }] } });

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
class AcMapComponent {
    constructor(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, screenshotService, contextMenuService, coordinateConverter) {
        this._cesiumService = _cesiumService;
        this._cameraService = _cameraService;
        this._elemRef = _elemRef;
        this.document = document;
        this.mapsManagerService = mapsManagerService;
        this.billboardDrawerService = billboardDrawerService;
        this.labelDrawerService = labelDrawerService;
        this.ellipseDrawerService = ellipseDrawerService;
        this.polylineDrawerService = polylineDrawerService;
        this.polygonDrawerService = polygonDrawerService;
        this.arcDrawerService = arcDrawerService;
        this.pointDrawerService = pointDrawerService;
        this.czmlDrawerService = czmlDrawerService;
        this.mapEventsManager = mapEventsManager;
        this.keyboardControlService = keyboardControlService;
        this.mapLayersService = mapLayersService;
        this.screenshotService = screenshotService;
        this.contextMenuService = contextMenuService;
        this.coordinateConverter = coordinateConverter;
        /**
         * Disable default plonter context menu
         */
        this.disableDefaultPlonter = false;
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
    ngOnChanges(changes) {
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
            }
            else {
                throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
            }
        }
    }
    ngAfterViewInit() {
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout(() => {
                const element = this.document.getElementById(this.containerId);
                if (element) {
                    element.appendChild(this.mapContainer);
                }
                else {
                    throw new Error(`No element found with id: ${this.containerId}`);
                }
            }, 0);
        }
    }
    ngOnDestroy() {
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
    getCameraService() {
        return this._cameraService;
    }
    getId() {
        return this.mapId;
    }
    getMapContainer() {
        return this.mapContainer;
    }
    getMapEventsManager() {
        return this.mapEventsManager;
    }
    getContextMenuService() {
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
AcMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapComponent, deps: [{ token: CesiumService }, { token: CameraService }, { token: i0.ElementRef }, { token: DOCUMENT }, { token: MapsManagerService }, { token: BillboardDrawerService }, { token: LabelDrawerService }, { token: EllipseDrawerService }, { token: PolylineDrawerService }, { token: PolygonDrawerService }, { token: ArcDrawerService }, { token: PointDrawerService }, { token: CzmlDrawerService }, { token: MapEventsManagerService }, { token: KeyboardControlService }, { token: MapLayersService }, { token: ScreenshotService }, { token: ContextMenuService }, { token: CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
AcMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapComponent, selector: "ac-map", inputs: { disableDefaultPlonter: "disableDefaultPlonter", mapId: "mapId", flyTo: "flyTo", sceneMode: "sceneMode", containerId: "containerId" }, providers: [
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
    ], usesOnChanges: true, ngImport: i0, template: `
    <ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `, isInline: true, components: [{ type: AcDefaultPlonterComponent, selector: "ac-default-plonter" }, { type: AcContextMenuWrapperComponent, selector: "ac-context-menu-wrapper" }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapComponent, decorators: [{
            type: Component,
            args: [{
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
                }]
        }], ctorParameters: function () {
        return [{ type: CesiumService }, { type: CameraService }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: MapsManagerService }, { type: BillboardDrawerService }, { type: LabelDrawerService }, { type: EllipseDrawerService }, { type: PolylineDrawerService }, { type: PolygonDrawerService }, { type: ArcDrawerService }, { type: PointDrawerService }, { type: CzmlDrawerService }, { type: MapEventsManagerService }, { type: KeyboardControlService }, { type: MapLayersService }, { type: ScreenshotService }, { type: ContextMenuService }, { type: CoordinateConverter }];
    }, propDecorators: { disableDefaultPlonter: [{
                type: Input
            }], mapId: [{
                type: Input
            }], flyTo: [{
                type: Input
            }], sceneMode: [{
                type: Input
            }], containerId: [{
                type: Input
            }] } });

class LayerService {
    constructor() {
        this._cache = true;
        this.descriptions = [];
        this.layerUpdate = new EventEmitter();
    }
    get cache() {
        return this._cache;
    }
    set cache(value) {
        this._cache = value;
    }
    get zIndex() {
        return this._zIndex;
    }
    set zIndex(value) {
        if (value !== this._zIndex) {
            this.layerUpdate.emit();
        }
        this._zIndex = value;
    }
    get show() {
        return this._show;
    }
    set show(value) {
        if (value !== this._show) {
            this.layerUpdate.emit();
        }
        this._show = value;
    }
    get options() {
        return this._options;
    }
    set options(value) {
        this._options = value;
        this.layerUpdate.emit();
    }
    get context() {
        return this._context;
    }
    set context(context) {
        this._context = context;
        this.layerUpdate.emit();
    }
    setEntityName(name) {
        this._entityName = name;
    }
    getEntityName() {
        return this._entityName;
    }
    registerDescription(descriptionComponent) {
        if (this.descriptions.indexOf(descriptionComponent) < 0) {
            this.descriptions.push(descriptionComponent);
        }
    }
    unregisterDescription(descriptionComponent) {
        const index = this.descriptions.indexOf(descriptionComponent);
        if (index > -1) {
            this.descriptions.splice(index, 1);
        }
    }
    getDescriptions() {
        return this.descriptions;
    }
    layerUpdates() {
        return this.layerUpdate;
    }
}
LayerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
LayerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LayerService, decorators: [{
            type: Injectable
        }] });

/**
 * Action to do on entity
 */
var ActionType;
(function (ActionType) {
    ActionType[ActionType["ADD_UPDATE"] = 0] = "ADD_UPDATE";
    ActionType[ActionType["DELETE"] = 1] = "DELETE";
})(ActionType || (ActionType = {}));

class ComputationCache {
    constructor() {
        this._cache = new Map();
    }
    get(expression, insertFn) {
        if (this._cache.has(expression)) {
            return this._cache.get(expression);
        }
        const value = insertFn();
        this._cache.set(expression, value);
        return value;
    }
    clear() {
        this._cache.clear();
    }
}
ComputationCache.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ComputationCache.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ComputationCache, decorators: [{
            type: Injectable
        }] });

class Checker {
    static throwIfAnyNotPresent(values, propertyNames) {
        propertyNames.forEach(propertyName => Checker.throwIfNotPresent(values, propertyName));
    }
    static throwIfNotPresent(value, name) {
        if (!Checker.present(value[name])) {
            throw new Error(`Error: ${name} was not given.`);
        }
    }
    static present(value) {
        return value !== undefined && value !== null;
    }
}

/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
class DynamicEllipseDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PrimitiveCollection, cesiumService);
    }
    add(cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return super.add(new EllipsePrimitive(cesiumProps));
    }
    update(ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    }
}
DynamicEllipseDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
DynamicEllipseDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for creating the dynamic version of the polyline component.
 */
class DynamicPolylineDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PolylineCollection, cesiumService);
    }
}
DynamicPolylineDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicPolylineDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
DynamicPolylineDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicPolylineDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 */
class StaticPrimitiveDrawer extends PrimitivesDrawerService {
    constructor(geometryType, cesiumService) {
        super(PrimitiveCollection, cesiumService);
        this.geometryType = geometryType;
    }
    add(geometryProps, instanceProps, primitiveProps) {
        if (Object.keys(instanceProps).length === 0) {
            throw (new Error('instanceProps object is empty'));
        }
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new GeometryInstance(instanceProps);
        primitiveProps.asynchronous = false;
        const primitive = new Primitive(primitiveProps);
        return super.add(primitive);
    }
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        instanceProps.geometry = new this.geometryType(geometryProps);
        primitiveProps.geometryInstances = new GeometryInstance(instanceProps);
        this._cesiumCollection.remove(primitive);
        return super.add(new Primitive(primitiveProps));
    }
}

/**
 *  This drawer is responsible for creating the static version of the circle component.
 */
class StaticCircleDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(CircleGeometry, cesiumService);
    }
}
StaticCircleDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticCircleDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticCircleDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticCircleDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticCircleDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for creating the static version of the polyline component.
 *  This also allows us to change the color of the polylines.
 */
class StaticPolylineDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(PolylineGeometry, cesiumService);
    }
    /**
     * Update function can only change the primitive color.
     */
    update(primitive, geometryProps, instanceProps, primitiveProps) {
        const color = instanceProps.attributes.color.value;
        if (primitive.ready) {
            primitive.getGeometryInstanceAttributes().color = color;
        }
        else {
            when(primitive.readyPromise).then((readyPrimitive) => {
                readyPrimitive.getGeometryInstanceAttributes().color.value = color;
            });
        }
        return primitive;
    }
}
StaticPolylineDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolylineDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolylineDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(PolygonGeometry, cesiumService);
    }
}
StaticPolygonDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolygonDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(EllipseGeometry, cesiumService);
    }
}
StaticEllipseDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticEllipseDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing models.
 */
class ModelDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.model);
    }
}
ModelDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ModelDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ModelDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ModelDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ModelDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing box.
 */
class BoxDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.box);
    }
}
BoxDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BoxDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
BoxDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BoxDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BoxDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing corridors .
 */
class CorridorDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.corridor);
    }
}
CorridorDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CorridorDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CorridorDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CorridorDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CorridorDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing cylinders.
 */
class CylinderDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.cylinder);
    }
}
CylinderDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CylinderDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CylinderDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CylinderDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CylinderDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing ellipsoid.
 */
class EllipsoidDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.ellipsoid);
    }
}
EllipsoidDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsoidDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
EllipsoidDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsoidDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsoidDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing polylines.
 */
class PolylineVolumeDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.polylineVolume);
    }
}
PolylineVolumeDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineVolumeDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PolylineVolumeDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineVolumeDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylineVolumeDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing polygons.
 */
class WallDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.wall);
    }
}
WallDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: WallDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
WallDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: WallDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: WallDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing rectangles.
 */
class RectangleDrawerService extends EntitiesDrawerService {
    constructor(cesiumService) {
        super(cesiumService, GraphicsType.rectangle);
    }
}
RectangleDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectangleDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
RectangleDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectangleDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectangleDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing labels as primitives.
 *  This drawer is more efficient than LabelDrawerService when drawing dynamic labels.
 */
class LabelPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(LabelCollection, cesiumService);
    }
}
LabelPrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelPrimitiveDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
LabelPrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelPrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: LabelPrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible for drawing billboards as primitives.
 *  This drawer is more efficient than BillboardDrawerService when drawing dynamic billboards.
 */
class BillboardPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(BillboardCollection, cesiumService);
    }
}
BillboardPrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardPrimitiveDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
BillboardPrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardPrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BillboardPrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

/**
 *  This drawer is responsible of drawing points as primitives.
 *  This drawer is more efficient than PointDrawerService when drawing dynamic points.
 */
class PointPrimitiveDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PointPrimitiveCollection, cesiumService);
    }
}
PointPrimitiveDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointPrimitiveDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
PointPrimitiveDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointPrimitiveDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointPrimitiveDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

class HtmlDrawerService extends PrimitivesDrawerService {
    constructor(_cesiumService) {
        super(Cesium.HtmlCollection, _cesiumService);
        this._cesiumService = _cesiumService;
    }
    add(cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        // cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        cesiumProps.mapContainer = this._cesiumService.getMapContainer();
        return super.add(cesiumProps);
    }
}
HtmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
HtmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: CesiumService }]; } });

// tslint:enable
/**
 *  This is a ac-layer implementation.
 *  The ac-layer element must be a child of ac-map element.
 *  + acFor `{string}` - get the tracked observable and entityName (see the example).
 *  + show `{boolean}` - show/hide layer's entities.
 *  + context `{any}` - get the context layer that will use the componnet (most of the time equal to "this").
 *  + options `{LayerOptions}` - sets the layer options for each drawer.
 *  + zIndex `{number}` - controls the zIndex (order) of the layer, layers with greater zIndex will be in front of layers with lower zIndex
 *    (Exception For `Billboard` and `Label`, should use `[eyeOffset]` prop instead)</br>
 *    zIndex won't work for pritimitve descs (like ac-primitive-polyline...)
 *  + debug `{boolean}` - prints every acNotification
 *
 *
 *  __Usage :__
 *  ```
 *  <ac-map>
 *    <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [options]="options" [zIndex]="1">
 *      <ac-billboard-desc props="{
 *        image: track.image,
 *        position: track.position,
 *        scale: track.scale,
 *        color: track.color,
 *        name: track.name
 *      }">
 *      </ac-billboard-desc>
 *        <ac-label-desc props="{
 *          position: track.position,
 *          pixelOffset : [-15,20] | pixelOffset,
 *          text: track.name,
 *          font: '15px sans-serif'
 *        }">
 *      </ac-label-desc>
 *    </ac-layer>
 *  </ac-map>
 *  ```
 */
class AcLayerComponent {
    constructor(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
        this.debug = false;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.stopObservable = new Subject();
        this._updateStream = new Subject();
        this.entitiesStore = new Map();
        this.layerDrawerDataSources = [];
        this._drawerList = new Map([
            ['billboard', billboardDrawerService],
            ['label', labelDrawerService],
            ['ellipse', ellipseDrawerService],
            ['polyline', polylineDrawerService],
            ['polygon', polygonDrawerService],
            ['arc', arcDrawerService],
            ['point', pointDrawerService],
            ['model', modelDrawerService],
            ['box', boxDrawerService],
            ['corridor', corridorDrawerService],
            ['cylinder', cylinderDrawerService],
            ['ellipsoid', ellipsoidDrawerSerice],
            ['polylineVolume', polylineVolumeDrawerService],
            ['rectangle', rectangleDrawerService],
            ['wall', wallDrawerService],
            ['polylinePrimitive', polylinePrimitiveDrawerService],
            ['labelPrimitive', labelPrimitiveDrawerService],
            ['billboardPrimitive', billboardPrimitiveDrawerService],
            ['pointPrimitive', pointPrimitiveDrawerService],
            ['html', htmlDrawerService],
            ['czml', czmlDrawerService],
            ['dynamicEllipse', dynamicEllipseDrawerService],
            ['dynamicPolyline', dynamicPolylineDrawerService],
            ['staticCircle', staticCircleDrawerService],
            ['staticPolyline', staticPolylineDrawerService],
            ['staticPolygon', staticPolygonDrawerService],
            ['staticEllipse', staticEllipseDrawerService],
        ]);
    }
    init() {
        this.initValidParams();
        merge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((notification) => {
            this._computationCache.clear();
            if (this.debug) {
                console.log('AcLayer received notification:', notification);
            }
            let contextEntity = notification.entity;
            if (this.store) {
                contextEntity = this.updateStore(notification);
            }
            this.context[this.entityName] = contextEntity;
            this.layerService.getDescriptions().forEach((descriptionComponent) => {
                switch (notification.actionType) {
                    case ActionType.ADD_UPDATE:
                        descriptionComponent.draw(this.context, notification.id, contextEntity);
                        break;
                    case ActionType.DELETE:
                        descriptionComponent.remove(notification.id);
                        break;
                    default:
                        console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
                }
            });
        });
    }
    updateStore(notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
            if (this.entitiesStore.has(notification.id)) {
                const entity = this.entitiesStore.get(notification.id);
                Object.assign(entity, notification.entity);
                return entity;
            }
            else {
                this.entitiesStore.set(notification.id, notification.entity);
                return notification.entity;
            }
        }
    }
    initValidParams() {
        if (!this.context) {
            throw new Error('ac-layer: must initialize [context] ');
        }
        if (!this.acForRgx.test(this.acFor)) {
            throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${this.acFor}`);
        }
        const acForArr = this.acFor.split(' ');
        this.observable = this.context[acForArr[3]];
        this.entityName = acForArr[1];
        if (!this.isObservable(this.observable)) {
            throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
        }
        this.layerService.context = this.context;
        this.layerService.setEntityName(this.entityName);
    }
    /** Test for a rxjs Observable */
    isObservable(obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    }
    ngAfterContentInit() {
        this.init();
    }
    ngOnInit() {
        this.layerService.context = this.context;
        this.layerService.options = this.options;
        this.layerService.show = this.show;
        this.layerService.zIndex = this.zIndex;
        this._drawerList.forEach((drawer, drawerName) => {
            const initOptions = this.options ? this.options[drawerName] : undefined;
            const drawerDataSources = drawer.init(initOptions);
            // only entities drawers create data sources
            if (drawerDataSources) {
                // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
                // TODO: Check if the following line causes Bad Performance
                this.layerDrawerDataSources.push(...drawerDataSources);
            }
            drawer.setShow(this.show);
        });
    }
    ngOnChanges(changes) {
        if (changes.show && !changes.show.firstChange) {
            const showValue = changes['show'].currentValue;
            this.layerService.show = showValue;
            this._drawerList.forEach((drawer) => drawer.setShow(showValue));
        }
        if (changes.zIndex && !changes.zIndex.firstChange) {
            const zIndexValue = changes['zIndex'].currentValue;
            this.layerService.zIndex = zIndexValue;
            this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
        }
    }
    ngOnDestroy() {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    }
    getLayerService() {
        return this.layerService;
    }
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    getLayerDrawerDataSources() {
        return this.layerDrawerDataSources;
    }
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name) {
        return this.layerDrawerDataSources.filter(d => d.name === name);
    }
    /**
     * Returns the store.
     */
    getStore() {
        return this.entitiesStore;
    }
    /**
     * Remove all the entities from the layer.
     */
    removeAll() {
        this.layerService.getDescriptions().forEach((description) => description.removeAll());
        this.entitiesStore.clear();
    }
    /**
     * remove entity from the layer
     */
    remove(entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    }
    /**
     * add/update entity to/from the layer
     */
    updateNotification(notification) {
        this._updateStream.next(notification);
    }
    /**
     * add/update entity to/from the layer
     */
    update(entity, id) {
        this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
    }
    refreshAll(collection) {
        // TODO make entity interface: collection of type entity not notification
        from(collection).subscribe((entity) => this._updateStream.next(entity));
    }
}
AcLayerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLayerComponent, deps: [{ token: LayerService }, { token: ComputationCache }, { token: MapLayersService }, { token: BillboardDrawerService }, { token: LabelDrawerService }, { token: EllipseDrawerService }, { token: PolylineDrawerService }, { token: PolygonDrawerService }, { token: ArcDrawerService }, { token: PointDrawerService }, { token: ModelDrawerService }, { token: BoxDrawerService }, { token: CorridorDrawerService }, { token: CylinderDrawerService }, { token: EllipsoidDrawerService }, { token: PolylineVolumeDrawerService }, { token: WallDrawerService }, { token: RectangleDrawerService }, { token: DynamicEllipseDrawerService }, { token: DynamicPolylineDrawerService }, { token: StaticCircleDrawerService }, { token: StaticPolylineDrawerService }, { token: StaticPolygonDrawerService }, { token: StaticEllipseDrawerService }, { token: PolylinePrimitiveDrawerService }, { token: LabelPrimitiveDrawerService }, { token: BillboardPrimitiveDrawerService }, { token: PointPrimitiveDrawerService }, { token: HtmlDrawerService }, { token: CzmlDrawerService }], target: i0.ɵɵFactoryTarget.Component });
AcLayerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcLayerComponent, selector: "ac-layer", inputs: { show: "show", acFor: "acFor", context: "context", store: "store", options: "options", zIndex: "zIndex", debug: "debug" }, providers: [
        LayerService,
        ComputationCache,
        BillboardDrawerService,
        LabelDrawerService,
        EllipseDrawerService,
        PolylineDrawerService,
        ArcDrawerService,
        PointDrawerService,
        PolygonDrawerService,
        ModelDrawerService,
        BoxDrawerService,
        CorridorDrawerService,
        CylinderDrawerService,
        EllipsoidDrawerService,
        PolylineVolumeDrawerService,
        WallDrawerService,
        RectangleDrawerService,
        PolylinePrimitiveDrawerService,
        LabelPrimitiveDrawerService,
        BillboardPrimitiveDrawerService,
        PointPrimitiveDrawerService,
        HtmlDrawerService,
        CzmlDrawerService,
        DynamicEllipseDrawerService,
        DynamicPolylineDrawerService,
        StaticCircleDrawerService,
        StaticPolylineDrawerService,
        StaticPolygonDrawerService,
        StaticEllipseDrawerService,
    ], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLayerComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-layer',
                    template: '<ng-content></ng-content>',
                    providers: [
                        LayerService,
                        ComputationCache,
                        BillboardDrawerService,
                        LabelDrawerService,
                        EllipseDrawerService,
                        PolylineDrawerService,
                        ArcDrawerService,
                        PointDrawerService,
                        PolygonDrawerService,
                        ModelDrawerService,
                        BoxDrawerService,
                        CorridorDrawerService,
                        CylinderDrawerService,
                        EllipsoidDrawerService,
                        PolylineVolumeDrawerService,
                        WallDrawerService,
                        RectangleDrawerService,
                        PolylinePrimitiveDrawerService,
                        LabelPrimitiveDrawerService,
                        BillboardPrimitiveDrawerService,
                        PointPrimitiveDrawerService,
                        HtmlDrawerService,
                        CzmlDrawerService,
                        DynamicEllipseDrawerService,
                        DynamicPolylineDrawerService,
                        StaticCircleDrawerService,
                        StaticPolylineDrawerService,
                        StaticPolygonDrawerService,
                        StaticEllipseDrawerService,
                    ],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: LayerService }, { type: ComputationCache }, { type: MapLayersService }, { type: BillboardDrawerService }, { type: LabelDrawerService }, { type: EllipseDrawerService }, { type: PolylineDrawerService }, { type: PolygonDrawerService }, { type: ArcDrawerService }, { type: PointDrawerService }, { type: ModelDrawerService }, { type: BoxDrawerService }, { type: CorridorDrawerService }, { type: CylinderDrawerService }, { type: EllipsoidDrawerService }, { type: PolylineVolumeDrawerService }, { type: WallDrawerService }, { type: RectangleDrawerService }, { type: DynamicEllipseDrawerService }, { type: DynamicPolylineDrawerService }, { type: StaticCircleDrawerService }, { type: StaticPolylineDrawerService }, { type: StaticPolygonDrawerService }, { type: StaticEllipseDrawerService }, { type: PolylinePrimitiveDrawerService }, { type: LabelPrimitiveDrawerService }, { type: BillboardPrimitiveDrawerService }, { type: PointPrimitiveDrawerService }, { type: HtmlDrawerService }, { type: CzmlDrawerService }]; }, propDecorators: { show: [{
                type: Input
            }], acFor: [{
                type: Input
            }], context: [{
                type: Input
            }], store: [{
                type: Input
            }], options: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], debug: [{
                type: Input
            }] } });

/**
 *  Extend this class to create drawing on map components.
 */
class EntityOnMapComponent {
    constructor(_drawer, mapLayers) {
        this._drawer = _drawer;
        this.mapLayers = mapLayers;
    }
    ngOnInit() {
        this.selfPrimitiveIsDraw = false;
        const dataSources = this._drawer.init();
        if (dataSources) {
            this.dataSources = dataSources;
            // this.mapLayers.registerLayerDataSources(dataSources, 0);
        }
        this.drawOnMap();
    }
    ngOnChanges(changes) {
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            this.updateOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.props);
    }
    removeFromMap() {
        this.selfPrimitiveIsDraw = false;
        return this._drawer.remove(this.selfPrimitive);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            return this._drawer.update(this.selfPrimitive, this.props);
        }
    }
    ngOnDestroy() {
        this.mapLayers.removeDataSources(this.dataSources);
        this.removeFromMap();
    }
}
EntityOnMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EntityOnMapComponent, deps: [{ token: BasicDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Directive });
EntityOnMapComponent.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: EntityOnMapComponent, inputs: { props: "props" }, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EntityOnMapComponent, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: BasicDrawerService }, { type: MapLayersService }]; }, propDecorators: { props: [{
                type: Input
            }] } });

/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }">;
 *    </ac-billboard>
 *  ```
 */
class AcBillboardComponent extends EntityOnMapComponent {
    constructor(billboardDrawer, mapLayers) {
        super(billboardDrawer, mapLayers);
    }
}
AcBillboardComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardComponent, deps: [{ token: BillboardDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBillboardComponent, selector: "ac-billboard", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: BillboardDrawerService }, { type: MapLayersService }]; } });

/**
 * Service for effective assignment.
 */
class SmartAssigner {
    static create(props = [], allowUndefined = true) {
        let fnBody = ``;
        props.forEach(prop => {
            if (!allowUndefined) {
                // tslint:disable-next-line:max-line-length
                fnBody += `if (!(obj1['${prop}'] instanceof Cesium.CallbackProperty) && obj2['${prop}'] !== undefined) { obj1['${prop}'] = obj2['${prop}']; } `;
            }
            else {
                fnBody += `if(!(obj1['${prop}'] instanceof Cesium.CallbackProperty))obj1['${prop}'] = obj2['${prop}']; `;
            }
        });
        fnBody += `return obj1`;
        const assignFn = new Function('obj1', 'obj2', fnBody);
        return function smartAssigner(obj1, obj2) {
            return assignFn(obj1, obj2);
        };
    }
}

class JsonMapper {
    constructor() {
        this._mapper = new JsonStringMapper();
    }
    map(expression) {
        return this._mapper.map(expression);
    }
}
JsonMapper.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
JsonMapper.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: JsonMapper, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class CesiumProperties {
    constructor(_parser, _jsonMapper) {
        this._parser = _parser;
        this._jsonMapper = _jsonMapper;
        this._assignersCache = new Map();
        this._evaluatorsCache = new Map();
    }
    _compile(expression, withCache = true) {
        const cesiumDesc = {};
        const propsMap = new Map();
        const resultMap = this._jsonMapper.map(expression);
        resultMap.forEach((resultExpression, prop) => propsMap.set(prop, {
            expression: resultExpression,
            get: this._parser.eval(resultExpression)
        }));
        propsMap.forEach((value, prop) => {
            if (withCache) {
                cesiumDesc[prop || 'undefined'] = `cache.get(\`${value.expression}\`, () => propsMap.get('${prop}').get(context))`;
            }
            else {
                cesiumDesc[prop || 'undefined'] = `propsMap.get('${prop}').get(context)`;
            }
        });
        const fnBody = `return ${JSON.stringify(cesiumDesc).replace(/"/g, '')};`;
        const getFn = new Function('propsMap', 'cache', 'context', fnBody);
        return function evaluateCesiumProps(cache, context) {
            return getFn(propsMap, cache, context);
        };
    }
    _build(expression) {
        const props = Array.from(this._jsonMapper.map(expression).keys());
        const smartAssigner = SmartAssigner.create(props);
        return function assignCesiumProps(oldVal, newVal) {
            return smartAssigner(oldVal, newVal);
        };
    }
    createEvaluator(expression, withCache = true, newEvaluator = false) {
        if (!newEvaluator && this._evaluatorsCache.has(expression)) {
            return this._evaluatorsCache.get(expression);
        }
        const evaluatorFn = this._compile(expression, withCache);
        this._evaluatorsCache.set(expression, evaluatorFn);
        return evaluatorFn;
    }
    createAssigner(expression) {
        if (this._assignersCache.has(expression)) {
            return this._assignersCache.get(expression);
        }
        const assignFn = this._build(expression);
        this._assignersCache.set(expression, assignFn);
        return assignFn;
    }
}
CesiumProperties.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties, deps: [{ token: i1.Parse }, { token: JsonMapper }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumProperties.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumProperties, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.Parse }, { type: JsonMapper }]; } });

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
class BasicDesc {
    constructor(_drawer, _layerService, _computationCache, _cesiumProperties) {
        this._drawer = _drawer;
        this._layerService = _layerService;
        this._computationCache = _computationCache;
        this._cesiumProperties = _cesiumProperties;
        this.onDraw = new EventEmitter();
        this.onRemove = new EventEmitter();
        this._cesiumObjectsMap = new Map();
    }
    _propsEvaluator(context) {
        return this._propsEvaluateFn(this._computationCache, context);
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => this._propsAssignerFn(cesiumObject, desc);
    }
    getLayerService() {
        return this._layerService;
    }
    setLayerService(layerService) {
        this._layerService.unregisterDescription(this);
        this._layerService = layerService;
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    ngOnInit() {
        if (!this.props) {
            console.error('ac-desc components error: [props] input is mandatory');
        }
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
        this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
    }
    getCesiumObjectsMap() {
        return this._cesiumObjectsMap;
    }
    draw(context, id, entity) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            const cesiumObject = this._drawer.add(cesiumProps);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._cesiumObjectsMap.set(id, cesiumObject);
        }
        else {
            const cesiumObject = this._cesiumObjectsMap.get(id);
            this.onDraw.emit({
                acEntity: entity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
            this._drawer.setPropsAssigner(this._getPropsAssigner());
            this._drawer.update(cesiumObject, cesiumProps);
        }
    }
    remove(id) {
        const cesiumObject = this._cesiumObjectsMap.get(id);
        if (cesiumObject) {
            this.onRemove.emit({
                acEntity: cesiumObject.acEntity,
                cesiumEntity: cesiumObject,
                entityId: id,
            });
            this._drawer.remove(cesiumObject);
            this._cesiumObjectsMap.delete(id);
        }
    }
    removeAll() {
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
    ngOnDestroy() {
        this._layerService.unregisterDescription(this);
        this.removeAll();
    }
}
BasicDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicDesc, deps: [{ token: BasicDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: BasicDesc, inputs: { props: "props" }, outputs: { onDraw: "onDraw", onRemove: "onRemove" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: BasicDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; }, propDecorators: { props: [{
                type: Input
            }], onDraw: [{
                type: Output
            }], onRemove: [{
                type: Output
            }] } });

/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-desc>
 *  ```
 */
class AcBillboardDescComponent extends BasicDesc {
    constructor(billboardDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardDescComponent, deps: [{ token: BillboardDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBillboardDescComponent, selector: "ac-billboard-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: BillboardDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-layer element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-ellipse-desc props="{
 *      position: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      height: 0
 *    }">
 *    </ac-ellipse-desc>
 *  ```
 */
class AcEllipseDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcEllipseDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipseDescComponent, deps: [{ token: EllipseDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcEllipseDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcEllipseDescComponent, selector: "ac-ellipse-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcEllipseDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-ellipse-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcEllipseDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: EllipseDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and PolylineGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-desc>
 * ```
 */
class AcPolylineDescComponent extends BasicDesc {
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineDescComponent, deps: [{ token: PolylineDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolylineDescComponent, selector: "ac-polyline-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylineDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polyline-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylineDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: PolylineDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 * @example
 * <ac-label-desc props="{
 *            position: track.position,
 *            pixelOffset : [-15,20] | pixelOffset,
 *            text: track.name,
 *            font: '15px sans-serif'
 *    }">
 * </ac-label-desc>
 */
class PixelOffsetPipe {
    transform(value, args) {
        return new Cartesian2(value[0], value[1]);
    }
}
PixelOffsetPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
PixelOffsetPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, name: "pixelOffset" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PixelOffsetPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'pixelOffset'
                }]
        }] });

class RadiansToDegreesPipe {
    transform(value, args) {
        return (360 - Math.round(180 * value / Math.PI)) % 360;
    }
}
RadiansToDegreesPipe.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, deps: [], target: i0.ɵɵFactoryTarget.Pipe });
RadiansToDegreesPipe.ɵpipe = i0.ɵɵngDeclarePipe({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, name: "radiansToDegrees" });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RadiansToDegreesPipe, decorators: [{
            type: Pipe,
            args: [{
                    name: 'radiansToDegrees'
                }]
        }] });

/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-desc>
 *  ```
 */
class AcLabelDescComponent extends BasicDesc {
    constructor(labelDrawer, layerService, computationCache, cesiumProperties) {
        super(labelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcLabelDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelDescComponent, deps: [{ token: LabelDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcLabelDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcLabelDescComponent, selector: "ac-label-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-label-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: LabelDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

class UtilsModule {
}
UtilsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: UtilsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
UtilsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: UtilsModule, imports: [CommonModule] });
UtilsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: UtilsModule, providers: [], imports: [[CommonModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: UtilsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule],
                    providers: []
                }]
        }] });

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *__Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
class AcCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        delete cesiumProps.radius;
        return cesiumProps;
    }
    _getPropsAssigner() {
        return (cesiumObject, desc) => Object.assign(cesiumObject, desc);
    }
}
AcCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleDescComponent, deps: [{ token: EllipseDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCircleDescComponent, selector: "ac-circle-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-circle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: EllipseDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-layer element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc props="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius,
 *          color : arc.color - The color should be Cesium.Color type
 *    }">
 *    </ac-arc-desc>
 *    ```
 *
 *    description of the props :
 *    center - The arc is a section of an outline of a circle, This is the center of the circle
 *    angle - the initial angle of the arc in radians
 *    delta - the spreading of the arc,
 *    radius - the distance from the center to the arc
 *
 *    for example :
 *    angle - 0
 *    delta - π
 *
 *    will draw an half circle
 */
class AcArcDescComponent extends BasicDesc {
    constructor(arcDrawer, layerService, computationCache, cesiumProperties) {
        super(arcDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcArcDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcDescComponent, deps: [{ token: ArcDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcArcDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArcDescComponent, selector: "ac-arc-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcArcDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: ArcDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 * Angular Cesium parent entity, all entities should inherit from it.
 * ```typescript
 * entity= new AcEntity({
 *  	id: 0,
 *  	name: 'click me',
 *  	position: Cartesian3.fromRadians(0.5, 0.5),
 * });
 * ```
 */
class AcEntity {
    /**
     * Creates entity from a json
     * @param json entity object
     * @returns entity as AcEntity
     */
    static create(json) {
        if (json) {
            return Object.assign(new AcEntity(), json);
        }
        return new AcEntity();
    }
    /**
     * Creates entity from a json
     * @param json (Optional) entity object
     */
    constructor(json) {
        Object.assign(this, json);
    }
}

class AcNotification {
}

class MapLayerProviderOptions {
}
MapLayerProviderOptions.ArcGisMapServer = Cesium$1.ArcGisMapServerImageryProvider;
MapLayerProviderOptions.WebMapTileService = Cesium$1.WebMapTileServiceImageryProvider;
MapLayerProviderOptions.MapTileService = Cesium$1.TileMapServiceImageryProvider;
MapLayerProviderOptions.WebMapService = Cesium$1.WebMapServiceImageryProvider;
MapLayerProviderOptions.SingleTileImagery = Cesium$1.SingleTileImageryProvider;
MapLayerProviderOptions.OpenStreetMap = Cesium$1.OpenStreetMapImageryProvider;
MapLayerProviderOptions.BingMaps = Cesium$1.BingMapsImageryProvider;
MapLayerProviderOptions.GoogleEarthEnterpriseMaps = Cesium$1.GoogleEarthEnterpriseMapsProvider;
MapLayerProviderOptions.MapBox = Cesium$1.MapboxImageryProvider;
MapLayerProviderOptions.MapboxStyleImageryProvider = Cesium$1.MapboxStyleImageryProvider;
MapLayerProviderOptions.UrlTemplateImagery = Cesium$1.UrlTemplateImageryProvider;
MapLayerProviderOptions.OFFLINE = null;

class MapTerrainProviderOptions {
}
MapTerrainProviderOptions.CesiumTerrain = Cesium$1.CesiumTerrainProvider;
MapTerrainProviderOptions.ArcGISTiledElevation = Cesium$1.ArcGISTiledElevationTerrainProvider;
MapTerrainProviderOptions.GoogleEarthEnterprise = Cesium$1.GoogleEarthEnterpriseTerrainProvider;
MapTerrainProviderOptions.VRTheWorld = Cesium$1.VRTheWorldTerrainProvider;
MapTerrainProviderOptions.Ellipsoid = Cesium$1.EllipsoidTerrainProvider;
MapTerrainProviderOptions.WorldTerrain = Cesium$1.createWorldTerrain;

/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
class AcMapLayerProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
         */
        this.options = {};
        /**
         * the provider
         */
        this.provider = MapLayerProviderOptions.OFFLINE;
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        /**
         * The alpha blending value of this layer: 0.0 to 1.0
         */
        this.alpha = 1.0;
        /**
         * The brightness of this layer: 0.0 to 1.0
         */
        this.brightness = 1.0;
        /**
         * The contrast of this layer: 0.0 to 1.0
         */
        this.contrast = 1.0;
        this.imageryLayersCollection = this.cesiumService.getScene().imageryLayers;
    }
    createOfflineMapProvider() {
        return Cesium.createTileMapServiceImageryProvider({
            url: buildModuleUrl('Assets/Textures/NaturalEarthII')
        });
    }
    ngOnInit() {
        if (!Checker.present(this.options.url) && this.provider !== MapLayerProviderOptions.OFFLINE) {
            throw new Error('options must have a url');
        }
        switch (this.provider) {
            case MapLayerProviderOptions.WebMapService:
            case MapLayerProviderOptions.WebMapTileService:
            case MapLayerProviderOptions.ArcGisMapServer:
            case MapLayerProviderOptions.SingleTileImagery:
            case MapLayerProviderOptions.BingMaps:
            case MapLayerProviderOptions.GoogleEarthEnterpriseMaps:
            case MapLayerProviderOptions.MapBox:
            case MapLayerProviderOptions.MapboxStyleImageryProvider:
            case MapLayerProviderOptions.UrlTemplateImagery:
            case MapLayerProviderOptions.MapTileService:
            case MapLayerProviderOptions.OpenStreetMap:
                this.layerProvider = new this.provider(this.options);
                break;
            case MapLayerProviderOptions.OFFLINE:
                this.layerProvider = this.createOfflineMapProvider();
                break;
            default:
                console.log('ac-map-layer-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.layerProvider = this.createOfflineMapProvider();
                break;
        }
        if (this.show) {
            this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
            this.imageryLayer.alpha = this.alpha;
            this.imageryLayer.contrast = this.contrast;
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.imageryLayer) {
                    this.imageryLayersCollection.add(this.imageryLayer, this.index);
                }
                else {
                    this.imageryLayer = this.imageryLayersCollection.addImageryProvider(this.layerProvider, this.index);
                    this.imageryLayer.alpha = this.alpha;
                    this.imageryLayer.contrast = this.contrast;
                    this.imageryLayer.brightness = this.brightness;
                }
            }
            else if (this.imageryLayer) {
                this.imageryLayersCollection.remove(this.imageryLayer, false);
            }
        }
        if (changes['alpha'] && !changes['alpha'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.alpha = this.alpha;
        }
        if (changes['contrast'] && !changes['contrast'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.contrast = this.contrast;
        }
        if (changes['brightness'] && !changes['brightness'].isFirstChange() && this.imageryLayer) {
            this.imageryLayer.brightness = this.brightness;
        }
    }
    ngOnDestroy() {
        if (this.imageryLayer) {
            this.imageryLayersCollection.remove(this.imageryLayer, true);
        }
    }
}
AcMapLayerProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapLayerProviderComponent, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapLayerProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapLayerProviderComponent, selector: "ac-map-layer-provider", inputs: { options: "options", provider: "provider", index: "index", show: "show", alpha: "alpha", brightness: "brightness", contrast: "contrast" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapLayerProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-layer-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], alpha: [{
                type: Input
            }], brightness: [{
                type: Input
            }], contrast: [{
                type: Input
            }] } });

/**
 *  This component is used for adding a terrain provider service to the map (ac-map)
 *  options according to selected terrain provider MapTerrainProviderOptions enum.
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-terrain-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-terrain-provider>
 *  ```
 */
class AcMapTerrainProviderComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/TerrainProvider.html
         */
        this.options = {};
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)
            && this.provider !== MapTerrainProviderOptions.Ellipsoid
            && this.provider !== MapTerrainProviderOptions.WorldTerrain) {
            throw new Error('options must have a url');
        }
        this.defaultTerrainProvider = this.cesiumService.getViewer().terrainProvider;
        switch (this.provider) {
            case MapTerrainProviderOptions.CesiumTerrain:
            case MapTerrainProviderOptions.ArcGISTiledElevation:
            case MapTerrainProviderOptions.GoogleEarthEnterprise:
            case MapTerrainProviderOptions.VRTheWorld:
            case MapTerrainProviderOptions.Ellipsoid:
                this.terrainProvider = new this.provider(this.options);
                break;
            case MapTerrainProviderOptions.WorldTerrain:
                this.terrainProvider = this.provider(this.options);
                break;
            default:
                console.log('ac-map-terrain-provider: [provider] wasn\'t found. setting OFFLINE provider as default');
                this.terrainProvider = this.defaultTerrainProvider;
                break;
        }
        if (this.show) {
            this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.terrainProvider) {
                    this.cesiumService.getViewer().terrainProvider = this.terrainProvider;
                }
            }
            else {
                this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
            }
        }
    }
    ngOnDestroy() {
        this.cesiumService.getViewer().terrainProvider = this.defaultTerrainProvider;
    }
}
AcMapTerrainProviderComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapTerrainProviderComponent, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcMapTerrainProviderComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapTerrainProviderComponent, selector: "ac-map-terrain-provider", inputs: { options: "options", provider: "provider", show: "show" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapTerrainProviderComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map-terrain-provider',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], provider: [{
                type: Input
            }], show: [{
                type: Input
            }] } });

/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-point-desc props="{
 *     pixelSize : point.pixelSize, //optional
 *     position : point.positions,
 *     color : point.color  //optional
 *   }">
 *   </ac-point-desc>
 *  ```
 */
class AcPointDescComponent extends BasicDesc {
    constructor(pointDrawerService, layerService, computationCache, cesiumProperties) {
        super(pointDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPointDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointDescComponent, deps: [{ token: PointDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPointDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPointDescComponent, selector: "ac-point-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPointDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-point-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPointDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: PointDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */
class AcLabelComponent extends EntityOnMapComponent {
    constructor(labelDrawer, mapLayers) {
        super(labelDrawer, mapLayers);
    }
}
AcLabelComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelComponent, deps: [{ token: LabelDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcLabelComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcLabelComponent, selector: "ac-label", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-label',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: LabelDrawerService }, { type: MapLayersService }]; } });

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
class AcPolylineComponent extends EntityOnMapComponent {
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPolylineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineComponent, deps: [{ token: PolylineDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPolylineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolylineComponent, selector: "ac-polyline", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polyline',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: PolylineDrawerService }, { type: MapLayersService }]; } });

/**
 *  This is an ellipse implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-ellipse [props]="{
 *    position: position,
 *    semiMajorAxis:40000.0,
 *    semiMinorAxis:25000.0,
 *    rotation : 0.785398
 *  }">
 *  </ac-ellipse>
 *  ```
 */
class AcEllipseComponent extends EntityOnMapComponent {
    constructor(ellipseDrawer, mapLayers) {
        super(ellipseDrawer, mapLayers);
    }
}
AcEllipseComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipseComponent, deps: [{ token: EllipseDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcEllipseComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcEllipseComponent, selector: "ac-ellipse", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipseComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-ellipse',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: EllipseDrawerService }, { type: MapLayersService }]; } });

/**
 *  This is a point implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and PointGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PointGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-point [props]="{
 *    position: position,
 *    width: 3
 *  }">
 *  </ac-point>
 *  ```
 */
class AcPointComponent extends EntityOnMapComponent {
    constructor(pointDrawer, mapLayers) {
        super(pointDrawer, mapLayers);
    }
}
AcPointComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointComponent, deps: [{ token: PointDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPointComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPointComponent, selector: "ac-point", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-point',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: PointDrawerService }, { type: MapLayersService }]; } });

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */
class AcCircleComponent extends EntityOnMapComponent {
    constructor(ellipseDrawerService, mapLayers) {
        super(ellipseDrawerService, mapLayers);
    }
    updateEllipseProps() {
        this.props.semiMajorAxis = this.props.radius;
        this.props.semiMinorAxis = this.props.radius;
        this.props.rotation = 0.0;
    }
    drawOnMap() {
        this.updateEllipseProps();
        super.drawOnMap();
    }
    updateOnMap() {
        this.updateEllipseProps();
        super.updateOnMap();
    }
}
AcCircleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleComponent, deps: [{ token: EllipseDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcCircleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCircleComponent, selector: "ac-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCircleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-circle',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: EllipseDrawerService }, { type: MapLayersService }]; } });

/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */
class AcArcComponent extends EntityOnMapComponent {
    constructor(arcDrawer, mapLayers) {
        super(arcDrawer, mapLayers);
    }
    updateOnMap() {
        if (this.selfPrimitiveIsDraw) {
            this.removeFromMap();
            this.drawOnMap();
        }
    }
    drawOnMap() {
        this.selfPrimitiveIsDraw = true;
        return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
    }
    ngOnChanges(changes) {
        const geometryProps = changes['geometryProps'];
        const instanceProps = changes['instanceProps'];
        const primitiveProps = changes['primitiveProps'];
        if (geometryProps.currentValue !== geometryProps.previousValue ||
            instanceProps.currentValue !== instanceProps.previousValue ||
            primitiveProps.currentValue !== primitiveProps.previousValue) {
            this.updateOnMap();
        }
    }
}
AcArcComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcComponent, deps: [{ token: ArcDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcArcComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArcComponent, selector: "ac-arc", inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArcComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-arc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: ArcDrawerService }, { type: MapLayersService }]; }, propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });

/**
 *  This is a polygon implementation.
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon-desc props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon-desc>
 *  ```
 */
class AcPolygonDescComponent extends BasicDesc {
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcPolygonDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonDescComponent, deps: [{ token: PolygonDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPolygonDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolygonDescComponent, selector: "ac-polygon-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolygonDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polygon-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolygonDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: PolygonDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
class AcPolygonComponent extends EntityOnMapComponent {
    constructor(polygonDrawer, mapLayers) {
        super(polygonDrawer, mapLayers);
    }
}
AcPolygonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonComponent, deps: [{ token: PolygonDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPolygonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolygonComponent, selector: "ac-polygon", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolygonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polygon',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: PolygonDrawerService }, { type: MapLayersService }]; } });

class BasicStaticPrimitiveDesc extends BasicDesc {
    constructor(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(_staticPrimitiveDrawer, layerService, computationCache, cesiumProperties);
        this._staticPrimitiveDrawer = _staticPrimitiveDrawer;
    }
    ngOnInit() {
        this._layerService.registerDescription(this);
        this._geometryPropsEvaluator = this._cesiumProperties.createEvaluator(this.geometryProps);
        this._instancePropsEvaluator = this._cesiumProperties.createEvaluator(this.instanceProps);
        this._primitivePropsEvaluator = this._cesiumProperties.createEvaluator(this.primitiveProps);
    }
    draw(context, id, entity) {
        const geometryProps = this._geometryPropsEvaluator(this._computationCache, context);
        const instanceProps = this._instancePropsEvaluator(this._computationCache, context);
        const primitiveProps = this._primitivePropsEvaluator(this._computationCache, context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._staticPrimitiveDrawer.add(geometryProps, instanceProps, primitiveProps);
            primitive.acEntity = entity; // set the entity on the primitive for later usage
            this._cesiumObjectsMap.set(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._staticPrimitiveDrawer.update(primitive, geometryProps, instanceProps, primitiveProps);
        }
    }
}
BasicStaticPrimitiveDesc.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicStaticPrimitiveDesc, deps: [{ token: StaticPrimitiveDrawer }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Directive });
BasicStaticPrimitiveDesc.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: BasicStaticPrimitiveDesc, inputs: { geometryProps: "geometryProps", instanceProps: "instanceProps", primitiveProps: "primitiveProps" }, usesInheritance: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: BasicStaticPrimitiveDesc, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: StaticPrimitiveDrawer }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; }, propDecorators: { geometryProps: [{
                type: Input
            }], instanceProps: [{
                type: Input
            }], primitiveProps: [{
                type: Input
            }] } });

/**
 *
 * @deprecated use ac-ellipse-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an ellipse.
 *  __usage:__
 *  ```
 *  &lt;ac-static-ellipse-desc-desc
 *      geometryProps="{
 *          center: ellipse.geometry.center,
 *          semiMajorAxis: ellipse.geometry.semiMajorAxis,
 *          semiMinorAxis: ellipse.geometry.semiMinorAxis,
 *          height: ellipse.geometry.height,
 *          rotation: ellipse.geometry.rotation
 *      }"
 *      instanceProps="{
 *          attributes: ellipse.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: ellipse.appearance //Optional
 *      }"&gt;
 *  &lt;/ac-static-ellipse-desc-desc&gt;
 *  ```
 */
class AcStaticEllipseDescComponent extends BasicStaticPrimitiveDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticEllipseDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticEllipseDescComponent, deps: [{ token: StaticEllipseDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticEllipseDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticEllipseDescComponent, selector: "ac-static-ellipse-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-ellipse-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: StaticEllipseDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *
 *
 *  This is a dynamic(position is updatable) implementation of an ellipse.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-dynamic-ellipse-desc props="{
 *      center: data.position,
 *      semiMajorAxis:250000.0,
 *      semiMinorAxis:400000.0,
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    ">
 *    &lt;/ac-dynamic-ellipse-desc&gt;
 *  ```
 *  __param:__ {Cartesian3} center
 *  __param:__ {number} semiMajorAxis
 *  __param:__ {number} semiMinorAxis
 *  __param:__ {number} rotation
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
class AcDynamicEllipseDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicEllipseDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicEllipseDescComponent, deps: [{ token: DynamicEllipseDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicEllipseDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDynamicEllipseDescComponent, selector: "ac-dynamic-ellipse-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicEllipseDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-ellipse-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: DynamicEllipseDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

// tslint:disable
// tslint:enable
/**
 * @deprecated use ac-polylinc-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an polyline.
 *  The ac-dynamic-polyline-desc element must be a child of ac-layer element.
 *  __Usage:__
 *  ```
 *    &lt;ac-dynamic-polyline-desc props="{width : polyline.width, //optional
 *                                      positions: polyline.positions,
 *                                      material: polyline.material //optional
 *                                      }"
 *    &gt;
 *    &lt;/ac-dynamic-polyline-desc&gt;
 * ```
 */
class AcDynamicPolylineDescComponent extends BasicDesc {
    constructor(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(dynamicPolylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcDynamicPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicPolylineDescComponent, deps: [{ token: DynamicPolylineDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDynamicPolylineDescComponent, selector: "ac-dynamic-polyline-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-polyline-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: DynamicPolylineDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

// tslint:disable
// tslint:enable
/**
 * @deprecated use ac-ploygon-desc instead
 *
 *  This is a static (position, color, etc.. are not updated) implementation of a polygon.
 *  __Usage:__
 *  ```
 *    &lt;ac-static-polygon-desc
 *          geometryProps="{
 *                     polygonHierarchy: polygon.geometry.polygonHierarchy,
 *                     height: polygon.geometry.height,
 *                     granularity: polygon.geometry.granularity
 *                 }"
 *          instanceProps="{
 *                     attributes: polygon.attributes
 *                 }"
 *          primitiveProps="{
 *                     appearance: polygon.appearance
 *                 }"
 *    &gt;&lt;/ac-static-polygon-desc&gt;
 *    ```
 */
class AcStaticPolygonDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polygonDrawer, layerService, computationCache, cesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolygonDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolygonDescComponent, deps: [{ token: StaticPolygonDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticPolygonDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticPolygonDescComponent, selector: "ac-static-polygon-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolygonDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polygon-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: StaticPolygonDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 * @deprecated use ac-circle-desc
 *
 *  This is a static (position, color, etc.. are not updated) implementation of an circle.
 *  __usage:__
 *  ```
 *    &lt;ac-static-circle-desc
 *      geometryProps="{
 *          center: circle.geometry.center,
 *          radius: circle.geometry.radius,
 *      }"
 *      instanceProps="{
 *          attributes: circle.attributes //Optional
 *      }"
 *      primitiveProps="{
 *          appearance: circle.appearance //Optional
 *      }"&gt;
 *    &lt;/ac-static-circle-desc&gt;
 *    ```
 */
class AcStaticCircleDescComponent extends BasicStaticPrimitiveDesc {
    constructor(staticCircleDrawer, layerService, computationCache, cesiumProperties) {
        super(staticCircleDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcStaticCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticCircleDescComponent, deps: [{ token: StaticCircleDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticCircleDescComponent, selector: "ac-static-circle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-circle',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: StaticCircleDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 * @deprecated use ac-circle-desc instead
 *
 *  This is a dynamic(position is updatable) implementation of an circle.
 __Usage :__
 *  ```
 *    &lt;ac-dynamic-circle-desc props="{
 *      center: data.position,
 *      radius: 5
 *      rotation : 0.785398,
 *      width:3, // Optional
 *      granularity:0.08 // Optional
 *      }"&gt;
 *    &lt;/ac-dynamic-circle-desc&gt;
 *  ```
 *
 *  __param__: {Cartesian3} center
 *   __param__: {number} rotation
 *   __param__: {number} radius in meters
 *   __param__: {number} [1] width
 *   __param__: {number} [0.003] granularity
 */
class AcDynamicCircleDescComponent extends BasicDesc {
    constructor(ellipseDrawer, layerService, computationCache, cesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
    _propsEvaluator(context) {
        const cesiumProps = super._propsEvaluator(context);
        cesiumProps.semiMajorAxis = cesiumProps.radius;
        cesiumProps.semiMinorAxis = cesiumProps.radius;
        return cesiumProps;
    }
}
AcDynamicCircleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicCircleDescComponent, deps: [{ token: DynamicEllipseDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcDynamicCircleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDynamicCircleDescComponent, selector: "ac-dynamic-circle-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDynamicCircleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-dynamic-circle-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: DynamicEllipseDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

// tslint:disable
// tslint:enable
/**
 * @deprecated use ac-ployline-desc instead
 *
 *  This is a static implementation of an polyline.
 *  __usage:__
 *  ```
 *    &ltac-static-polyline-desc
 *            geometryProps="{
 *            	width: poly.geometry.width,
 *            	positions: poly.geometry.positions
 *            }"
 *            instanceProps="{
 *              attributes: {
 *                  ColorGeometryInstanceAttribute.fromColor(Color.fromRandom())
 *              }
 *            }"
 *            primitiveProps="{
 *              appearance: new PolylineColorAppearance()
 *    }"&gt&lt/ac-static-polyline-desc&gt
 *  ```
 */
class AcStaticPolylineDescComponent extends BasicStaticPrimitiveDesc {
    constructor(polylineDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylineDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcStaticPolylineDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolylineDescComponent, deps: [{ token: StaticPolylineDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcStaticPolylineDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcStaticPolylineDescComponent, selector: "ac-static-polyline-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcStaticPolylineDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-static-polyline-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: StaticPolylineDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a model implementation.
 *  The ac-model element must be a child of ac-layer element.
 *  The properties of props are the same as the properties of Entity and ModelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/ModelGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-model-desc props="{
 *       position : Cesium.Cartesian3.fromDegrees(-123.0744619, 44.0503706),
 *       uri : '../../SampleData/models/CesiumGround/Cesium_Ground.gltf'
 *   }
 *    }">
 *    </ac-model-desc>
 *  ```
 */
class AcModelDescComponent extends BasicDesc {
    constructor(modelDrawer, layerService, computationCache, cesiumProperties) {
        super(modelDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcModelDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcModelDescComponent, deps: [{ token: ModelDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcModelDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcModelDescComponent, selector: "ac-model-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcModelDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcModelDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-model-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcModelDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: ModelDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
class AcTileset3dComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
         */
        this.options = { url: null };
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        this.tilesetInstance = null;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)) {
            throw new Error('Options must have a url');
        }
        this._3dtilesCollection = new PrimitiveCollection();
        this.cesiumService.getScene().primitives.add(this._3dtilesCollection);
        if (this.show) {
            this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
            if (this.style) {
                this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.tilesetInstance) {
                    this._3dtilesCollection.add(this.tilesetInstance, this.index);
                }
                else {
                    this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
                    if (this.style) {
                        this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
                    }
                }
            }
            else if (this.tilesetInstance) {
                this._3dtilesCollection.remove(this.tilesetInstance, false);
            }
        }
        if (changes['style'] && !changes['style'].isFirstChange()) {
            const styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnDestroy() {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    }
}
AcTileset3dComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcTileset3dComponent, deps: [{ token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcTileset3dComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcTileset3dComponent, selector: "ac-3d-tile-layer", inputs: { options: "options", index: "index", show: "show", style: "style" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcTileset3dComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-3d-tile-layer',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], style: [{
                type: Input
            }] } });

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BoxGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-box-desc props="{
 *     show : point.show, //optional
 *     position : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-box-desc>
 *  ```
 */
class AcBoxDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcBoxDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBoxDescComponent, deps: [{ token: BoxDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcBoxDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBoxDescComponent, selector: "ac-box-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBoxDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBoxDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-box-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBoxDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: BoxDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CylinderGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-cylinder-desc props="{
 *     show : cylinder.show, //optional
 *     position : cylinder.position,
 *     material : cylinder.color  //optional
 *   }">
 *   </ac-cylinder-desc>
 *  ```
 */
class AcCylinderDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcCylinderDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCylinderDescComponent, deps: [{ token: CylinderDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCylinderDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCylinderDescComponent, selector: "ac-cylinder-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCylinderDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCylinderDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-cylinder-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCylinderDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: CylinderDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CorridorGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-corridor-desc props="{
 *     show : point.show, //optional
 *     positions : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-corridor-desc>
 *  ```
 */
class AcCorridorDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcCorridorDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCorridorDescComponent, deps: [{ token: CorridorDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCorridorDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCorridorDescComponent, selector: "ac-corridor-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCorridorDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCorridorDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-corridor-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcCorridorDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: CorridorDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipsoidGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-ellipsoid-desc props="{
 *     show : ellipsoid.show, //optional
 *     radii : ellipsoid.radii,
 *     material : ellipsoid.color  //optional
 *   }">
 *   </ac-ellipsoid-desc>
 *  ```
 */
class AcEllipsoidDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcEllipsoidDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipsoidDescComponent, deps: [{ token: EllipsoidDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcEllipsoidDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcEllipsoidDescComponent, selector: "ac-ellipsoid-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcEllipsoidDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcEllipsoidDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-ellipsoid-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcEllipsoidDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: EllipsoidDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineVolumeGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-polyline-volume-desc props="{
 *     show : line.show, //optional
 *     positions : line.positions,
 *     material : line.color  //optional
 *   }">
 *   </ac-polyline-volume-desc>
 *  ```
 */
class AcPolylineVolumeDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylineVolumeDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineVolumeDescComponent, deps: [{ token: PolylineVolumeDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPolylineVolumeDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolylineVolumeDescComponent, selector: "ac-polyline-volume-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylineVolumeDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polyline-volume-desc',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: PolylineVolumeDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/WallGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-wall-desc props="{
 *     show : wall.show, //optional
 *     positions : wall.positions,
 *     material : wall.color  //optional
 *   }">
 *   </ac-wall-desc>
 *  ```
 */
class AcWallDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcWallDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcWallDescComponent, deps: [{ token: WallDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcWallDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcWallDescComponent, selector: "ac-wall-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcWallDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcWallDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-wall-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcWallDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: WallDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a point implementation.
 *  The ac-rectangle-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties RectangleGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-rectangle-desc props="{
 *     show : rectangle.show, //optional
 *     coordinates : rectangle.positions,
 *     material : rectangle.color  //optional
 *   }">
 *   </ac-rectangle-desc>
 *  ```
 */
class AcRectangleDescComponent extends BasicDesc {
    constructor(drawerService, layerService, computationCache, cesiumProperties) {
        super(drawerService, layerService, computationCache, cesiumProperties);
    }
}
AcRectangleDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleDescComponent, deps: [{ token: RectangleDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcRectangleDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcRectangleDescComponent, selector: "ac-rectangle-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcRectangleDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-rectangle-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcRectangleDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: RectangleDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */
class AcBillboardPrimitiveDescComponent extends BasicDesc {
    constructor(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcBillboardPrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardPrimitiveDescComponent, deps: [{ token: BillboardPrimitiveDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcBillboardPrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcBillboardPrimitiveDescComponent, selector: "ac-billboard-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcBillboardPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-billboard-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: BillboardPrimitiveDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *
 *  __Usage :__
 *  ```
 *    <ac-label-primitive-desc props="{
 *      position: track.position,
 *      pixelOffset : [-15,20] | pixelOffset,
 *      text: track.name,
 *      font: '15px sans-serif'
 *    }">
 *    </ac-label-primitive-desc>
 *  ```
 */
class AcLabelPrimitiveDescComponent extends BasicDesc {
    constructor(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties) {
        super(labelPrimitiveDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcLabelPrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelPrimitiveDescComponent, deps: [{ token: LabelPrimitiveDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcLabelPrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelPrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLabelPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-label-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcLabelPrimitiveDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: LabelPrimitiveDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a polyline primitive implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polyline-primitive-desc props="{
 *      width : polyline.width,
 *      positions: polyline.positions,
 *      material: polyline.material
 *    }">
 *    </ac-polyline-primitive-desc>
 * ```
 */
class AcPolylinePrimitiveDescComponent extends BasicDesc {
    constructor(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(polylinePrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPolylinePrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylinePrimitiveDescComponent, deps: [{ token: PolylinePrimitiveDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPolylinePrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPolylinePrimitiveDescComponent, selector: "ac-polyline-primitive-desc", providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylinePrimitiveDescComponent) }], usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPolylinePrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-polyline-primitive-desc',
                    template: '',
                    providers: [{ provide: BasicDesc, useExisting: forwardRef(() => AcPolylinePrimitiveDescComponent) }],
                }]
        }], ctorParameters: function () { return [{ type: PolylinePrimitiveDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 * Fix for the constant entity shadowing.
 * PR in Cesium repo: https://github.com/AnalyticalGraphicsInc/cesium/pull/5736
 */
// tslint:disable
// const AssociativeArray = AssociativeArray;
// const Color = Color;
// const ColorGeometryInstanceAttribute = ColorGeometryInstanceAttribute;
// const defined = defined;
// const DistanceDisplayCondition = DistanceDisplayCondition;
// const DistanceDisplayConditionGeometryInstanceAttribute = DistanceDisplayConditionGeometryInstanceAttribute;
// const ShowGeometryInstanceAttribute = ShowGeometryInstanceAttribute;
// const Primitive = Primitive;
// const ShadowMode = ShadowMode;
// const BoundingSphereState = BoundingSphereState;
// const ColorMaterialProperty = ColorMaterialProperty;
// const MaterialProperty = MaterialProperty;
//  const Property = Property;
var colorScratch = new Color();
var distanceDisplayConditionScratch = new DistanceDisplayCondition();
var defaultDistanceDisplayCondition = new DistanceDisplayCondition();
function Batch(primitives, translucent, appearanceType, depthFailAppearanceType, depthFailMaterialProperty, closed, shadows) {
    this.translucent = translucent;
    this.appearanceType = appearanceType;
    this.depthFailAppearanceType = depthFailAppearanceType;
    this.depthFailMaterialProperty = depthFailMaterialProperty;
    this.depthFailMaterial = undefined;
    this.closed = closed;
    this.shadows = shadows;
    this.primitives = primitives;
    this.createPrimitive = false;
    this.waitingOnCreate = false;
    this.primitive = undefined;
    this.oldPrimitive = undefined;
    this.geometry = new AssociativeArray();
    this.updaters = new AssociativeArray();
    this.updatersWithAttributes = new AssociativeArray();
    this.attributes = new AssociativeArray();
    this.subscriptions = new AssociativeArray();
    this.showsUpdated = new AssociativeArray();
    this.itemsToRemove = [];
    this.invalidated = false;
    var removeMaterialSubscription;
    if (defined(depthFailMaterialProperty)) {
        removeMaterialSubscription = depthFailMaterialProperty.definitionChanged.addEventListener(Batch.prototype.onMaterialChanged, this);
    }
    this.removeMaterialSubscription = removeMaterialSubscription;
}
Batch.prototype.onMaterialChanged = function () {
    this.invalidated = true;
};
Batch.prototype.isMaterial = function (updater) {
    var material = this.depthFailMaterialProperty;
    var updaterMaterial = updater.depthFailMaterialProperty;
    if (updaterMaterial === material) {
        return true;
    }
    if (defined(material)) {
        return material.equals(updaterMaterial);
    }
    return false;
};
Batch.prototype.add = function (updater, instance) {
    var id = updater.id;
    this.createPrimitive = true;
    this.geometry.set(id, instance);
    this.updaters.set(id, updater);
    if (!updater.hasConstantFill || !updater.fillMaterialProperty.isConstant || !Cesium.Property.isConstant(updater.distanceDisplayConditionProperty)) {
        this.updatersWithAttributes.set(id, updater);
    }
    else {
        var that = this;
        this.subscriptions.set(id, updater.entity.definitionChanged.addEventListener(function (entity, propertyName, newValue, oldValue) {
            if (propertyName === 'isShowing') {
                that.showsUpdated.set(updater.id, updater);
            }
        }));
    }
};
Batch.prototype.remove = function (updater) {
    var id = updater.id;
    this.createPrimitive = this.geometry.remove(id) || this.createPrimitive;
    if (this.updaters.remove(id)) {
        this.updatersWithAttributes.remove(id);
        var unsubscribe = this.subscriptions.get(id);
        if (defined(unsubscribe)) {
            unsubscribe();
            this.subscriptions.remove(id);
        }
    }
};
Batch.prototype.update = function (time) {
    var isUpdated = true;
    var removedCount = 0;
    var primitive = this.primitive;
    var primitives = this.primitives;
    var attributes;
    var i;
    if (this.createPrimitive) {
        var geometries = this.geometry.values;
        var geometriesLength = geometries.length;
        if (geometriesLength > 0) {
            if (defined(primitive)) {
                if (!defined(this.oldPrimitive)) {
                    this.oldPrimitive = primitive;
                }
                else {
                    primitives.remove(primitive);
                }
            }
            for (i = 0; i < geometriesLength; i++) {
                var geometryItem = geometries[i];
                var originalAttributes = geometryItem.attributes;
                attributes = this.attributes.get(geometryItem.id.id);
                if (defined(attributes)) {
                    if (defined(originalAttributes.show)) {
                        originalAttributes.show.value = attributes.show;
                    }
                    if (defined(originalAttributes.color)) {
                        originalAttributes.color.value = attributes.color;
                    }
                    if (defined(originalAttributes.depthFailColor)) {
                        originalAttributes.depthFailColor.value = attributes.depthFailColor;
                    }
                }
            }
            var depthFailAppearance;
            if (defined(this.depthFailAppearanceType)) {
                if (defined(this.depthFailMaterialProperty)) {
                    this.depthFailMaterial = Cesium.MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
                }
                depthFailAppearance = new this.depthFailAppearanceType({
                    material: this.depthFailMaterial,
                    translucent: this.translucent,
                    closed: this.closed
                });
            }
            primitive = new Primitive({
                show: false,
                asynchronous: true,
                geometryInstances: geometries,
                appearance: new this.appearanceType({
                    flat: this.shadows === ShadowMode.DISABLED || this.shadows === ShadowMode.CAST_ONLY,
                    translucent: this.translucent,
                    closed: this.closed
                }),
                depthFailAppearance: depthFailAppearance,
                shadows: this.shadows
            });
            primitives.add(primitive);
            isUpdated = false;
        }
        else {
            if (defined(primitive)) {
                primitives.remove(primitive);
                primitive = undefined;
            }
            var oldPrimitive = this.oldPrimitive;
            if (defined(oldPrimitive)) {
                primitives.remove(oldPrimitive);
                this.oldPrimitive = undefined;
            }
        }
        this.attributes.removeAll();
        this.primitive = primitive;
        this.createPrimitive = false;
        this.waitingOnCreate = true;
    }
    else if (defined(primitive) && primitive.ready) {
        primitive.show = true;
        if (defined(this.oldPrimitive)) {
            primitives.remove(this.oldPrimitive);
            this.oldPrimitive = undefined;
        }
        if (defined(this.depthFailAppearanceType) && !(this.depthFailMaterialProperty instanceof ColorMaterialProperty)) {
            this.depthFailMaterial = Cesium.MaterialProperty.getValue(time, this.depthFailMaterialProperty, this.depthFailMaterial);
            this.primitive.depthFailAppearance.material = this.depthFailMaterial;
        }
        var updatersWithAttributes = this.updatersWithAttributes.values;
        var length = updatersWithAttributes.length;
        var waitingOnCreate = this.waitingOnCreate;
        for (i = 0; i < length; i++) {
            var updater = updatersWithAttributes[i];
            var instance = this.geometry.get(updater.id);
            attributes = this.attributes.get(instance.id.id);
            if (!defined(attributes)) {
                attributes = primitive.getGeometryInstanceAttributes(instance.id);
                this.attributes.set(instance.id.id, attributes);
            }
            if (!updater.fillMaterialProperty.isConstant || waitingOnCreate) {
                var colorProperty = updater.fillMaterialProperty.color;
                var resultColor = Cesium.Property.getValueOrDefault(colorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastColor, resultColor)) {
                    attributes._lastColor = Color.clone(resultColor, attributes._lastColor);
                    attributes.color = ColorGeometryInstanceAttribute.toValue(resultColor, attributes.color);
                    if ((this.translucent && attributes.color[3] === 255) || (!this.translucent && attributes.color[3] !== 255)) {
                        this.itemsToRemove[removedCount++] = updater;
                    }
                }
            }
            if (defined(this.depthFailAppearanceType) && updater.depthFailMaterialProperty instanceof ColorMaterialProperty && (!updater.depthFailMaterialProperty.isConstant || waitingOnCreate)) {
                var depthFailColorProperty = updater.depthFailMaterialProperty.color;
                var depthColor = Cesium.Property.getValueOrDefault(depthFailColorProperty, time, Color.WHITE, colorScratch);
                if (!Color.equals(attributes._lastDepthFailColor, depthColor)) {
                    attributes._lastDepthFailColor = Color.clone(depthColor, attributes._lastDepthFailColor);
                    attributes.depthFailColor = ColorGeometryInstanceAttribute.toValue(depthColor, attributes.depthFailColor);
                }
            }
            var show = updater.entity.isShowing && (updater.hasConstantFill || updater.isFilled(time));
            var currentShow = attributes.show[0] === 1;
            if (show !== currentShow) {
                attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
            }
            var distanceDisplayConditionProperty = updater.distanceDisplayConditionProperty;
            if (!Cesium.Property.isConstant(distanceDisplayConditionProperty)) {
                var distanceDisplayCondition = Cesium.Property.getValueOrDefault(distanceDisplayConditionProperty, time, defaultDistanceDisplayCondition, distanceDisplayConditionScratch);
                if (!DistanceDisplayCondition.equals(distanceDisplayCondition, attributes._lastDistanceDisplayCondition)) {
                    attributes._lastDistanceDisplayCondition = DistanceDisplayCondition.clone(distanceDisplayCondition, attributes._lastDistanceDisplayCondition);
                    attributes.distanceDisplayCondition = DistanceDisplayConditionGeometryInstanceAttribute.toValue(distanceDisplayCondition, attributes.distanceDisplayCondition);
                }
            }
        }
        this.updateShows(primitive);
        this.waitingOnCreate = false;
    }
    else if (defined(primitive) && !primitive.ready) {
        isUpdated = false;
    }
    this.itemsToRemove.length = removedCount;
    return isUpdated;
};
Batch.prototype.updateShows = function (primitive) {
    var showsUpdated = this.showsUpdated.values;
    var length = showsUpdated.length;
    for (var i = 0; i < length; i++) {
        var updater = showsUpdated[i];
        var instance = this.geometry.get(updater.id);
        var attributes = this.attributes.get(instance.id.id);
        if (!defined(attributes)) {
            attributes = primitive.getGeometryInstanceAttributes(instance.id);
            this.attributes.set(instance.id.id, attributes);
        }
        var show = updater.entity.isShowing;
        var currentShow = attributes.show[0] === 1;
        if (show !== currentShow) {
            attributes.show = ShowGeometryInstanceAttribute.toValue(show, attributes.show);
        }
    }
    this.showsUpdated.removeAll();
};
Batch.prototype.contains = function (updater) {
    return this.updaters.contains(updater.id);
};
Batch.prototype.getBoundingSphere = function (updater, result) {
    var primitive = this.primitive;
    if (!primitive.ready) {
        return Cesium.BoundingSphereState.PENDING;
    }
    var attributes = primitive.getGeometryInstanceAttributes(updater.entity);
    if (!defined(attributes) || !defined(attributes.boundingSphere) || //
        (defined(attributes.show) && attributes.show[0] === 0)) {
        return Cesium.BoundingSphereState.FAILED;
    }
    attributes.boundingSphere.clone(result);
    return Cesium.BoundingSphereState.DONE;
};
Batch.prototype.removeAllPrimitives = function () {
    var primitives = this.primitives;
    var primitive = this.primitive;
    if (defined(primitive)) {
        primitives.remove(primitive);
        this.primitive = undefined;
        this.geometry.removeAll();
        this.updaters.removeAll();
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
        this.oldPrimitive = undefined;
    }
};
Batch.prototype.destroy = function () {
    var primitive = this.primitive;
    var primitives = this.primitives;
    if (defined(primitive)) {
        primitives.remove(primitive);
    }
    var oldPrimitive = this.oldPrimitive;
    if (defined(oldPrimitive)) {
        primitives.remove(oldPrimitive);
    }
    if (defined(this.removeMaterialSubscription)) {
        this.removeMaterialSubscription();
    }
};
let wasFixed = false;
function fixCesiumEntitiesShadows() {
    if (wasFixed) {
        return;
    }
    Cesium.StaticGeometryColorBatch.prototype.add = function (time, updater) {
        var items;
        var translucent;
        var instance = updater.createFillGeometryInstance(time);
        if (instance.attributes.color.value[3] === 255) {
            items = this._solidItems;
            translucent = false;
        }
        else {
            items = this._translucentItems;
            translucent = true;
        }
        var length = items.length;
        for (var i = 0; i < length; i++) {
            var item = items[i];
            if (item.isMaterial(updater)) {
                item.add(updater, instance);
                return;
            }
        }
        var batch = new Batch(this._primitives, translucent, this._appearanceType, this._depthFailAppearanceType, updater.depthFailMaterialProperty, this._closed, this._shadows);
        batch.add(updater, instance);
        items.push(batch);
    };
    wasFixed = true;
}

const ANGULAR_CESIUM_CONFIG = new InjectionToken('ANGULAR_CESIUM_CONFIG');
class ConfigurationService {
    constructor(config) {
        this.config = config;
        const fixEntitiesShadows = config ? config.fixEntitiesShadows : true;
        if (fixEntitiesShadows !== false) {
            fixCesiumEntitiesShadows();
        }
    }
}
ConfigurationService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService, deps: [{ token: ANGULAR_CESIUM_CONFIG, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ConfigurationService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ConfigurationService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Optional
                    }, {
                        type: Inject,
                        args: [ANGULAR_CESIUM_CONFIG]
                    }] }];
    } });

//import { Cartesian2 } from '../../angular-cesium/models/cartesian2';
//import { Cartesian3 } from '../../angular-cesium/models/cartesian3';
class HtmlPrimitive {
    constructor(options, collection = null) {
        if (typeof options !== 'object') {
            throw new Error('HtmlPrimitive ERROR: invalid html options!');
        }
        this.scene = options.scene;
        this._mapContainer = options.mapContainer;
        this.show = options.show || true;
        this.position = options.position;
        this.pixelOffset = options.pixelOffset;
        this.element = options.element;
        this.collection = collection;
    }
    set scene(scene) {
        this._scene = scene;
    }
    set show(show) {
        this._show = show;
        if (defined(this.element)) {
            if (show) {
                this._element.style.display = 'block';
            }
            else {
                this._element.style.display = 'none';
            }
        }
    }
    get show() {
        return this._show;
    }
    set position(position) {
        this._position = position;
    }
    get position() {
        return this._position;
    }
    set pixelOffset(pixelOffset) {
        this._pixelOffset = pixelOffset;
    }
    get pixelOffset() {
        return this._pixelOffset;
    }
    set element(element) {
        this._element = element;
        if (defined(element)) {
            this._mapContainer.appendChild(element);
            this._element.style.position = 'absolute';
            this._element.style.zIndex = Number.MAX_VALUE.toString();
        }
    }
    get element() {
        return this._element;
    }
    set collection(collection) {
        this._collection = collection;
    }
    get collection() {
        return this._collection;
    }
    update() {
        if (!defined(this._show) || !defined(this._element)) {
            return;
        }
        let screenPosition = SceneTransforms.wgs84ToWindowCoordinates(this._scene, new Cartesian3(this._position.x, this._position.y, this._position.z));
        if (!defined(screenPosition)) {
            screenPosition = new Cartesian2((-1000), (-1000));
        }
        else if (defined(this._pixelOffset) && defined(this._pixelOffset.x) && defined(this._pixelOffset.y)) {
            screenPosition.y += this._pixelOffset.y;
            screenPosition.x += this._pixelOffset.x;
        }
        if (this._lastPosition && this._lastPosition.equals(screenPosition)) {
            return;
        }
        this._element.style.top = `${screenPosition.y}px`;
        this._element.style.left = `${screenPosition.x}px`;
        this._lastPosition = screenPosition;
    }
    remove() {
        if (this._element) {
            this._element.remove();
        }
    }
}

class HtmlCollection {
    constructor() {
        this._collection = [];
    }
    get length() {
        return this._collection.length;
    }
    get(index) {
        return this._collection[index];
    }
    add(options) {
        const html = new HtmlPrimitive(options, this);
        this._collection.push(html);
        return html;
    }
    remove(html) {
        const index = this._collection.indexOf(html);
        if (index === (-1)) {
            return false;
        }
        this._collection[index].remove();
        this._collection.splice(index, 1);
        return true;
    }
    update() {
        for (let i = 0, len = this._collection.length; i < len; i++) {
            this._collection[i].update();
        }
    }
    removeAll() {
        while (this._collection.length > 0) {
            const html = this._collection.pop();
            html.remove();
        }
    }
    contains(html) {
        return defined(html) && html.collection === this;
    }
    destroy() {
        this.removeAll();
    }
}

class CesiumExtender {
    static extend() {
        Cesium.HtmlPrimitive = HtmlPrimitive;
        Cesium.HtmlCollection = HtmlCollection;
    }
}

class AcHtmlManager {
    constructor() {
        this._entities = new Map();
    }
    has(id) {
        return this._entities.has(id);
    }
    get(id) {
        return this._entities.get(id);
    }
    addOrUpdate(id, info) {
        this._entities.set(id, info);
    }
    remove(id) {
        this._entities.delete(id);
    }
    forEach(callback) {
        this._entities.forEach(callback);
    }
}
AcHtmlManager.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
AcHtmlManager.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlManager, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });

class AcHtmlContext {
    constructor(id, context) {
        this.id = id;
        this.context = context;
    }
}
class AcHtmlDirective {
    constructor(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    ngOnInit() {
    }
    _handleView(id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            const context = new AcHtmlContext(id, { $implicit: entity });
            const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef, context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    }
    addOrUpdate(id, primitive) {
        const context = this._layerService.context;
        const entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity, primitive });
        this._handleView(id, primitive, entity);
    }
    remove(id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        const { viewRef } = this._views.get(id);
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    }
}
AcHtmlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: LayerService }, { token: AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive });
AcHtmlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlDirective, selector: "[acHtml]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtml]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: LayerService }, { type: AcHtmlManager }]; } });

class AcHtmlContainerDirective {
    constructor(_element, _acHtmlManager) {
        this._element = _element;
        this._acHtmlManager = _acHtmlManager;
    }
    set acHtmlContainer(id) {
        this._id = id;
    }
    ngOnInit() {
        if (this._id === undefined) {
            throw new Error(`AcHtml container ERROR: entity id not defined`);
        }
        const entity = this._acHtmlManager.get(this._id);
        entity.primitive.element = this._element.nativeElement;
    }
}
AcHtmlContainerDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlContainerDirective, deps: [{ token: i0.ElementRef }, { token: AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive });
AcHtmlContainerDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: { acHtmlContainer: "acHtmlContainer" }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlContainerDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtmlContainer]'
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: AcHtmlManager }]; }, propDecorators: { acHtmlContainer: [{
                type: Input
            }] } });

/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-layer element.
 *  <br>
 *  [props] accepts position(Cartesian3) and show(boolean).
 *
 *  __Usage:__
 *  ```
 *  <ac-layer acFor="let html of htmls$" [context]="this">
 <ac-html-desc props="{position: html.position, show: html.show}">
 <ng-template let-html>
 <div>
 <h1>This is ac-html {{html.name}}</h1>
 <button (click)="changeText(html, 'Test')">change text</button>
 </div>
 </ng-template>
 </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
class AcHtmlDescComponent extends BasicDesc {
    constructor(htmlDrawer, layerService, computationCache, cesiumProperties) {
        super(htmlDrawer, layerService, computationCache, cesiumProperties);
    }
    ngOnInit() {
        super.ngOnInit();
        if (!this.acHtmlCreator) {
            throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
        }
        if (!this.acHtmlTemplate) {
            throw new Error(`AcHtml desc ERROR: html template not found.`);
        }
    }
    draw(context, id) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }
    remove(id) {
        const primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }
    removeAll() {
        this._cesiumObjectsMap.forEach(((primitive, id) => {
            this.acHtmlCreator.remove(id, primitive);
        }));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
}
AcHtmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDescComponent, deps: [{ token: HtmlDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcHtmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlDescComponent, selector: "ac-html-desc", providers: [AcHtmlManager], queries: [{ propertyName: "acHtmlTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "acHtmlCreator", first: true, predicate: AcHtmlDirective, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`, isInline: true, directives: [{ type: AcHtmlDirective, selector: "[acHtml]" }, { type: AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: ["acHtmlContainer"] }, { type: i4.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-html-desc',
                    providers: [AcHtmlManager],
                    template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
                }]
        }], ctorParameters: function () { return [{ type: HtmlDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; }, propDecorators: { acHtmlCreator: [{
                type: ViewChild,
                args: [AcHtmlDirective, { static: true }]
            }], acHtmlTemplate: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });

/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 *</ac-layer>
 *  ```
 */
class AcArrayDescComponent {
    constructor(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    ngOnChanges(changes) {
        if (changes['acFor'].firstChange) {
            const acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
            }
            const acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    }
    ngOnInit() {
        if (this.layer) {
            this.layer.getLayerService().cache = false;
        }
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(() => {
            this.cd.detectChanges();
        });
    }
    ngAfterContentInit() {
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((component) => {
            component.setLayerService(this.layer.getLayerService());
        });
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((component) => {
            this.layerService.unregisterDescription(component);
            this.layer.getLayerService().registerDescription(component);
            component.layerService = this.layer.getLayerService();
            component.setLayerService(this.layer.getLayerService());
        });
    }
    ngOnDestroy() {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    }
    setLayerService(layerService) {
        this.layerService = layerService;
    }
    draw(context, id, contextEntity) {
        const entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        const previousEntitiesIdArray = this.entitiesMap.get(id);
        const entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((item, index) => {
            this.layerService.context[this.entityName] = item;
            const arrayItemId = this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            this.layer.update(contextEntity, arrayItemId);
        });
        if (previousEntitiesIdArray) {
            const entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((entityId) => entitiesIdArray.indexOf(entityId) < 0) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((entityId) => this.layer.remove(entityId));
            }
        }
    }
    remove(id) {
        const entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((entityId) => this.layer.remove(entityId));
        }
        this.entitiesMap.delete(id);
    }
    removeAll() {
        this.layer.removeAll();
        this.entitiesMap.clear();
    }
    getAcForString() {
        return `let ${this.entityName + '___temp'} of arrayObservable$`;
    }
    generateCombinedId(entityId, arrayItem, index) {
        let arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    }
}
AcArrayDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArrayDescComponent, deps: [{ token: LayerService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
AcArrayDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArrayDescComponent, selector: "ac-array-desc", inputs: { acFor: "acFor", idGetter: "idGetter", show: "show" }, queries: [{ propertyName: "basicDescs", predicate: BasicDesc }, { propertyName: "arrayDescs", predicate: AcArrayDescComponent }], viewQueries: [{ propertyName: "layer", first: true, predicate: ["layer"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArrayDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-array-desc',
                    template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: LayerService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { acFor: [{
                type: Input
            }], idGetter: [{
                type: Input
            }], show: [{
                type: Input
            }], layer: [{
                type: ViewChild,
                args: ['layer', { static: true }]
            }], basicDescs: [{
                type: ContentChildren,
                args: [BasicDesc, { descendants: false }]
            }], arrayDescs: [{
                type: ContentChildren,
                args: [AcArrayDescComponent, { descendants: false }]
            }] } });

/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Point.html
 *
 *  __Usage :__
 *  ```
 *    <ac-point-primitive-desc props="{
 *      position: track.position,
 *      color: Color.RED
 *    }">
 *    </ac-point-primitive-desc>
 *  ```
 */
class AcPointPrimitiveDescComponent extends BasicDesc {
    constructor(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties) {
        super(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties);
    }
}
AcPointPrimitiveDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointPrimitiveDescComponent, deps: [{ token: PointPrimitiveDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcPointPrimitiveDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPointPrimitiveDescComponent, selector: "ac-point-primitive-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPointPrimitiveDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-point-primitive-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: PointPrimitiveDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */
class AcPrimitivePolylineComponent extends EntityOnMapComponent {
    constructor(polylineDrawer, mapLayers) {
        super(polylineDrawer, mapLayers);
    }
}
AcPrimitivePolylineComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPrimitivePolylineComponent, deps: [{ token: PolylinePrimitiveDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcPrimitivePolylineComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcPrimitivePolylineComponent, selector: "ac-primitive-polyline", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcPrimitivePolylineComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-primitive-polyline',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: PolylinePrimitiveDrawerService }, { type: MapLayersService }]; } });

// For angular parse usage
var PARSE_PIPES_CONFIG_MAP = [
    { pipeName: 'pixelOffset', pipeInstance: new PixelOffsetPipe() },
    { pipeName: 'radiansToDegrees', pipeInstance: new RadiansToDegreesPipe() },
];

/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
class AcCzmlDescComponent extends BasicDesc {
    constructor(czmlDrawer, layerService, computationCache, cesiumProperties) {
        super(czmlDrawer, layerService, computationCache, cesiumProperties);
    }
}
AcCzmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCzmlDescComponent, deps: [{ token: CzmlDrawerService }, { token: LayerService }, { token: ComputationCache }, { token: CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcCzmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcCzmlDescComponent, selector: "ac-czml-desc", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcCzmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-czml-desc',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: CzmlDrawerService }, { type: LayerService }, { type: ComputationCache }, { type: CesiumProperties }]; } });

/**
 *  This is a rectangle implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and RectangleGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/RectangleGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-rectangle props="{
 *      coordinates: rectangle.coordinates,
 *      material: rectangle.material,
 *      height: rectangle.height
 *    }">
 *    </ac-rectangle>
 *  ```
 */
class AcRectangleComponent extends EntityOnMapComponent {
    constructor(rectangleDrawer, mapLayers) {
        super(rectangleDrawer, mapLayers);
    }
}
AcRectangleComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleComponent, deps: [{ token: RectangleDrawerService }, { token: MapLayersService }], target: i0.ɵɵFactoryTarget.Component });
AcRectangleComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcRectangleComponent, selector: "ac-rectangle", usesInheritance: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcRectangleComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-rectangle',
                    template: ''
                }]
        }], ctorParameters: function () { return [{ type: RectangleDrawerService }, { type: MapLayersService }]; } });

class AngularCesiumModule {
    constructor() {
        CesiumExtender.extend();
    }
    static forRoot(config) {
        return {
            ngModule: AngularCesiumModule,
            providers: [
                JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService,
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    }
}
AngularCesiumModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularCesiumModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, declarations: [AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcBillboardPrimitiveDescComponent,
        AcLabelDescComponent,
        AcLabelPrimitiveDescComponent,
        AcEllipseDescComponent,
        AcPolylineDescComponent,
        AcPolylinePrimitiveDescComponent,
        PixelOffsetPipe,
        RadiansToDegreesPipe,
        AcCircleDescComponent,
        AcArcDescComponent,
        AcMapLayerProviderComponent,
        AcMapTerrainProviderComponent,
        AcPointDescComponent,
        AcLabelComponent,
        AcPolylineComponent,
        AcPrimitivePolylineComponent,
        AcEllipseComponent,
        AcPointComponent,
        AcBillboardComponent,
        AcHtmlComponent,
        AcCircleComponent,
        AcArcComponent,
        AcPolygonDescComponent,
        AcPolygonComponent,
        AcDefaultPlonterComponent,
        AcModelDescComponent,
        AcTileset3dComponent,
        AcBoxDescComponent,
        AcCylinderDescComponent,
        AcCorridorDescComponent,
        AcEllipsoidDescComponent,
        AcPolylineVolumeDescComponent,
        AcWallDescComponent,
        AcRectangleDescComponent,
        AcContextMenuWrapperComponent,
        AcPointPrimitiveDescComponent,
        AcHtmlDescComponent,
        AcHtmlDirective,
        AcHtmlContainerDirective,
        AcArrayDescComponent,
        AcCzmlDescComponent,
        AcStaticEllipseDescComponent,
        AcDynamicEllipseDescComponent,
        AcDynamicPolylineDescComponent,
        AcStaticPolylineDescComponent,
        AcDynamicCircleDescComponent,
        AcStaticCircleDescComponent,
        AcStaticPolygonDescComponent,
        AcRectangleComponent], imports: [CommonModule,
        Angular2ParseModule,
        UtilsModule], exports: [AcMapComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcBillboardPrimitiveDescComponent,
        AcLabelDescComponent,
        AcLabelPrimitiveDescComponent,
        AcEllipseDescComponent,
        AcPolylineDescComponent,
        AcPolylinePrimitiveDescComponent,
        AcLayerComponent,
        AcCircleDescComponent,
        AcArcDescComponent,
        AcMapLayerProviderComponent,
        AcMapTerrainProviderComponent,
        AcPointDescComponent,
        AcLabelComponent,
        AcPolylineComponent,
        AcPrimitivePolylineComponent,
        AcEllipseComponent,
        AcPointComponent,
        AcBillboardComponent,
        AcHtmlComponent,
        AcCircleComponent,
        AcArcComponent,
        AcPolygonDescComponent,
        AcPolygonComponent,
        AcDefaultPlonterComponent,
        AcModelDescComponent,
        AcTileset3dComponent,
        AcBoxDescComponent,
        AcCylinderDescComponent,
        AcCorridorDescComponent,
        AcEllipsoidDescComponent,
        AcPolylineVolumeDescComponent,
        AcWallDescComponent,
        AcRectangleDescComponent,
        AcPointPrimitiveDescComponent,
        AcHtmlDescComponent,
        AcArrayDescComponent,
        AcCzmlDescComponent,
        AcRectangleComponent,
        AcStaticEllipseDescComponent,
        AcDynamicEllipseDescComponent,
        AcDynamicPolylineDescComponent,
        AcStaticPolylineDescComponent,
        AcDynamicCircleDescComponent,
        AcStaticCircleDescComponent,
        AcStaticPolygonDescComponent] });
AngularCesiumModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, imports: [[
            CommonModule,
            Angular2ParseModule,
            UtilsModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        Angular2ParseModule,
                        UtilsModule,
                    ],
                    declarations: [
                        AcMapComponent,
                        AcLayerComponent,
                        AcBillboardComponent,
                        AcBillboardDescComponent,
                        AcBillboardPrimitiveDescComponent,
                        AcLabelDescComponent,
                        AcLabelPrimitiveDescComponent,
                        AcEllipseDescComponent,
                        AcPolylineDescComponent,
                        AcPolylinePrimitiveDescComponent,
                        PixelOffsetPipe,
                        RadiansToDegreesPipe,
                        AcCircleDescComponent,
                        AcArcDescComponent,
                        AcMapLayerProviderComponent,
                        AcMapTerrainProviderComponent,
                        AcPointDescComponent,
                        AcLabelComponent,
                        AcPolylineComponent,
                        AcPrimitivePolylineComponent,
                        AcEllipseComponent,
                        AcPointComponent,
                        AcBillboardComponent,
                        AcHtmlComponent,
                        AcCircleComponent,
                        AcArcComponent,
                        AcPolygonDescComponent,
                        AcPolygonComponent,
                        AcDefaultPlonterComponent,
                        AcModelDescComponent,
                        AcTileset3dComponent,
                        AcBoxDescComponent,
                        AcCylinderDescComponent,
                        AcCorridorDescComponent,
                        AcEllipsoidDescComponent,
                        AcPolylineVolumeDescComponent,
                        AcWallDescComponent,
                        AcRectangleDescComponent,
                        AcContextMenuWrapperComponent,
                        AcPointPrimitiveDescComponent,
                        AcHtmlDescComponent,
                        AcHtmlDirective,
                        AcHtmlContainerDirective,
                        AcArrayDescComponent,
                        AcCzmlDescComponent,
                        AcStaticEllipseDescComponent,
                        AcDynamicEllipseDescComponent,
                        AcDynamicPolylineDescComponent,
                        AcStaticPolylineDescComponent,
                        AcDynamicCircleDescComponent,
                        AcStaticCircleDescComponent,
                        AcStaticPolygonDescComponent,
                        AcRectangleComponent
                    ],
                    exports: [
                        AcMapComponent,
                        AcBillboardComponent,
                        AcBillboardDescComponent,
                        AcBillboardPrimitiveDescComponent,
                        AcLabelDescComponent,
                        AcLabelPrimitiveDescComponent,
                        AcEllipseDescComponent,
                        AcPolylineDescComponent,
                        AcPolylinePrimitiveDescComponent,
                        AcLayerComponent,
                        AcCircleDescComponent,
                        AcArcDescComponent,
                        AcMapLayerProviderComponent,
                        AcMapTerrainProviderComponent,
                        AcPointDescComponent,
                        AcLabelComponent,
                        AcPolylineComponent,
                        AcPrimitivePolylineComponent,
                        AcEllipseComponent,
                        AcPointComponent,
                        AcBillboardComponent,
                        AcHtmlComponent,
                        AcCircleComponent,
                        AcArcComponent,
                        AcPolygonDescComponent,
                        AcPolygonComponent,
                        AcDefaultPlonterComponent,
                        AcModelDescComponent,
                        AcTileset3dComponent,
                        AcBoxDescComponent,
                        AcCylinderDescComponent,
                        AcCorridorDescComponent,
                        AcEllipsoidDescComponent,
                        AcPolylineVolumeDescComponent,
                        AcWallDescComponent,
                        AcRectangleDescComponent,
                        AcPointPrimitiveDescComponent,
                        AcHtmlDescComponent,
                        AcArrayDescComponent,
                        AcCzmlDescComponent,
                        AcRectangleComponent,
                        AcStaticEllipseDescComponent,
                        AcDynamicEllipseDescComponent,
                        AcDynamicPolylineDescComponent,
                        AcStaticPolylineDescComponent,
                        AcDynamicCircleDescComponent,
                        AcStaticCircleDescComponent,
                        AcStaticPolygonDescComponent,
                    ],
                }]
        }], ctorParameters: function () { return []; } });

class DisposableObservable extends Observable {
}

/**
 * EventModifier options for registration on map-event-manager.
 */
var CesiumEventModifier;
(function (CesiumEventModifier) {
    CesiumEventModifier[CesiumEventModifier["ALT"] = 2] = "ALT";
    CesiumEventModifier[CesiumEventModifier["CTRL"] = 1] = "CTRL";
    CesiumEventModifier[CesiumEventModifier["SHIFT"] = 0] = "SHIFT";
})(CesiumEventModifier || (CesiumEventModifier = {}));

/**
 * Manages entity selection service for any given mouse event and modifier
 * the service will manage the list of selected items.
 * check out the example
 * you must provide the service yourself
 *
 *  __Usage :__
 * ```
 * // provide the service in some component
 * @Component({
 * //...
 *  providers: [SelectionManagerService]
 * }
 *
 * // Usage example:
 * // init selection
 * const selectedIndicator = ture; // optional default true, if true a boolean "selected" property will be added to the selected entity
 * selectionManagerService.initSelection({ event: CesiumEvent.LEFT_CLICK,
 * 																			modifier: CesiumEventModifier.CTRL
 * 																		},selectedIndicator);
 * // Get selected
 * const selected = selectionManagerService.selected();
 *
 * // Or as observer
 * const selected$ = selectionManagerService.selected$();
 *
 * ```
 *
 */
class SelectionManagerService {
    constructor(mapsManager) {
        this.mapsManager = mapsManager;
        this.selectedEntitiesItems$ = new BehaviorSubject([]);
        this.selectedEntitySubject$ = new Subject();
    }
    selectedEntities$() {
        return this.selectedEntitiesItems$.asObservable();
    }
    selectedEntities() {
        return this.selectedEntitiesItems$.getValue();
    }
    selectedEntity$() {
        return this.selectedEntitySubject$;
    }
    toggleSelection(entity, addSelectedIndicator) {
        const current = this.selectedEntities();
        if (current.indexOf(entity) === -1) {
            this.addToSelected(entity, addSelectedIndicator);
        }
        else {
            this.removeSelected(entity, addSelectedIndicator);
        }
    }
    addToSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = true;
        }
        const current = this.selectedEntities();
        this.selectedEntitySubject$.next(entity);
        this.selectedEntitiesItems$.next([...current, entity]);
    }
    removeSelected(entity, addSelectedIndicator) {
        if (addSelectedIndicator) {
            entity['selected'] = false;
        }
        const current = this.selectedEntities();
        const entityIndex = current.indexOf(entity);
        if (entityIndex !== -1) {
            current.splice(entityIndex, 1);
            this.selectedEntitiesItems$.next(current);
            this.selectedEntitySubject$.next(entity);
        }
    }
    initSelection(selectionOptions, addSelectedIndicator = true, eventPriority, mapId) {
        const mapComponent = this.mapsManager.getMap(mapId);
        if (!mapComponent) {
            return;
        }
        this.mapEventsManagerService = mapComponent.getMapEventsManager();
        if (!selectionOptions) {
            Object.assign(selectionOptions, { event: CesiumEvent.LEFT_CLICK });
        }
        const eventSubscription = this.mapEventsManagerService.register({
            event: selectionOptions.event,
            pick: PickOptions.PICK_ONE,
            modifier: selectionOptions.modifier,
            entityType: selectionOptions.entityType,
            priority: eventPriority,
        });
        eventSubscription.pipe(map(result => result.entities), filter(entities => entities && entities.length > 0))
            .subscribe(entities => {
            const entity = entities[0];
            this.toggleSelection(entity, addSelectedIndicator);
        });
    }
}
SelectionManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService, deps: [{ token: MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable });
SelectionManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: SelectionManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: MapsManagerService }]; } });

// import './src/angular-cesium/operators';

var EditModes;
(function (EditModes) {
    EditModes[EditModes["CREATE"] = 0] = "CREATE";
    EditModes[EditModes["EDIT"] = 1] = "EDIT";
    EditModes[EditModes["CREATE_OR_EDIT"] = 2] = "CREATE_OR_EDIT";
})(EditModes || (EditModes = {}));

var EditActions;
(function (EditActions) {
    EditActions[EditActions["INIT"] = 0] = "INIT";
    EditActions[EditActions["MOUSE_MOVE"] = 1] = "MOUSE_MOVE";
    EditActions[EditActions["ADD_POINT"] = 2] = "ADD_POINT";
    EditActions[EditActions["ADD_LAST_POINT"] = 3] = "ADD_LAST_POINT";
    EditActions[EditActions["CHANGE_TO_EDIT"] = 4] = "CHANGE_TO_EDIT";
    EditActions[EditActions["REMOVE_POINT"] = 5] = "REMOVE_POINT";
    EditActions[EditActions["DRAG_POINT"] = 6] = "DRAG_POINT";
    EditActions[EditActions["DRAG_POINT_FINISH"] = 7] = "DRAG_POINT_FINISH";
    EditActions[EditActions["DRAG_SHAPE"] = 8] = "DRAG_SHAPE";
    EditActions[EditActions["DRAG_SHAPE_FINISH"] = 9] = "DRAG_SHAPE_FINISH";
    EditActions[EditActions["DONE"] = 10] = "DONE";
    EditActions[EditActions["DISABLE"] = 11] = "DISABLE";
    EditActions[EditActions["ENABLE"] = 12] = "ENABLE";
    EditActions[EditActions["DISPOSE"] = 13] = "DISPOSE";
    EditActions[EditActions["SET_EDIT_LABELS_RENDER_CALLBACK"] = 14] = "SET_EDIT_LABELS_RENDER_CALLBACK";
    EditActions[EditActions["UPDATE_EDIT_LABELS"] = 15] = "UPDATE_EDIT_LABELS";
    EditActions[EditActions["SET_MANUALLY"] = 16] = "SET_MANUALLY";
    EditActions[EditActions["TRANSFORM"] = 17] = "TRANSFORM";
})(EditActions || (EditActions = {}));

class EditPoint extends AcEntity {
    constructor(entityId, position, pointProps, virtualPoint = false) {
        super();
        this._show = true;
        this.editedEntityId = entityId;
        this.position = position;
        this.id = this.generateId();
        this.pointProps = Object.assign({}, pointProps);
        this._virtualEditPoint = virtualPoint;
    }
    get show() {
        return this._show;
    }
    set show(value) {
        this._show = value;
    }
    get props() {
        return this.pointProps;
    }
    set props(value) {
        this.pointProps = value;
    }
    isVirtualEditPoint() {
        return this._virtualEditPoint;
    }
    setVirtualEditPoint(value) {
        this._virtualEditPoint = value;
    }
    getEditedEntityId() {
        return this.editedEntityId;
    }
    getPosition() {
        return this.position.clone();
    }
    getPositionCallbackProperty() {
        return new CallbackProperty(this.getPosition.bind(this), false);
    }
    setPosition(position) {
        this.position.x = position.x;
        this.position.y = position.y;
        this.position.z = position.z;
    }
    getId() {
        return this.id;
    }
    generateId() {
        return 'edit-point-' + EditPoint.counter++;
    }
}
EditPoint.counter = 0;

const defaultLabelProps = {
    backgroundColor: new Color(0.165, 0.165, 0.165, 0.7),
    backgroundPadding: new Cartesian2(25, 20),
    distanceDisplayCondition: undefined,
    fillColor: Color.WHITE,
    font: '30px sans-serif',
    heightReference: HeightReference.NONE,
    horizontalOrigin: HorizontalOrigin.LEFT,
    outlineColor: Color.BLACK,
    outlineWidth: 1.0,
    pixelOffset: Cartesian2.ZERO,
    pixelOffsetScaleByDistance: undefined,
    scale: 1.0,
    scaleByDistance: undefined,
    show: true,
    showBackground: false,
    style: LabelStyle.FILL,
    text: '',
    translucencyByDistance: undefined,
    verticalOrigin: VerticalOrigin.BASELINE,
    eyeOffset: Cartesian3.ZERO,
    disableDepthTestDistance: 0,
};

class EditablePoint extends AcEntity {
    constructor(id, pointLayer, coordinateConverter, editOptions, position) {
        super();
        this.id = id;
        this.pointLayer = pointLayer;
        this.coordinateConverter = coordinateConverter;
        this.editOptions = editOptions;
        this._enableEdit = true;
        this._labels = [];
        this._props = Object.assign({}, editOptions.pointProps);
        if (position) {
            this.createFromExisting(position);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const position = this.point.getPosition();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = position;
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get props() {
        return this._props;
    }
    set props(value) {
        this._props = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        if (value) {
            this.point.props.color = Color.WHITE;
        }
        else {
            this.point.props.color = Color.DIMGREY;
            this.point.props.pixelSize = 10;
        }
        this.updatePointLayer();
    }
    createFromExisting(position) {
        this.point = new EditPoint(this.id, position, this._props);
        this.updatePointLayer();
    }
    hasPosition(point) {
        if (point.position) {
            return true;
        }
        return false;
    }
    setManually(point, props) {
        if (!this.enableEdit) {
            throw new Error('Update manually only in edit mode, after point is created');
        }
        let newProps = props;
        if (this.hasPosition(point)) {
            newProps = point.pointProp ? point.pointProp : props;
            this.point.setPosition(point.position);
        }
        else {
            this.point.setPosition(point);
        }
        this.point.props = newProps;
        this.updatePointLayer();
    }
    addLastPoint(position) {
        this.point.setPosition(position);
        this.updatePointLayer();
    }
    movePoint(toPosition) {
        if (!this.point) {
            this.point = new EditPoint(this.id, toPosition, this._props);
        }
        else {
            this.point.setPosition(toPosition);
        }
        this.updatePointLayer();
    }
    getCurrentPoint() {
        return this.point;
    }
    getPosition() {
        return this.point.getPosition();
    }
    getPositionCallbackProperty() {
        return new CallbackProperty(this.getPosition.bind(this), false);
    }
    updatePointLayer() {
        this.pointLayer.update(this.point, this.point.getId());
    }
    update() {
        this.updatePointLayer();
    }
    dispose() {
        this.pointLayer.remove(this.point.getId());
    }
    getId() {
        return this.id;
    }
}

class PointsManagerService {
    constructor() {
        this.points = new Map();
    }
    createEditablePoint(id, editPointLayer, coordinateConverter, editOptions, position) {
        const editablePoint = new EditablePoint(id, editPointLayer, coordinateConverter, editOptions, position);
        this.points.set(id, editablePoint);
    }
    enableAll() {
        this.points.forEach(point => point.enableEdit = true);
    }
    disableAll() {
        this.points.forEach(point => point.enableEdit = false);
    }
    dispose(id) {
        const point = this.points.get(id);
        if (point.getCurrentPoint()) {
            point.dispose();
        }
        this.points.delete(id);
    }
    get(id) {
        return this.points.get(id);
    }
    clear() {
        this.points.forEach(point => point.dispose());
        this.points.clear();
    }
}
PointsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PointsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsManagerService, decorators: [{
            type: Injectable
        }] });

function generateKey(length = 12) {
    let id = '';
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        id += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return id;
}
function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const DEFAULT_POINT_OPTIONS = {
    addLastPointEvent: CesiumEvent.LEFT_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE.withAlpha(0.95),
        outlineColor: Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 10,
        show: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable point
 *
 *  * You must provide `PointsEditorService` yourself.
 * PolygonsEditorService works together with `<points-editor>` component. Therefor you need to create `<points-editor>`
 * for each `PointsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PointEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PointEditorObservable`.
 * + To stop editing call `dsipose()` from the `PointEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PointEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating point
 *  const editing$ = pointEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit point from existing point cartesian3 positions
 *  const editing$ = this.pointEditor.edit(initialPos);
 *
 * ```
 */
class PointsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, pointManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.pointManager = pointManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    screenToPosition(cartesian2) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (cartesian3) {
            const ray = this.cameraService.getCamera().getPickRay(cartesian2);
            return this.cesiumScene.globe.pick(ray, this.cesiumScene);
        }
        return cartesian3;
    }
    create(options = DEFAULT_POINT_OPTIONS, eventPriority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, true);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: pointOptions.addLastPointEvent,
            modifier: pointOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    position,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition);
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, clientEditSubject, position, eventPriority, pointOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            position: position,
            editMode: EditModes.CREATE_OR_EDIT,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(Object.assign(Object.assign({}, update), { position: position, point: this.getPoint(id) }));
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(registration => registration.dispose());
        }
        this.observablesMap.delete(id);
        this.editPoint(id, position, eventPriority, clientEditSubject, pointOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(position, options = DEFAULT_POINT_OPTIONS, priority = 100) {
        const id = generateKey();
        const pointOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            position: position,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            pointOptions: pointOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { position: position, point: this.getPoint(id) }));
        return this.editPoint(id, position, priority, editSubject, pointOptions);
    }
    editPoint(id, position, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const updatedPosition = this.screenToPosition(endPosition);
            if (!updatedPosition) {
                return;
            }
            const update = {
                id,
                editMode: EditModes.EDIT,
                updatedPosition,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { position: updatedPosition, point: this.getPoint(id) }));
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POINT_OPTIONS));
        const pointOptions = Object.assign(defaultClone, options);
        pointOptions.pointProps = Object.assign(Object.assign({}, DEFAULT_POINT_OPTIONS.pointProps), options.pointProps);
        pointOptions.pointProps = Object.assign(Object.assign({}, DEFAULT_POINT_OPTIONS.pointProps), options.pointProps);
        return pointOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                position: this.getPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (point, pointProps) => {
            const newPoint = this.pointManager.get(id);
            newPoint.setManually(point, pointProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Points editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoint = () => this.getPoint(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.pointManager.get(id).labels;
        return observableToExtend;
    }
    getPosition(id) {
        const point = this.pointManager.get(id);
        return point.getPosition();
    }
    getPoint(id) {
        const point = this.pointManager.get(id);
        if (point) {
            return point.getCurrentPoint();
        }
    }
}
PointsEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PointsEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorService, decorators: [{
            type: Injectable
        }] });

class PointsEditorComponent {
    constructor(pointsEditor, coordinateConverter, mapEventsManager, cameraService, pointsManager, cesiumService) {
        this.pointsEditor = pointsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.pointsManager = pointsManager;
        this.cesiumService = cesiumService;
        this.editPoint$ = new Subject();
        this.pointLabels$ = new Subject();
        this.pointsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, pointsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.pointsEditor.onUpdate().subscribe((update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(point, update, labels) {
        if (labels) {
            point.labels = labels;
            this.pointLabelsLayer.update(point, point.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        update.position = point.getPosition();
        update.point = point.getCurrentPoint();
        point.labels = this.editLabelsRenderFn(update, point.labels);
        this.pointLabelsLayer.update(point, point.getId());
    }
    removeEditLabels(point) {
        point.labels = [];
        this.pointLabelsLayer.remove(point.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const point = this.pointsManager.get(update.id);
                if (update.updatedPosition) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const point = this.pointsManager.get(update.id);
                if (point && point.getCurrentPoint()) {
                    this.removeEditLabels(point);
                }
                this.pointsManager.dispose(update.id);
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const point = this.pointsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(point, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const point = this.pointsManager.get(update.id);
                this.renderEditLabels(point, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.pointsManager.createEditablePoint(update.id, this.editPointLayer, this.coordinateConverter, update.pointOptions, update.position);
                break;
            }
            case EditActions.DRAG_POINT: {
                const point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const point = this.pointsManager.get(update.id);
                if (point && point.enableEdit) {
                    point.movePoint(update.updatedPosition);
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = false;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const point = this.pointsManager.get(update.id);
                if (point) {
                    point.enableEdit = true;
                    this.renderEditLabels(point, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.pointsManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PointsEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorComponent, deps: [{ token: PointsEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: PointsManagerService }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PointsEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: PointsEditorComponent, selector: "points-editor", providers: [CoordinateConverter, PointsManagerService], viewQueries: [{ propertyName: "editPointLayer", first: true, predicate: ["editPointLayer"], descendants: true }, { propertyName: "pointLabelsLayer", first: true, predicate: ["pointLabelsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPointLayer acFor="let point of editPoint$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #pointLabelsLayer acFor="let pointLabels of pointLabels$" [context]="this">
      <ac-array-desc acFor="let label of pointLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PointsEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'points-editor',
                    template: /*html*/ `
    <ac-layer #editPointLayer acFor="let point of editPoint$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #pointLabelsLayer acFor="let pointLabels of pointLabels$" [context]="this">
      <ac-array-desc acFor="let label of pointLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                    providers: [CoordinateConverter, PointsManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: PointsEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: PointsManagerService }, { type: CesiumService }]; }, propDecorators: { editPointLayer: [{
                type: ViewChild,
                args: ['editPointLayer']
            }], pointLabelsLayer: [{
                type: ViewChild,
                args: ['pointLabelsLayer']
            }] } });

class EditPolyline extends AcEntity {
    constructor(entityId, startPosition, endPosition, polylineProps) {
        super();
        this.editedEntityId = entityId;
        this.id = this.generateId();
        this.positions = [startPosition, endPosition];
        this._polylineProps = Object.assign({}, polylineProps);
    }
    get props() {
        return this._polylineProps;
    }
    set props(value) {
        this._polylineProps = value;
    }
    getEditedEntityId() {
        return this.editedEntityId;
    }
    getPositions() {
        return this.positions.map(p => p.clone());
    }
    getPositionsCallbackProperty() {
        return new CallbackProperty(this.getPositions.bind(this), false);
    }
    validatePositions() {
        return this.positions[0] !== undefined && this.positions[1] !== undefined;
    }
    getStartPosition() {
        return this.positions[0];
    }
    getEndPosition() {
        return this.positions[1];
    }
    setStartPosition(position) {
        this.positions[0] = position;
    }
    setEndPosition(position) {
        this.positions[1] = position;
    }
    getId() {
        return this.id;
    }
    generateId() {
        return 'edit-polyline-' + EditPolyline.counter++;
    }
}
EditPolyline.counter = 0;

class EditablePolygon extends AcEntity {
    constructor(id, polygonsLayer, pointsLayer, polylinesLayer, coordinateConverter, polygonOptions, positions) {
        super();
        this.id = id;
        this.polygonsLayer = polygonsLayer;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.polygonOptions = polygonOptions;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this.polygonProps = Object.assign({}, polygonOptions.polygonProps);
        this.defaultPointProps = Object.assign({}, polygonOptions.pointProps);
        this.defaultPolylineProps = Object.assign({}, polygonOptions.polylineProps);
        if (positions && positions.length >= 3) {
            this.createFromExisting(positions);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const positions = this.getRealPositions();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get defaultPolylineProps() {
        return this._defaultPolylineProps;
    }
    set defaultPolylineProps(value) {
        this._defaultPolylineProps = value;
    }
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    get polygonProps() {
        return this._polygonProps;
    }
    set polygonProps(value) {
        this._polygonProps = value;
    }
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(false, point);
        });
    }
    createFromExisting(positions) {
        positions.forEach((position) => {
            this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
        this.doneCreation = true;
    }
    setPointsManually(points, polygonProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polygon is created');
        }
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            const pointOrCartesian = points[i];
            let newPoint = null;
            if (pointOrCartesian.pointProps) {
                newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
            }
            else {
                newPoint = new EditPoint(this.id, pointOrCartesian, this.defaultPointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polygonProps = polygonProps ? polygonProps : this.polygonProps;
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
        this.updatePolygonsLayer();
    }
    addAllVirtualEditPoints() {
        const currentPoints = [...this.positions];
        currentPoints.forEach((pos, index) => {
            const currentPoint = pos;
            const nextIndex = (index + 1) % (currentPoints.length);
            const nextPoint = currentPoints[nextIndex];
            const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
            this.updatePointsLayer(false, midPoint);
        });
    }
    setMiddleVirtualPoint(firstP, secondP) {
        const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secondP.getPosition(), 0.5, new Cartesian3());
        const midPoint = new EditPoint(this.id, midPointCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        const firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    }
    updateMiddleVirtualPoint(virtualEditPoint, prevPoint, nextPoint) {
        const midPointCartesian3 = Cartesian3.lerp(prevPoint.getPosition(), nextPoint.getPosition(), 0.5, new Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    }
    changeVirtualPointToRealPoint(point) {
        point.setVirtualEditPoint(false); // virtual point becomes a real point
        const pointsCount = this.positions.length;
        const pointIndex = this.positions.indexOf(point);
        const nextIndex = (pointIndex + 1) % (pointsCount);
        const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        const nextPoint = this.positions[nextIndex];
        const prePoint = this.positions[preIndex];
        const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(true, firstMidPoint, secMidPoint, point);
        this.updatePolygonsLayer();
    }
    renderPolylines() {
        this.polylines.forEach(polyline => this.polylinesLayer.remove(polyline.getId()));
        this.polylines = [];
        const realPoints = this.positions.filter(pos => !pos.isVirtualEditPoint());
        realPoints.forEach((point, index) => {
            const nextIndex = (index + 1) % (realPoints.length);
            const nextPoint = realPoints[nextIndex];
            const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.defaultPolylineProps);
            this.polylines.push(polyline);
            this.polylinesLayer.update(polyline, polyline.getId());
        });
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    }
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
        this.updatePolygonsLayer();
    }
    movePointFinish(editPoint) {
        if (this.polygonOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    }
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.polygonOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            const pointsCount = this.positions.length;
            const pointIndex = this.positions.indexOf(editPoint);
            const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
            const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
            const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
            const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
            this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
        }
        this.updatePolygonsLayer();
        this.updatePointsLayer(true, editPoint);
    }
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    movePolygon(startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.positions.forEach(point => {
            const newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.updatePointsLayer();
        this.lastDraggedToPosition = draggedToPosition;
        this.positions.forEach(point => this.updatePointsLayer(true, point));
    }
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions
            .filter(p => p.isVirtualEditPoint())
            .forEach(p => this.removePosition(p));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.updatePolygonsLayer();
        this.addAllVirtualEditPoints();
    }
    getRealPositions() {
        return this.getRealPoints().map(position => position.getPosition());
    }
    getRealPoints() {
        return this.positions.filter(position => !position.isVirtualEditPoint() && position !== this.movingPoint);
    }
    getPoints() {
        return this.positions.filter(position => position !== this.movingPoint);
    }
    getPositionsHierarchy() {
        const positions = this.positions.filter(position => !position.isVirtualEditPoint()).map(position => position.getPosition().clone());
        return new PolygonHierarchy(positions);
    }
    getPositionsHierarchyCallbackProperty() {
        return new CallbackProperty(this.getPositionsHierarchy.bind(this), false);
    }
    removePosition(point) {
        const index = this.positions.findIndex((p) => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePolygonsLayer() {
        if (this.getPointsCount() >= 3) {
            this.polygonsLayer.update(this, this.id);
        }
    }
    updatePointsLayer(renderPolylines = true, ...points) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        points.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    dispose() {
        this.polygonsLayer.remove(this.id);
        this.positions.forEach(editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        });
        this.polylines.forEach(line => this.polylinesLayer.remove(line.getId()));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}

class PolygonsManagerService {
    constructor() {
        this.polygons = new Map();
    }
    createEditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions) {
        const editablePolygon = new EditablePolygon(id, editPolygonsLayer, editPointsLayer, editPolylinesLayer, coordinateConverter, polygonOptions, positions);
        this.polygons.set(id, editablePolygon);
    }
    dispose(id) {
        this.polygons.get(id).dispose();
        this.polygons.delete(id);
    }
    get(id) {
        return this.polygons.get(id);
    }
    clear() {
        this.polygons.forEach(polygon => polygon.dispose());
        this.polygons.clear();
    }
}
PolygonsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolygonsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsManagerService, decorators: [{
            type: Injectable
        }] });

const DEFAULT_POLYGON_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE.withAlpha(0.95),
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polygonProps: {
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: ClassificationType.BOTH,
        zIndex: 0,
    },
    polylineProps: {
        material: () => Color.WHITE,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
    },
};
/**
 * Service for creating editable polygons
 *
 * You must provide `PolygonsEditorService` yourself.
 * PolygonsEditorService works together with `<polygons-editor>` component. Therefor you need to create `<polygons-editor>`
 * for each `PolygonsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolygonEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolygonEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolygonEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolygonEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polygon
 *  const editing$ = polygonsEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polygon from existing polygon positions
 *  const editing$ = this.polygonsEditorService.edit(initialPos);
 *
 * ```
 */
class PolygonsEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce((id, clampHeightTo3D, clampHeightTo3DOptions) => {
            this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    init(mapEventsManager, coordinateConverter, cameraService, polygonsManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    clampPoints(id, clampHeightTo3D, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }) {
        if (clampHeightTo3D && clampMostDetailed) {
            const polygon = this.polygonsManager.get(id);
            const points = polygon.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points.forEach(point => {
                    point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
                // const cartesians = points.map(point => point.getPosition());
                // const promise = this.cesiumScene.clampToHeightMostDetailed(cartesians, undefined, clampToHeightPickWidth);
                // promise.then((updatedCartesians) => {
                //   points.forEach((point, index) => {
                //     point.setPosition(updatedCartesians[index]);
                //   });
                // });
            }
            else {
                const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
                const promise = sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                when(promise, (updatedPositions) => {
                    points.forEach((point, index) => {
                        point.setPosition(Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    }
    screenToPosition(cartesian2, clampHeightTo3D, { clampToHeightPickWidth, clampToTerrain }) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            const globePositionPick = () => {
                const ray = this.cameraService.getCamera().getPickRay(cartesian2);
                return this.cesiumScene.globe.pick(ray, this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    }
    create(options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        const positions = [];
        const id = generateKey();
        const polygonOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addPointEvent,
            modifier: polygonOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polygonOptions.addLastPointEvent,
            modifier: polygonOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            if (allPositions.find((cartesian) => cartesian.equals(position))) {
                return;
            }
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polygonOptions.maximumNumberOfPoints && allPositions.length + 1 === polygonOptions.maximumNumberOfPoints) {
                finishedCreate = finishCreation(position);
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polygonOptions.clampHeightTo3D, polygonOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // Add last point to positions if not already added
            const allPositions = this.getPositions(id);
            if (!allPositions.find((cartesian) => cartesian.equals(position))) {
                const updateValue = {
                    id,
                    positions: allPositions,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(updateValue);
                clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            }
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, position, clientEditSubject, positions, priority, polygonOptions, editorObservable, finishedCreate) {
        const updateValue = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(updateValue);
        clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(registration => registration.dispose());
        }
        this.observablesMap.delete(id);
        this.editPolygon(id, positions, priority, clientEditSubject, polygonOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(positions, options = DEFAULT_POLYGON_OPTIONS, priority = 100) {
        if (positions.length < 3) {
            throw new Error('Polygons editor error edit(): polygon should have at least 3 positions');
        }
        const id = generateKey();
        const polygonOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polygonOptions: polygonOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolygon(id, positions, priority, editSubject, polygonOptions);
    }
    editPolygon(id, positions, priority, editSubject, options, editObservable) {
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditablePolygon,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            entityType: EditPoint,
            modifier: options.removePointModifier,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.polygonsManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.polygonsManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                const startDragPosition = this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            });
        }
        pointRemoveRegistration.subscribe(({ entities }) => {
            const point = entities[0];
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 4) {
                return;
            }
            const index = allPositions.findIndex(position => point.getPosition().equals(position));
            if (index < 0) {
                return;
            }
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        if (options.maximumNumberOfPoints && options.maximumNumberOfPoints < 3) {
            console.warn('Warn: PolygonEditor invalid option.' +
                ' maximumNumberOfPoints smaller then 3, maximumNumberOfPoints changed to 3');
            options.maximumNumberOfPoints = 3;
        }
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYGON_OPTIONS));
        const polygonOptions = Object.assign(defaultClone, options);
        polygonOptions.pointProps = Object.assign(Object.assign({}, DEFAULT_POLYGON_OPTIONS.pointProps), options.pointProps);
        polygonOptions.polygonProps = Object.assign(Object.assign({}, DEFAULT_POLYGON_OPTIONS.polygonProps), options.polygonProps);
        polygonOptions.polylineProps = Object.assign(Object.assign({}, DEFAULT_POLYGON_OPTIONS.polylineProps), options.polylineProps);
        polygonOptions.clampHeightTo3DOptions = Object.assign(Object.assign({}, DEFAULT_POLYGON_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
            }
            if (polygonOptions.pointProps.color.alpha === 1 || polygonOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polygonOptions.allowDrag = false;
            polygonOptions.polylineProps.clampToGround = true;
            polygonOptions.pointProps.heightReference = polygonOptions.clampHeightTo3DOptions.clampToTerrain ?
                HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND;
            polygonOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polygonOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (points, polygonProps) => {
            const polygon = this.polygonsManager.get(id);
            polygon.setPointsManually(points, polygonProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Polygons editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.polygonsManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPositions();
    }
    getPoints(id) {
        const polygon = this.polygonsManager.get(id);
        return polygon.getRealPoints();
    }
}
PolygonsEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolygonsEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsEditorService, decorators: [{
            type: Injectable
        }] });

class PolygonsEditorComponent {
    constructor(polygonsEditor, coordinateConverter, mapEventsManager, cameraService, polygonsManager, cesiumService) {
        this.polygonsEditor = polygonsEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polygonsManager = polygonsManager;
        this.cesiumService = cesiumService;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.editPolygons$ = new Subject();
        this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.polygonsManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.polygonsEditor.onUpdate().subscribe((update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(polygon, update, labels) {
        update.positions = polygon.getRealPositions();
        update.points = polygon.getRealPoints();
        if (labels) {
            polygon.labels = labels;
            this.editPolygonsLayer.update(polygon, polygon.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polygon.labels = this.editLabelsRenderFn(update, polygon.labels);
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    removeEditLabels(polygon) {
        polygon.labels = [];
        this.editPolygonsLayer.update(polygon, polygon.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.moveTempMovingPoint(update.updatedPosition);
                    polygon.addPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (update.updatedPosition) {
                    polygon.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.dispose();
                    this.removeEditLabels(polygon);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const polygon = this.polygonsManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polygon, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const polygon = this.polygonsManager.get(update.id);
                this.renderEditLabels(polygon, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polygonsManager.createEditablePolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polygonOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polygon.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polygon, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.removePoint(update.updatedPoint);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = false;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.movePolygon(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon && polygon.enableEdit) {
                    polygon.endMovePolygon();
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const polygon = this.polygonsManager.get(update.id);
                if (polygon) {
                    polygon.enableEdit = true;
                    this.renderEditLabels(polygon, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.polygonsManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolygonsEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsEditorComponent, deps: [{ token: PolygonsEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: PolygonsManagerService }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PolygonsEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: PolygonsEditorComponent, selector: "polygons-editor", providers: [CoordinateConverter, PolygonsManagerService], viewQueries: [{ propertyName: "editPolygonsLayer", first: true, predicate: ["editPolygonsLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editPolylinesLayer", first: true, predicate: ["editPolylinesLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
          hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
          material: polygon.polygonProps.material,
          fill: polygon.polygonProps.fill,
          classificationType: polygon.polygonProps.classificationType,
          zIndex: polygon.polygonProps.zIndex,
        }"
      >
      </ac-polygon-desc>
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcPolylineDescComponent, selector: "ac-polyline-desc" }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcPolygonDescComponent, selector: "ac-polygon-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolygonsEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'polygons-editor',
                    template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
          hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
          material: polygon.polygonProps.material,
          fill: polygon.polygonProps.fill,
          classificationType: polygon.polygonProps.classificationType,
          zIndex: polygon.polygonProps.zIndex,
        }"
      >
      </ac-polygon-desc>
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                    providers: [CoordinateConverter, PolygonsManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: PolygonsEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: PolygonsManagerService }, { type: CesiumService }]; }, propDecorators: { editPolygonsLayer: [{
                type: ViewChild,
                args: ['editPolygonsLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editPolylinesLayer: [{
                type: ViewChild,
                args: ['editPolylinesLayer']
            }] } });

class EditArc extends AcEntity {
    constructor(entityId, center, radius, delta, angle, _arcProps) {
        super();
        this._arcProps = _arcProps;
        this.id = this.generateId();
        this.editedEntityId = entityId;
        this._center = center;
        this._radius = radius;
        this._delta = delta;
        this._angle = angle;
    }
    get props() {
        return this._arcProps;
    }
    set props(props) {
        this._arcProps = props;
    }
    get angle() {
        return this._angle;
    }
    set angle(value) {
        this._angle = value;
    }
    get delta() {
        return this._delta;
    }
    set delta(value) {
        this._delta = value;
    }
    get radius() {
        return this._radius;
    }
    set radius(value) {
        this._radius = value;
    }
    get center() {
        return this._center;
    }
    set center(value) {
        this._center = value;
    }
    updateCenter(center) {
        this._center.x = center.x;
        this._center.y = center.y;
        this._center.z = center.z;
    }
    getId() {
        return this.id;
    }
    generateId() {
        return 'edit-arc-' + EditArc.counter++;
    }
}
EditArc.counter = 0;

class EditableCircle extends AcEntity {
    constructor(id, circlesLayer, pointsLayer, arcsLayer, options) {
        super();
        this.id = id;
        this.circlesLayer = circlesLayer;
        this.pointsLayer = pointsLayer;
        this.arcsLayer = arcsLayer;
        this.options = options;
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._circleProps = Object.assign({}, options.circleProps);
        this._pointProps = Object.assign({}, options.pointProps);
        this._polylineProps = Object.assign({}, options.polylineProps);
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels || !this._center || !this._radiusPoint) {
            return;
        }
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                if (index !== labels.length - 1) {
                    label.position = this._center.getPosition();
                }
                else {
                    label.position = this._radiusPoint.getPosition();
                }
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get polylineProps() {
        return this._polylineProps;
    }
    set polylineProps(value) {
        this._polylineProps = value;
    }
    get pointProps() {
        return this._pointProps;
    }
    set pointProps(value) {
        this._pointProps = value;
    }
    get circleProps() {
        return this._circleProps;
    }
    set circleProps(value) {
        this._circleProps = value;
    }
    get center() {
        return this._center;
    }
    get radiusPoint() {
        return this._radiusPoint;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this._center.show = value;
        this._radiusPoint.show = value;
        this.updatePointsLayer();
    }
    setManually(center, radiusPoint, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, circleProp = this.circleProps) {
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        if (!this._radiusPoint) {
            this._radiusPoint = new EditPoint(this.id, radiusPoint, radiusPointProp);
        }
        else {
            this._radiusPoint.setPosition(radiusPoint);
        }
        if (!this._outlineArc) {
            this.createOutlineArc();
        }
        else {
            this._outlineArc.radius = this.getRadius();
        }
        this.circleProps = circleProp;
        this.doneCreation = true;
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        if (!this._center) {
            this._center = new EditPoint(this.id, position, this.pointProps);
            this._radiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            if (!this._outlineArc) {
                this.createOutlineArc();
            }
        }
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(position);
        this.doneCreation = true;
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    movePoint(toPosition) {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._radiusPoint.setPosition(toPosition);
        this._outlineArc.radius = this.getRadius();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
    }
    moveCircle(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        const radius = this.getRadius();
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        const newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.radiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), radius, Math.PI / 2, true));
        this._outlineArc.radius = this.getRadius();
        this._outlineArc.center = this._center.getPosition();
        this.updateArcsLayer();
        this.updatePointsLayer();
        this.updateCirclesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    endMovePolygon() {
        this.lastDraggedToPosition = undefined;
    }
    getRadius() {
        if (!this._center || !this._radiusPoint) {
            return 0;
        }
        return GeoUtilsService.distance(this._center.getPosition(), this._radiusPoint.getPosition());
    }
    getRadiusCallbackProperty() {
        return new CallbackProperty(this.getRadius.bind(this), false);
    }
    getCenter() {
        return this._center ? this._center.getPosition() : undefined;
    }
    getCenterCallbackProperty() {
        return new CallbackProperty(this.getCenter.bind(this), false);
    }
    getRadiusPoint() {
        return this._radiusPoint ? this._radiusPoint.getPosition() : undefined;
    }
    dispose() {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.remove(this._radiusPoint.getId());
        }
        if (this._outlineArc) {
            this.arcsLayer.remove(this._outlineArc.getId());
        }
        this.circlesLayer.remove(this.id);
    }
    getId() {
        return this.id;
    }
    updateCirclesLayer() {
        this.circlesLayer.update(this, this.id);
    }
    updatePointsLayer() {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._radiusPoint) {
            this.pointsLayer.update(this._radiusPoint, this._radiusPoint.getId());
        }
    }
    updateArcsLayer() {
        if (!this._outlineArc) {
            return;
        }
        this.arcsLayer.update(this._outlineArc, this._outlineArc.getId());
    }
    createOutlineArc() {
        if (!this._center || !this._radiusPoint) {
            return;
        }
        this._outlineArc = new EditArc(this.id, this.getCenter(), this.getRadius(), Math.PI * 2, 0, this.polylineProps);
    }
}

class CirclesManagerService {
    constructor() {
        this.circles = new Map();
    }
    createEditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions) {
        const editableCircle = new EditableCircle(id, editCirclesLayer, editPointsLayer, editArcsLayer, circleOptions);
        this.circles.set(id, editableCircle);
        return editableCircle;
    }
    dispose(id) {
        const circle = this.circles.get(id);
        if (circle) {
            circle.dispose();
        }
        this.circles.delete(id);
    }
    get(id) {
        return this.circles.get(id);
    }
    clear() {
        this.circles.forEach(circle => circle.dispose());
        this.circles.clear();
    }
}
CirclesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CirclesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesManagerService, decorators: [{
            type: Injectable
        }] });

const DEFAULT_CIRCLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    circleProps: {
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: false,
        outlineWidth: 1,
        outlineColor: Color.WHITE.withAlpha(0.8),
        classificationType: ClassificationType.BOTH,
        zIndex: 0,
        shadows: ShadowMode.DISABLED,
    },
    pointProps: {
        color: Color.WHITE,
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: () => Color.WHITE.withAlpha(0.8),
    },
};
/**
 * Service for creating editable circles
 *
 * You must provide `CircleEditorService` yourself.
 * PolygonsEditorService works together with `<circle-editor>` component. Therefor you need to create `<circle-editor>`
 * for each `CircleEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `CircleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `CircleEditorObservable`.
 * + To stop editing call `dsipose()` from the `CircleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `CircleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating circle
 *  const editing$ = circlesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
class CirclesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, circlesManager) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.updatePublisher.connect();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            circleOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            const changeMode = {
                id,
                center,
                radiusPoint: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editCircle(id, priority, clientEditSubject, circleOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
                center = position;
            }
            else {
                finishedCreate = finishCreation(position);
            }
        });
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                const update = {
                    id,
                    center,
                    radiusPoint: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            }
        });
        return editorObservable;
    }
    edit(center, radius, options = DEFAULT_CIRCLE_OPTIONS, priority = 100) {
        const id = generateKey();
        const circleOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
        const update = {
            id,
            center,
            radiusPoint,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            circleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
        return this.editCircle(id, priority, editSubject, circleOptions);
    }
    editCircle(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: CesiumEvent.LEFT_CLICK_DRAG,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: CesiumEvent.LEFT_CLICK_DRAG,
                entityType: EditableCircle,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            const point = entities[0];
            const pointIsCenter = point === this.getCenterPoint(id);
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = {
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                startDragPosition,
                endDragPosition,
                editMode: EditModes.EDIT,
                editAction,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = {
                    id,
                    center: this.getCenterPosition(id),
                    radiusPoint: this.getRadiusPosition(id),
                    startDragPosition,
                    endDragPosition,
                    editMode: EditModes.EDIT,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), this.getCircleProperties(id)));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                center: this.getCenterPosition(id),
                radiusPoint: this.getRadiusPosition(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (center, radius, centerPointProp, radiusPointProp, circleProp) => {
            const radiusPoint = GeoUtilsService.pointByLocationDistanceAndAzimuth(center, radius, Math.PI / 2, true);
            const circle = this.circlesManager.get(id);
            circle.setManually(center, radiusPoint, centerPointProp, radiusPointProp, circleProp);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Circles editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.circlesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getRadius = () => this.getRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_CIRCLE_OPTIONS));
        const circleOptions = Object.assign(defaultClone, options);
        circleOptions.pointProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.pointProps, options.pointProps);
        circleOptions.circleProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.circleProps, options.circleProps);
        circleOptions.polylineProps = Object.assign({}, DEFAULT_CIRCLE_OPTIONS.polylineProps, options.polylineProps);
        return circleOptions;
    }
    getCenterPosition(id) {
        return this.circlesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.circlesManager.get(id).center;
    }
    getRadiusPosition(id) {
        return this.circlesManager.get(id).getRadiusPoint();
    }
    getRadius(id) {
        return this.circlesManager.get(id).getRadius();
    }
    getCircleProperties(id) {
        const circle = this.circlesManager.get(id);
        return {
            center: circle.getCenter(),
            radiusPoint: circle.getRadiusPoint(),
            radius: circle.getRadius(),
        };
    }
}
CirclesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
CirclesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorService, decorators: [{
            type: Injectable
        }] });

class CirclesEditorComponent {
    constructor(circlesEditor, coordinateConverter, mapEventsManager, cameraService, circlesManager) {
        this.circlesEditor = circlesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.circlesManager = circlesManager;
        this.editPoints$ = new Subject();
        this.editCircles$ = new Subject();
        this.editArcs$ = new Subject();
        this.circlesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.circlesManager);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.circlesEditor.onUpdate().subscribe(update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(circle, update, labels) {
        update.center = circle.getCenter();
        update.radiusPoint = circle.getRadiusPoint();
        update.radius = circle.getRadius();
        if (labels) {
            circle.labels = labels;
            this.editCirclesLayer.update(circle, circle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        circle.labels = this.editLabelsRenderFn(update, circle.labels);
        this.editCirclesLayer.update(circle, circle.getId());
    }
    removeEditLabels(circle) {
        circle.labels = [];
        this.editCirclesLayer.update(circle, circle.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.movePoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (update.center) {
                    circle.addPoint(update.center);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (update.radiusPoint) {
                    circle.addLastPoint(update.radiusPoint);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    this.removeEditLabels(circle);
                    this.circlesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const circle = this.circlesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(circle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const circle = this.circlesManager.get(update.id);
                this.renderEditLabels(circle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                const circle = this.circlesManager.createEditableCircle(update.id, this.editCirclesLayer, this.editPointsLayer, this.editArcsLayer, update.circleOptions);
                circle.setManually(update.center, update.radiusPoint);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.movePoint(update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.moveCircle(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const circle = this.circlesManager.get(update.id);
                if (circle && circle.enableEdit) {
                    circle.endMovePolygon();
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = false;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const circle = this.circlesManager.get(update.id);
                if (circle) {
                    circle.enableEdit = true;
                    this.renderEditLabels(circle, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.circlesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
CirclesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorComponent, deps: [{ token: CirclesEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: CirclesManagerService }], target: i0.ɵɵFactoryTarget.Component });
CirclesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: CirclesEditorComponent, selector: "circles-editor", providers: [CoordinateConverter, CirclesManagerService], viewQueries: [{ propertyName: "editCirclesLayer", first: true, predicate: ["editCirclesLayer"], descendants: true }, { propertyName: "editArcsLayer", first: true, predicate: ["editArcsLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
      <ac-layer #editArcsLayer acFor="let arc of editArcs$" [context]="this">
          <ac-arc-desc
                  props="{
        angle: arc.angle,
        delta: arc.delta,
        center: arc.center,
        radius: arc.radius,
        quality: 30,
        color: arc.props.material()
    }"
          >
          </ac-arc-desc>
      </ac-layer>

      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editCirclesLayer acFor="let circle of editCircles$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                  position: circle.getCenterCallbackProperty(),
                  semiMajorAxis: circle.getRadiusCallbackProperty(),
                  semiMinorAxis: circle.getRadiusCallbackProperty(),
                  material: circle.circleProps.material,
                  outline: circle.circleProps.outline,
                  height: 0
                  outlineWidth: circle.circleProps.outlineWidth,
                  outlineColor: circle.circleProps.outlineColor,
                  fill: circle.circleProps.fill,
                  classificationType: circle.circleProps.classificationType,
                  zIndex: circle.circleProps.zIndex,
                  shadows: circle.circleProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of circle.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcArcDescComponent, selector: "ac-arc-desc" }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcEllipseDescComponent, selector: "ac-ellipse-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CirclesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'circles-editor',
                    template: /*html*/ `
      <ac-layer #editArcsLayer acFor="let arc of editArcs$" [context]="this">
          <ac-arc-desc
                  props="{
        angle: arc.angle,
        delta: arc.delta,
        center: arc.center,
        radius: arc.radius,
        quality: 30,
        color: arc.props.material()
    }"
          >
          </ac-arc-desc>
      </ac-layer>

      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editCirclesLayer acFor="let circle of editCircles$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                  position: circle.getCenterCallbackProperty(),
                  semiMajorAxis: circle.getRadiusCallbackProperty(),
                  semiMinorAxis: circle.getRadiusCallbackProperty(),
                  material: circle.circleProps.material,
                  outline: circle.circleProps.outline,
                  height: 0
                  outlineWidth: circle.circleProps.outlineWidth,
                  outlineColor: circle.circleProps.outlineColor,
                  fill: circle.circleProps.fill,
                  classificationType: circle.circleProps.classificationType,
                  zIndex: circle.circleProps.zIndex,
                  shadows: circle.circleProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of circle.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `,
                    providers: [CoordinateConverter, CirclesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: CirclesEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: CirclesManagerService }]; }, propDecorators: { editCirclesLayer: [{
                type: ViewChild,
                args: ['editCirclesLayer']
            }], editArcsLayer: [{
                type: ViewChild,
                args: ['editArcsLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });

class EditableEllipse extends AcEntity {
    constructor(id, ellipsesLayer, pointsLayer, coordinateConverter, options) {
        super();
        this.id = id;
        this.ellipsesLayer = ellipsesLayer;
        this.pointsLayer = pointsLayer;
        this.coordinateConverter = coordinateConverter;
        this.options = options;
        this._rotation = 0;
        this.doneCreation = false;
        this._enableEdit = true;
        this._minorRadiusPoints = [];
        this._labels = [];
        this._ellipseProps = Object.assign({}, options.ellipseProps);
        this._pointProps = Object.assign({}, options.pointProps);
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels || !this._center) {
            return;
        }
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                if (index === 0) {
                    label.position = this._center.getPosition();
                }
                else if (index === 1) {
                    label.position = this._majorRadiusPoint
                        ? Cartesian3.midpoint(this.getCenter(), this._majorRadiusPoint.getPosition(), new Cartesian3())
                        : new Cartesian3();
                }
                else if (index === 2) {
                    label.position =
                        this._minorRadiusPoints.length > 0 && this._minorRadius
                            ? Cartesian3.midpoint(this.getCenter(), this.getMinorRadiusPointPosition(), new Cartesian3())
                            : new Cartesian3();
                }
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get polylineProps() {
        return this._polylineProps;
    }
    set polylineProps(value) {
        this._polylineProps = value;
    }
    get pointProps() {
        return this._pointProps;
    }
    set pointProps(value) {
        this._pointProps = value;
    }
    get ellipseProps() {
        return this._ellipseProps;
    }
    set ellipseProps(value) {
        this._ellipseProps = value;
    }
    get center() {
        return this._center;
    }
    get majorRadiusPoint() {
        return this._majorRadiusPoint;
    }
    getMajorRadiusPointPosition() {
        if (!this._majorRadiusPoint) {
            return undefined;
        }
        return this._majorRadiusPoint.getPosition();
    }
    getMinorRadiusPointPosition() {
        if (this._minorRadiusPoints.length < 1) {
            return undefined;
        }
        return this._minorRadiusPoints[0].getPosition();
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this._center.show = value;
        this._majorRadiusPoint.show = value;
        this.updatePointsLayer();
    }
    setManually(center, majorRadius, rotation = Math.PI / 2, minorRadius, centerPointProp = this.pointProps, radiusPointProp = this.pointProps, ellipseProp = this.ellipseProps) {
        if (majorRadius < minorRadius) {
            throw new Error('Major radius muse be equal or greater than minor radius');
        }
        this._rotation = rotation;
        this._majorRadius = majorRadius;
        if (!this._center) {
            this._center = new EditPoint(this.id, center, centerPointProp);
        }
        else {
            this._center.setPosition(center);
        }
        const majorRadiusPosition = GeoUtilsService.pointByLocationDistanceAndAzimuth(this.center.getPosition(), majorRadius, rotation);
        if (!this._majorRadiusPoint) {
            this._majorRadiusPoint = new EditPoint(this.id, majorRadiusPosition, radiusPointProp);
        }
        else {
            this._majorRadiusPoint.setPosition(majorRadiusPosition);
        }
        if (minorRadius) {
            this._minorRadius = minorRadius;
        }
        this.ellipseProps = ellipseProp;
        this.doneCreation = true;
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        if (!this._center) {
            this._center = new EditPoint(this.id, position, this.pointProps);
            this._majorRadiusPoint = new EditPoint(this.id, position.clone(), this.pointProps);
            this._majorRadius = 0;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    transformToEllipse() {
        if (this._minorRadius) {
            return;
        }
        this._minorRadius = this.getMajorRadius();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    addLastPoint(position) {
        if (this.doneCreation || !this._center || !this._majorRadiusPoint) {
            return;
        }
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), position);
        this._majorRadiusPoint.setPosition(position);
        this._majorRadius = newRadius;
        this.doneCreation = true;
        if (!this.options.circleToEllipseTransformation) {
            this._minorRadius = this._majorRadius;
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    movePoint(toPosition, editPoint) {
        if (!this._center || !this._majorRadiusPoint) {
            return;
        }
        const newRadius = GeoUtilsService.distance(this._center.getPosition(), toPosition);
        if (this.majorRadiusPoint === editPoint) {
            if (newRadius < this._minorRadius) {
                this._majorRadius = this._minorRadius;
                this._majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), this._minorRadius, this._rotation));
            }
            else {
                this.majorRadiusPoint.setPosition(toPosition);
                this._majorRadius = newRadius;
            }
        }
        else {
            if (newRadius > this._majorRadius) {
                this._minorRadius = this._majorRadius;
            }
            else {
                this._minorRadius = newRadius;
            }
        }
        this.updateRotation();
        this.updateMinorRadiusEditPoints();
        this.updatePointsLayer();
        this.updateEllipsesLayer();
    }
    moveEllipse(dragStartPosition, dragEndPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = dragStartPosition;
        }
        const majorRadius = this.getMajorRadius();
        const rotation = this.getRotation();
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, dragEndPosition);
        const newCenterPosition = GeoUtilsService.addDeltaToPosition(this.getCenter(), delta, true);
        this._center.setPosition(newCenterPosition);
        this.majorRadiusPoint.setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this.getCenter(), majorRadius, rotation));
        this.updatePointsLayer();
        this.updateMinorRadiusEditPoints();
        this.updateEllipsesLayer();
        this.lastDraggedToPosition = dragEndPosition;
    }
    endMoveEllipse() {
        this.lastDraggedToPosition = undefined;
    }
    updateMinorRadiusEditPoints() {
        if (this._minorRadius === undefined) {
            return;
        }
        if (this._minorRadiusPoints.length === 0) {
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cartesian3(), this.pointProps, true));
            this._minorRadiusPoints.push(new EditPoint(this.id, new Cartesian3(), this.pointProps, true));
        }
        this._minorRadiusPoints[0].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() - Math.PI / 2));
        this._minorRadiusPoints[1].setPosition(GeoUtilsService.pointByLocationDistanceAndAzimuth(this._center.getPosition(), this._minorRadius, this.getRotation() + Math.PI / 2));
    }
    getMajorRadius() {
        return this._majorRadius || 0;
    }
    getMinorRadius() {
        if (this._minorRadius === undefined) {
            return this.getMajorRadius();
        }
        else {
            return this._minorRadius;
        }
    }
    getRotation() {
        return this._rotation || 0;
    }
    updateRotation() {
        if (!this._majorRadiusPoint) {
            return 0;
        }
        const azimuthInDegrees = this.coordinateConverter.bearingToCartesian(this.getCenter(), this._majorRadiusPoint.getPosition());
        this._rotation = Math$1.toRadians(azimuthInDegrees);
        return this._rotation;
    }
    getRotationCallbackProperty() {
        return new CallbackProperty(() => Math.PI / 2 - this.getRotation(), false);
    }
    getMinorRadiusCallbackProperty() {
        return new CallbackProperty(() => this.getMinorRadius(), false);
    }
    getMajorRadiusCallbackProperty() {
        return new CallbackProperty(() => this.getMajorRadius(), false);
    }
    getCenter() {
        return this._center ? this._center.getPosition() : undefined;
    }
    getCenterCallbackProperty() {
        return new CallbackProperty(() => this.getCenter(), false);
    }
    dispose() {
        if (this._center) {
            this.pointsLayer.remove(this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.remove(this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints) {
            this._minorRadiusPoints.forEach(point => this.pointsLayer.remove(point.getId()));
        }
        this.ellipsesLayer.remove(this.id);
    }
    getId() {
        return this.id;
    }
    updateEllipsesLayer() {
        this.ellipsesLayer.update(this, this.id);
    }
    updatePointsLayer() {
        if (this._center) {
            this.pointsLayer.update(this._center, this._center.getId());
        }
        if (this._majorRadiusPoint) {
            this.pointsLayer.update(this._majorRadiusPoint, this._majorRadiusPoint.getId());
        }
        if (this._minorRadiusPoints.length > 0) {
            this.pointsLayer.update(this._minorRadiusPoints[0], this._minorRadiusPoints[0].getId());
            this.pointsLayer.update(this._minorRadiusPoints[1], this._minorRadiusPoints[1].getId());
        }
    }
}

class EllipsesManagerService {
    constructor() {
        this.ellipses = new Map();
    }
    createEditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions) {
        const editableEllipse = new EditableEllipse(id, editEllipsesLayer, editPointsLayer, coordinateConverter, ellipseOptions);
        this.ellipses.set(id, editableEllipse);
        return editableEllipse;
    }
    dispose(id) {
        this.ellipses.get(id).dispose();
        this.ellipses.delete(id);
    }
    get(id) {
        return this.ellipses.get(id);
    }
    clear() {
        this.ellipses.forEach(ellipse => ellipse.dispose());
        this.ellipses.clear();
    }
}
EllipsesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
EllipsesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesManagerService, decorators: [{
            type: Injectable
        }] });

const DEFAULT_ELLIPSE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    circleToEllipseTransformEvent: CesiumEvent.LEFT_CLICK,
    circleToEllipseTransformEventModifier: CesiumEventModifier.ALT,
    allowDrag: true,
    ellipseProps: {
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        outline: true,
        outlineWidth: 1,
        outlineColor: Color.WHITE.withAlpha(0.8),
        classificationType: ClassificationType.BOTH,
        zIndex: 0,
        shadows: ShadowMode.DISABLED,
    },
    pointProps: {
        color: Color.WHITE,
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        width: 1,
        material: () => Color.WHITE,
    },
    circleToEllipseTransformation: false,
};
/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
class EllipsesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, ellipsesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        let center;
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE,
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            ellipseOptions,
        });
        const finishCreation = (position) => {
            const update = {
                id,
                center,
                updatedPosition: position,
                editMode: EditModes.CREATE,
                editAction: EditActions.ADD_LAST_POINT,
            };
            this.updateSubject.next(update);
            clientEditSubject.next(Object.assign({}, update));
            const changeMode = {
                id,
                center,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(Object.assign({}, update));
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editEllipse(id, priority, clientEditSubject, ellipseOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: ellipseOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            if (!center) {
                const update = {
                    id,
                    center: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
                center = position;
            }
            else {
                finishedCreate = finishCreation(position);
            }
        });
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            if (!center) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                const update = {
                    id,
                    center,
                    updatedPosition: position,
                    editMode: EditModes.CREATE,
                    editAction: EditActions.MOUSE_MOVE,
                };
                this.updateSubject.next(update);
                clientEditSubject.next(Object.assign({}, update));
            }
        });
        return editorObservable;
    }
    edit(center, majorRadius, rotation = Math.PI / 2, minorRadius, options = DEFAULT_ELLIPSE_OPTIONS, priority = 100) {
        const id = generateKey();
        const ellipseOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT,
        });
        const update = {
            id,
            center,
            majorRadius,
            rotation,
            minorRadius,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            ellipseOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign({}, update));
        return this.editEllipse(id, priority, editSubject, ellipseOptions);
    }
    editEllipse(id, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.PICK_FIRST,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let addSecondRadiusRegistration;
        if (options.circleToEllipseTransformation) {
            addSecondRadiusRegistration = this.mapEventsManager.register({
                event: options.circleToEllipseTransformEvent,
                modifier: options.circleToEllipseTransformEventModifier,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableEllipse,
                pickConfig: options.pickConfiguration,
                pick: PickOptions.PICK_FIRST,
                priority: priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration
            .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
            const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
            const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!endDragPosition) {
                return;
            }
            const point = entities[0];
            const pointIsCenter = point === this.getCenterPoint(id);
            let editAction;
            if (drop) {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_POINT_FINISH;
            }
            else {
                editAction = pointIsCenter ? EditActions.DRAG_SHAPE : EditActions.DRAG_POINT;
            }
            if (!options.allowDrag && this.ellipsesManager.get(id).enableEdit &&
                (editAction === EditActions.DRAG_SHAPE || editAction === EditActions.DRAG_SHAPE_FINISH)) {
                this.cameraService.enableInputs(true);
                return;
            }
            const update = Object.assign({ id, updatedPoint: point, startDragPosition,
                endDragPosition, editMode: EditModes.EDIT, editAction }, this.getEllipseProperties(id));
            this.updateSubject.next(update);
            editSubject.next(Object.assign({}, update));
        });
        if (addSecondRadiusRegistration) {
            addSecondRadiusRegistration.subscribe(({ movement: { endPosition, startPosition, drop }, entities }) => {
                const update = Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.TRANSFORM }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.ellipsesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop } }) => {
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                if (!endDragPosition || !startDragPosition) {
                    return;
                }
                const update = Object.assign({ id,
                    startDragPosition,
                    endDragPosition, editMode: EditModes.EDIT, editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE }, this.getEllipseProperties(id));
                this.updateSubject.next(update);
                editSubject.next(Object.assign({}, update));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        if (addSecondRadiusRegistration) {
            observables.push(addSecondRadiusRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.ENABLE }, this.getEllipseProperties(id)));
        };
        observableToExtend.disable = () => {
            this.updateSubject.next(Object.assign({ id, editMode: EditModes.EDIT, editAction: EditActions.DISABLE }, this.getEllipseProperties(id)));
        };
        observableToExtend.setManually = (center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp) => {
            const ellipse = this.ellipsesManager.get(id);
            ellipse.setManually(center, majorRadius, rotation, minorRadius, centerPointProp, radiusPointProp, ellipseProp);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Ellipses editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.ellipsesManager.get(id).labels;
        observableToExtend.getCenter = () => this.getCenterPosition(id);
        observableToExtend.getMajorRadius = () => this.getMajorRadius(id);
        observableToExtend.getMinorRadius = () => this.getMinorRadius(id);
        return observableToExtend;
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_ELLIPSE_OPTIONS));
        const ellipseOptions = Object.assign(defaultClone, options);
        ellipseOptions.pointProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.pointProps, options.pointProps);
        ellipseOptions.ellipseProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.ellipseProps, options.ellipseProps);
        ellipseOptions.polylineProps = Object.assign({}, DEFAULT_ELLIPSE_OPTIONS.polylineProps, options.polylineProps);
        return ellipseOptions;
    }
    getCenterPosition(id) {
        return this.ellipsesManager.get(id).getCenter();
    }
    getCenterPoint(id) {
        return this.ellipsesManager.get(id).center;
    }
    getMajorRadius(id) {
        return this.ellipsesManager.get(id).getMajorRadius();
    }
    getMinorRadius(id) {
        return this.ellipsesManager.get(id).getMinorRadius();
    }
    getEllipseProperties(id) {
        const ellipse = this.ellipsesManager.get(id);
        return {
            center: ellipse.getCenter(),
            rotation: ellipse.getRotation(),
            minorRadius: ellipse.getMinorRadius(),
            majorRadius: ellipse.getMajorRadius(),
            minorRadiusPointPosition: ellipse.getMinorRadiusPointPosition(),
            majorRadiusPointPosition: ellipse.getMajorRadiusPointPosition(),
        };
    }
}
EllipsesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
EllipsesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorService, decorators: [{
            type: Injectable
        }] });

class EllipsesEditorComponent {
    constructor(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager, cesiumService) {
        this.ellipsesEditor = ellipsesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.cesiumService = cesiumService;
        this.editPoints$ = new Subject();
        this.editEllipses$ = new Subject();
        this.ellipsesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.ellipsesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.ellipsesEditor.onUpdate().subscribe(update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(ellipse, update, labels) {
        update.center = ellipse.getCenter();
        update.majorRadius = ellipse.getMajorRadius();
        update.minorRadius = ellipse.getMinorRadius();
        update.rotation = ellipse.getRotation();
        if (labels) {
            ellipse.labels = labels;
            this.editEllipsesLayer.update(ellipse, ellipse.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        ellipse.labels = this.editLabelsRenderFn(update, ellipse.labels);
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    removeEditLabels(ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    this.removeEditLabels(ellipse);
                    this.ellipsesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                const ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = true;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.ellipsesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
EllipsesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorComponent, deps: [{ token: EllipsesEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: EllipsesManagerService }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
EllipsesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: EllipsesEditorComponent, selector: "ellipses-editor", providers: [CoordinateConverter, EllipsesManagerService], viewQueries: [{ propertyName: "editEllipsesLayer", first: true, predicate: ["editEllipsesLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                    position: ellipse.getCenterCallbackProperty(),
                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
                    rotation: ellipse.getRotationCallbackProperty(),
                    material: ellipse.ellipseProps.material,
                    outline: ellipse.ellipseProps.outline,
                    outlineWidth: ellipse.ellipseProps.outlineWidth,
                    outlineColor: ellipse.ellipseProps.outlineColor,
                    height: 0,
                    fill: ellipse.ellipseProps.fill,
                    classificationType: ellipse.ellipseProps.classificationType,
                    zIndex: ellipse.ellipseProps.zIndex,
                    shadows: ellipse.ellipseProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
                        position: label.position,
                        text: label.text,
                        backgroundColor: label.backgroundColor,
                        backgroundPadding: label.backgroundPadding,
                        distanceDisplayCondition: label.distanceDisplayCondition,
                        eyeOffset: label.eyeOffset,
                        fillColor: label.fillColor,
                        font: label.font,
                        heightReference: label.heightReference,
                        horizontalOrigin: label.horizontalOrigin,
                        outlineColor: label.outlineColor,
                        outlineWidth: label.outlineWidth,
                        pixelOffset: label.pixelOffset,
                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
                        scale: label.scale,
                        scaleByDistance: label.scaleByDistance,
                        show: label.show,
                        showBackground: label.showBackground,
                        style: label.style,
                        translucencyByDistance: label.translucencyByDistance,
                        verticalOrigin: label.verticalOrigin,
                        disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcEllipseDescComponent, selector: "ac-ellipse-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ellipses-editor',
                    template: /*html*/ `
      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                    position: ellipse.getCenterCallbackProperty(),
                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
                    rotation: ellipse.getRotationCallbackProperty(),
                    material: ellipse.ellipseProps.material,
                    outline: ellipse.ellipseProps.outline,
                    outlineWidth: ellipse.ellipseProps.outlineWidth,
                    outlineColor: ellipse.ellipseProps.outlineColor,
                    height: 0,
                    fill: ellipse.ellipseProps.fill,
                    classificationType: ellipse.ellipseProps.classificationType,
                    zIndex: ellipse.ellipseProps.zIndex,
                    shadows: ellipse.ellipseProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
                        position: label.position,
                        text: label.text,
                        backgroundColor: label.backgroundColor,
                        backgroundPadding: label.backgroundPadding,
                        distanceDisplayCondition: label.distanceDisplayCondition,
                        eyeOffset: label.eyeOffset,
                        fillColor: label.fillColor,
                        font: label.font,
                        heightReference: label.heightReference,
                        horizontalOrigin: label.horizontalOrigin,
                        outlineColor: label.outlineColor,
                        outlineWidth: label.outlineWidth,
                        pixelOffset: label.pixelOffset,
                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
                        scale: label.scale,
                        scaleByDistance: label.scaleByDistance,
                        show: label.show,
                        showBackground: label.showBackground,
                        style: label.style,
                        translucencyByDistance: label.translucencyByDistance,
                        verticalOrigin: label.verticalOrigin,
                        disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `,
                    providers: [CoordinateConverter, EllipsesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: EllipsesEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: EllipsesManagerService }, { type: CesiumService }]; }, propDecorators: { editEllipsesLayer: [{
                type: ViewChild,
                args: ['editEllipsesLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });

class EditablePolyline extends AcEntity {
    constructor(id, pointsLayer, polylinesLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.polylinesLayer = polylinesLayer;
        this.coordinateConverter = coordinateConverter;
        this.editOptions = editOptions;
        this.positions = [];
        this.polylines = [];
        this.doneCreation = false;
        this._enableEdit = true;
        this._labels = [];
        this._pointProps = Object.assign({}, editOptions.pointProps);
        this.props = Object.assign({}, editOptions.polylineProps);
        if (positions && positions.length >= 2) {
            this.createFromExisting(positions);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const positions = this.getRealPositions();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get props() {
        return this.polylineProps;
    }
    set props(value) {
        this.polylineProps = value;
    }
    get pointProps() {
        return this._pointProps;
    }
    set pointProps(value) {
        this._pointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(false, point);
        });
    }
    createFromExisting(positions) {
        positions.forEach((position) => {
            this.addPointFromExisting(position);
        });
        this.addAllVirtualEditPoints();
        this.doneCreation = true;
    }
    setManually(points, polylineProps) {
        if (!this.doneCreation) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        const newPoints = [];
        for (let i = 0; i < points.length; i++) {
            const pointOrCartesian = points[i];
            let newPoint = null;
            if (pointOrCartesian.pointProps) {
                newPoint = new EditPoint(this.id, pointOrCartesian.position, pointOrCartesian.pointProps);
            }
            else {
                newPoint = new EditPoint(this.id, pointOrCartesian, this._pointProps);
            }
            newPoints.push(newPoint);
        }
        this.positions = newPoints;
        this.polylineProps = polylineProps ? polylineProps : this.polylineProps;
        this.updatePointsLayer(true, ...this.positions);
        this.addAllVirtualEditPoints();
    }
    addAllVirtualEditPoints() {
        const currentPoints = [...this.positions];
        currentPoints.forEach((pos, index) => {
            if (index !== currentPoints.length - 1) {
                const currentPoint = pos;
                const nextIndex = (index + 1) % (currentPoints.length);
                const nextPoint = currentPoints[nextIndex];
                const midPoint = this.setMiddleVirtualPoint(currentPoint, nextPoint);
                this.updatePointsLayer(false, midPoint);
            }
        });
    }
    setMiddleVirtualPoint(firstP, secondP) {
        const pos1 = firstP.getPosition();
        const pos2 = secondP.getPosition();
        const midPointCartesian3 = Cartesian3.lerp(new Cartesian3(pos1.x, pos1.y, pos1.z), new Cartesian3(pos2.x, pos2.y, pos2.z), 0.5, new Cartesian3());
        const midPoint = new EditPoint(this.id, midPointCartesian3, this._pointProps);
        midPoint.setVirtualEditPoint(true);
        const firstIndex = this.positions.indexOf(firstP);
        this.positions.splice(firstIndex + 1, 0, midPoint);
        return midPoint;
    }
    updateMiddleVirtualPoint(virtualEditPoint, prevPoint, nextPoint) {
        const pos1 = prevPoint.getPosition();
        const pos2 = nextPoint.getPosition();
        const midPointCartesian3 = Cartesian3.lerp(new Cartesian3(pos1.x, pos1.y, pos1.z), new Cartesian3(pos2.x, pos2.y, pos2.z), 0.5, new Cartesian3());
        virtualEditPoint.setPosition(midPointCartesian3);
    }
    changeVirtualPointToRealPoint(point) {
        point.setVirtualEditPoint(false); // actual point becomes a real point
        const pointsCount = this.positions.length;
        const pointIndex = this.positions.indexOf(point);
        const nextIndex = (pointIndex + 1) % (pointsCount);
        const preIndex = ((pointIndex - 1) + pointsCount) % pointsCount;
        const nextPoint = this.positions[nextIndex];
        const prePoint = this.positions[preIndex];
        const firstMidPoint = this.setMiddleVirtualPoint(prePoint, point);
        const secMidPoint = this.setMiddleVirtualPoint(point, nextPoint);
        this.updatePointsLayer(false, firstMidPoint, secMidPoint, point);
    }
    renderPolylines() {
        this.polylines.forEach(polyline => this.polylinesLayer.remove(polyline.getId()));
        this.polylines = [];
        const realPoints = this.positions.filter(point => !point.isVirtualEditPoint());
        realPoints.forEach((point, index) => {
            if (index !== realPoints.length - 1) {
                const nextIndex = (index + 1);
                const nextPoint = realPoints[nextIndex];
                const polyline = new EditPolyline(this.id, point.getPosition(), nextPoint.getPosition(), this.polylineProps);
                this.polylines.push(polyline);
                this.polylinesLayer.update(polyline, polyline.getId());
            }
        });
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this._pointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(true, newPoint);
    }
    addPoint(position) {
        if (this.doneCreation) {
            return;
        }
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            const firstPoint = new EditPoint(this.id, position, this._pointProps);
            this.positions.push(firstPoint);
            this.updatePointsLayer(true, firstPoint);
        }
        this.movingPoint = new EditPoint(this.id, position.clone(), this._pointProps);
        this.positions.push(this.movingPoint);
        this.updatePointsLayer(true, this.movingPoint);
    }
    movePointFinish(editPoint) {
        if (this.editOptions.clampHeightTo3D) {
            editPoint.props.disableDepthTestDistance = Number.POSITIVE_INFINITY;
            this.updatePointsLayer(false, editPoint);
        }
    }
    movePoint(toPosition, editPoint) {
        editPoint.setPosition(toPosition);
        if (this.doneCreation) {
            if (editPoint.props.disableDepthTestDistance && this.editOptions.clampHeightTo3D) {
                // To avoid bug with pickPosition() on point with disableDepthTestDistance
                editPoint.props.disableDepthTestDistance = undefined;
                return; // ignore first move because the pickPosition() could be wrong
            }
            if (editPoint.isVirtualEditPoint()) {
                this.changeVirtualPointToRealPoint(editPoint);
            }
            const pointsCount = this.positions.length;
            const pointIndex = this.positions.indexOf(editPoint);
            if (pointIndex < this.positions.length - 1) {
                const nextVirtualPoint = this.positions[(pointIndex + 1) % (pointsCount)];
                const nextRealPoint = this.positions[(pointIndex + 2) % (pointsCount)];
                this.updateMiddleVirtualPoint(nextVirtualPoint, editPoint, nextRealPoint);
            }
            if (pointIndex > 0) {
                const prevVirtualPoint = this.positions[((pointIndex - 1) + pointsCount) % pointsCount];
                const prevRealPoint = this.positions[((pointIndex - 2) + pointsCount) % pointsCount];
                this.updateMiddleVirtualPoint(prevVirtualPoint, editPoint, prevRealPoint);
            }
        }
        this.updatePointsLayer(true, editPoint);
    }
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.doneCreation) {
            return;
        }
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, new Cartesian3(draggedToPosition.x, draggedToPosition.y, draggedToPosition.z));
        this.positions.forEach(point => {
            const pos = point.getPosition();
            const newPos = GeoUtilsService.addDeltaToPosition(new Cartesian3(pos.x, pos.y, pos.z), delta, true);
            point.setPosition(newPos);
        });
        this.updatePointsLayer(true, ...this.positions);
        this.lastDraggedToPosition = draggedToPosition;
    }
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.updatePointsLayer(true, ...this.positions);
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions
            .filter(p => p.isVirtualEditPoint())
            .forEach(p => this.removePosition(p));
        this.addAllVirtualEditPoints();
        this.renderPolylines();
    }
    addLastPoint(position) {
        this.doneCreation = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
        this.addAllVirtualEditPoints();
    }
    getRealPositions() {
        return this.getRealPoints()
            .map(position => position.getPosition());
    }
    getRealPoints() {
        return this.positions
            .filter(position => !position.isVirtualEditPoint() && position !== this.movingPoint);
    }
    getPoints() {
        return this.positions.filter(position => position !== this.movingPoint);
    }
    getPositions() {
        return this.positions.map(position => position.getPosition());
    }
    getPositionsCallbackProperty() {
        return new CallbackProperty(this.getPositions.bind(this), false);
    }
    removePosition(point) {
        const index = this.positions.findIndex((p) => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePointsLayer(renderPolylines = true, ...point) {
        if (renderPolylines) {
            this.renderPolylines();
        }
        point.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    update() {
        this.updatePointsLayer();
    }
    dispose() {
        this.positions.forEach(editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        });
        this.polylines.forEach(line => this.polylinesLayer.remove(line.getId()));
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}

class PolylinesManagerService {
    constructor() {
        this.polylines = new Map();
    }
    createEditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions) {
        const editablePolyline = new EditablePolyline(id, editPolylinesLayer, editPointsLayer, coordinateConverter, polylineOptions, positions);
        this.polylines.set(id, editablePolyline);
    }
    get(id) {
        return this.polylines.get(id);
    }
    clear() {
        this.polylines.forEach(polyline => polyline.dispose());
        this.polylines.clear();
    }
}
PolylinesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolylinesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesManagerService, decorators: [{
            type: Injectable
        }] });

class EditableRectangle extends AcEntity {
    constructor(id, pointsLayer, rectangleLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.rectangleLayer = rectangleLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = Object.assign({}, editOptions.pointProps);
        this.rectangleProps = Object.assign({}, editOptions.rectangleProps);
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Rectangle consist of 2 points but provided ' + positions.length);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const positions = this.getRealPositions();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get rectangleProps() {
        return this._rectangleProps;
    }
    set rectangleProps(value) {
        this._rectangleProps = value;
    }
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(point);
        });
    }
    createFromExisting(positions) {
        positions.forEach(position => {
            this.addPointFromExisting(position);
        });
        this.updateRectangleLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after rectangle is created');
        }
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        this.positions = points;
        this.updatePointsLayer(...points);
        this.updateRectangleLayer();
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    addPoint(position) {
        if (this.done) {
            return;
        }
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.updatePointsLayer(...this.positions);
            this.updateRectangleLayer();
        }
    }
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        const lastDraggedCartographic = Cartographic.fromCartesian(this.lastDraggedToPosition);
        const draggedToPositionCartographic = Cartographic.fromCartesian(draggedToPosition);
        this.getRealPoints().forEach(point => {
            const cartographic = Cartographic.fromCartesian(point.getPosition());
            cartographic.longitude += (draggedToPositionCartographic.longitude - lastDraggedCartographic.longitude);
            cartographic.latitude += (draggedToPositionCartographic.latitude - lastDraggedCartographic.latitude);
            point.setPosition(Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, 0));
        });
        this.updatePointsLayer(...this.positions);
        this.updateRectangleLayer();
        this.lastDraggedToPosition = draggedToPosition;
    }
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.positions.forEach(point => this.updatePointsLayer(point));
        this.updateRectangleLayer();
    }
    endMovePoint() {
        this.updatePointsLayer(...this.positions);
    }
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
    }
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    getRealPositions() {
        return this.getRealPoints().map(position => position.getPosition());
    }
    getRealPositionsCallbackProperty() {
        return new CallbackProperty(this.getRealPositions.bind(this), false);
    }
    getRealPoints() {
        return this.positions.filter(position => !position.isVirtualEditPoint());
    }
    getPositions() {
        return this.positions.map(position => position.getPosition());
    }
    getRectangle() {
        const cartographics = this.getPositions().map(cartesian => Cartographic.fromCartesian(cartesian));
        const longitudes = cartographics.map(position => position.longitude);
        const latitudes = cartographics.map(position => position.latitude);
        return new Rectangle(Math.min(...longitudes), Math.min(...latitudes), Math.max(...longitudes), Math.max(...latitudes));
    }
    getRectangleCallbackProperty() {
        return new CallbackProperty(this.getRectangle.bind(this), false);
    }
    removePosition(point) {
        const index = this.positions.findIndex(p => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePointsLayer(...point) {
        point.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    updateRectangleLayer() {
        this.rectangleLayer.update(this, this.id);
    }
    dispose() {
        this.rectangleLayer.remove(this.id);
        this.positions.forEach(editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}

class EditorObservable extends Observable {
}

class PointEditorObservable extends EditorObservable {
}

//import { Cartesian3 } from '../../angular-cesium';
class PolylineEditorObservable extends EditorObservable {
}

class PolygonEditorObservable extends EditorObservable {
}

class RectangleEditorObservable extends EditorObservable {
}

class CircleEditorObservable extends EditorObservable {
}

class EllipseEditorObservable extends EditorObservable {
}

class HippodromeEditorObservable extends EditorObservable {
}

class EditableHippodrome extends AcEntity {
    constructor(id, pointsLayer, hippodromeLayer, coordinateConverter, editOptions, positions) {
        super();
        this.id = id;
        this.pointsLayer = pointsLayer;
        this.hippodromeLayer = hippodromeLayer;
        this.coordinateConverter = coordinateConverter;
        this.positions = [];
        this.done = false;
        this._enableEdit = true;
        this._labels = [];
        this.defaultPointProps = Object.assign({}, editOptions.pointProps);
        this.hippodromeProps = Object.assign({}, editOptions.hippodromeProps);
        if (positions && positions.length === 2) {
            this.createFromExisting(positions);
        }
        else if (positions) {
            throw new Error('Hippodrome consist of 2 points but provided ' + positions.length);
        }
    }
    get labels() {
        return this._labels;
    }
    set labels(labels) {
        if (!labels) {
            return;
        }
        const positions = this.getRealPositions();
        this._labels = labels.map((label, index) => {
            if (!label.position) {
                label.position = positions[index];
            }
            return Object.assign({}, defaultLabelProps, label);
        });
    }
    get hippodromeProps() {
        return this._hippodromeProps;
    }
    set hippodromeProps(value) {
        this._hippodromeProps = value;
    }
    get defaultPointProps() {
        return this._defaultPointProps;
    }
    set defaultPointProps(value) {
        this._defaultPointProps = value;
    }
    get enableEdit() {
        return this._enableEdit;
    }
    set enableEdit(value) {
        this._enableEdit = value;
        this.positions.forEach(point => {
            point.show = value;
            this.updatePointsLayer(point);
        });
    }
    createFromExisting(positions) {
        positions.forEach(position => {
            this.addPointFromExisting(position);
        });
        this.createHeightEditPoints();
        this.updateHippdromeLayer();
        this.updatePointsLayer(...this.positions);
        this.done = true;
    }
    setPointsManually(points, widthMeters) {
        if (!this.done) {
            throw new Error('Update manually only in edit mode, after polyline is created');
        }
        this.hippodromeProps.width = widthMeters ? widthMeters : this.hippodromeProps.width;
        this.positions.forEach(p => this.pointsLayer.remove(p.getId()));
        this.positions = points;
        this.createHeightEditPoints();
        this.updatePointsLayer(...points);
        this.updateHippdromeLayer();
    }
    addPointFromExisting(position) {
        const newPoint = new EditPoint(this.id, position, this.defaultPointProps);
        this.positions.push(newPoint);
        this.updatePointsLayer(newPoint);
    }
    addPoint(position) {
        if (this.done) {
            return;
        }
        const isFirstPoint = !this.positions.length;
        if (isFirstPoint) {
            const firstPoint = new EditPoint(this.id, position, this.defaultPointProps);
            this.positions.push(firstPoint);
            this.movingPoint = new EditPoint(this.id, position.clone(), this.defaultPointProps);
            this.positions.push(this.movingPoint);
            this.updatePointsLayer(firstPoint);
        }
        else {
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
            this.done = true;
            this.movingPoint = null;
        }
    }
    createHeightEditPoints() {
        this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
        const firstP = this.getRealPoints()[0];
        const secP = this.getRealPoints()[1];
        const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cartesian3());
        const bearingDeg = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        const upAzimuth = Math$1.toRadians(bearingDeg) - Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, upAzimuth);
        const downAzimuth = Math$1.toRadians(bearingDeg) + Math.PI / 2;
        this.createMiddleEditablePoint(midPointCartesian3, downAzimuth);
    }
    createMiddleEditablePoint(midPointCartesian3, azimuth) {
        const upEditCartesian3 = GeoUtilsService.pointByLocationDistanceAndAzimuth(midPointCartesian3, this.hippodromeProps.width / 2, azimuth, true);
        const midPoint = new EditPoint(this.id, upEditCartesian3, this.defaultPointProps);
        midPoint.setVirtualEditPoint(true);
        this.positions.push(midPoint);
    }
    movePoint(toPosition, editPoint) {
        if (!editPoint.isVirtualEditPoint()) {
            editPoint.setPosition(toPosition);
            this.createHeightEditPoints();
            this.updatePointsLayer(...this.positions);
            this.updateHippdromeLayer();
        }
        else {
            this.changeWidthByNewPoint(toPosition);
        }
    }
    changeWidthByNewPoint(toPosition) {
        const firstP = this.getRealPoints()[0];
        const secP = this.getRealPoints()[1];
        const midPointCartesian3 = Cartesian3.lerp(firstP.getPosition(), secP.getPosition(), 0.5, new Cartesian3());
        const bearingDeg = this.coordinateConverter.bearingToCartesian(midPointCartesian3, toPosition);
        let normalizedBearingDeb = bearingDeg;
        if (bearingDeg > 270) {
            normalizedBearingDeb = bearingDeg - 270;
        }
        else if (bearingDeg > 180) {
            normalizedBearingDeb = bearingDeg - 180;
        }
        let bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(firstP.getPosition(), secP.getPosition());
        if (bearingDegHippodromeDots > 180) {
            bearingDegHippodromeDots = this.coordinateConverter.bearingToCartesian(secP.getPosition(), firstP.getPosition());
        }
        let fixedBearingDeg = bearingDegHippodromeDots > normalizedBearingDeb
            ? bearingDegHippodromeDots - normalizedBearingDeb
            : normalizedBearingDeb - bearingDegHippodromeDots;
        if (bearingDeg > 270) {
            fixedBearingDeg = bearingDeg - bearingDegHippodromeDots;
        }
        const distanceMeters = Math.abs(GeoUtilsService.distance(midPointCartesian3, toPosition));
        const radiusWidth = Math.sin(Math$1.toRadians(fixedBearingDeg)) * distanceMeters;
        this.hippodromeProps.width = Math.abs(radiusWidth) * 2;
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
    }
    moveShape(startMovingPosition, draggedToPosition) {
        if (!this.lastDraggedToPosition) {
            this.lastDraggedToPosition = startMovingPosition;
        }
        const delta = GeoUtilsService.getPositionsDelta(this.lastDraggedToPosition, draggedToPosition);
        this.getRealPoints().forEach(point => {
            const newPos = GeoUtilsService.addDeltaToPosition(point.getPosition(), delta, true);
            point.setPosition(newPos);
        });
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
        this.updateHippdromeLayer();
        this.lastDraggedToPosition = draggedToPosition;
    }
    endMoveShape() {
        this.lastDraggedToPosition = undefined;
        this.createHeightEditPoints();
        this.positions.forEach(point => this.updatePointsLayer(point));
        this.updateHippdromeLayer();
    }
    endMovePoint() {
        this.createHeightEditPoints();
        this.updatePointsLayer(...this.positions);
    }
    moveTempMovingPoint(toPosition) {
        if (this.movingPoint) {
            this.movePoint(toPosition, this.movingPoint);
        }
    }
    removePoint(pointToRemove) {
        this.removePosition(pointToRemove);
        this.positions.filter(p => p.isVirtualEditPoint()).forEach(p => this.removePosition(p));
    }
    addLastPoint(position) {
        this.done = true;
        this.removePosition(this.movingPoint); // remove movingPoint
        this.movingPoint = null;
    }
    getRealPositions() {
        return this.getRealPoints().map(position => position.getPosition());
    }
    getRealPositionsCallbackProperty() {
        return new CallbackProperty(this.getRealPositions.bind(this), false);
    }
    getRealPoints() {
        return this.positions.filter(position => !position.isVirtualEditPoint());
    }
    getWidth() {
        return this.hippodromeProps.width;
    }
    getPositions() {
        return this.positions.map(position => position.getPosition());
    }
    removePosition(point) {
        const index = this.positions.findIndex(p => p === point);
        if (index < 0) {
            return;
        }
        this.positions.splice(index, 1);
        this.pointsLayer.remove(point.getId());
    }
    updatePointsLayer(...point) {
        point.forEach(p => this.pointsLayer.update(p, p.getId()));
    }
    updateHippdromeLayer() {
        this.hippodromeLayer.update(this, this.id);
    }
    dispose() {
        this.hippodromeLayer.remove(this.id);
        this.positions.forEach(editPoint => {
            this.pointsLayer.remove(editPoint.getId());
        });
        if (this.movingPoint) {
            this.pointsLayer.remove(this.movingPoint.getId());
            this.movingPoint = undefined;
        }
        this.positions.length = 0;
    }
    getPointsCount() {
        return this.positions.length;
    }
    getId() {
        return this.id;
    }
}

const DEFAULT_POLYLINE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    addLastPointEvent: CesiumEvent.LEFT_DOUBLE_CLICK,
    removePointEvent: CesiumEvent.RIGHT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE.withAlpha(0.95),
        outlineColor: Color.BLACK.withAlpha(0.5),
        outlineWidth: 1,
        pixelSize: 15,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    polylineProps: {
        material: () => Color.BLACK,
        width: 3,
        clampToGround: false,
        zIndex: 0,
        classificationType: ClassificationType.BOTH,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
        clampMostDetailed: true,
        clampToHeightPickWidth: 2,
    },
};
/**
 * Service for creating editable polylines
 *
 *  * You must provide `PolylineEditorService` yourself.
 * PolygonsEditorService works together with `<polylines-editor>` component. Therefor you need to create `<polylines-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PolylineEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PolylineEditorObservable`.
 * + To stop editing call `dsipose()` from the `PolylineEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PolylineEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating polyline
 *  const editing$ = polylinesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit polyline from existing polyline cartesian3 positions
 *  const editing$ = this.polylinesEditor.edit(initialPos);
 *
 * ```
 */
class PolylinesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
        this.clampPointsDebounced = debounce((id, clampHeightTo3D, clampHeightTo3DOptions) => {
            this.clampPoints(id, clampHeightTo3D, clampHeightTo3DOptions);
        }, 300);
    }
    init(mapEventsManager, coordinateConverter, cameraService, polylinesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    clampPoints(id, clampHeightTo3D, { clampToTerrain, clampMostDetailed, clampToHeightPickWidth }) {
        if (clampHeightTo3D && clampMostDetailed) {
            const polyline = this.polylinesManager.get(id);
            const points = polyline.getPoints();
            if (!clampToTerrain) {
                // 3dTiles
                points.forEach(point => {
                    point.setPosition(this.cesiumScene.clampToHeight(point.getPosition(), undefined, clampToHeightPickWidth));
                });
            }
            else {
                const cartographics = points.map(point => this.coordinateConverter.cartesian3ToCartographic(point.getPosition()));
                const promise = sampleTerrain(this.cesiumScene.terrainProvider, 11, cartographics);
                when(promise, function (updatedPositions) {
                    points.forEach((point, index) => {
                        point.setPosition(Cartographic.toCartesian(updatedPositions[index]));
                    });
                });
            }
        }
    }
    screenToPosition(cartesian2, clampHeightTo3D, { clampToHeightPickWidth, clampToTerrain }) {
        const cartesian3 = this.coordinateConverter.screenToCartesian3(cartesian2);
        // If cartesian3 is undefined then the point inst on the globe
        if (clampHeightTo3D && cartesian3) {
            const globePositionPick = () => {
                const ray = this.cameraService.getCamera().getPickRay(cartesian2);
                return this.cesiumScene.globe.pick(ray, this.cesiumScene);
            };
            // is terrain?
            if (clampToTerrain) {
                return globePositionPick();
            }
            else {
                const cartesian3PickPosition = this.cesiumScene.pickPosition(cartesian2);
                const latLon = CoordinateConverter.cartesian3ToLatLon(cartesian3PickPosition);
                if (latLon.height < 0) { // means nothing picked -> Validate it
                    return globePositionPick();
                }
                return this.cesiumScene.clampToHeight(cartesian3PickPosition, undefined, clampToHeightPickWidth);
            }
        }
        return cartesian3;
    }
    create(options = DEFAULT_POLYLINE_OPTIONS, eventPriority = 100) {
        const positions = [];
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        });
        const finishCreation = (position) => {
            return this.switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate);
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addPointEvent,
            modifier: polylineOptions.addPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        const addLastPointRegistration = this.mapEventsManager.register({
            event: polylineOptions.addLastPointEvent,
            modifier: polylineOptions.addLastPointModifier,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
            pickConfig: options.pickConfiguration,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration, addLastPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            if (allPositions.find((cartesian) => cartesian.equals(position))) {
                return;
            }
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (polylineOptions.maximumNumberOfPoints && allPositions.length + 1 === polylineOptions.maximumNumberOfPoints) {
                finishedCreate = finishCreation(position);
            }
        });
        addLastPointRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.screenToPosition(endPosition, polylineOptions.clampHeightTo3D, polylineOptions.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            // Add last point to positions if not already added
            const allPositions = this.getPositions(id);
            if (!allPositions.find((cartesian) => cartesian.equals(position))) {
                const updateValue = {
                    id,
                    positions: allPositions,
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.ADD_POINT,
                };
                this.updateSubject.next(updateValue);
                clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            }
            finishedCreate = finishCreation(position);
        });
        return editorObservable;
    }
    switchToEditMode(id, position, clientEditSubject, positions, eventPriority, polylineOptions, editorObservable, finishedCreate) {
        const update = {
            id,
            positions: this.getPositions(id),
            editMode: EditModes.CREATE,
            updatedPosition: position,
            editAction: EditActions.ADD_LAST_POINT,
        };
        this.updateSubject.next(update);
        clientEditSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        const changeMode = {
            id,
            editMode: EditModes.CREATE,
            editAction: EditActions.CHANGE_TO_EDIT,
        };
        this.updateSubject.next(changeMode);
        clientEditSubject.next(changeMode);
        if (this.observablesMap.has(id)) {
            this.observablesMap.get(id).forEach(registration => registration.dispose());
        }
        this.observablesMap.delete(id);
        this.editPolyline(id, positions, eventPriority, clientEditSubject, polylineOptions, editorObservable);
        finishedCreate = true;
        return finishedCreate;
    }
    edit(positions, options = DEFAULT_POLYLINE_OPTIONS, priority = 100) {
        if (positions.length < 2) {
            throw new Error('Polylines editor error edit(): polyline should have at least 2 positions');
        }
        const id = generateKey();
        const polylineOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            polylineOptions: polylineOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editPolyline(id, positions, priority, editSubject, polylineOptions);
    }
    editPolyline(id, positions, priority, editSubject, options, editObservable) {
        this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        const pointRemoveRegistration = this.mapEventsManager.register({
            event: options.removePointEvent,
            modifier: options.removePointModifier,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditPolyline,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.editedEntityId,
            });
        }
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.screenToPosition(endPosition, false, options.clampHeightTo3DOptions);
                const startDragPosition = this.screenToPosition(startPosition, false, options.clampHeightTo3DOptions);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            });
        }
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.polylinesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.screenToPosition(endPosition, options.clampHeightTo3D, options.clampHeightTo3DOptions);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPointsDebounced(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        pointRemoveRegistration.subscribe(({ entities }) => {
            const point = entities[0];
            const allPositions = [...this.getPositions(id)];
            if (allPositions.length < 3) {
                return;
            }
            const index = allPositions.findIndex(position => point.getPosition().equals(position));
            if (index < 0) {
                return;
            }
            const update = {
                id,
                positions: allPositions,
                editMode: EditModes.EDIT,
                updatedPoint: point,
                editAction: EditActions.REMOVE_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            this.clampPoints(id, options.clampHeightTo3D, options.clampHeightTo3DOptions);
        });
        const observables = [pointDragRegistration, pointRemoveRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_POLYLINE_OPTIONS));
        const polylineOptions = Object.assign(defaultClone, options);
        polylineOptions.pointProps = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.pointProps), options.pointProps);
        polylineOptions.polylineProps = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.polylineProps), options.polylineProps);
        polylineOptions.clampHeightTo3DOptions = Object.assign(Object.assign({}, DEFAULT_POLYLINE_OPTIONS.clampHeightTo3DOptions), options.clampHeightTo3DOptions);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
            }
            if (polylineOptions.pointProps.color.alpha === 1 || polylineOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            polylineOptions.allowDrag = false;
            polylineOptions.polylineProps.clampToGround = true;
            polylineOptions.pointProps.heightReference = polylineOptions.clampHeightTo3DOptions.clampToTerrain ?
                HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND;
            polylineOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return polylineOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (points, polylineProps) => {
            const polyline = this.polylinesManager.get(id);
            polyline.setManually(points, polylineProps);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Polylines editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation(null);
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.polylinesManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPositions();
    }
    getPoints(id) {
        const polyline = this.polylinesManager.get(id);
        return polyline.getRealPoints();
    }
}
PolylinesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
PolylinesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorService, decorators: [{
            type: Injectable
        }] });

class PolylinesEditorComponent {
    constructor(polylinesEditor, coordinateConverter, mapEventsManager, cameraService, polylinesManager, cesiumService) {
        this.polylinesEditor = polylinesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.polylinesManager = polylinesManager;
        this.cesiumService = cesiumService;
        this.editPoints$ = new Subject();
        this.editPolylines$ = new Subject();
        this.polylineLabels$ = new Subject();
        this.polylinesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polylinesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.polylinesEditor.onUpdate().subscribe((update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(polyline, update, labels) {
        update.positions = polyline.getRealPositions();
        update.points = polyline.getRealPoints();
        if (labels) {
            polyline.labels = labels;
            this.polylineLabelsLayer.update(polyline, polyline.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        polyline.labels = this.editLabelsRenderFn(update, polyline.labels);
        this.polylineLabelsLayer.update(polyline, polyline.getId());
    }
    removeEditLabels(polyline) {
        polyline.labels = [];
        this.polylineLabelsLayer.remove(polyline.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.moveTempMovingPoint(update.updatedPosition);
                    polyline.addPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (update.updatedPosition) {
                    polyline.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.dispose();
                    this.removeEditLabels(polyline);
                    this.editLabelsRenderFn = undefined;
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const polyline = this.polylinesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(polyline, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const polyline = this.polylinesManager.get(update.id);
                this.renderEditLabels(polyline, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.polylinesManager.createEditablePolyline(update.id, this.editPointsLayer, this.editPolylinesLayer, this.coordinateConverter, update.polylineOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.movePointFinish(update.updatedPoint);
                    if (update.updatedPoint.isVirtualEditPoint()) {
                        polyline.changeVirtualPointToRealPoint(update.updatedPoint);
                        this.renderEditLabels(polyline, update);
                    }
                }
                break;
            }
            case EditActions.REMOVE_POINT: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.removePoint(update.updatedPoint);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = false;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline) {
                    polyline.enableEdit = true;
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const polyline = this.polylinesManager.get(update.id);
                if (polyline && polyline.enableEdit) {
                    polyline.endMoveShape();
                    this.renderEditLabels(polyline, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.polylinesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
PolylinesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorComponent, deps: [{ token: PolylinesEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: PolylinesManagerService }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
PolylinesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: PolylinesEditorComponent, selector: "polylines-editor", providers: [CoordinateConverter, PolylinesManagerService], viewQueries: [{ propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editPolylinesLayer", first: true, predicate: ["editPolylinesLayer"], descendants: true }, { propertyName: "polylineLabelsLayer", first: true, predicate: ["polylineLabelsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #polylineLabelsLayer acFor="let polylineLabels of polylineLabels$" [context]="this">
      <ac-array-desc acFor="let label of polylineLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcPolylineDescComponent, selector: "ac-polyline-desc" }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: PolylinesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'polylines-editor',
                    template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-desc
        props="{
        positions: polyline.getPositionsCallbackProperty(),
        width: polyline.props.width,
        material: polyline.props.material(),
        clampToGround: polyline.props.clampToGround,
        zIndex: polyline.props.zIndex,
        classificationType: polyline.props.classificationType,
      }"
      >
      </ac-polyline-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #polylineLabelsLayer acFor="let polylineLabels of polylineLabels$" [context]="this">
      <ac-array-desc acFor="let label of polylineLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                    providers: [CoordinateConverter, PolylinesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: PolylinesEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: PolylinesManagerService }, { type: CesiumService }]; }, propDecorators: { editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editPolylinesLayer: [{
                type: ViewChild,
                args: ['editPolylinesLayer']
            }], polylineLabelsLayer: [{
                type: ViewChild,
                args: ['polylineLabelsLayer']
            }] } });

class HippodromeManagerService {
    constructor() {
        this.hippodromes = new Map();
    }
    createEditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions) {
        const editableHippodrome = new EditableHippodrome(id, editHippodromeLayer, editPointsLayer, coordinateConverter, hippodromeEditOptions, positions);
        this.hippodromes.set(id, editableHippodrome);
    }
    get(id) {
        return this.hippodromes.get(id);
    }
    clear() {
        this.hippodromes.forEach(hippodrome => hippodrome.dispose());
        this.hippodromes.clear();
    }
}
HippodromeManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
HippodromeManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeManagerService, decorators: [{
            type: Injectable
        }] });

const DEFAULT_HIPPODROME_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    hippodromeProps: {
        fill: true,
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        outline: true,
        width: 200000.0,
        outlineWidth: 1,
        outlineColor: Color.WHITE.withAlpha(0.8),
        classificationType: ClassificationType.BOTH,
        zIndex: 0,
        shadows: ShadowMode.DISABLED,
    },
    pointProps: {
        color: Color.WHITE,
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
};
/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
class HippodromeEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, managerService) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.hippodromeManager = managerService;
        this.updatePublisher.connect();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_HIPPODROME_OPTIONS, eventPriority = 100) {
        const positions = [];
        const id = generateKey();
        const hippodromeOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeOptions,
        });
        const finishCreation = () => {
            const changeMode = {
                id,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(changeMode);
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editHippodrome(id, eventPriority, clientEditSubject, hippodromeOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: hippodromeOptions.addPointEvent,
            pickConfig: options.pickConfiguration,
            pick: PickOptions.NO_PICK,
            priority: eventPriority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            const isFirstPoint = this.getPositions(id).length === 0;
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            if (!isFirstPoint) {
                finishedCreate = finishCreation();
            }
        });
        return editorObservable;
    }
    edit(positions, options = DEFAULT_HIPPODROME_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Hippodrome editor error edit(): polygon should have 2 positions but received ' + positions);
        }
        const id = generateKey();
        const hippodromeEditOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            hippodromeOptions: hippodromeEditOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        return this.editHippodrome(id, priority, editSubject, hippodromeEditOptions);
    }
    editHippodrome(id, priority, editSubject, options, editObservable) {
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableHippodrome,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.hippodromeManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id), width: this.getWidth(id) }));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_HIPPODROME_OPTIONS));
        const hippodromeOptions = Object.assign(defaultClone, options);
        hippodromeOptions.hippodromeProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.hippodromeProps, options.hippodromeProps);
        hippodromeOptions.pointProps = Object.assign({}, DEFAULT_HIPPODROME_OPTIONS.pointProps, options.pointProps);
        return hippodromeOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (firstPosition, secondPosition, widthMeters, firstPointProp, secondPointProp) => {
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_HIPPODROME_OPTIONS.pointProps);
            const hippodrome = this.hippodromeManager.get(id);
            hippodrome.setPointsManually([firstP, secP], widthMeters);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Hippodrome editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation();
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.hippodromeManager.get(id).labels;
        observableToExtend.getCurrentWidth = () => this.getWidth(id);
        return observableToExtend;
    }
    getPositions(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPositions();
    }
    getPoints(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getRealPoints();
    }
    getWidth(id) {
        const hippodrome = this.hippodromeManager.get(id);
        return hippodrome.getWidth();
    }
}
HippodromeEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
HippodromeEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeEditorService, decorators: [{
            type: Injectable
        }] });

class HippodromeEditorComponent {
    constructor(hippodromesEditor, coordinateConverter, mapEventsManager, cameraService, hippodromesManager) {
        this.hippodromesEditor = hippodromesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.hippodromesManager = hippodromesManager;
        this.editPoints$ = new Subject();
        this.editHippodromes$ = new Subject();
        this.hippodromesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, hippodromesManager);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.hippodromesEditor.onUpdate().subscribe((update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(hippodrome, update, labels) {
        update.positions = hippodrome.getRealPositions();
        update.points = hippodrome.getRealPoints();
        if (labels) {
            hippodrome.labels = labels;
            this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        hippodrome.labels = this.editLabelsRenderFn(update, hippodrome.labels);
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    removeEditLabels(hippodrome) {
        hippodrome.labels = [];
        this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (update.updatedPosition) {
                    hippodrome.moveTempMovingPoint(update.updatedPosition);
                    hippodrome.addPoint(update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.dispose();
                    this.removeEditLabels(hippodrome);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(hippodrome, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const hippodrome = this.hippodromesManager.get(update.id);
                this.renderEditLabels(hippodrome, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.hippodromesManager.createEditableHippodrome(update.id, this.editPointsLayer, this.editHippodromesLayer, this.coordinateConverter, update.hippodromeOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMovePoint();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = false;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome) {
                    hippodrome.enableEdit = true;
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const hippodrome = this.hippodromesManager.get(update.id);
                if (hippodrome && hippodrome.enableEdit) {
                    hippodrome.endMoveShape();
                    this.renderEditLabels(hippodrome, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.hippodromesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
HippodromeEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeEditorComponent, deps: [{ token: HippodromeEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: HippodromeManagerService }], target: i0.ɵɵFactoryTarget.Component });
HippodromeEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: HippodromeEditorComponent, selector: "hippodrome-editor", providers: [CoordinateConverter, HippodromeManagerService], viewQueries: [{ propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }, { propertyName: "editHippodromesLayer", first: true, predicate: ["editHippodromesLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
      <ac-layer #editHippodromesLayer acFor="let hippodrome of editHippodromes$" [context]="this">
          <ac-corridor-desc props="{
            positions: hippodrome.getRealPositionsCallbackProperty(),
            cornerType: Cesium.CornerType.ROUNDED,
            material: hippodrome.hippodromeProps.material,
            width : hippodrome.hippodromeProps.width,
            outline: hippodrome.hippodromeProps.outline,
            outlineColor: hippodrome.hippodromeProps.outlineColor,
            outlineWidth: hippodrome.hippodromeProps.outlineWidth,
            height: 0,
            classificationType: hippodrome.hippodromeProps.classificationType,
            zIndex: hippodrome.hippodromeProps.zIndex,
            shadows: hippodrome.hippodromeProps.shadows,
    }">
          </ac-corridor-desc>

          <ac-array-desc acFor="let label of hippodrome.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }">
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>

      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc props="{
         position: point.getPositionCallbackProperty(),
         pixelSize: getPointSize(point),
         color: point.props.color,
         outlineColor: point.props.outlineColor,
         outlineWidth: point.props.outlineWidth,
         show: getPointShow(point),
         disableDepthTestDistance: point.props.disableDepthTestDistance,
         heightReference: point.props.heightReference,
    }">
          </ac-point-desc>
      </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcCorridorDescComponent, selector: "ac-corridor-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }, { type: AcPointDescComponent, selector: "ac-point-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HippodromeEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'hippodrome-editor',
                    template: /*html*/ `
      <ac-layer #editHippodromesLayer acFor="let hippodrome of editHippodromes$" [context]="this">
          <ac-corridor-desc props="{
            positions: hippodrome.getRealPositionsCallbackProperty(),
            cornerType: Cesium.CornerType.ROUNDED,
            material: hippodrome.hippodromeProps.material,
            width : hippodrome.hippodromeProps.width,
            outline: hippodrome.hippodromeProps.outline,
            outlineColor: hippodrome.hippodromeProps.outlineColor,
            outlineWidth: hippodrome.hippodromeProps.outlineWidth,
            height: 0,
            classificationType: hippodrome.hippodromeProps.classificationType,
            zIndex: hippodrome.hippodromeProps.zIndex,
            shadows: hippodrome.hippodromeProps.shadows,
    }">
          </ac-corridor-desc>

          <ac-array-desc acFor="let label of hippodrome.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }">
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>

      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc props="{
         position: point.getPositionCallbackProperty(),
         pixelSize: getPointSize(point),
         color: point.props.color,
         outlineColor: point.props.outlineColor,
         outlineWidth: point.props.outlineWidth,
         show: getPointShow(point),
         disableDepthTestDistance: point.props.disableDepthTestDistance,
         heightReference: point.props.heightReference,
    }">
          </ac-point-desc>
      </ac-layer>
  `,
                    providers: [CoordinateConverter, HippodromeManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: HippodromeEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: HippodromeManagerService }]; }, propDecorators: { editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }], editHippodromesLayer: [{
                type: ViewChild,
                args: ['editHippodromesLayer']
            }] } });

/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
class DraggableToMapService {
    constructor(document, mapsManager) {
        this.document = document;
        this.mapsManager = mapsManager;
        this.mainSubject = new Subject();
    }
    setCoordinateConverter(coordinateConverter) {
        this.coordinateConverter = coordinateConverter;
    }
    drag(imageSrc, style) {
        if (!this.coordinateConverter) {
            const mapComponent = this.mapsManager.getMap();
            if (mapComponent) {
                this.coordinateConverter = mapComponent.getCoordinateConverter();
            }
        }
        this.cancel();
        const imgElement = document.createElement('img');
        imgElement.src = imageSrc;
        imgElement.style.position = 'fixed';
        imgElement.style.visibility = 'hidden';
        imgElement.style.width = '30px';
        imgElement.style.height = '30px';
        imgElement.style['user-drag'] = 'none';
        imgElement.style['user-select'] = 'none';
        imgElement.style['-moz-user-select'] = 'none';
        imgElement.style['-webkit-user-drag'] = 'none';
        imgElement.style['-webkit-user-select'] = 'none';
        imgElement.style['-ms-user-select'] = 'none';
        Object.assign(imgElement.style, style);
        document.body.appendChild(imgElement);
        this.createDragObservable();
        this.dragObservable.subscribe((e) => {
            imgElement.style.visibility = 'visible';
            imgElement.style.left = e.screenPosition.x - imgElement.clientWidth / 2 + 'px';
            imgElement.style.top = e.screenPosition.y - imgElement.clientHeight / 2 + 'px';
            this.mainSubject.next(e);
            if (e.drop) {
                imgElement.remove();
            }
        }, (e) => {
            imgElement.remove();
        }, () => {
            imgElement.remove();
        });
    }
    dragUpdates() {
        return this.mainSubject;
    }
    cancel() {
        if (this.stopper) {
            this.stopper.next(true);
            this.stopper = undefined;
            this.dragObservable = undefined;
        }
    }
    createDragObservable() {
        const stopper = new Subject();
        const dropSubject = new Subject();
        const pointerUp = fromEvent(document, 'pointerup');
        const pointerMove = fromEvent(document, 'pointermove');
        let dragStartPositionX;
        let dragStartPositionY;
        let lastMove;
        const moveObservable = pointerMove.pipe(map((e) => {
            dragStartPositionX = dragStartPositionX ? dragStartPositionX : e.x;
            dragStartPositionY = dragStartPositionY ? dragStartPositionY : e.y;
            lastMove = {
                drop: false,
                initialScreenPosition: {
                    x: dragStartPositionX,
                    y: dragStartPositionY,
                },
                screenPosition: {
                    x: e.x,
                    y: e.y,
                },
                mapPosition: this.coordinateConverter ?
                    this.coordinateConverter.screenToCartesian3({ x: e.x, y: e.y }) : undefined,
            };
            return lastMove;
        }), takeUntil(pointerUp), tap(undefined, undefined, () => {
            if (lastMove) {
                const dropEvent = Object.assign({}, lastMove);
                dropEvent.drop = true;
                dropSubject.next(dropEvent);
            }
        }));
        this.dragObservable = moveObservable.pipe(merge$1(dropSubject), takeUntil(stopper));
        this.stopper = stopper;
    }
}
DraggableToMapService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService, deps: [{ token: DOCUMENT }, { token: MapsManagerService }], target: i0.ɵɵFactoryTarget.Injectable });
DraggableToMapService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: MapsManagerService }];
    } });

/**
 * This directive is used to allow dragging of icons from outside the map over the map
 * while being notified of the dragging position and drop position with an observable exposed from `DraggableToMapService`.
 * @Input {src: string, style?: any} | string -
 * the [src: string | string] should be the image src of the dragged image.
 * The style is an optional style object for the image.
 *
 * example:
 * ```
 * <a href="..." class="..." [draggableToMap]="{src: '../assets/GitHub-Mark-Light.png', style: {width: '50px', height: '50px'}}">
 *     <img class="github" src="../assets/GitHub-Mark-Light.png">
 * </a>
 * ```
 *
 * In order the get notified of the dragging location  and drop state subscribe to `DraggableToMapService.dragUpdates()`
 * ```
 *  this.iconDragService.dragUpdates().subscribe(e => console.log(e));
 * ```
 *
 * In order the cancel dragging use `DraggableToMapService.cancel()`
 * ```
 *  this.iconDragService.cancel();
 * ```
 */
class DraggableToMapDirective {
    constructor(el, iconDragService) {
        this.iconDragService = iconDragService;
        el.nativeElement.style['user-drag'] = 'none';
        el.nativeElement.style['user-select'] = 'none';
        el.nativeElement.style['-moz-user-select'] = 'none';
        el.nativeElement.style['-webkit-user-drag'] = 'none';
        el.nativeElement.style['-webkit-user-select'] = 'none';
        el.nativeElement.style['-ms-user-select'] = 'none';
    }
    ngOnInit() {
        if (typeof this.draggableToMap === 'string') {
            this.src = this.draggableToMap;
        }
        else {
            this.src = this.draggableToMap.src;
            this.style = this.draggableToMap.style;
        }
    }
    onMouseDown() {
        this.iconDragService.drag(this.src, this.style);
    }
}
DraggableToMapDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapDirective, deps: [{ token: i0.ElementRef }, { token: DraggableToMapService }], target: i0.ɵɵFactoryTarget.Directive });
DraggableToMapDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: DraggableToMapDirective, selector: "[draggableToMap]", inputs: { draggableToMap: "draggableToMap" }, host: { listeners: { "mousedown": "onMouseDown()" } }, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DraggableToMapDirective, decorators: [{
            type: Directive,
            args: [{ selector: '[draggableToMap]' }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: DraggableToMapService }]; }, propDecorators: { draggableToMap: [{
                type: Input
            }], onMouseDown: [{
                type: HostListener,
                args: ['mousedown']
            }] } });

/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
class AcToolbarButtonComponent {
    constructor() {
        this.onClick = new EventEmitter();
    }
    ngOnInit() {
    }
}
AcToolbarButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
AcToolbarButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: { iconUrl: "iconUrl", buttonClass: "buttonClass", iconClass: "iconClass" }, outputs: { onClick: "onClick" }, ngImport: i0, template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [".button-container{border-radius:1px;background-color:#fffc;height:30px;width:30px;padding:5px;transition:all .2s;cursor:pointer;display:flex;justify-content:center;align-items:center;flex-direction:column}.button-container:hover{background-color:#fffffff2}.icon{height:30px;width:30px}\n"], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-toolbar-button',
                    template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `,
                    styles: [`
        .button-container {
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            height: 30px;
            width: 30px;
            padding: 5px;
            transition: all 0.2s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .button-container:hover {
            background-color: rgba(255, 255, 255, 0.95);
        }

        .icon {
            height: 30px;
            width: 30px;
        }
    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { iconUrl: [{
                type: Input
            }], buttonClass: [{
                type: Input
            }], iconClass: [{
                type: Input
            }], onClick: [{
                type: Output
            }] } });

class DragIconComponent {
    constructor() {
    }
}
DragIconComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragIconComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
DragIconComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: DragIconComponent, selector: "ac-drag-icon", ngImport: i0, template: `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"  height="25"  width="25"
	 viewBox="0 0 476.737 476.737" style="enable-background:new 0 0 476.737 476.737;" xml:space="preserve">
<g>
	<g>
		<path style="fill:#010002;" d="M475.498,232.298l-3.401-5.149l-63.565-63.565c-6.198-6.198-16.304-6.198-22.47,0
			c-6.198,6.198-6.198,16.273,0,22.47l36.423,36.423H254.26V54.253l36.423,36.423c6.166,6.198,16.273,6.198,22.47,0
			c6.166-6.198,6.166-16.273,0-22.47L249.588,4.64l-0.159-0.095l-4.99-3.305L238.369,0h-0.064l-6.007,1.24l-4.99,3.305l-0.191,0.095
			l-63.565,63.565c-6.198,6.198-6.198,16.273,0,22.47s16.273,6.198,22.47,0l36.455-36.423v168.225H54.253l36.423-36.423
			c6.198-6.198,6.198-16.273,0-22.47s-16.273-6.198-22.47,0L4.64,227.149l-0.095,0.159l-3.305,4.99L0,238.369v0.064l1.24,6.007
			l3.305,4.958l0.095,0.191l63.565,63.565c6.198,6.198,16.273,6.198,22.47,0c6.198-6.166,6.198-16.273,0-22.47L54.253,254.26
			h168.225v168.225l-36.423-36.423c-6.198-6.166-16.273-6.166-22.47,0c-6.198,6.198-6.198,16.304,0,22.47l63.565,63.565l5.149,3.432
			l6.007,1.208h0.064l6.07-1.24l5.149-3.401l63.565-63.565c6.166-6.198,6.166-16.304,0-22.47c-6.198-6.198-16.304-6.198-22.47,0
			l-36.423,36.423V254.26h168.225l-36.423,36.423c-6.166,6.166-6.166,16.273,0,22.47c6.198,6.166,16.304,6.166,22.47,0
			l63.565-63.565l3.432-5.149l1.208-6.007v-0.064L475.498,232.298z"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
    `, isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DragIconComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-drag-icon',
                    template: `
        <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg"  x="0px" y="0px"  height="25"  width="25"
	 viewBox="0 0 476.737 476.737" style="enable-background:new 0 0 476.737 476.737;" xml:space="preserve">
<g>
	<g>
		<path style="fill:#010002;" d="M475.498,232.298l-3.401-5.149l-63.565-63.565c-6.198-6.198-16.304-6.198-22.47,0
			c-6.198,6.198-6.198,16.273,0,22.47l36.423,36.423H254.26V54.253l36.423,36.423c6.166,6.198,16.273,6.198,22.47,0
			c6.166-6.198,6.166-16.273,0-22.47L249.588,4.64l-0.159-0.095l-4.99-3.305L238.369,0h-0.064l-6.007,1.24l-4.99,3.305l-0.191,0.095
			l-63.565,63.565c-6.198,6.198-6.198,16.273,0,22.47s16.273,6.198,22.47,0l36.455-36.423v168.225H54.253l36.423-36.423
			c6.198-6.198,6.198-16.273,0-22.47s-16.273-6.198-22.47,0L4.64,227.149l-0.095,0.159l-3.305,4.99L0,238.369v0.064l1.24,6.007
			l3.305,4.958l0.095,0.191l63.565,63.565c6.198,6.198,16.273,6.198,22.47,0c6.198-6.166,6.198-16.273,0-22.47L54.253,254.26
			h168.225v168.225l-36.423-36.423c-6.198-6.166-16.273-6.166-22.47,0c-6.198,6.198-6.198,16.304,0,22.47l63.565,63.565l5.149,3.432
			l6.007,1.208h0.064l6.07-1.24l5.149-3.401l63.565-63.565c6.166-6.198,6.166-16.304,0-22.47c-6.198-6.198-16.304-6.198-22.47,0
			l-36.423,36.423V254.26h168.225l-36.423,36.423c-6.166,6.166-6.166,16.273,0,22.47c6.198,6.166,16.304,6.166,22.47,0
			l63.565-63.565l3.432-5.149l1.208-6.007v-0.064L475.498,232.298z"/>
	</g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
<g>
</g>
</svg>
    `,
                }]
        }], ctorParameters: function () { return []; } });

/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
class AcToolbarComponent {
    constructor(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.onDrag = new EventEmitter();
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    ngOnInit() {
        //this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        this.cesiumService.getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            this.listenForDragging();
        }
    }
    ngOnChanges(changes) {
        if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
            this.listenForDragging();
        }
        if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
            this.dragSubscription.unsubscribe();
        }
    }
    ngOnDestroy() {
        if (this.dragSubscription) {
            this.dragSubscription.unsubscribe();
        }
    }
    listenForDragging() {
        this.mouseDown$ = this.mouseDown$ || fromEvent(this.element.nativeElement, 'mousedown');
        this.mouseMove$ = this.mouseMove$ || fromEvent(document, 'mousemove');
        this.mouseUp$ = this.mouseUp$ || fromEvent(document, 'mouseup');
        this.drag$ = this.drag$ ||
            this.mouseDown$.pipe(switchMap(() => this.mouseMove$.pipe(tap(this.onDrag.emit), takeUntil(this.mouseUp$))));
        this.dragSubscription = this.drag$.subscribe((event) => {
            this.element.nativeElement.style.left = `${event.x}px`;
            this.element.nativeElement.style.top = `${event.y}px`;
        });
    }
}
AcToolbarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarComponent, deps: [{ token: i0.ElementRef }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcToolbarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcToolbarComponent, selector: "ac-toolbar", inputs: { toolbarClass: "toolbarClass", allowDrag: "allowDrag" }, outputs: { onDrag: "onDrag" }, usesOnChanges: true, ngImport: i0, template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [":host{position:absolute;top:20px;left:20px;width:20px;height:20px;z-index:999;-webkit-user-drag:none}\n"], components: [{ type: AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: ["iconUrl", "buttonClass", "iconClass"], outputs: ["onClick"] }, { type: DragIconComponent, selector: "ac-drag-icon" }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-toolbar',
                    template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
                    styles: [`
        :host {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 999;
            -webkit-user-drag: none;
        }
    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: CesiumService }]; }, propDecorators: { toolbarClass: [{
                type: Input
            }], allowDrag: [{
                type: Input
            }], onDrag: [{
                type: Output
            }] } });

/**
 *
 * Range and bearing component that is used to draw range and bearing on the map.
 * The inputs are used to customize the range and bearing style and behavior.
 * Create component reference and use the `create()` function to start creating R&B on the map.
 * The function receives an optional RangeAndBearingOptions object that defines the created range and bearing style and behavior
 * (on top of the default and global definitions).
 *
 * Usage:
 *
 * my-component.ts:
 *
 * ```
 * \@ViewChild('rangeAndBearing', {static: false}) private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
 *  // ...
 * this.rangeAndBearing.create({style: { pointProps: { pixelSize: 12 } }, bearingLabelsStyle: { fillColor: Color.GREEN } });
 * ```
 *
 * my-component.html
 * ```
 * <range-and-bearing #rangeAndBearing></range-and-bearing> // Optional inputs defines global style and behavior.
 * ```
 *
 */
class RangeAndBearingComponent {
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        const rnb = this.polylineEditor.create(Object.assign(Object.assign({ allowDrag: false, pointProps: {
                showVirtual: false,
                pixelSize: 8,
            }, polylineProps: {
                width: 2,
            } }, this.lineEditOptions), lineEditOptions));
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn(update => {
                const positions = update.positions;
                let totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? [...positions, update.updatedPosition]
                    : positions).reduce((labels, position, index, array) => {
                    if (index !== 0) {
                        const previousPosition = array[index - 1];
                        const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        const distance = Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push(Object.assign(Object.assign(Object.assign(Object.assign({ text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cartesian2(-20, -8), position: new Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2), fillColor: Color.WHITE, outlineColor: Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.bearingLabelsStyle), bearingLabelsStyle), Object.assign(Object.assign(Object.assign(Object.assign({ text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cartesian2(-35, -8), position: position, fillColor: Color.WHITE, outlineColor: Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.distanceLabelsStyle), distanceLabelsStyle));
                        totalDistance += distance;
                    }
                    return labels;
                }, [
                    Object.assign(Object.assign(Object.assign(Object.assign({ text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`, scale: 0.2, font: '80px Helvetica', pixelOffset: new Cartesian2(-20, -8), position: positions[0], fillColor: Color.WHITE, outlineColor: Color.WHITE, showBackground: true }, this.labelsStyle), labelsStyle), this.distanceLabelsStyle), distanceLabelsStyle),
                ]);
            });
        }
        return rnb;
    }
}
RangeAndBearingComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RangeAndBearingComponent, deps: [{ token: PolylinesEditorService }, { token: CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
RangeAndBearingComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: RangeAndBearingComponent, selector: "range-and-bearing", inputs: { lineEditOptions: "lineEditOptions", labelsStyle: "labelsStyle", distanceLabelsStyle: "distanceLabelsStyle", bearingLabelsStyle: "bearingLabelsStyle", bearingStringFn: "bearingStringFn", distanceStringFn: "distanceStringFn", labelsRenderFn: "labelsRenderFn" }, providers: [PolylinesEditorService], ngImport: i0, template: `
    <polylines-editor></polylines-editor>
  `, isInline: true, components: [{ type: PolylinesEditorComponent, selector: "polylines-editor" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RangeAndBearingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'range-and-bearing',
                    template: `
    <polylines-editor></polylines-editor>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [PolylinesEditorService],
                }]
        }], ctorParameters: function () { return [{ type: PolylinesEditorService }, { type: CoordinateConverter }]; }, propDecorators: { lineEditOptions: [{
                type: Input
            }], labelsStyle: [{
                type: Input
            }], distanceLabelsStyle: [{
                type: Input
            }], bearingLabelsStyle: [{
                type: Input
            }], bearingStringFn: [{
                type: Input
            }], distanceStringFn: [{
                type: Input
            }], labelsRenderFn: [{
                type: Input
            }] } });

/**
 * The Service is as a "zoom to rectangle" tool
 *
 * example:
 * ```
 * constructor(
 *   private cameraService: CameraService,
 *   private cesiumService: CesiumService,
 *   private zoomToRectangleService: ZoomToRectangleService,
 * ) {
 *   this.zoomToRectangleService.init(cesiumService, cameraService);
 * }
 * ...
 * this.zoomToRectangleService.activate({onComplete: () => this.zoomToRectangleService.disable()});
 * ```
 *
 * `init()` - initialize the service with CameraService and CesiumService.
 * If no mapId is provided to activate() - must be called before calling `activate()`.
 *
 * `disable()` - disables the tool.
 *
 * `activate()` -
 * @param options
 * {
 *  onStart - optional - a callback that will be called when the user start drawing the rectangle
 *  onComplete - optional - a callback that will be called when the tool zoom in
 *  autoDisableOnZoom - optional - determines if the tool should auto disable after zoom - default: true
 *  animationDurationInSeconds - optional - zoom animation duration in seconds - default: 0.5
 *  borderStyle - optional - the style of the rectangle element border - default: '3px dashed #FFFFFF'
 *  backgroundColor - optional - the background color of the rectangle element - default: 'transparent'
 *  resetKeyCode - optional - the key code of the key that is used to reset the drawing of the rectangle - default: 27 (ESC key)
 *  threshold - optional - the minimum area of the screen rectangle (in pixels) that is required to perform zoom - default: 9
 *  keepRotation - optional - whether or not to keep the rotation when zooming in - default: true
 *  mouseButton - optional - sets the mouse button for drawing the rectangle - default: left mouse button (0)
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */
var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["LEFT"] = 0] = "LEFT";
    MouseButtons[MouseButtons["MIDDLE"] = 1] = "MIDDLE";
    MouseButtons[MouseButtons["RIGHT"] = 2] = "RIGHT";
})(MouseButtons || (MouseButtons = {}));
class ZoomToRectangleService {
    constructor(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
            threshold: 9,
            keepRotation: true,
            mouseButton: MouseButtons.LEFT,
        };
    }
    init(cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    }
    activate(options = {}, mapId) {
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        const finalOptions = Object.assign({}, this.defaultOptions, options);
        let cameraService = this.cameraService;
        let mapContainer;
        let map;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
        }
        if (!mapId) {
            map = this.mapsManager.getMap();
            mapId = map.getId();
        }
        else {
            map = this.mapsManager.getMap(mapId);
            if (!map) {
                throw new Error(`Map not found with id: ${mapId}`);
            }
        }
        cameraService = map.getCameraService();
        mapContainer = map.getCesiumViewer().container;
        if (!cameraService || !mapContainer) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        this.disable(mapId);
        const container = document.createElement('div');
        mapContainer.style.position = 'relative';
        container.style.position = 'absolute';
        container.style.width = '100%';
        container.style.height = '100%';
        container.style.top = '0';
        container.style.left = '0';
        mapContainer.appendChild(container);
        const mapZoomData = { container };
        this.mapsZoomElements.set(mapId, mapZoomData);
        let mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        let borderElement;
        container.onmousedown = e => {
            if (e.button !== finalOptions.mouseButton) {
                return;
            }
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                mouse.startX = offsetX;
                mouse.startY = offsetY;
                borderElement = document.createElement('div');
                borderElement.className = 'zoom-to-rectangle-border';
                borderElement.style.position = 'absolute';
                borderElement.style.border = finalOptions.borderStyle;
                borderElement.style.backgroundColor = finalOptions.backgroundColor;
                borderElement.style.left = mouse.startX + 'px';
                borderElement.style.top = mouse.startY + 'px';
                container.appendChild(borderElement);
                mapZoomData.borderElement = borderElement;
            }
        };
        container.onmouseup = e => {
            if (borderElement) {
                let zoomApplied;
                if (mouse && Math.abs(mouse.endX - mouse.startX) * Math.abs(mouse.endY - mouse.startY) > finalOptions.threshold) {
                    zoomApplied = this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds, finalOptions);
                }
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
                if (!!finalOptions.onComplete) {
                    finalOptions.onComplete(map);
                }
                if (finalOptions.autoDisableOnZoom && zoomApplied) {
                    this.disable(mapId);
                }
            }
        };
        container.onmousemove = e => {
            if (borderElement) {
                const rect = e.currentTarget.getBoundingClientRect();
                const offsetX = e.clientX - rect.left;
                const offsetY = e.clientY - rect.top;
                mouse.endX = offsetX;
                mouse.endY = offsetY;
                borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
                borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
                borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
                borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
            }
        };
        const resetOnEscapePress = e => {
            if (e.keyCode === finalOptions.resetKeyCode && borderElement) {
                borderElement.remove();
                borderElement = undefined;
                mapZoomData.borderElement = undefined;
                mouse = {
                    endX: 0,
                    endY: 0,
                    startX: 0,
                    startY: 0,
                };
            }
        };
        document.addEventListener('keydown', resetOnEscapePress);
        mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
    }
    disable(mapId) {
        if (!this.mapsManager && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
        }
        if (!mapId) {
            const map = this.mapsManager.getMap();
            mapId = map.getId();
        }
        const data = this.mapsZoomElements.get(mapId);
        if (data) {
            data.container.remove();
            if (data.borderElement) {
                data.borderElement.remove();
            }
            if (data.resetOnEscapePressFunc) {
                document.removeEventListener('keydown', data.resetOnEscapePressFunc);
            }
        }
        this.mapsZoomElements.delete(mapId);
    }
    zoomCameraToRectangle(cameraService, positions, animationDuration, options) {
        const camera = cameraService.getCamera();
        const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        const cartographic1 = Cartographic.fromCartesian(cartesian1);
        const cartographic2 = Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            orientation: options.keepRotation ? { heading: camera.heading } : undefined,
            duration: animationDuration,
        });
        return true;
    }
}
ZoomToRectangleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService, deps: [{ token: MapsManagerService }, { token: CameraService, optional: true }, { token: CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ZoomToRectangleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: MapsManagerService }, { type: CameraService, decorators: [{
                        type: Optional
                    }] }, { type: CesiumService, decorators: [{
                        type: Optional
                    }] }];
    } });

class RectanglesManagerService {
    constructor() {
        this.rectangles = new Map();
    }
    createEditableRectangle(id, editRectanglesLayer, editPointsLayer, coordinateConverter, rectangleOptions, positions) {
        const editableRectangle = new EditableRectangle(id, editPointsLayer, editRectanglesLayer, coordinateConverter, rectangleOptions, positions);
        this.rectangles.set(id, editableRectangle);
    }
    dispose(id) {
        this.rectangles.get(id).dispose();
        this.rectangles.delete(id);
    }
    get(id) {
        return this.rectangles.get(id);
    }
    clear() {
        this.rectangles.forEach(rectangle => rectangle.dispose());
        this.rectangles.clear();
    }
}
RectanglesManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RectanglesManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesManagerService, decorators: [{
            type: Injectable
        }] });

const DEFAULT_RECTANGLE_OPTIONS = {
    addPointEvent: CesiumEvent.LEFT_CLICK,
    dragPointEvent: CesiumEvent.LEFT_CLICK_DRAG,
    dragShapeEvent: CesiumEvent.LEFT_CLICK_DRAG,
    allowDrag: true,
    pointProps: {
        color: Color.WHITE,
        outlineColor: Color.BLACK.withAlpha(0.2),
        outlineWidth: 1,
        pixelSize: 13,
        virtualPointPixelSize: 8,
        show: true,
        showVirtual: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
    },
    rectangleProps: {
        height: 0,
        extrudedHeight: 0,
        material: Color.CORNFLOWERBLUE.withAlpha(0.4),
        fill: true,
        classificationType: ClassificationType.BOTH,
        outline: true,
        outlineColor: Color.WHITE,
        zIndex: 0,
    },
    clampHeightTo3D: false,
    clampHeightTo3DOptions: {
        clampToTerrain: false,
    },
};
/**
 * Service for creating editable rectangles
 *
 * You must provide `RectanglesEditorService` yourself.
 * RectanglesEditorService works together with `<rectangles-editor>` component. Therefor you need to create `<rectangles-editor>`
 * for each `RectanglesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `RectangleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `RectangleEditorObservable`.
 * + To stop editing call `dsipose()` from the `RectangleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `RectangleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating rectangle
 *  const editing$ = rectanglesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit rectangle from existing rectangle positions
 *  const editing$ = this.rectanglesEditorService.edit(initialPos);
 *
 * ```
 */
class RectanglesEditorService {
    constructor() {
        this.updateSubject = new Subject();
        this.updatePublisher = publish()(this.updateSubject); // TODO maybe not needed
        this.observablesMap = new Map();
    }
    init(mapEventsManager, coordinateConverter, cameraService, rectanglesManager, cesiumViewer) {
        this.mapEventsManager = mapEventsManager;
        this.coordinateConverter = coordinateConverter;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.updatePublisher.connect();
        this.cesiumScene = cesiumViewer.getScene();
    }
    onUpdate() {
        return this.updatePublisher;
    }
    create(options = DEFAULT_RECTANGLE_OPTIONS, priority = 100) {
        const positions = [];
        const id = generateKey();
        const rectangleOptions = this.setOptions(options);
        const clientEditSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.CREATE
        });
        let finishedCreate = false;
        this.updateSubject.next({
            id,
            positions,
            editMode: EditModes.CREATE,
            editAction: EditActions.INIT,
            rectangleOptions: rectangleOptions,
        });
        const finishCreation = () => {
            const changeMode = {
                id,
                editMode: EditModes.CREATE,
                editAction: EditActions.CHANGE_TO_EDIT,
            };
            this.updateSubject.next(changeMode);
            clientEditSubject.next(changeMode);
            if (this.observablesMap.has(id)) {
                this.observablesMap.get(id).forEach(registration => registration.dispose());
            }
            this.observablesMap.delete(id);
            this.editRectangle(id, positions, priority, clientEditSubject, rectangleOptions, editorObservable);
            finishedCreate = true;
            return finishedCreate;
        };
        const mouseMoveRegistration = this.mapEventsManager.register({
            event: CesiumEvent.MOUSE_MOVE,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        const addPointRegistration = this.mapEventsManager.register({
            event: rectangleOptions.addPointEvent,
            pick: PickOptions.NO_PICK,
            pickConfig: options.pickConfiguration,
            priority,
        });
        this.observablesMap.set(id, [mouseMoveRegistration, addPointRegistration]);
        const editorObservable = this.createEditorObservable(clientEditSubject, id, finishCreation);
        mouseMoveRegistration.subscribe(({ movement: { endPosition } }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (position) {
                this.updateSubject.next({
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.CREATE,
                    updatedPosition: position,
                    editAction: EditActions.MOUSE_MOVE,
                });
            }
        });
        addPointRegistration.subscribe(({ movement: { endPosition } }) => {
            if (finishedCreate) {
                return;
            }
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            const allPositions = this.getPositions(id);
            const isFirstPoint = this.getPositions(id).length === 0;
            const updateValue = {
                id,
                positions: allPositions,
                editMode: EditModes.CREATE,
                updatedPosition: position,
                editAction: EditActions.ADD_POINT,
            };
            this.updateSubject.next(updateValue);
            clientEditSubject.next(Object.assign(Object.assign({}, updateValue), { positions: this.getPositions(id), points: this.getPoints(id) }));
            if (!isFirstPoint) {
                finishedCreate = finishCreation();
            }
        });
        return editorObservable;
    }
    edit(positions, options = DEFAULT_RECTANGLE_OPTIONS, priority = 100) {
        if (positions.length !== 2) {
            throw new Error('Rectangles editor error edit(): rectangle should have at least 2 positions');
        }
        const id = generateKey();
        const rectangleOptions = this.setOptions(options);
        const editSubject = new BehaviorSubject({
            id,
            editAction: null,
            editMode: EditModes.EDIT
        });
        const update = {
            id,
            positions: positions,
            editMode: EditModes.EDIT,
            editAction: EditActions.INIT,
            rectangleOptions: rectangleOptions,
        };
        this.updateSubject.next(update);
        editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        return this.editRectangle(id, positions, priority, editSubject, rectangleOptions);
    }
    editRectangle(id, positions, priority, editSubject, options, editObservable) {
        const pointDragRegistration = this.mapEventsManager.register({
            event: options.dragPointEvent,
            entityType: EditPoint,
            pick: PickOptions.PICK_FIRST,
            pickConfig: options.pickConfiguration,
            priority,
            pickFilter: entity => id === entity.editedEntityId,
        });
        let shapeDragRegistration;
        if (options.allowDrag) {
            shapeDragRegistration = this.mapEventsManager.register({
                event: options.dragShapeEvent,
                entityType: EditableRectangle,
                pick: PickOptions.PICK_FIRST,
                pickConfig: options.pickConfiguration,
                priority,
                pickFilter: entity => id === entity.id,
            });
        }
        pointDragRegistration.pipe(tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
            .subscribe(({ movement: { endPosition, drop }, entities }) => {
            const position = this.coordinateConverter.screenToCartesian3(endPosition);
            if (!position) {
                return;
            }
            const point = entities[0];
            const update = {
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                updatedPosition: position,
                updatedPoint: point,
                editAction: drop ? EditActions.DRAG_POINT_FINISH : EditActions.DRAG_POINT,
            };
            this.updateSubject.next(update);
            editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
        });
        if (shapeDragRegistration) {
            shapeDragRegistration
                .pipe(tap(({ movement: { drop } }) => this.rectanglesManager.get(id).enableEdit && this.cameraService.enableInputs(drop)))
                .subscribe(({ movement: { startPosition, endPosition, drop }, entities }) => {
                const endDragPosition = this.coordinateConverter.screenToCartesian3(endPosition);
                const startDragPosition = this.coordinateConverter.screenToCartesian3(startPosition);
                if (!endDragPosition) {
                    return;
                }
                const update = {
                    id,
                    positions: this.getPositions(id),
                    editMode: EditModes.EDIT,
                    updatedPosition: endDragPosition,
                    draggedPosition: startDragPosition,
                    editAction: drop ? EditActions.DRAG_SHAPE_FINISH : EditActions.DRAG_SHAPE,
                };
                this.updateSubject.next(update);
                editSubject.next(Object.assign(Object.assign({}, update), { positions: this.getPositions(id), points: this.getPoints(id) }));
            });
        }
        const observables = [pointDragRegistration];
        if (shapeDragRegistration) {
            observables.push(shapeDragRegistration);
        }
        this.observablesMap.set(id, observables);
        return editObservable || this.createEditorObservable(editSubject, id);
    }
    setOptions(options) {
        const defaultClone = JSON.parse(JSON.stringify(DEFAULT_RECTANGLE_OPTIONS));
        const rectangleOptions = Object.assign(defaultClone, options);
        rectangleOptions.pointProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.pointProps, options.pointProps);
        rectangleOptions.rectangleProps = Object.assign({}, DEFAULT_RECTANGLE_OPTIONS.rectangleProps, options.rectangleProps);
        if (options.clampHeightTo3D) {
            if (!this.cesiumScene.pickPositionSupported || !this.cesiumScene.clampToHeightSupported) {
                throw new Error(`Cesium pickPosition and clampToHeight must be supported to use clampHeightTo3D`);
            }
            if (this.cesiumScene.pickTranslucentDepth) {
                console.warn(`Cesium scene.pickTranslucentDepth must be false in order to make the editors work properly on 3D`);
            }
            if (rectangleOptions.pointProps.color.alpha === 1 || rectangleOptions.pointProps.outlineColor.alpha === 1) {
                console.warn('Point color and outline color must have alpha in order to make the editor work properly on 3D');
            }
            rectangleOptions.pointProps.heightReference = rectangleOptions.clampHeightTo3DOptions.clampToTerrain ?
                HeightReference.CLAMP_TO_GROUND : HeightReference.RELATIVE_TO_GROUND;
            rectangleOptions.pointProps.disableDepthTestDistance = Number.POSITIVE_INFINITY;
        }
        return rectangleOptions;
    }
    createEditorObservable(observableToExtend, id, finishCreation) {
        observableToExtend.dispose = () => {
            const observables = this.observablesMap.get(id);
            if (observables) {
                observables.forEach(obs => obs.dispose());
            }
            this.observablesMap.delete(id);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.DISPOSE,
            });
        };
        observableToExtend.enable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.ENABLE,
            });
        };
        observableToExtend.disable = () => {
            this.updateSubject.next({
                id,
                positions: this.getPositions(id),
                editMode: EditModes.EDIT,
                editAction: EditActions.DISABLE,
            });
        };
        observableToExtend.setManually = (firstPosition, secondPosition, firstPointProp, secondPointProp) => {
            const firstP = new EditPoint(id, firstPosition, firstPointProp ? firstPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            const secP = new EditPoint(id, secondPosition, secondPointProp ? secondPointProp : DEFAULT_RECTANGLE_OPTIONS.pointProps);
            const rectangle = this.rectanglesManager.get(id);
            rectangle.setPointsManually([firstP, secP]);
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_MANUALLY,
            });
        };
        observableToExtend.setLabelsRenderFn = (callback) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.SET_EDIT_LABELS_RENDER_CALLBACK,
                labelsRenderFn: callback,
            });
        };
        observableToExtend.updateLabels = (labels) => {
            this.updateSubject.next({
                id,
                editMode: EditModes.CREATE_OR_EDIT,
                editAction: EditActions.UPDATE_EDIT_LABELS,
                updateLabels: labels,
            });
        };
        observableToExtend.finishCreation = () => {
            if (!finishCreation) {
                throw new Error('Rectangles editor error edit(): cannot call finishCreation() on edit');
            }
            return finishCreation();
        };
        observableToExtend.getCurrentPoints = () => this.getPoints(id);
        observableToExtend.getEditValue = () => observableToExtend.getValue();
        observableToExtend.getLabels = () => this.rectanglesManager.get(id).labels;
        return observableToExtend;
    }
    getPositions(id) {
        const rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPositions();
    }
    getPoints(id) {
        const rectangle = this.rectanglesManager.get(id);
        return rectangle.getRealPoints();
    }
}
RectanglesEditorService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesEditorService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
RectanglesEditorService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesEditorService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesEditorService, decorators: [{
            type: Injectable
        }] });

class RectanglesEditorComponent {
    constructor(rectanglesEditor, coordinateConverter, mapEventsManager, cameraService, rectanglesManager, cesiumService) {
        this.rectanglesEditor = rectanglesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.rectanglesManager = rectanglesManager;
        this.cesiumService = cesiumService;
        this.editPoints$ = new Subject();
        this.editRectangles$ = new Subject();
        this.rectanglesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.rectanglesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.rectanglesEditor.onUpdate().subscribe((update) => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(rectangle, update, labels) {
        update.positions = rectangle.getRealPositions();
        update.points = rectangle.getRealPoints();
        if (labels) {
            rectangle.labels = labels;
            this.editRectanglesLayer.update(rectangle, rectangle.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        rectangle.labels = this.editLabelsRenderFn(update, rectangle.labels);
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    }
    removeEditLabels(rectangle) {
        rectangle.labels = [];
        this.editRectanglesLayer.update(rectangle, rectangle.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.moveTempMovingPoint(update.updatedPosition);
                    rectangle.addPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (update.updatedPosition) {
                    rectangle.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.dispose();
                    this.removeEditLabels(rectangle);
                }
                this.editLabelsRenderFn = undefined;
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(rectangle, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const rectangle = this.rectanglesManager.get(update.id);
                this.renderEditLabels(rectangle, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.rectanglesManager.createEditableRectangle(update.id, this.editRectanglesLayer, this.editPointsLayer, this.coordinateConverter, update.rectangleOptions, update.positions);
                break;
            }
            case EditActions.DRAG_POINT: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.movePoint(update.updatedPosition, update.updatedPoint);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_POINT_FINISH: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMovePoint();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = false;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle) {
                    rectangle.enableEdit = true;
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.moveShape(update.draggedPosition, update.updatedPosition);
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const rectangle = this.rectanglesManager.get(update.id);
                if (rectangle && rectangle.enableEdit) {
                    rectangle.endMoveShape();
                    this.renderEditLabels(rectangle, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.rectanglesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
RectanglesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesEditorComponent, deps: [{ token: RectanglesEditorService }, { token: CoordinateConverter }, { token: MapEventsManagerService }, { token: CameraService }, { token: RectanglesManagerService }, { token: CesiumService }], target: i0.ɵɵFactoryTarget.Component });
RectanglesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: RectanglesEditorComponent, selector: "rectangles-editor", providers: [CoordinateConverter, RectanglesManagerService], viewQueries: [{ propertyName: "editRectanglesLayer", first: true, predicate: ["editRectanglesLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editRectanglesLayer acFor="let rectangle of editRectangles$" [context]="this">
      <ac-rectangle-desc
        props="{
          coordinates: rectangle.getRectangleCallbackProperty(),
          material: rectangle.rectangleProps.material,
          fill: rectangle.rectangleProps.fill,
          classificationType: rectangle.rectangleProps.classificationType,
          zIndex: rectangle.rectangleProps.zIndex,
          outline: rectangle.rectangleProps.outline,
          outlineColor: rectangle.rectangleProps.outlineColor,
          height: rectangle.rectangleProps.height,
          extrudedHeight: rectangle.rectangleProps.extrudedHeight
        }"
      >
      </ac-rectangle-desc>
      <ac-array-desc acFor="let label of rectangle.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `, isInline: true, components: [{ type: AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: AcPointDescComponent, selector: "ac-point-desc" }, { type: AcRectangleDescComponent, selector: "ac-rectangle-desc" }, { type: AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RectanglesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'rectangles-editor',
                    template: /*html*/ `
    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPositionCallbackProperty(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point),
        disableDepthTestDistance: point.props.disableDepthTestDistance,
        heightReference: point.props.heightReference,
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editRectanglesLayer acFor="let rectangle of editRectangles$" [context]="this">
      <ac-rectangle-desc
        props="{
          coordinates: rectangle.getRectangleCallbackProperty(),
          material: rectangle.rectangleProps.material,
          fill: rectangle.rectangleProps.fill,
          classificationType: rectangle.rectangleProps.classificationType,
          zIndex: rectangle.rectangleProps.zIndex,
          outline: rectangle.rectangleProps.outline,
          outlineColor: rectangle.rectangleProps.outlineColor,
          height: rectangle.rectangleProps.height,
          extrudedHeight: rectangle.rectangleProps.extrudedHeight
        }"
      >
      </ac-rectangle-desc>
      <ac-array-desc acFor="let label of rectangle.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
            backgroundColor: label.backgroundColor,
            backgroundPadding: label.backgroundPadding,
            distanceDisplayCondition: label.distanceDisplayCondition,
            eyeOffset: label.eyeOffset,
            fillColor: label.fillColor,
            font: label.font,
            heightReference: label.heightReference,
            horizontalOrigin: label.horizontalOrigin,
            outlineColor: label.outlineColor,
            outlineWidth: label.outlineWidth,
            pixelOffset: label.pixelOffset,
            pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
            scale: label.scale,
            scaleByDistance: label.scaleByDistance,
            show: label.show,
            showBackground: label.showBackground,
            style: label.style,
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
                    providers: [CoordinateConverter, RectanglesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: RectanglesEditorService }, { type: CoordinateConverter }, { type: MapEventsManagerService }, { type: CameraService }, { type: RectanglesManagerService }, { type: CesiumService }]; }, propDecorators: { editRectanglesLayer: [{
                type: ViewChild,
                args: ['editRectanglesLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });

class AngularCesiumWidgetsModule {
}
AngularCesiumWidgetsModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularCesiumWidgetsModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, declarations: [PointsEditorComponent,
        HippodromeEditorComponent,
        PolygonsEditorComponent,
        RectanglesEditorComponent,
        CirclesEditorComponent,
        EllipsesEditorComponent,
        PolylinesEditorComponent,
        DraggableToMapDirective,
        DragIconComponent,
        AcToolbarComponent,
        AcToolbarButtonComponent,
        RangeAndBearingComponent], imports: [CommonModule, AngularCesiumModule], exports: [PointsEditorComponent,
        HippodromeEditorComponent,
        PolygonsEditorComponent,
        RectanglesEditorComponent,
        CirclesEditorComponent,
        EllipsesEditorComponent,
        PolylinesEditorComponent,
        DraggableToMapDirective,
        AcToolbarComponent,
        AcToolbarButtonComponent,
        RangeAndBearingComponent] });
AngularCesiumWidgetsModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, providers: [
        DraggableToMapService,
        ZoomToRectangleService,
    ], imports: [[CommonModule, AngularCesiumModule]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumWidgetsModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [CommonModule, AngularCesiumModule],
                    declarations: [
                        PointsEditorComponent,
                        HippodromeEditorComponent,
                        PolygonsEditorComponent,
                        RectanglesEditorComponent,
                        CirclesEditorComponent,
                        EllipsesEditorComponent,
                        PolylinesEditorComponent,
                        DraggableToMapDirective,
                        DragIconComponent,
                        AcToolbarComponent,
                        AcToolbarButtonComponent,
                        RangeAndBearingComponent,
                    ],
                    exports: [
                        PointsEditorComponent,
                        HippodromeEditorComponent,
                        PolygonsEditorComponent,
                        RectanglesEditorComponent,
                        CirclesEditorComponent,
                        EllipsesEditorComponent,
                        PolylinesEditorComponent,
                        DraggableToMapDirective,
                        AcToolbarComponent,
                        AcToolbarButtonComponent,
                        RangeAndBearingComponent,
                    ],
                    providers: [
                        DraggableToMapService,
                        ZoomToRectangleService,
                    ]
                }]
        }] });

/*
 * Public API Surface of angular-cesium
 */

/**
 * Generated bundle index. Do not edit.
 */

export { AcArcComponent, AcArcDescComponent, AcArrayDescComponent, AcBillboardComponent, AcBillboardDescComponent, AcBillboardPrimitiveDescComponent, AcBoxDescComponent, AcCircleComponent, AcCircleDescComponent, AcCorridorDescComponent, AcCylinderDescComponent, AcCzmlDescComponent, AcDefaultPlonterComponent, AcDynamicCircleDescComponent, AcDynamicEllipseDescComponent, AcDynamicPolylineDescComponent, AcEllipseComponent, AcEllipseDescComponent, AcEllipsoidDescComponent, AcEntity, AcHtmlComponent, AcHtmlDescComponent, AcLabelComponent, AcLabelDescComponent, AcLabelPrimitiveDescComponent, AcLayerComponent, AcMapComponent, AcMapLayerProviderComponent, AcMapTerrainProviderComponent, AcModelDescComponent, AcNotification, AcPointComponent, AcPointDescComponent, AcPointPrimitiveDescComponent, AcPolygonComponent, AcPolygonDescComponent, AcPolylineComponent, AcPolylineDescComponent, AcPolylinePrimitiveDescComponent, AcPolylineVolumeDescComponent, AcPrimitivePolylineComponent, AcRectangleComponent, AcRectangleDescComponent, AcStaticCircleDescComponent, AcStaticEllipseDescComponent, AcStaticPolygonDescComponent, AcStaticPolylineDescComponent, AcTileset3dComponent, AcToolbarButtonComponent, AcToolbarComponent, AcWallDescComponent, ActionType, AngularCesiumModule, AngularCesiumWidgetsModule, CameraService, CesiumEvent, CesiumEventModifier, CesiumService, CircleEditorObservable, CirclesEditorComponent, CirclesEditorService, ContextMenuService, CoordinateConverter, DEFAULT_CIRCLE_OPTIONS, DEFAULT_ELLIPSE_OPTIONS, DEFAULT_HIPPODROME_OPTIONS, DEFAULT_POINT_OPTIONS, DEFAULT_POLYGON_OPTIONS, DEFAULT_POLYLINE_OPTIONS, DEFAULT_RECTANGLE_OPTIONS, DisposableObservable, DraggableToMapDirective, DraggableToMapService, EditActions, EditArc, EditModes, EditPoint, EditPolyline, EditableCircle, EditableEllipse, EditableHippodrome, EditablePoint, EditablePolygon, EditablePolyline, EditableRectangle, EditorObservable, EllipseEditorObservable, EllipsesEditorComponent, EllipsesEditorService, GeoUtilsService, HippodromeEditorComponent, HippodromeEditorObservable, HippodromeEditorService, KeyboardAction, KeyboardControlService, MapEventsManagerService, MapLayerProviderOptions, MapTerrainProviderOptions, MapsManagerService, MouseButtons, PREDEFINED_KEYBOARD_ACTIONS, PickOptions, PixelOffsetPipe, PlonterService, PointEditorObservable, PointsEditorComponent, PointsEditorService, PolygonEditorObservable, PolygonsEditorComponent, PolygonsEditorService, PolylineEditorObservable, PolylinesEditorComponent, PolylinesEditorService, RadiansToDegreesPipe, RangeAndBearingComponent, RectangleEditorObservable, RectanglesEditorComponent, RectanglesEditorService, SceneMode, ScreenshotService, SelectionManagerService, ViewerConfiguration, ZoomToRectangleService, defaultLabelProps };
//# sourceMappingURL=auscope-angular-cesium.mjs.map
