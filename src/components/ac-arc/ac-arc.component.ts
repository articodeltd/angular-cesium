import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';

/**
 *  This is an implementation of an arc.
 *  The ac-arc-desc element must be a child of ac-map element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *  __Usage :__
 *  ```
 *    &lt;ac-arc [props]="{
 *                  center: center,
 *                  angle: angle,
 *                  delta: delta,
 *                  radius: radius,
 *                  color: Cesium.Color.WHITE,
 *                  granularity: granularity //optional
 *                  }"&gt;
 *    &lt;/ac-arc&gt;
 *    ```
 */

@Component({
	selector: 'ac-arc',
	template: '',
})
export class AcArcComponent extends BasicPrimitiveOnMap {

	constructor(arcDrawer: ArcDrawerService) {
		super(arcDrawer);
	}

	updateOnMap() {
		if (this.selfPrimitiveIsDraw) {
			this.removeFromMap();
			this.drawOnMap();
		}
	}
}
