import { Component, forwardRef } from '@angular/core';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';

/**
 *  This is a circle implementation.
 *  The element must be a child of ac-layer element.
 *  semiMajorAxis ans semiMinorAxis are replaced with radius property.
 *  All other properties of props are the same as the properties of Entity and EllipseGraphics:
 *  + https://cesiumjs.org/Cesium/Build/Documentation/Entity.html
 *  + https://cesiumjs.org/Cesium/Build/Documentation/EllipseGraphics.html
 *
 *__Usage :__
 *  ```
 *    <ac-circle-desc props="{
 *      position: data.position,
 *      radius: 5
 *      granularity:0.08 // Optional
 *    }">
 *    </ac-circle-desc>
 *  ```
 */
@Component({
  selector: 'ac-circle-desc',
  template: '',
  providers: [{provide: BasicDesc, useExisting: forwardRef(() => AcCircleDescComponent)}],
})
export class AcCircleDescComponent extends BasicDesc {
  constructor(ellipseDrawer: EllipseDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(ellipseDrawer, layerService, computationCache, cesiumProperties);
  }

  protected _propsEvaluator(context: Object): any {
    const cesiumProps = super._propsEvaluator(context);

    cesiumProps.semiMajorAxis = cesiumProps.radius;
    cesiumProps.semiMinorAxis = cesiumProps.radius;
    delete cesiumProps.radius;

    return cesiumProps;
  }

  protected _getPropsAssigner(): (cesiumObject: Object, desc: Object) => Object {
    return (cesiumObject: Object, desc: Object) => Object.assign(cesiumObject, desc);
  }
}
