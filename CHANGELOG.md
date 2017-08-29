## NEXT
### Features
* Added `done` callback to `KeyboardControlService` definitions - now it's possible to know when the event is done.
* Added internal `IGNORED` state to `KeyboardControlService` - now when action returns `false` it will ignore it until the next event cycle (keydown then keyup)
* Added new components: `ac-billboard-primitive-desc`, `ac-label-primitive-desc`, `ac-polyline-primitive-desc`. The components uses Cesium Primitives for performance efficient drawing of map entities.

### Breaking Changes
* Event triggered from `KeyboardControlService` is now triggered with `cesiumService: CesiumService, key: string, keyboardEvent: KeyboardEvent`.
* `AngularCesiumModule` should be loaded with `.forRoot()`. Additionally, `AngularCesiumModule.forRoot()` takes options of type `ModuleOptions`. 

## 0.0.18
### Features
* Expose `onDraw` and `onRemove` for `BasicDesc` component - now it's possible to know when an Cesium object is drawn.
* Expose `getCesiumObjectsMap` from `BasicDesc` component.
* Add drag and drop event to `MapEventManagerService`
* support:
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
