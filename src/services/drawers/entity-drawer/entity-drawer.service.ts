import { CesiumService } from '../../cesium/cesium.service';
import { Injectable } from '@angular/core';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';

/**
 *  This drawer is responsible for creating an entity, this should be used only if you need to create some kind of Cesium object
 *  we do not provide an API for (e.g, a 3d model).
 *  Caution, using entities is not adviced if performence is a concern.
 */
@Injectable()
export class EntityDrawerService extends SimpleDrawerService {
  constructor(cesiumService:CesiumService) {
    super(Map, cesiumService);
  }

  protected initialize(): void {
  }

  add(cesiumProps:any, ...moreProps):any {
    const entity = this.cesiumService.getViewer().entities.add(cesiumProps);

    this._cesiumCollection.set(entity.id, entity);

    return entity;
  }

  remove(entity:any):any {
    this._cesiumCollection.delete(entity.id);

    return this.cesiumService.getViewer().entities.remove(entity);
  }

  removeAll():any {
    for (let entity of this._cesiumCollection.values()) {
      this.cesiumService.getViewer().entities.remove(entity);
    }

    this._cesiumCollection = new Map();
  }
}
