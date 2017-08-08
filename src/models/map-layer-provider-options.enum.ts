export enum MapLayerProviderOptions {
  ArcGisMapServer = Cesium.ArcGisMapServerImageryProvider ,
  WebMapTileService = Cesium.WebMapTileServiceImageryProvider,
  MapTileService =  Cesium.createTileMapServiceImageryProvider,
  WebMapService = Cesium.WebMapServiceImageryProvider,
  SingleTileImagery = Cesium.SingleTileImageryProvider,
  OpenStreetMap =  Cesium.createOpenStreetMapImageryProvider,
  BingMaps = Cesium.BingMapsImageryProvider,
  GoogleEarthEnterpriseMaps = Cesium.GoogleEarthEnterpriseMapsProvider,
  MapBox = Cesium.MapboxImageryProvider,
  UrlTemplateImagery = Cesium. UrlTemplateImageryProvider,
  OFFLINE = null,
}

