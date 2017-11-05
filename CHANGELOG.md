## NEXT
### Fixes
* Fixed a bug in editors.

### Features
* Added customizable labels to shape editors.

## 0.0.32
### Features
* Polyline edtior supports drag shape events.
* Add ability to change width to Hippodrome editor
* Added `ac-array-desc` for representing dynamic arrays in entity - ALPHA

## Fixes
* Hippodrome editor - setManually supports positions and hippodrome width.
* Fixed Polygons Editing  bug that happened when dragging a point.  
* Fixed Polyline Editing bug that happened when dragging a point.
* Fixed `EntitesDrawerService` show prop bug.

## Breaking changes
* Observer Editors methods: `setPolygonManually()`, `setPolylineManually()`,`setCircleManually()`,`setHippodromeManually()` changed to: `setManually()`.  
Each shape accepts here own specific arguments to configure the edited object, for example: `polygonEditor$.setManaually(positions, pointOptions, polygonOptions)`.    

## 0.0.31
### Features
* All editors now except allowDrag option to allow or disable the ability to drag the edited shape.
* Added options to circle editor  - `CircleEditOptions`.
 

### Fixes
* Fix hippodrome editor outline bug.
* Fixed bug that caused polygons hiding to throw an error if they had outline. 

## 0.0.30
### Fixes
* Service init order  [#131](https://github.com/TGFTech/angular-cesium/issues/131)

### Features
* Added `selectionManagerService` and example in selection-layer.component.ts
* Added context menu service that allows dynamic injection of custom components.
* Added Polyline editor `PolylinesEditorService` - allow for creating polylines and editing them from the map of from the code.  
* Added Circle editor `CirclesEditorService` - allow for creating circles and editing them from the map of from the code.
* Added Hippodrome editor `HippodromeEditorService` - allow for creating hippodromes and editing them from the map of from the code.
* Added `CesiumHeatMapMaterialCreator` for creating heatmap material for cesium entities.
* edited polygons are now draggable.
* added `ac-point-primitive-desc`
* added `ac-html-desc` - ac-layer supports ac-html  

## 0.0.29
### Features
* polygon editor(alpha) - edit points manually.

## 0.0.28
### Features
* polygon editor(alpha) - edit mode, disable,enable, add points to the editor result.


## 0.0.26
### Features
* added screenshot service
* polygon editor - alpha

## 0.0.25
### Fixes
* fix draw on map example

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
