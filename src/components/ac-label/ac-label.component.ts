import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';

/**
 *  This is a label implementation.
 *  The ac-label element must be a child ac-map element.
 *  The properties of props are the same as the properties of label:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *  __Usage:__
 *  ```
 *  &lt;ac-label [props]="{position: position,
 *                         text: 'labelText',
 *                         font: '30px sans-serif',
 *                         fillColor : aquamarine}"
 *  &gt;
 *  &lt;/ac-label&gt;
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
