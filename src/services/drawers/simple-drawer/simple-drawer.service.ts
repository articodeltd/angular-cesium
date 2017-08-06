import { CesiumService } from '../../cesium/cesium.service';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';

/**
 *  This is abstract drawer who provides some implementation for other drawers that extends it.
 */
export abstract class SimpleDrawerService extends BasicDrawerService {
  private _show = true;
  protected _cesiumCollection: any;
  private _primitiveCollectionWrap;
  protected _propsAssigner: Function;

  constructor(drawerType: any, cesiumService: CesiumService) {
    super();
    this._cesiumCollection = new drawerType();
    this._primitiveCollectionWrap = new Cesium.PrimitiveCollection();
    this._primitiveCollectionWrap.add(this._cesiumCollection);
    cesiumService.getScene().primitives.add(this._primitiveCollectionWrap);
  }

  add(cesiumProps: any, ...args): any {
    return this._cesiumCollection.add(cesiumProps);
  }

  update(entity: any, cesiumProps: any, ...args) {
    if (this._propsAssigner) {
      this._propsAssigner(entity, cesiumProps);
    }
    else {
      Object.assign(entity, cesiumProps);
    }
  }

  remove(entity: any) {
    this._cesiumCollection.remove(entity);
  }

  removeAll() {
    this._cesiumCollection.removeAll();
  }

  setShow(showValue: boolean) {
    this._show = showValue;
    this._primitiveCollectionWrap.show = showValue;
  }

  getShow(): boolean {
    return this._show;
  }
}
