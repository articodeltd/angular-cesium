import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';

/**
 *  This is a polyline implementation.
 *  The ac-polyline element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-polyline [props]="{position: position,
 *                               text: 'labelText',
 *                               font: '30px sans-serif',
 *                               fillColor : aquamarine}"
 *  &gt;
 *  &lt;/ac-polyline&gt;
 *  ```
 */

@Component({
	selector: 'ac-polyline',
	template: '',
})
export class AcPolylineComponent extends BasicPrimitiveOnMap {

	constructor(dynamicPolylineDrawer: PolylineDrawerService) {
		super(dynamicPolylineDrawer);
	}
}
