import { AfterViewInit, Component, ViewChild, ViewEncapsulation } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { MatIconRegistry } from '@angular/material/icon';
import { MatSidenav } from '@angular/material/sidenav';
import { Cartesian3 } from 'cesium';
import { AppSettingsService, TracksType } from './services/app-settings-service/app-settings-service';
import { DraggableToMapService, MapLayerProviderOptions, MapsManagerService } from 'angular-cesium';
import { DemoMapComponent } from './components/demo-map/demo-map.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.css'],
  providers: [ AppSettingsService],
  encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements AfterViewInit {

  arcGisMapServerProvider = MapLayerProviderOptions.ArcGisMapServer;
  flyToOptions = {
    duration: 2,
    destination: Cartesian3.fromDegrees(-117.16, 32.71, 15000.0),
  };

  multiMap = false; // Change to true to enable multiple maps

  constructor(
    public appSettingsService: AppSettingsService,
    iconRegistry: MatIconRegistry,
    sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private mapsManagerService: MapsManagerService,
    private draggableToMapService: DraggableToMapService,
  ) {
    iconRegistry.addSvgIcon('settings', sanitizer.bypassSecurityTrustResourceUrl('/assets/settings.svg'));
    this.appSettingsService.showTracksLayer = true;
  }

  openSidenav(sidenav: MatSidenav) {
    this.dialog.closeAll();
    sidenav.open();
  }

  cleanMainMap() {
  }

  setMultiMaps() {
    this.multiMap = !this.multiMap;
  }

  ngAfterViewInit(): void {
    // example for getting the viewer by Id outside of the ac-map hierarchy
    const map = this.mapsManagerService.getMap('main-map');
    this.draggableToMapService.dragUpdates().subscribe(e => console.log(e));
  }
}
