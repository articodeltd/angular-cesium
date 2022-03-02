import * as Cesium from 'cesium';

export class MapLayerProviderOptions {
  static ArcGisMapServer = Cesium.ArcGisMapServerImageryProvider;
  static WebMapTileService = Cesium.WebMapTileServiceImageryProvider;
  static MapTileService = Cesium.TileMapServiceImageryProvider;
  static WebMapService = Cesium.WebMapServiceImageryProvider;
  static SingleTileImagery = Cesium.SingleTileImageryProvider;
  static OpenStreetMap = Cesium.OpenStreetMapImageryProvider;
  static BingMaps = Cesium.BingMapsImageryProvider;
  static GoogleEarthEnterpriseMaps = Cesium.GoogleEarthEnterpriseMapsProvider;
  static MapBox = Cesium.MapboxImageryProvider;
  static MapboxStyleImageryProvider = Cesium.MapboxStyleImageryProvider;
  static UrlTemplateImagery = Cesium.UrlTemplateImageryProvider;
  static OFFLINE = null;
}
