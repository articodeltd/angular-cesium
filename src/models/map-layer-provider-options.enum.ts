export enum MapLayerProviderOptions {
  ArcGisMapServer ,
  WebMapTileService,
  MapTileService,
  WebMapService,
  SingleTileImagery,
  OpenStreetMap,
  BingMaps,
  GoogleEarthImagery,
  MapBox,
  UrlTemplateImagery,
  OFFLINE
}

export const MapLayerProviderOptionsToProvider = {
  [MapLayerProviderOptions.ArcGisMapServer]: Cesium.ArcGisMapServerImageryProvider ,
  [MapLayerProviderOptions.WebMapTileService]: Cesium.WebMapTileServiceImageryProvider,
  [MapLayerProviderOptions.MapTileService]: Cesium.createTileMapServiceImageryProvider,
  [MapLayerProviderOptions.WebMapService]: Cesium.WebMapServiceImageryProvider,
  [MapLayerProviderOptions.SingleTileImagery]: Cesium.SingleTileImageryProvider,
  
  [MapLayerProviderOptions.OpenStreetMap]: Cesium.createOpenStreetMapImageryProvider,
  [MapLayerProviderOptions.BingMaps]:  Cesium.BingMapsImageryProvider,
  [MapLayerProviderOptions.GoogleEarthImagery]: Cesium.GoogleEarthImageryProvider,
  [MapLayerProviderOptions.MapBox]: Cesium.MapboxImageryProvider,
  [MapLayerProviderOptions.UrlTemplateImagery]: Cesium. UrlTemplateImageryProvider,
  [MapLayerProviderOptions.OFFLINE]: '',
};
