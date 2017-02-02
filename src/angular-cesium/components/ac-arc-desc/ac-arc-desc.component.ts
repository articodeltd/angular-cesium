import { Component, OnInit } from '@angular/core';
import {LayerService} from "../../services/layer-service/layer-service.service";
import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {ArcDrawerService} from "../../services/arc-drawer/arc-drawer.service";
import {BasicDesc} from "../../services/basic-desc/basic-desc.service";

@Component({
  selector: 'ac-arc-desc',
  template: ''
})
export class AcArcDescComponent extends BasicDesc {

  constructor(arcDrawer: ArcDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties
  ) {
    super(arcDrawer, layerService, computationCache, cesiumProperties);
  }

}
