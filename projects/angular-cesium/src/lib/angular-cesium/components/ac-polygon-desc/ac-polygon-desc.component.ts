import { Component, forwardRef, OnInit } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

/**
 *  This is a polygon implementation.
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon-desc props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon-desc>
 *  ```
 */
@Component({
  selector: 'ac-polygon-desc',
  template: '',
  providers: [{provide: BasicDesc, useExisting: forwardRef(() => AcPolygonDescComponent)}],
})
export class AcPolygonDescComponent extends BasicDesc implements OnInit {

  constructor(polygonDrawer: PolygonDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(polygonDrawer, layerService, computationCache, cesiumProperties);
  }
}
