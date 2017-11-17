import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import { CesiumService } from '../../../cesium/cesium.service';

/**
 *
 * This drawer is deprecated.
 * General static primitives drawer responsible of drawing static Cesium primitives with material.
 */
export abstract class StaticPrimitiveDrawer extends PrimitivesDrawerService {
  constructor(private geometryType, cesiumService: CesiumService) {
    super(Cesium.PrimitiveCollection, cesiumService);
  }

  add(geometryProps, instanceProps, primitiveProps) {
    instanceProps.geometry = new this.geometryType(geometryProps);
    primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
    primitiveProps.asynchronous = false;
    const primitive = new Cesium.Primitive(primitiveProps);
    return super.add(primitive);
  }

  update(primitive, geometryProps, instanceProps, primitiveProps) {
    instanceProps.geometry = new this.geometryType(geometryProps);
    primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);
    const index = this._cesiumCollection._primitives.findIndex(p => p === primitive);
    if (index >= 0) {
      const newPrimitive = new Cesium.Primitive(primitiveProps);
      newPrimitive.acEntity = primitive.acEntity;
      this._cesiumCollection._primitives[index] = newPrimitive;
      primitive.destroy();
      return newPrimitive;
    }
  }

  remove(primitive) {
    this._cesiumCollection.remove(primitive);
  }
}
