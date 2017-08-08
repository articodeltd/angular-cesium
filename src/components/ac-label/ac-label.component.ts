import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';

/**
 *  This is a label implementation.
 *  The ac-label element must be a child of ac-map element.
 *  The properties of props are the same as the properties of Entity and LabelGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/LabelGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-label [props]="{
 *    position: position,
 *    text: 'labelText',
 *    font: '30px sans-serif',
 *    fillColor : aquamarine
 *  }">
 *  </ac-label>;
 *  ```
 */

@Component({
	selector: 'ac-label',
	template: '',
})
export class AcLabelComponent extends BasicPrimitiveOnMap {

	constructor(labelDrawer: LabelDrawerService) {
		super(labelDrawer);
	}
}
