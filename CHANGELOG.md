## 0.0.12 (30-7-17)
### Breaking changes
* AcEntity id filed changed to string from number
* AcNotification id filed changed to string from number

## 0.0.13
### Features
* ac-map-layer-provider - Support all cesium imagery providers
* Expose cesium viewer through ViewesManagerService and `ac-map`

## 0.0.14
### Breaking changes 
* deprecated: 
  * AcStaticEllipseDescComponent, instead use `ac-ellipse-desc`
  * AcDynamicPolylineDescComponent, instead use `ac-polyline-desc`
  * AcStaticPolylineDescComponent, instead use `ac-polyline-desc`
  * AcStaticCircleDescComponent, instead use `ac-circle-desc`
  * AcStaticPolygonDescComponent, instead use `ac-polygon-desc`
* MapEventManagerService: EventResult.primitives changed to EventResult.cesiumEntities

### Features 
* support models `ac-model-desc`