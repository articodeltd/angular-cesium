import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';

/**
 *  This is a billboard implementation.
 *  The element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and BillboardGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/BillboardGraphics.html
 *
 *  __Usage :__
 *  ```
 *    <ac-billboard [props]="{
 *      image: image,
 *      position: position,
 *      scale: scale,
 *      color: color,
 *      name: name
 *    }">;
 *    </ac-billboard>
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
