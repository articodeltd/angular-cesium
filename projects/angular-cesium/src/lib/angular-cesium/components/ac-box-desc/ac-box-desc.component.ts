import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BoxDrawerService } from '../../services/drawers/box-dawer/box-drawer.service';

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity (like `position`)
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BoxGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-box-desc props="{
 *     show : point.show, //optional
 *     position : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-box-desc>
 *  ```
 */
@Component({
  selector: 'ac-box-desc',
  template: '',
  providers: [{provide: BasicDesc, useExisting: forwardRef(() => AcBoxDescComponent)}],
})
export class AcBoxDescComponent extends BasicDesc {

  constructor(drawerService: BoxDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(drawerService, layerService, computationCache, cesiumProperties);
  }
}
