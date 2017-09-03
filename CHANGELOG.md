## 0.0.21
### Features
* Allow `KeyboardControlService` to run outside of angular zone. 

## 0.0.20
### Features
* Added `enableInput()`, `enableZoom()` to `CameraService`.

### Fixes
* Fixed bug removed default height 0
* Fixed AngularCesiumModule loading
* Fixed `npm run server`

### Breaking Changes
* Renamed `ModuleOptions` to `ModuleConfiguration`. 

## 0.0.19
### Features
* Added `done` callback to `KeyboardControlService` definitions - now it's possible to know when the event is done.
* Added internal `IGNORED` state to `KeyboardControlService` - now when action returns `false` it will ignore it until the next event cycle (keydown then keyup)
* Added zIndex to `<ac-layer [zIndex]="1"/>`, ability to control the layers order. 
* Added `CameraService` that is provided by `ac-map`. The service exposes the scene's camera and screenSpaceCameraController.
* Added `[sceneMode]` attribute to `ac-map` .
* Added new components: `ac-billboard-primitive-desc`, `ac-label-primitive-desc`, `ac-polyline-primitive-desc`. The components uses Cesium Primitives for performance efficient drawing of map entities.

### Breaking Changes
* Event triggered from `KeyboardControlService` is now triggered with `cesiumService: CesiumService, key: string, keyboardEvent: KeyboardEvent`.
* CesiumService no longer supports camera actions such as `setEnableTilt`, `setMaximumZoom`, etc... - instead use CameraService that is provided by `ac-map`.
* `ac-map` function `getMapEventManager()` renamed to `getMapEventsManager()`
* `maximumZoom`, `minimumZoom` and `enableTilt` attributes in `ac-map` were removed. use `CameraService` instead.  
* `ViewersManagerService` renamed into `MapsManagerService`. It now manage ac-map instances. Internal functions changed accordingly to `getMap()` and `registerMap()`. The logic remained the same.
* `AngularCesiumModule` should be loaded with `.forRoot()`. Additionally, `AngularCesiumModule.forRoot()` takes options of type `ModuleOptions`. Fixes cesium [bug](https://github.com/AnalyticalGraphicsInc/cesium/pull/5736) (height=0 on entities creates entities with shadows,shadows cant be turn off).  

## 0.0.18
### Features
* Exposed `onDraw` and `onRemove` for `BasicDesc` component - now it's possible to know when an Cesium object is drawn.
* Exposed `getCesiumObjectsMap` from `BasicDesc` component.
* Added drag and drop event to `MapEventManagerService`
* Added new drawable entities:
  * `ac-box-dec`
  * `ac-corridor-dec`
  * `ac-cylinder-dec`
  * `ac-ellipsoid-dec`
  * `ac-polyline-volume-dec`
  * `ac-wall-dec`
  * `ac-rectangle-dec`

## 0.0.15
### Features
* Expose `MapEventManagerService` from `<ac-map #map/>` component reference: `acMapComponent.getMapEventManager()`
* New `KeyboardControlService` for controlling the camera using the keyboard
* add `<ac-3d-tile-layer/>` for 3d tiles

## 0.0.14
### Breaking changes 
* deprecated: 
  * AcStaticEllipseDescComponent, instead use `ac-ellipse-desc`
  * AcDynamicPolylineDescComponent, instead use `ac-polyline-desc`
  * AcStaticPolylineDescComponent, instead use `ac-polyline-desc`
  * AcStaticCircleDescComponent, instead use `ac-circle-desc`
  * AcStaticPolygonDescComponent, instead use `ac-polygon-desc`
* MapEventManagerService: EventResult.primitives changed to EventResult.cesiumEntities
* `ac-polyline-desc` and `ac-polyline` accept Cesium.Color as material in props input.

### Features 
* support models `ac-model-desc`

## 0.0.13
### Features
* ac-map-layer-provider - Support all cesium imagery providers
* Expose cesium viewer through ViewesManagerService and `ac-map`

## 0.0.12 (30-7-17)
### Breaking changes
* AcEntity id filed changed to string from number
* AcNotification id filed changed to string from number
