import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { EntityOnMapComponent } from '../../services/entity-on-map/entity-on-map.component';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

/**
 *  This is an implementation of an arc.
 *  The element must be a child of ac-map element.
 *  An arc is not natively implemented in cesium.
 *
 *  __Usage :__
 *  ```
 *    <ac-arc-desc geometryProps="{
 *          center: arc.center,
 *          angle: arc.angle,
 *          delta: arc.delta,
 *          radius: arc.radius
 *       }"
 *       instanceProps="{
 *          attributes: arc.attributes
 *       }"
 *       primitiveProps="{
 *          appearance: arc.appearance
 *       }">
 *    </ac-arc-desc>
 *    ```
 */

@Component({
  selector: 'ac-arc',
  template: '',
})
export class AcArcComponent extends EntityOnMapComponent implements OnChanges {

  @Input()
  geometryProps: any;
  @Input()
  instanceProps: any;
  @Input()
  primitiveProps: any;

  constructor(arcDrawer: ArcDrawerService, mapLayers: MapLayersService) {
    super(arcDrawer, mapLayers);
  }

  updateOnMap() {
    if (this.selfPrimitiveIsDraw) {
      this.removeFromMap();
      this.drawOnMap();
    }
  }

  drawOnMap() {
    this.selfPrimitiveIsDraw = true;
    return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
  }

  ngOnChanges(changes: SimpleChanges) {
    const geometryProps = changes['geometryProps'];
    const instanceProps = changes['instanceProps'];
    const primitiveProps = changes['primitiveProps'];
    if (geometryProps.currentValue !== geometryProps.previousValue ||
      instanceProps.currentValue !== instanceProps.previousValue ||
      primitiveProps.currentValue !== primitiveProps.previousValue) {
      this.updateOnMap();
    }
  }
}
