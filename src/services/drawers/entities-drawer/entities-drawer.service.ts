import { Injectable } from '@angular/core';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { BasicEntityDrawerOptions } from '../../../models/basic-entity-drawer-options';

@Injectable()
export class EntitiesDrawerService extends BasicDrawerService {
  private entityCollections = new Map<any, OptimizedEntityCollection>();
  private graphicsTypeName: string;

  constructor(private cesiumService: CesiumService,
              private graphicsType: GraphicsType,
              private defaultOptions: BasicEntityDrawerOptions = {
                collectionMaxSize: -1,
                collectionSuspensionTime: -1,
                collectionsNumber: 1
              }) {
    super();
    this.graphicsTypeName = GraphicsType[this.graphicsType];
  }

  private getFreeEntitiesCollection(): OptimizedEntityCollection {
    let freeEntityCollection = null;
    this.entityCollections.forEach((entityCollection) => {
      if (entityCollection.isFree()) {
        freeEntityCollection = entityCollection;
      }
    });

    return freeEntityCollection;
  }

  init(options?: BasicEntityDrawerOptions) {
    const finalOptions = options || this.defaultOptions;
    for (let i = 0; i < finalOptions.collectionsNumber; i++) {
      const dataSource = new Cesium.CustomDataSource();
      this.cesiumService.getViewer().dataSources.add(dataSource);
      this.entityCollections.set(dataSource.entities,
        new OptimizedEntityCollection(
          dataSource.entities,
          finalOptions.collectionMaxSize,
          finalOptions.collectionSuspensionTime));
    }
  }

  add(cesiumProps: any) {
    const optimizedEntityCollection = this.getFreeEntitiesCollection();
    if (optimizedEntityCollection === null) {
      throw new Error('No more free entity collections');
    }

    const graphicsClass = this.graphicsType as any;
    return optimizedEntityCollection.add(
      {
        position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
        show: cesiumProps.show !== undefined ? cesiumProps.show : true,
        [this.graphicsTypeName]: new graphicsClass(cesiumProps)

      });
  }

  update(entity: any, cesiumProps: any) {
    this.suspendEntityCollection(entity);

    entity.position = cesiumProps.position !== undefined ? cesiumProps.position : undefined;
    entity.show = cesiumProps.show !== undefined ? cesiumProps.show : entity.show;
    if (this._propsAssigner) {
      this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
    }
    else {
      Object.assign(entity[this.graphicsTypeName], cesiumProps);
    }
  }

  remove(entity: any) {
    const optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
    optimizedEntityCollection.remove(entity);
  }

  removeAll() {
    this.entityCollections.forEach((entityCollection) => {
      entityCollection.removeAll();
    });
  }

  setShow(showValue: boolean) {
    this.entityCollections.forEach((entityCollection) => {
      entityCollection.setShow(showValue);
    });
  }

  private suspendEntityCollection(entity) {
    const id = entity.entityCollection;
    if (!this.entityCollections.has(id)) {
      throw new Error('No EntityCollection for entity.entityCollection');
    }

    const entityCollection = this.entityCollections.get(id);
    entityCollection.suspend();
  }
}

export class OptimizedEntityCollection {
  private _updateRate: number;
  private _collectionSize: number;
  private _isSuspended = false;
  private _isHardSuspend = false;
  private _suspensionTimeout;
  private _onEventSuspensionCallback: { once: boolean, callback: Function };
  private _onEventResumeCallback: { once: boolean, callback: Function };

  constructor(private entityCollection: any, collectionSize = -1 , updateRate = -1) {
    this._updateRate = updateRate;
    this._collectionSize = collectionSize;

  }

  setShow(show: boolean) {
    this.entityCollection.show = show;
  }

  get isSuspended(): boolean {
    return this._isSuspended;
  }

  get updateRate(): number {
    return this._updateRate;
  }

  set updateRate(value: number) {
    this._updateRate = value;
  }

  get collectionSize(): number {
    return this._collectionSize;
  }

  set collectionSize(value: number) {
    this._collectionSize = value;
  }

  collection() {
    return this.entityCollection;
  }

  isFree(): boolean {
    return this._collectionSize < 1 || this.entityCollection.values.length < this._collectionSize;
  }

  add(entity) {
    this.suspend();
    return this.entityCollection.add(entity);
  }

  remove(entity) {
    this.suspend();
    return this.entityCollection.remove(entity);
  }

  removeNoSuspend(entity) {
    this.entityCollection.remove(entity);
  }

  removeAll() {
    this.suspend();
    this.entityCollection.removeAll();
  }

  onEventSuspension(callback: Function, once = false): Function {
    this._onEventSuspensionCallback = { callback, once };
    return () => {
      this._onEventSuspensionCallback = undefined;
    };
  }

  onEventResume(callback: Function, once = false): Function {
    this._onEventResumeCallback = { callback, once };
    if (!this._isSuspended) {
      this.triggerEventResume();
    }
    return () => {
      this._onEventResumeCallback = undefined;
    };
  }

  triggerEventSuspension() {
    if (this._onEventSuspensionCallback !== undefined) {
      const callback = this._onEventSuspensionCallback.callback;
      if (this._onEventSuspensionCallback.once) {
        this._onEventSuspensionCallback = undefined;
      }
      callback();
    }
  }

  triggerEventResume() {
    if (this._onEventResumeCallback !== undefined) {
      const callback = this._onEventResumeCallback.callback;
      if (this._onEventResumeCallback.once) {
        this._onEventResumeCallback = undefined;
      }
      callback();
    }
  }

  public suspend() {
    if (this._updateRate < 0) {
      return;
    }
    if (this._isHardSuspend) {
      return;
    }
    if (!this._isSuspended) {
      this._isSuspended = true;
      this.entityCollection.suspendEvents();
      this.triggerEventSuspension();
      this._suspensionTimeout = setTimeout(() => {
        this.entityCollection.resumeEvents();
        this.triggerEventResume();
        this._isSuspended = false;
        this._suspensionTimeout = undefined;
      }, this._updateRate);
    }
  }

  public hardSuspend() {
    this.entityCollection.suspendEvents();
    this._isHardSuspend = true;
  }

  public hardResume() {
    this.entityCollection.resumeEvents();
    this._isHardSuspend = false;
  }

}
