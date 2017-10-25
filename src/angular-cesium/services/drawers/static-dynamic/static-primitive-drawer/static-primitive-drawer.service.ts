import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';

/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 */
export abstract class StaticPrimitiveDrawer extends PrimitivesDrawerService {
  constructor(private geometryType: any, cesiumService: CesiumService) {
    super(Cesium.PrimitiveCollection, cesiumService);
  }

  add(geometryProps: any, instanceProps: any, primitiveProps: any): any {
    instanceProps.geometry = new this.geometryType(geometryProps);
    primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
    primitiveProps.asynchronous = false;
    const primitive = new Cesium.Primitive(primitiveProps);
    return super.add(primitive);
  }

  update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any) {
    instanceProps.geometry = new this.geometryType(geometryProps);
    primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
    this._cesiumCollection.remove(primitive);
    return super.add(new Cesium.Primitive(primitiveProps));
  }
}
