import { CesiumService } from '../../cesium/cesium.service';
import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { EllipsePrimitive } from 'primitive-primitives';
import { Checker } from '../../../utils/checker';


/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
@Injectable()
export class DynamicEllipseDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PrimitiveCollection, cesiumService);
	}

	add(cesiumProps: any): any {
		Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis', 'rotation']);

		return super.add(new EllipsePrimitive(cesiumProps));
	}

	update(ellipse: any, cesiumProps: any): any {
		ellipse.updateLocationData(cesiumProps);

		return ellipse;
	}
}
