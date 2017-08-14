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

  protected _mapEntitiesMap = new Map();
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

  protected _getPropsAssigner(): (primitive: Object, desc: Object) => Object {
    return (primitive: Object, desc: Object) => this._propsAssignerFn(primitive, desc);
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
    if (!this._mapEntitiesMap.has(id)) {
      const mapEntity = this._drawer.add(cesiumProps);
      mapEntity.acEntity = entity; // set the entity on the mapEntity for later usage
      this._mapEntitiesMap.set(id, mapEntity);
    } else {
      const mapEntity = this._mapEntitiesMap.get(id);
      mapEntity.acEntity = entity; // set the entity on the mapEntity for later usage
      this._drawer.setPropsAssigner(this._getPropsAssigner());
      this._drawer.update(mapEntity, cesiumProps);
    }
  }

  remove(id) {
    const mapEntity = this._mapEntitiesMap.get(id);
    this._drawer.remove(mapEntity);
    this._mapEntitiesMap.delete(id);
  }

  removeAll() {
    this._mapEntitiesMap.clear();
    this._drawer.removeAll();
  }

  ngOnDestroy() {
    this._layerService.unregisterDescription(this);
    this.removeAll();
  }
}
