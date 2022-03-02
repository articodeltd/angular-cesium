import { CesiumService } from '../../../cesium/cesium.service';
import { EllipseGeometry } from 'cesium';
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';


/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
@Injectable()
export class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
  constructor(cesiumService: CesiumService) {
    super(EllipseGeometry, cesiumService);
  }
}
