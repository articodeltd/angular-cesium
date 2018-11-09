import { Component, ViewChild } from '@angular/core';
import { ViewerConfiguration } from '../../../../src/angular-cesium/services/viewer-configuration/viewer-configuration.service';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { MapLayerProviderOptions } from '../../../../src/angular-cesium/models/map-layer-provider-options.enum';
import { TracksLayerComponent } from '../tracks-layer/tracks-layer.component';
import { SceneMode } from '../../../../src/angular-cesium/models/scene-mode.enum';

@Component({
  selector: 'demo-map',
  templateUrl: './demo-map.component.html',
  providers: [ViewerConfiguration],
  styleUrls: ['./demo-map.component.css']
})
export class DemoMapComponent {
  @ViewChild('layer') tracksLayer: TracksLayerComponent;
  arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
  sceneMode = SceneMode.SCENE3D;
  showLayer = true;
  showMap = true;
  maps = [
    {
      sceneMode: SceneMode.SCENE3D,
      id: 'main-map',
      containerId: 'left-map-container'
    },
    {
      sceneMode: SceneMode.PERFORMANCE_SCENE2D,
      id: 'sub-map',
      containerId: 'right-map-container'
    }
  ];
  mapContainerId = 'left-map-container';

  constructor(
    private viewerConf: ViewerConfiguration,
    private appSettingsService: AppSettingsService
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
      mapMode2D: Cesium.MapMode2D.ROTATE
    };

    viewerConf.viewerModifier = (viewer: any) => {
      viewer.screenSpaceEventHandler.removeInputAction(
        Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      );
      viewer.bottomContainer.remove();
    };

    this.appSettingsService.showTracksLayer = true;

    // setTimeout(() => this.showLayer = false, 5000);
    // setTimeout(() => this.showMap = false, 5000);
    // setTimeout(() => (this.mapContainerId = 'right-map-container'), 8000);
    // setTimeout(() => {
    //   const maps0ContainerId = this.maps[0].containerId;
    //   this.maps[0].containerId = this.maps[1].containerId;
    //   this.maps[1].containerId = maps0ContainerId;
    // }, 10000);

    // setTimeout(() => this.maps.pop(), 15000);
  }

  removeAll() {
    this.tracksLayer.removeAll();
  }

  mapsTrackBy(index, item) {
    item.id || index;
  }
}
