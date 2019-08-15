import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { AcMapLayerProviderComponent, MapLayerProviderOptions } from 'angular-cesium';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';

@Component({
  selector: 'maps-provider-example',
  templateUrl: 'maps-provider-example.component.html'
})

export class MapsProviderExampleComponent implements AfterViewInit {

  @ViewChild('blackmarble') blackMarbleMap: AcMapLayerProviderComponent;

  MapLayerProviderOptions = MapLayerProviderOptions;
  Cesium = Cesium;

  constructor(public appSettingsService: AppSettingsService) {
  }

  ngAfterViewInit(): void {

    if (this.blackMarbleMap && this.blackMarbleMap.imageryLayer) {
      // another way to set alpha (or any imageLayers settings)
      this.blackMarbleMap.imageryLayer.alpha = 0.5;
    }
  }
}
