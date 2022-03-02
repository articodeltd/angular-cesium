import { Injectable } from '@angular/core';
import { Ellipsoid, SceneMode, Cartographic } from 'cesium';
import { AcMapComponent } from '../../components/ac-map/ac-map.component';

/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
@Injectable()
export class MapsManagerService {
  private defaultIdCounter = 0;
  private _Maps = new Map<string, AcMapComponent>();
  private firstMap: any;
  private eventRemoveCallbacks: Function[] = [];

  constructor() {
  }

  getMap(id?: string): AcMapComponent | undefined {
    if (!id) {
      return this.firstMap;
    }
    return this._Maps.get(id);
  }

  _registerMap(id: string, acMap: AcMapComponent): string {
    if (!this.firstMap) {
      this.firstMap = acMap;
    }

    const mapId = id ? id : this.generateDefaultId();
    if (this._Maps.has(mapId)) {
      throw new Error(`Map with id: ${mapId} already exist`);
    }
    this._Maps.set(mapId, acMap);
    return mapId;
  }

  _removeMapById(id: string) {
    return this._Maps.delete(id);
  }

  private generateDefaultId(): string {
    this.defaultIdCounter++;
    return 'default-map-id-' + this.defaultIdCounter;
  }

  /**
   * Binds multiple 2D map's cameras together.
   * @param mapsConfiguration - binding options.
   * mapId - the id of the maps to bind.
   * sensitivity - the amount the camera position should change in order to sync other maps.
   * bindZoom - should bind zoom level
   */
  sync2DMapsCameras(mapsConfiguration: { id: string; sensitivity?: number; bindZoom?: boolean }[]) {
    const DEFAULT_SENSITIVITY = 0.01;
    this.unsyncMapsCameras();
    const maps: { map: AcMapComponent; options?: { sensitivity?: number; bindZoom?: boolean } }[] = mapsConfiguration.map(config => {
      const map = this.getMap(config.id);
      if (!map) {
        throw new Error(`Couldn't find map with id: ${config.id}`);
      }

      return {map, options: {sensitivity: config.sensitivity, bindZoom: config.bindZoom}};
    });

    maps.forEach(masterMapConfig => {
      const masterMap = masterMapConfig.map;
      const options = masterMapConfig.options;
      const masterCamera = masterMap.getCameraService().getCamera();
      const masterCameraCartographic = masterCamera.positionCartographic;
      masterCamera.percentageChanged = options.sensitivity || DEFAULT_SENSITIVITY;
      const removeCallback = masterCamera.changed.addEventListener(() => {
        maps.forEach(slaveMapConfig => {
          const slaveMap = slaveMapConfig.map;
          const slaveMapOptions = slaveMapConfig.options;
          if (slaveMap === masterMap) {
            return;
          }

          const slaveCamera = slaveMap.getCameraService().getCamera();
          const slaveCameraCartographic = slaveCamera.positionCartographic;
          const position = Ellipsoid.WGS84.cartographicToCartesian(
            new Cartographic(
                masterCameraCartographic.longitude,
                masterCameraCartographic.latitude,
                slaveMapOptions.bindZoom ? masterCameraCartographic.height : slaveCameraCartographic.height)
          );

          if (slaveMap.getCesiumViewer().scene.mode !== SceneMode.MORPHING) {
            slaveCamera.setView({
              destination: position,
              orientation: {
                heading: slaveCamera.heading,
                pitch: slaveCamera.pitch,
              },
            });
          }
        });
      });
      this.eventRemoveCallbacks.push(removeCallback);
    });
  }

  /**
   * Unsyncs maps cameras
   */
  unsyncMapsCameras() {
    this.eventRemoveCallbacks.forEach(removeCallback => removeCallback());
    this.eventRemoveCallbacks = [];
  }
}
