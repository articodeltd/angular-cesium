import { Component, ViewChild } from '@angular/core';
import { ViewerConfiguration } from '../../../../src/services/viewer-configuration/viewer-configuration.service';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { MapLayerProviderOptions } from '../../../../src/models/map-layer-provider-options.enum';
import { TracksLayerComponent } from '../tracks-layer/tracks-layer.component';
import { SceneMode } from '../../../../src/models/scene-mode.enum';
import { PolygonsEditorService } from '../../../../angular-cesium-entities-editor/services/entity-editors/polygons-editor/polgons-editor.service';

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
              private appSettingsService: AppSettingsService,
              private polygonsEditor: PolygonsEditorService) {
    viewerConf.viewerOptions = {
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
    };

    this.appSettingsService.showTracksLayer = true;
    setTimeout(() => this.polygonsEditor.create(), 5000);
  }

  removeAll() {
    this.tracksLayer.removeAll();
  }
}
