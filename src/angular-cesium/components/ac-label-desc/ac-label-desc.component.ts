  import { Component} from '@angular/core';
  import {BasicDesc} from "../../services/basic-desc/basic-desc.service";
  import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";
  import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
  import {LayerService} from "../../services/layer-service/layer-service.service";
  import {LabelDrawerService} from "../../services/label-drawer/label-drawer.service";

@Component({
  selector: 'ac-label-desc',
  templateUrl: './ac-label-desc.component.html',
  styleUrls: ['./ac-label-desc.component.css']
})
export class AcLabelDescComponent extends BasicDesc{

  constructor(labelDrawer: LabelDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties
  ) {
    super(labelDrawer, layerService, computationCache, cesiumProperties);
  }

}
