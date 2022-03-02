import { Injectable } from '@angular/core';
import { PrimitiveCollection } from 'cesium';
import { CesiumService } from '../../../cesium/cesium.service';
import { Checker } from '../../../../utils/checker';
import { EllipsePrimitive } from 'primitive-primitives';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';


/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
@Injectable()
export class DynamicEllipseDrawerService extends PrimitivesDrawerService {
  constructor(cesiumService: CesiumService) {
    super(PrimitiveCollection, cesiumService);
  }

  add(cesiumProps: any): any {
    Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);

    return super.add(new EllipsePrimitive(cesiumProps));
  }

  update(ellipse: any, cesiumProps: any): any {
    ellipse.updateLocationData(cesiumProps);

    return ellipse;
  }
}
