import { Component } from '@angular/core';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

/**
 *  This is a polygon implementation.
 *  The ac-label element must be a child of ac-map element.
 *  _Set `height` prop for performance enhancement_
 *  The properties of props are the same as the properties of Entity and PolygonGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/PolygonGraphics.html
 *
 *  __Usage:__
 *  ```
 *    <ac-polygon props="{
 *      hierarchy: polygon.hierarchy,
 *      material: polygon.material,
 *      height: polygon.height
 *    }">
 *    </ac-polygon>
 *  ```
 */
@Component({
  selector: 'ac-polygon',
  template: '',
})
export class AcPolygonComponent extends EntityOnMapComponent {
  constructor(polygonDrawer: PolygonDrawerService, mapLayers: MapLayersService) {
    super(polygonDrawer, mapLayers);
  }
}
