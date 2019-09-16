export enum MapTerrainProviderOptions {
  CesiumTerrain = Cesium.CesiumTerrainProvider,
  ArcGISTiledElevation = Cesium.ArcGISTiledElevationTerrainProvider,
  GoogleEarthEnterprise = Cesium.GoogleEarthEnterpriseTerrainProvider,
  VRTheWorld = Cesium.VRTheWorldTerrainProvider,
  Ellipsoid = Cesium.EllipsoidTerrainProvider,
  WorldTerrain = Cesium.createWorldTerrain
}
