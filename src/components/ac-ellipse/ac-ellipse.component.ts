import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a label implementation.
 *  The ac-label element must be a child ac-map element.
 *  The properties of props are the same as the properties of label:
 *  https://cesiumjs.org/Cesium/Build/Documentation/Label.html
 *  __Usage:__
 *  &lt;ac-label-desc [props]="{position: position,
 *                               text: 'labelText',
 *                               font: '30px sans-serif',
 *                               fillColor : aquamarine}"
 *  &gt;
 *  &lt;/ac-label-desc&gt;
 *  ```
 */

@Component({
	selector: 'ac-ellipse',
	template: '',
})
export class AcEllipseComponent extends BasicPrimitiveOnMap {

	constructor(dynamicEllipseDrawer: DynamicEllipseDrawerService) {
		super(dynamicEllipseDrawer);
	}
}
