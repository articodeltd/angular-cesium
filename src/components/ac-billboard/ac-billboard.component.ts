import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';

/**
 *  This is a billboard implementation.
 *  The ac-billboard element must be a child of ac-map element.
 *  The properties of props are the same as the properties of billboard:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Billboard.html
 *  __Usage :__
 *  ```
 *    &lt;ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }"&gt;
 *    &lt;/ac-billboard&gt;
 *  ```
 */

@Component({
	selector: 'ac-billboard',
	template: '',
})
export class AcBillboardComponent extends BasicPrimitiveOnMap {

	constructor(billboardDrawer: BillboardDrawerService) {
		super(billboardDrawer);
	}
}
