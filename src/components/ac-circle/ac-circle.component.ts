import { Component } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-map element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *  __Usage:__
 *  ```
 *  <ac-circle [props]="{
 *    position: position,
 *    radius:40000.0,
 *    granularity:0.03,
 *  }">
 *  </ac-circle>
 *  ```
 */

@Component({
	selector: 'ac-circle',
	template: '',
})
export class AcCircleComponent extends BasicPrimitiveOnMap {

	constructor(ellipseDrawerService: EllipseDrawerService) {
		super(ellipseDrawerService);
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
