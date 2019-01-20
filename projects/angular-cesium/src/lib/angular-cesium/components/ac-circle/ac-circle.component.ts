import { Component } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */

@Component({
  selector: 'ac-circle',
  template: '',
})
export class AcCircleComponent extends EntityOnMapComponent {

  constructor(ellipseDrawerService: EllipseDrawerService, mapLayers: MapLayersService) {
    super(ellipseDrawerService, mapLayers);
  }

  private updateEllipseProps() {
    this.props.semiMajorAxis = this.props.radius;
    this.props.semiMinorAxis = this.props.radius;
    this.props.rotation = 0.0;
  }

  drawOnMap() {
    this.updateEllipseProps();
    super.drawOnMap();
  }

  updateOnMap() {
    this.updateEllipseProps();
    super.updateOnMap();
  }
}
