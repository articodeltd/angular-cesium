import { Component, ViewChild } from '@angular/core';
import { MapLayerProviderOptions, SceneMode, ViewerConfiguration } from 'angular-cesium';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { TracksLayerComponent } from '../tracks-layer/tracks-layer.component';

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

  constructor(private viewerConf: ViewerConfiguration,
              public appSettingsService: AppSettingsService) {
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
      mapMode2D: Cesium.MapMode2D.ROTATE,
    };

    viewerConf.viewerModifier = (viewer: any) => {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
    };

    this.appSettingsService.showTracksLayer = true;
  }

  removeAll() {
    this.tracksLayer.removeAll();
  }
}
