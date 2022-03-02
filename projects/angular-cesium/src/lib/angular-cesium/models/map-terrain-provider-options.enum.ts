import * as Cesium from 'cesium';

export class MapTerrainProviderOptions {
  static CesiumTerrain = Cesium.CesiumTerrainProvider;
  static ArcGISTiledElevation = Cesium.ArcGISTiledElevationTerrainProvider;
  static GoogleEarthEnterprise = Cesium.GoogleEarthEnterpriseTerrainProvider;
  static VRTheWorld = Cesium.VRTheWorldTerrainProvider;
  static Ellipsoid = Cesium.EllipsoidTerrainProvider;
  static WorldTerrain = Cesium.createWorldTerrain;
}
