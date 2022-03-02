import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { ScreenSpaceEventType, MapMode2D } from 'cesium';
import { MapLayerProviderOptions, MapsManagerService, SceneMode, ViewerConfiguration, ZoomToRectangleService } from 'angular-cesium';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';

@Component({
  selector: 'demo-multiple-maps',
  templateUrl: './demo-multiple-maps.component.html',
  providers: [ViewerConfiguration],
})
export class DemoMultipleMapsComponent implements AfterViewInit {
  arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
  sceneMode = SceneMode.SCENE3D;
  showLayer = true;
  showMap = true;
  maps = [
    {
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      id: 'main-map',
      containerId: 'left-map-container',
    },
    {
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      id: 'sub-map',
      containerId: 'right-map-container',
    },
  ];
  mapContainerId = 'left-map-container';

  constructor(
    private viewerConf: ViewerConfiguration,
    private appSettingsService: AppSettingsService,
    private zoomToRect: ZoomToRectangleService,
    private mapsManagerService: MapsManagerService,
  ) {
    viewerConf.viewerOptions = {
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      shouldAnimate: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
      mapMode2D: MapMode2D.ROTATE,
    };

    viewerConf.viewerModifier = (viewer: any) => {
      viewer.screenSpaceEventHandler.removeInputAction(ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      viewer.bottomContainer.remove();
    };

    this.appSettingsService.showTracksLayer = true;

    // setTimeout(() => (this.mapContainerId = 'right-map-container'), 8000);
    // setTimeout(() => {
    //   const maps0ContainerId = this.maps[0].containerId;
    //   this.maps[0].containerId = this.maps[1].containerId;
    //   this.maps[1].containerId = maps0ContainerId;
    // }, 10000);

    // setTimeout(() => this.maps.pop(), 15000);
  }

  mapsTrackBy(index, item) {
    return item.id || index;
  }

  ngAfterViewInit(): void {
    this.mapsManagerService.sync2DMapsCameras([{id: 'main-map'}, {id: 'sub-map'}]);
  }
}
