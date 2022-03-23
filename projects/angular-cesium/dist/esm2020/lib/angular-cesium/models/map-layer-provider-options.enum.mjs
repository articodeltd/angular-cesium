import * as Cesium from 'cesium';
export class MapLayerProviderOptions {
}
MapLayerProviderOptions.ArcGisMapServer = Cesium.ArcGisMapServerImageryProvider;
MapLayerProviderOptions.WebMapTileService = Cesium.WebMapTileServiceImageryProvider;
MapLayerProviderOptions.MapTileService = Cesium.TileMapServiceImageryProvider;
MapLayerProviderOptions.WebMapService = Cesium.WebMapServiceImageryProvider;
MapLayerProviderOptions.SingleTileImagery = Cesium.SingleTileImageryProvider;
MapLayerProviderOptions.OpenStreetMap = Cesium.OpenStreetMapImageryProvider;
MapLayerProviderOptions.BingMaps = Cesium.BingMapsImageryProvider;
MapLayerProviderOptions.GoogleEarthEnterpriseMaps = Cesium.GoogleEarthEnterpriseMapsProvider;
MapLayerProviderOptions.MapBox = Cesium.MapboxImageryProvider;
MapLayerProviderOptions.MapboxStyleImageryProvider = Cesium.MapboxStyleImageryProvider;
MapLayerProviderOptions.UrlTemplateImagery = Cesium.UrlTemplateImageryProvider;
MapLayerProviderOptions.OFFLINE = null;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVyLXByb3ZpZGVyLW9wdGlvbnMuZW51bS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vbW9kZWxzL21hcC1sYXllci1wcm92aWRlci1vcHRpb25zLmVudW0udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxLQUFLLE1BQU0sTUFBTSxRQUFRLENBQUM7QUFFakMsTUFBTSxPQUFPLHVCQUF1Qjs7QUFDM0IsdUNBQWUsR0FBRyxNQUFNLENBQUMsOEJBQThCLENBQUM7QUFDeEQseUNBQWlCLEdBQUcsTUFBTSxDQUFDLGdDQUFnQyxDQUFDO0FBQzVELHNDQUFjLEdBQUcsTUFBTSxDQUFDLDZCQUE2QixDQUFDO0FBQ3RELHFDQUFhLEdBQUcsTUFBTSxDQUFDLDRCQUE0QixDQUFDO0FBQ3BELHlDQUFpQixHQUFHLE1BQU0sQ0FBQyx5QkFBeUIsQ0FBQztBQUNyRCxxQ0FBYSxHQUFHLE1BQU0sQ0FBQyw0QkFBNEIsQ0FBQztBQUNwRCxnQ0FBUSxHQUFHLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQztBQUMxQyxpREFBeUIsR0FBRyxNQUFNLENBQUMsaUNBQWlDLENBQUM7QUFDckUsOEJBQU0sR0FBRyxNQUFNLENBQUMscUJBQXFCLENBQUM7QUFDdEMsa0RBQTBCLEdBQUcsTUFBTSxDQUFDLDBCQUEwQixDQUFDO0FBQy9ELDBDQUFrQixHQUFHLE1BQU0sQ0FBQywwQkFBMEIsQ0FBQztBQUN2RCwrQkFBTyxHQUFHLElBQUksQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIENlc2l1bSBmcm9tICdjZXNpdW0nO1xyXG5cclxuZXhwb3J0IGNsYXNzIE1hcExheWVyUHJvdmlkZXJPcHRpb25zIHtcclxuICBzdGF0aWMgQXJjR2lzTWFwU2VydmVyID0gQ2VzaXVtLkFyY0dpc01hcFNlcnZlckltYWdlcnlQcm92aWRlcjtcclxuICBzdGF0aWMgV2ViTWFwVGlsZVNlcnZpY2UgPSBDZXNpdW0uV2ViTWFwVGlsZVNlcnZpY2VJbWFnZXJ5UHJvdmlkZXI7XHJcbiAgc3RhdGljIE1hcFRpbGVTZXJ2aWNlID0gQ2VzaXVtLlRpbGVNYXBTZXJ2aWNlSW1hZ2VyeVByb3ZpZGVyO1xyXG4gIHN0YXRpYyBXZWJNYXBTZXJ2aWNlID0gQ2VzaXVtLldlYk1hcFNlcnZpY2VJbWFnZXJ5UHJvdmlkZXI7XHJcbiAgc3RhdGljIFNpbmdsZVRpbGVJbWFnZXJ5ID0gQ2VzaXVtLlNpbmdsZVRpbGVJbWFnZXJ5UHJvdmlkZXI7XHJcbiAgc3RhdGljIE9wZW5TdHJlZXRNYXAgPSBDZXNpdW0uT3BlblN0cmVldE1hcEltYWdlcnlQcm92aWRlcjtcclxuICBzdGF0aWMgQmluZ01hcHMgPSBDZXNpdW0uQmluZ01hcHNJbWFnZXJ5UHJvdmlkZXI7XHJcbiAgc3RhdGljIEdvb2dsZUVhcnRoRW50ZXJwcmlzZU1hcHMgPSBDZXNpdW0uR29vZ2xlRWFydGhFbnRlcnByaXNlTWFwc1Byb3ZpZGVyO1xyXG4gIHN0YXRpYyBNYXBCb3ggPSBDZXNpdW0uTWFwYm94SW1hZ2VyeVByb3ZpZGVyO1xyXG4gIHN0YXRpYyBNYXBib3hTdHlsZUltYWdlcnlQcm92aWRlciA9IENlc2l1bS5NYXBib3hTdHlsZUltYWdlcnlQcm92aWRlcjtcclxuICBzdGF0aWMgVXJsVGVtcGxhdGVJbWFnZXJ5ID0gQ2VzaXVtLlVybFRlbXBsYXRlSW1hZ2VyeVByb3ZpZGVyO1xyXG4gIHN0YXRpYyBPRkZMSU5FID0gbnVsbDtcclxufVxyXG4iXX0=