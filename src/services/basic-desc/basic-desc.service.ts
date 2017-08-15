import { Input, OnDestroy, OnInit } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { AcEntity } from '../../models/ac-entity';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
export class BasicDesc implements OnInit, OnDestroy {
  @Input()
  props: any;

  protected _cesiumObjectsMap = new Map();
  private _propsEvaluateFn: Function;
  private _propsAssignerFn: Function;

  constructor(protected _drawer: BasicDrawerService,
              protected _layerService: LayerService,
              protected _computationCache: ComputationCache,
              protected _cesiumProperties: CesiumProperties) {
  }

  protected _propsEvaluator(context: Object): any {
    return this._propsEvaluateFn(this._computationCache, context);
  }

  protected _getPropsAssigner(): (cesiumObject: Object, desc: Object) => Object {
    return (cesiumObject: Object, desc: Object) => this._propsAssignerFn(cesiumObject, desc);
  }

  ngOnInit(): void {
    if (!this.props) {
      console.error('ac-desc components error: [props] input is mandatory');
    }
    this._layerService.registerDescription(this);
    this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
    this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
  }

  draw(context: any, id: string, entity: AcEntity): any {
    const cesiumProps = this._propsEvaluator(context);
    if (!this._cesiumObjectsMap.has(id)) {
      const cesiumObject = this._drawer.add(cesiumProps);
      cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
      this._cesiumObjectsMap.set(id, cesiumObject);
    } else {
      const cesiumObject = this._cesiumObjectsMap.get(id);
      cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
      this._drawer.setPropsAssigner(this._getPropsAssigner());
      this._drawer.update(cesiumObject, cesiumProps);
    }
  }

  remove(id) {
    const cesiumObject = this._cesiumObjectsMap.get(id);
    this._drawer.remove(cesiumObject);
    this._cesiumObjectsMap.delete(id);
  }

  removeAll() {
    this._cesiumObjectsMap.clear();
    this._drawer.removeAll();
  }

  ngOnDestroy() {
    this._layerService.unregisterDescription(this);
    this.removeAll();
  }
}
