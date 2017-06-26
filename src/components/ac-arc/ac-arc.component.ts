import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { BasicPrimitiveOnMap } from '../../services/basic-primitive-on-map/basic-primitive-on-map.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';

/**
 *  This is an implementation of an arc.
 *  The ac-arc-desc element must be a child of ac-map element.
 *  An arc is not cesium natively implemented and therefore it's API doesn't appear anywhere
 *  __Usage :__
 *  ```
 *    &lt;ac-arc [geometryProps]="{
 *                  center: center,
 *                  angle: angle,
 *                  delta: delta,
 *                  radius: radius
 *              }"
 *              [instanceProps]="{
 *                  attributes: attributes
 *              }"
 *              [primitiveProps]="{
 *                  appearance: appearance
 *              }"&gt;
 *    &lt;/ac-arc&gt;
 *    ```
 */

@Component({
	selector: 'ac-arc',
	template: '',
})
export class AcArcComponent extends BasicPrimitiveOnMap implements OnChanges {

	@Input()
	geometryProps: any;
	@Input()
	instanceProps: any;
	@Input()
	primitiveProps: any;

	constructor(arcDrawer: ArcDrawerService) {
		super(arcDrawer);
	}

	updateOnMap() {
		if (this.selfPrimitiveIsDraw) {
			this.removeFromMap();
			this.drawOnMap();
		}
	}

	drawOnMap() {
		this.selfPrimitiveIsDraw = true;
		return this.selfPrimitive = this._drawer.add(this.geometryProps, this.instanceProps, this.primitiveProps);
	}

	ngOnChanges(changes: SimpleChanges) {
		const geometryProps = changes['geometryProps'];
		const instanceProps = changes['instanceProps'];
		const primitiveProps = changes['primitiveProps'];
		if (geometryProps.currentValue !== geometryProps.previousValue ||
			instanceProps.currentValue !== instanceProps.previousValue ||
			primitiveProps.currentValue !== primitiveProps.previousValue) {
			this.updateOnMap();
		}
	}
}
