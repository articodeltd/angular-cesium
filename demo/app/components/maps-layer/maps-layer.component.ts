import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MapLayerProviderOptions } from '../../../../src/angular-cesium/models/map-layer-provider-options.enum';
import { AppSettingsService } from '../../services/app-settings-service/app-settings-service';
import { AcMapLayerProviderComponent } from '../../../../src/angular-cesium/components/ac-map-layer-provider/ac-map-layer-provider.component';

@Component({
  selector : 'maps-layer',
  templateUrl : 'maps-layer.component.html'
})

export class MapsLayerComponent implements AfterViewInit {
  
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
