export enum MapLayerProviderOptions {
  ArcGisMapServer = Cesium.ArcGisMapServerImageryProvider,
  WebMapTileService = Cesium.WebMapTileServiceImageryProvider,
  MapTileService = Cesium.TileMapServiceImageryProvider,
  WebMapService = Cesium.WebMapServiceImageryProvider,
  SingleTileImagery = Cesium.SingleTileImageryProvider,
  OpenStreetMap = Cesium.OpenStreetMapImageryProvider,
  BingMaps = Cesium.BingMapsImageryProvider,
  GoogleEarthEnterpriseMaps = Cesium.GoogleEarthEnterpriseMapsProvider,
  MapBox = Cesium.MapboxImageryProvider,
  MapboxStyleImageryProvider = Cesium.MapboxStyleImageryProvider,
  UrlTemplateImagery = Cesium.UrlTemplateImageryProvider,
  OFFLINE = null,
}
