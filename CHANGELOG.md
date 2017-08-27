## 0.0.16
### Features
* Expose `onDraw` and `onRemove` for `BasicDesc` component - now it's possible to know when an Cesium object is drawn.
* Expose `getCesiumObjectsMap` from `BasicDesc` component.
* Add drag and drop event to `MapEventManagerService`

## 0.0.15
### Features
* Expose `MapEventManagerService` from `<ac-map #map/>` component reference: `acMapComponent.getMapEventManager()`
* New `KeyboardControlService` for controlling the camera using the keyboard


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
