import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';

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
 *    color: Cesium.Color.GREEN
 *  }">;
 *  </ac-polyline>
 *  ```
 */

@Component({
	selector: 'ac-polyline',
	template: '',
})
export class AcPolylineComponent extends BasicPrimitiveOnMap {

	constructor(polylineDrawer: PolylineDrawerService) {
		super(polylineDrawer);
	}
}
