## 0.57
### Fixes
* Fixed demo app unit tests
* Updated README with instructions for including Cesium scripts in test config

## 0.56
### Features
* Added `onDrag` hook into the `ac-toolbar` component.
* Altered `ac-toolbar` to listen in to changes on its `allowDrag` input and subscribe/unsubscribe dynamically.
* Added threshold option to `ZoomToRectangleService` options.
* Added keepRotation option to `ZoomToRectangleService` options.
* Added mouseButton option to `ZoomToRectangleService` options.

## 0.55
### Features
* New Angular CLI build system.

## 0.54
### Fixes
* Fixed `ac-layer` onDestroy.
* Fixed `ac-map` onDestroy.
* Fixed `CircleEditorService` shape dragging.
* Fixed `ac-model-desc` docs [#243](https://github.com/TGFTech/angular-cesium/issues/243).
* Fixed entities drawing directly to map - without ac-layer [#212](https://github.com/TGFTech/angular-cesium/issues/212).
* Fixed plonter behavior.

### Features
* Multiple `AcMap` support using `ngFor` - The optional `@Input() containerId` in `AcMap` can be used to place the map canvas in any container / move the canvas to a new container.
* New `bind2DMapsCameras()` function added to `MapsManagerService` for binding cameras position in different 2D maps.
* New `unbindMapsCameras()` function added to `MapsManagerService` for unbinding maps camera.
* New `setRotation()` function added to `CameraService`.
* New `lockRotation()` function added to `CameraService`.
* New `ZoomToRectangleService` was added to `AngularCesiumWidgetsModule` - a tool for zooming into a rectangle that is drawn on the map.
* Added initial support for `Cesium.CallbackProperty`.
* Added new ellipses shape editor that can be used to draw circles and ellipses.

## 0.53
### Features
* New `<ac-czml-desc>` component for adding CzmlDataSource to ac-layer.
* New `czml-drawer` service 
* New `<czml-layer` component in demo app to show usage of `<ac-czml-desc>`
* Support RxJs 6 

### Fixes
* Fixed AOT compilation for angular 6, the issue was with `angular2parse` reaching angular compiler pipes.
* Fixed Shape editors points zIndex in 2D.  
* Updated demo dependencies

### Breaking Changes
* From now Angular Pipes need to be set in `AngularCesiumModule.forRoot(ustomPipes: myCustomPipes)`.
angular-cesium won't be aware of pipes that wont be defined as `customPipes`.
There for any user Pipes need to be declared when initializing angular cesium.
* For upgrade to 0.53 from older versions remove `rxjs-compat` dependency and refactor to rxjs 6 new import paths.  

## 0.0.52
### Fixes
* Fixed shape editors 2D points bug - remove height reference
* Fixed polygon editor moving point updates

## 0.0.51
### Fixes
* Fixed `package.json` engines section. 

## 0.0.50
### Features
* New `<range-and-bearing>` component that is used to to draw range & bearing on the map.
* Refactored `KeyboardControlService` docs.
* Added `maximumNumberOfPoints` to `PolygonEditOptions` - you can now set maximum number of points when creating polygon using `PolygonEditorService` .
* Refactored `KeyboardControlService` docs. 
* Added flyTo options to `CameraService.trackEntity()` + example in the demo.

### Fixes
* `ac-point-desc` changed to Entity instead of Primitive. For primitive use `ac-point-primitive-desc`.

## 0.0.49
### Fixes
* Fixed mistakenly rejecting Observables from other contexts
* Fixed `ac-toolbar` onDestroy() [#217](https://github.com/TGFTech/angular-cesium/issues/217).
* Fixed `ac-html` element is shown when show initially set to false [#216](https://github.com/TGFTech/angular-cesium/issues/216).
* Changed `ellipse-drawer` service collection max size cap to 100
* Fixed `sim-generator` in demo server
* Changed `SmartAssigner` allowUndefined default from true to false
* Removed deprecated code in `ViewerFactory` that set CESIUM_BASE_URL if ti wasn't already set.

## 0.0.48
### Fixes
* Fixed `ac-circle-desc` radius changing.
* Fixed `ac-ellipse-desc` & `ac-circle-desc` updating bug

## 0.0.45
### Fixes
* Some minor fixes

## 0.0.43
### Fixes
* Improved shape editors performance
* Fixed undragable editable hippodrome
* Fixed editable hippodrome updating
* Fixed editing multiple shapes of the same type simultaneously

### Features
* Labels of editable shapes now update on mouse move
* Update Cesium version to 1.41.0

## 0.0.42
### Fixes
* Fixed `PolygonsEditorService` shape drag

## 0.0.41
### Features
* Added `pickFilter` to `EventRegistrationInput` - you can now pass a filter function to `MapEventsManager.register()` - in order to filter the returned entities.

### Fixes
* Fixed editing of multiple shapes simultaneously

## 0.0.40
### Features
* Upgraded to Angular 5
* Fixed aot build

## 0.0.39
### Fixes
* Fix range and bearing example

### Features
* Added `ac-primitive-polyline` - Using primitive drawer

## 0.0.37
### Fixes
* Html Primitive - change primitive screen position to Cesium.Cartesian2
* Fix demo typescript compilation
* Fix project implicit any
* Change `ngOutletContext` to `ngTemplateOutletContext`

## 0.0.36
### Fixes
* Hippodrome Editor - Expose hippodrome width

### Breaking Changes
* `HippodromeEditorService` is no longer provided by `AngularCesiumWidgetsModule`, user should provide it himself
* `CircleEditorService` is no longer provided by `AngularCesiumWidgetsModule`, user should provide it himself
* `PolylineEditorService` is no longer provided by `AngularCesiumWidgetsModule`, user should provide it himself
* `PolygonEditorService` is no longer provided by `AngularCesiumWidgetsModule`, user should provide it himself

## 0.0.35
### Features
* Added `calcEllipseContainingRect` static function to `CesiumHeatMapMaterialCreator`
* Added `ac-toolbar` and `ac-toolbar-button` components
* Added toolbar example and flyTo home toolbar option
* Added Range and bearing example

### Breaking changes
* `AngularCesiumEntitiesDrawerModule` refactored to `AngularCesiumWigetsModule`

## 0.0.34
### Fixes
* Fixed a bug in editors.

### Features
* Added customizable labels to shape editors.
* Added `DraggableToMapDirective` directive for dragging icons from outside the map over the map.
* Added `IconDragService` service that exposes an observable that listens to dragging with `DraggableToMapDirective`.

## 0.0.33
## Fixes
* fix missing Cartesian3 typings

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
