import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a ellipse implementation.
 *  The ac-ellipse element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-ellipse [props]="{center: position,
 *                           semiMajorAxis:25000.0,
 *                           semiMinorAxis:40000.0,
 *                           rotation : 0.785398,
 *                           width:3,
 *                           granularity:0.03,
 *                           color:[0,0,0,0.5]}"
 *  &gt;
 *  &lt;/ac-ellipse&gt;
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
