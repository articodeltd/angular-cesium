import { Component } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';

/**
 *  This is a label primitive implementation.
 *  The ac-label element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Point.html
 *
 *  __Usage :__
 *  ```
 *    <ac-point-primitive-desc props="{
 *      position: track.position,
 *      color: Color.RED
 *    }">
 *    </ac-point-primitive-desc>
 *  ```
 */

@Component({
  selector: 'ac-point-primitive-desc',
  template: '',
})
export class AcPointPrimitiveDescComponent extends BasicDesc {

  constructor(pointPrimitiveDrawerService: PointPrimitiveDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(pointPrimitiveDrawerService, layerService, computationCache, cesiumProperties);
  }
}
