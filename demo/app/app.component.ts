import { AfterViewInit, Component, ViewEncapsulation } from '@angular/core';
import { WebSocketSupplier } from '../utils/services/webSocketSupplier/webSocketSupplier';
import { MapLayerProviderOptions } from '../../src/angular-cesium/models/map-layer-provider-options.enum';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog, MatIconRegistry, MatSidenav } from '@angular/material';
import {
  AppSettingsService,
  TracksType
} from './services/app-settings-service/app-settings-service';
import { MapsManagerService } from '../../src/angular-cesium/services/maps-manager/maps-manager.service';
import { DraggableToMapService } from '../../src/angular-cesium-widgets/services/draggable-to-map.service';
import { TracksDataProvider } from '../utils/services/dataProvider/tracksDataProvider.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [WebSocketSupplier, AppSettingsService, TracksDataProvider],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements AfterViewInit {
  arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
  flyToOptions = {
    duration: 2,
    destination: Cesium.Cartesian3.fromDegrees(-117.16, 32.71, 15000.0)
  };

  TracksType = TracksType;

  constructor(
    public appSettingsService: AppSettingsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private mapsManagerService: MapsManagerService,
    private draggableToMapService: DraggableToMapService
  ) {
    iconRegistry.addSvgIcon(
      'settings',
      sanitizer.bypassSecurityTrustResourceUrl('/assets/settings.svg')
    );
    this.appSettingsService.showTracksLayer = true;
  }

  settingsClick(sidenav: MatSidenav) {
    this.dialog.closeAll();
    sidenav.open();
  }

  ngAfterViewInit(): void {
    // example for getting the viewer by Id outside of the ac-map hierarchy
    const map = this.mapsManagerService.getMap('main-map');
    // this.mapsManagerService.bind2DMapsCameras(['main-map', 'sub-map']);
    this.draggableToMapService.dragUpdates().subscribe(e => console.log(e));
  }
}
