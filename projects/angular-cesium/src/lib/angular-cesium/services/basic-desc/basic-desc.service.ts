import { EventEmitter, Input, OnDestroy, OnInit, Output, Directive } from '@angular/core';
import { LayerService } from '../layer-service/layer-service.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { AcEntity } from '../../models/ac-entity';
import { BasicDrawerService } from '../drawers/basic-drawer/basic-drawer.service';
import { IDescription } from '../../models/description';

export interface OnDrawParams {
  acEntity: AcEntity;
  entityId: string;
  cesiumEntity: any;
}

/**
 *  the ancestor class for creating components.
 *  extend this class to create desc component.
 */
@Directive()
export class BasicDesc implements OnInit, OnDestroy, IDescription {
  @Input()
  props: any;

  @Output()
  onDraw: EventEmitter<OnDrawParams> = new EventEmitter<OnDrawParams>();

  @Output()
  onRemove: EventEmitter<OnDrawParams> = new EventEmitter<OnDrawParams>();

  protected _cesiumObjectsMap: Map<string, any> = new Map<string, any>();
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

  getLayerService(): LayerService {
    return this._layerService;
  }

  setLayerService(layerService: LayerService) {
    this._layerService.unregisterDescription(this);
    this._layerService = layerService;
    this._layerService.registerDescription(this);
    this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache, true);
    this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
  }

  ngOnInit(): void {
    if (!this.props) {
      console.error('ac-desc components error: [props] input is mandatory');
    }

    this._layerService.registerDescription(this);
    this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props, this._layerService.cache);
    this._propsAssignerFn = this._cesiumProperties.createAssigner(this.props);
  }

  public getCesiumObjectsMap(): Map<string, any> {
    return this._cesiumObjectsMap;
  }

  draw(context: any, id: string, entity: AcEntity): void {
    const cesiumProps = this._propsEvaluator(context);

    if (!this._cesiumObjectsMap.has(id)) {
      const cesiumObject = this._drawer.add(cesiumProps);
      this.onDraw.emit({
        acEntity: entity,
        cesiumEntity: cesiumObject,
        entityId: id,
      });
      cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
      this._cesiumObjectsMap.set(id, cesiumObject);
    } else {
      const cesiumObject = this._cesiumObjectsMap.get(id);
      this.onDraw.emit({
        acEntity: entity,
        cesiumEntity: cesiumObject,
        entityId: id,
      });
      cesiumObject.acEntity = entity; // set the entity on the cesiumObject for later usage
      this._drawer.setPropsAssigner(this._getPropsAssigner());
      this._drawer.update(cesiumObject, cesiumProps);
    }
  }

  remove(id: string) {
    const cesiumObject = this._cesiumObjectsMap.get(id);
    if (cesiumObject) {
      this.onRemove.emit({
        acEntity: cesiumObject.acEntity,
        cesiumEntity: cesiumObject,
        entityId: id,
      });
      this._drawer.remove(cesiumObject);
      this._cesiumObjectsMap.delete(id);
    }
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
