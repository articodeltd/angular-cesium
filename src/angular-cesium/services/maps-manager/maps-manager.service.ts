import { Injectable } from '@angular/core';
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

  constructor() {}

  getMap(id?: string): AcMapComponent | undefined {
    if (!id) {
      return this.firstMap;
    }
    return this._Maps.get(id);
  }

  registerMap(id: string, acMap: AcMapComponent) {
    if (!this.firstMap) {
      this.firstMap = acMap;
    }
    const mapId = id ? id : this.generateDefaultId();
    this._Maps.set(mapId, acMap);
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
   * @param {string[]} mapIds - the ids of the maps to bind
   * @param {{ sensitivity?: number; bindZoom?: boolean }} options - binding options
   * sensitivity - the amount the camera position should change in order to sync other maps
   * bindZoom - should bind zoom level
   */
  bind2DMapsCameras(
    mapIds: string[],
    options: { sensitivity?: number; bindZoom?: boolean } = {
      sensitivity: 0.01
    }
  ) {
    this.unbindMapsCameras();
    const maps: AcMapComponent[] = mapIds.map(id => {
      const map = this.getMap(id);
      if (!map) {
        throw new Error(`Couldn't find map with id: ${id}`);
      }

      return map;
    });

    maps.forEach(masterMap => {
      const masterCamera = masterMap.getCameraService().getCamera();
      const masterCameraCartographic = masterCamera.positionCartographic;
      masterCamera.percentageChanged = options.sensitivity || 0.01;
      const removeCallback = masterCamera.changed.addEventListener(() => {
        maps.forEach(slaveMap => {
          if (slaveMap === masterMap) {
            return;
          }

          const slaveCamera = slaveMap.getCameraService().getCamera();
          const slaveCameraCartographic = slaveCamera.positionCartographic;
          const position = Cesium.Ellipsoid.WGS84.cartographicToCartesian({
            longitude: masterCameraCartographic.longitude,
            latitude: masterCameraCartographic.latitude,
            height: options.bindZoom
              ? masterCameraCartographic.height
              : slaveCameraCartographic.height
          });

          if (
            slaveMap.getCesiumViewer().scene.mode !== Cesium.SceneMode.MORPHING
          ) {
            slaveCamera.setView({ destination: position });
          }
        });
      });
      this.eventRemoveCallbacks.push(removeCallback);
    });
  }

  /**
   * Unbinds maps cameras
   */
  unbindMapsCameras() {
    this.eventRemoveCallbacks.forEach(removeCallback => removeCallback());
    this.eventRemoveCallbacks = [];
  }
}
