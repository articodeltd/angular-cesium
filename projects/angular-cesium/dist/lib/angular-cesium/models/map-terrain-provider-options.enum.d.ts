import * as Cesium from 'cesium';
export declare class MapTerrainProviderOptions {
    static CesiumTerrain: typeof Cesium.CesiumTerrainProvider;
    static ArcGISTiledElevation: typeof Cesium.ArcGISTiledElevationTerrainProvider;
    static GoogleEarthEnterprise: typeof Cesium.GoogleEarthEnterpriseTerrainProvider;
    static VRTheWorld: typeof Cesium.VRTheWorldTerrainProvider;
    static Ellipsoid: typeof Cesium.EllipsoidTerrainProvider;
    static WorldTerrain: typeof Cesium.createWorldTerrain;
}
