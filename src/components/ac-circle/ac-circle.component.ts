import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

/**
 *  This is a circle implementation.
 *  The ac-circle element must be a child ac-map element.
 *  __Usage:__
 *  ```
 *  &lt;ac-circle [props]="{center: position,
 *                           radius:40000.0,
 *                           width:3,
 *                           granularity:0.03,
 *                           color:[0,0,0,0.5]}"
 *  &gt;
 *  &lt;/ac-circle&gt;
 *  ```
 */

@Component({
	selector: 'ac-circle',
	template: '',
})
export class AcCircleComponent extends BasicPrimitiveOnMap {

	constructor(dynamicEllipseDrawer: DynamicEllipseDrawerService) {
		super(dynamicEllipseDrawer);
	}

	private updateEllipseProps() {
		this.props.semiMajorAxis = this.props.radius;
		this.props.semiMinorAxis = this.props.radius;
		this.props.rotation = 0.0;
	}

	drawOnMap() {
		this.updateEllipseProps();
		super.drawOnMap();
	}

	updateOnMap() {
		this.updateEllipseProps();
		super.updateOnMap();
	}
}
