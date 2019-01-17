import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CorridorDrawerService } from '../../services/drawers/corridor-dawer/corridor-drawer.service';

/**
 *  This is a point implementation.
 *  The ac-box-desc element must be a child of ac-layer element.
 *  The properties of props are the same as the properties PointGraphics and the general properties
 *  of Entity
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/CorridorGraphics.html
 *
 *  __Usage:__
 *  ```
 *   <ac-corridor-desc props="{
 *     show : point.show, //optional
 *     positions : point.positions,
 *     material : point.color  //optional
 *   }">
 *   </ac-corridor-desc>
 *  ```
 */
@Component({
  selector: 'ac-corridor-desc',
  template: '',
  providers: [{provide: BasicDesc, useExisting: forwardRef(() => AcCorridorDescComponent)}],
})
export class AcCorridorDescComponent extends BasicDesc {

  constructor(drawerService: CorridorDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(drawerService, layerService, computationCache, cesiumProperties);
  }
}
