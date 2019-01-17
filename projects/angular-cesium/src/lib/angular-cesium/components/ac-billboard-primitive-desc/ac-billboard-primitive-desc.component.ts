import { Component, forwardRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';

/**
 *  This is a billboard primitive implementation.
 *  The element must be a child of ac-layer element.
 *  The properties of props are:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard-primitive-desc props="{
 *      image: track.image,
 *      position: track.position,
 *      scale: track.scale,
 *      color: track.color,
 *      name: track.name
 *    }">
 *    </ac-billboard-primitive-desc>
 *  ```
 */

@Component({
  selector: 'ac-billboard-primitive-desc',
  template: '',
  providers: [{provide: BasicDesc, useExisting: forwardRef(() => AcBillboardPrimitiveDescComponent)}],
})
export class AcBillboardPrimitiveDescComponent extends BasicDesc {

  constructor(billboardPrimitiveDrawer: BillboardPrimitiveDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(billboardPrimitiveDrawer, layerService, computationCache, cesiumProperties);
  }
}
