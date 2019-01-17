import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { PolylineVolumeDrawerService } from '../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service';

/**
 *  This is a point implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolylineVolumeGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-polyline-volume-desc props="{
 *     show : line.show, //optional
 *     positions : line.positions,
 *     material : line.color  //optional
 *   }">
 *   </ac-polyline-volume-desc>
 *  ```
 */
@Component({
  selector: 'ac-polyline-volume-desc',
  template: ''
})
export class AcPolylineVolumeDescComponent extends BasicDesc {

  constructor(drawerService: PolylineVolumeDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(drawerService, layerService, computationCache, cesiumProperties);
  }
}
