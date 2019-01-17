import { Component, OnInit } from '@angular/core';

import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';

/**
 *  This is a czml implementation.
 *  The ac-czml-desc element must be a child of ac-layer element.
 *
 *  See CZML Guide for the structure of props.czmlPacket:
 *  + https://github.com/AnalyticalGraphicsInc/czml-writer/wiki/CZML-Structure
 *
 *  Attention: the first czmlPacket in the stream needs to be a document
 *  with an id and a name attribute. See this example
 *  + https://cesiumjs.org/Cesium/Apps/Sandcastle/index.html?src=CZML%20Point%20-%20Time%20Dynamic.html&label=CZML
 *
 *  To see a working example, use the demo app and
 *  + uncomment <czml-layer></czml-layer> in demo-map.component.html
 *  + set the properties 'timeline', 'animation' and 'shouldAnimate' true in viewerOptions of demo-map.component.ts
 *
 *
 *  __Usage:__
 *  ```
 *    <ac-czml-desc props="{
 *      czmlPacket: czmlPacket
 *    }">
 *    </ac-czml-desc>
 *  ```
 */
@Component({
  selector: 'ac-czml-desc',
  template: '',
})
export class AcCzmlDescComponent extends BasicDesc implements OnInit {
  constructor(czmlDrawer: CzmlDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(czmlDrawer, layerService, computationCache, cesiumProperties);
  }


}
