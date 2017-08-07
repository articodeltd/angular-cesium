import { Component, Input, ViewChild } from '@angular/core';
import { ViewerConfiguration } from '../../../../src/services/viewer-configuration/viewer-configuration.service';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { MapLayerProviderOptions } from '../../../../src/models/map-layer-provider-options.enum';
import { TracksLayerComponent } from '../tracks-layer/tracks-layer.component';

@Component({
  selector : 'demo-map',
  templateUrl : './demo-map.component.html',
  providers : [ViewerConfiguration],
  styleUrls : ['./demo-map.component.css']
})
export class DemoMapComponent {
  @Input() tracksRealData: boolean;

  @ViewChild('layer') tracksLayer: TracksLayerComponent;
  arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;

  constructor(private viewerConf: ViewerConfiguration, private appSettingsService: AppSettingsService) {
    viewerConf.viewerOptions = {
      sceneMode: Cesium.SceneMode.COLUMBUS_VIEW,
      selectionIndicator: false,
      timeline: false,
      infoBox: false,
      fullscreenButton: false,
      baseLayerPicker: false,
      animation: false,
      homeButton: false,
      geocoder: false,
      navigationHelpButton: false,
      navigationInstructionsInitiallyVisible: false,
    };

    viewerConf.viewerModifier = (viewer) => {
      viewer.screenSpaceEventHandler.removeInputAction(Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK);
      viewer.bottomContainer.remove();
      const screenSpaceCameraController = viewer.scene.screenSpaceCameraController;
      screenSpaceCameraController.enableTilt = false;
      screenSpaceCameraController.enableRotate = false;
    };

    this.appSettingsService.showTracksLayer = true;
	}

  removeAll() {
    this.tracksLayer.removeAll();
  }
}
