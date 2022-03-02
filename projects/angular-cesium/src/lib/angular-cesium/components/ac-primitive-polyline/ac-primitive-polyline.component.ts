import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';

/**
 *  This is a polyline implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Polyline Primitive:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Polyline.html
 *
 *  __Usage:__
 *  ```
 *  <ac-polyline [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif'
 *    color: Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */

@Component({
  selector: 'ac-primitive-polyline',
  template: '',
})
export class AcPrimitivePolylineComponent extends EntityOnMapComponent {

  constructor(polylineDrawer: PolylinePrimitiveDrawerService, mapLayers: MapLayersService) {
    super(polylineDrawer, mapLayers);
  }
}
