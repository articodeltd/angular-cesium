import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import { CustomDataSource, CallbackProperty } from 'cesium';
import { CesiumService } from '../../cesium/cesium.service';
import { GraphicsType } from './enums/graphics-type.enum';
import { EntitiesDrawerOptions } from '../../../models/entities-drawer-options';
import { OptimizedEntityCollection } from './optimized-entity-collection';

/**
 *  General primitives drawer responsible of drawing Cesium primitives.
 *  Drawers the handle Cesium primitives extend it.
 */

export class EntitiesDrawerService extends BasicDrawerService {
  private entityCollections = new Map<any, OptimizedEntityCollection>();
  private graphicsTypeName: string;

  constructor(
    private cesiumService: CesiumService,
    private graphicsType: GraphicsType,
    private defaultOptions: EntitiesDrawerOptions = {
      collectionMaxSize: -1,
      collectionSuspensionTime: -1,
      collectionsNumber: 1,
    },
  ) {
    super();
    this.graphicsTypeName = "Unknown";

    // Fix bad enum compilation
    for (const i in GraphicsType) {
      if (GraphicsType[i] as any === this.graphicsType) {
        this.graphicsTypeName = i;
      }
    }
  }

  private getFreeEntitiesCollection(): OptimizedEntityCollection {
    let freeEntityCollection = null;
    this.entityCollections.forEach(entityCollection => {
      if (entityCollection.isFree()) {
        freeEntityCollection = entityCollection;
      }
    });

    return freeEntityCollection;
  }

  init(options?: EntitiesDrawerOptions) {
    const finalOptions = options || this.defaultOptions;
    const dataSources = [];
    for (let i = 0; i < finalOptions.collectionsNumber; i++) {
      const dataSource = new CustomDataSource(this.graphicsTypeName);
      dataSources.push(dataSource);
      this.cesiumService.getViewer().dataSources.add(dataSource);
      this.entityCollections.set(
        dataSource.entities,
        new OptimizedEntityCollection(dataSource.entities, finalOptions.collectionMaxSize, finalOptions.collectionSuspensionTime),
      );
    }

    return dataSources;
  }

  add(cesiumProps: any): any {
    const optimizedEntityCollection = this.getFreeEntitiesCollection();
    if (optimizedEntityCollection === null) {
      throw new Error('No more free entity collections');
    }

    const entityObject = {
      position: cesiumProps.position !== undefined ? cesiumProps.position : undefined,
      description: cesiumProps.description !== undefined ? cesiumProps.description : undefined,
      orientation: cesiumProps.orientation !== undefined ? cesiumProps.orientation : undefined,
      viewFrom: cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : undefined,
      [this.graphicsTypeName]: cesiumProps,
    };

    if (cesiumProps.name !== undefined) {
      entityObject.name = cesiumProps.name;
    }
    if (cesiumProps.availability !== undefined) {
      entityObject.availability = cesiumProps.availability;
    }

    return optimizedEntityCollection.add(entityObject);
  }

  update(entity: any, cesiumProps: any) {
    this.suspendEntityCollection(entity);

    if (entity.position instanceof CallbackProperty) {
      if (entity.position._isConstant) {
        entity.position = cesiumProps.position;
      }
    }
    entity.position = cesiumProps.position !== undefined ? cesiumProps.position : undefined;
    entity.name = cesiumProps.name !== undefined ? cesiumProps.name : entity.name;
    entity.description = cesiumProps.description !== undefined ? cesiumProps.description : entity.description;
    entity.orientation = cesiumProps.orientation !== undefined ? cesiumProps.orientation : entity.orientation;
    entity.viewFrom = cesiumProps.viewFrom !== undefined ? cesiumProps.viewFrom : entity.viewFrom;
    entity.availability = cesiumProps.availability !== undefined ? cesiumProps.availability : cesiumProps.availability;

    if (this._propsAssigner) {
      this._propsAssigner(entity[this.graphicsTypeName], cesiumProps);
    } else {
      Object.assign(entity[this.graphicsTypeName], cesiumProps);
    }
  }

  remove(entity: any) {
    const optimizedEntityCollection = this.entityCollections.get(entity.entityCollection);
    optimizedEntityCollection.remove(entity);
  }

  removeAll() {
    this.entityCollections.forEach(entityCollection => {
      entityCollection.removeAll();
    });
  }

  setShow(showValue: boolean) {
    this.entityCollections.forEach(entityCollection => {
      entityCollection.setShow(showValue);
    });
  }

  private suspendEntityCollection(entity: any) {
    const id = entity.entityCollection;
    if (!this.entityCollections.has(id)) {
      throw new Error('No EntityCollection for entity.entityCollection');
    }

    const entityCollection = this.entityCollections.get(id);
    entityCollection.suspend();
  }
}

