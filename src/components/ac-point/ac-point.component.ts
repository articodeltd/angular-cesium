import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';

/**
 *  This is a point implementation.
 *  The ac-point element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-point [props]="{position: position,
 *                         width: 3,
 *  &gt;
 *  &lt;/ac-point&gt;
 *  ```
 */

@Component({
	selector: 'ac-point',
	template: '',
})
export class AcPointComponent extends BasicPrimitiveOnMap {

	constructor(pointDrawer: PointDrawerService) {
		super(pointDrawer);
	}
}
