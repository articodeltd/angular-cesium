import { Injectable, Optional } from '@angular/core';
import { Cartographic, Rectangle } from 'cesium';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
import { CameraService } from '../../angular-cesium/services/camera/camera.service';
import { CesiumService } from '../../angular-cesium/services/cesium/cesium.service';
import { AcMapComponent } from '../../angular-cesium/components/ac-map/ac-map.component';

interface ZoomData {
  container: HTMLElement;
  borderElement?: HTMLElement;
  resetOnEscapePressFunc?: EventListenerOrEventListenerObject;
}

/**
 * The Service is as a "zoom to rectangle" tool
 *
 * example:
 * ```
 * constructor(
 *   private cameraService: CameraService,
 *   private cesiumService: CesiumService,
 *   private zoomToRectangleService: ZoomToRectangleService,
 * ) {
 *   this.zoomToRectangleService.init(cesiumService, cameraService);
 * }
 * ...
 * this.zoomToRectangleService.activate({onComplete: () => this.zoomToRectangleService.disable()});
 * ```
 *
 * `init()` - initialize the service with CameraService and CesiumService.
 * If no mapId is provided to activate() - must be called before calling `activate()`.
 *
 * `disable()` - disables the tool.
 *
 * `activate()` -
 * @param options
 * {
 *  onStart - optional - a callback that will be called when the user start drawing the rectangle
 *  onComplete - optional - a callback that will be called when the tool zoom in
 *  autoDisableOnZoom - optional - determines if the tool should auto disable after zoom - default: true
 *  animationDurationInSeconds - optional - zoom animation duration in seconds - default: 0.5
 *  borderStyle - optional - the style of the rectangle element border - default: '3px dashed #FFFFFF'
 *  backgroundColor - optional - the background color of the rectangle element - default: 'transparent'
 *  resetKeyCode - optional - the key code of the key that is used to reset the drawing of the rectangle - default: 27 (ESC key)
 *  threshold - optional - the minimum area of the screen rectangle (in pixels) that is required to perform zoom - default: 9
 *  keepRotation - optional - whether or not to keep the rotation when zooming in - default: true
 *  mouseButton - optional - sets the mouse button for drawing the rectangle - default: left mouse button (0)
 * }
 * @param mapId - optional - the mapId of the map that the tool will be used in.
 *
 */

export enum MouseButtons {
  LEFT = 0,
  MIDDLE = 1,
  RIGHT = 2,
}

@Injectable()
export class ZoomToRectangleService {
  constructor(
    private mapsManager: MapsManagerService,
    @Optional() cameraService: CameraService,
    @Optional() cesiumService: CesiumService,
  ) {}

  private cameraService: CameraService;
  private cesiumService: CesiumService;

  private mapsZoomElements = new Map<string, ZoomData>();
  private defaultOptions = {
    animationDurationInSeconds: 0.5,
    resetKeyCode: 27,
    borderStyle: '2px solid rgba(0,0,0,0.5)',
    backgroundColor: 'rgba(0,0,0,0.2)',
    autoDisableOnZoom: true,
    threshold: 9,
    keepRotation: true,
    mouseButton: MouseButtons.LEFT,
  };

  init(cesiumService: CesiumService, cameraService: CameraService) {
    this.cameraService = cameraService;
    this.cesiumService = cesiumService;
  }

  activate(
    options: {
      onStart?: (acMap?: AcMapComponent) => any;
      onComplete?: (acMap?: AcMapComponent) => any;
      mouseButton?: MouseButtons;
      autoDisableOnZoom?: boolean;
      animationDurationInSeconds?: number;
      threshold?: number;
      keepRotation?: boolean;
      borderStyle?: string;
      backgroundColor?: string;
      resetKeyCode?: number;
    } = {},
    mapId?: string,
  ) {
    if ((!this.cameraService || !this.cesiumService) && !mapId) {
      throw new Error(`The function must receive a mapId if the service wasn't initialized`);
    }
    const finalOptions = Object.assign({}, this.defaultOptions, options);
    let cameraService = this.cameraService;
    let mapContainer;
    let map;
    if (!mapId) {
      map = this.mapsManager.getMap();
      if (!map) {
        throw new Error(`Map not found`);
      }
      mapId = map.getId();
      mapContainer = this.cesiumService.getViewer().container;
    } else {
      map = this.mapsManager.getMap(mapId);
      if (!map) {
        throw new Error(`Map not found with id: ${mapId}`);
      }
      cameraService = map.getCameraService();
      mapContainer = map.getCesiumViewer().container;
    }

    if (!cameraService || !mapContainer) {
      throw new Error(`The function must receive a mapId if the service wasn't initialized`);
    }
    this.disable(mapId);
    const container = document.createElement('div');
    mapContainer.style.position = 'relative';
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.top = '0';
    container.style.left = '0';
    mapContainer.appendChild(container);
    const mapZoomData: ZoomData = { container };
    this.mapsZoomElements.set(mapId, mapZoomData);
    let mouse = {
      endX: 0,
      endY: 0,
      startX: 0,
      startY: 0,
    };
    let borderElement: HTMLElement | undefined;

    container.onmousedown = e => {
      if (e.button !== finalOptions.mouseButton) {
        return;
      }
      if (!borderElement) {
        if (options && options.onStart) {
          options.onStart(map);
        }

        const rect = (e.currentTarget as any).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        mouse.startX = offsetX;
        mouse.startY = offsetY;
        borderElement = document.createElement('div');
        borderElement.className = 'zoom-to-rectangle-border';
        borderElement.style.position = 'absolute';
        borderElement.style.border = finalOptions.borderStyle;
        borderElement.style.backgroundColor = finalOptions.backgroundColor;
        borderElement.style.left = mouse.startX + 'px';
        borderElement.style.top = mouse.startY + 'px';
        container.appendChild(borderElement);
        mapZoomData.borderElement = borderElement;
      }
    };

    container.onmouseup = e => {
      if (borderElement) {
        let zoomApplied;
        if (mouse && Math.abs(mouse.endX - mouse.startX) * Math.abs(mouse.endY - mouse.startY) > finalOptions.threshold) {
          zoomApplied = this.zoomCameraToRectangle(
            cameraService,
            mouse,
            finalOptions.animationDurationInSeconds,
            finalOptions,
          );
        }
        borderElement.remove();
        borderElement = undefined;
        mapZoomData.borderElement = undefined;
        mouse = {
          endX: 0,
          endY: 0,
          startX: 0,
          startY: 0,
        };
        if (!!finalOptions.onComplete) {
          finalOptions.onComplete(map);
        }
        if (finalOptions.autoDisableOnZoom && zoomApplied) {
          this.disable(mapId);
        }
      }
    };

    container.onmousemove = e => {
      if (borderElement) {
        const rect = (e.currentTarget as any).getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        mouse.endX = offsetX;
        mouse.endY = offsetY;
        borderElement.style.width = Math.abs(mouse.endX - mouse.startX) + 'px';
        borderElement.style.height = Math.abs(mouse.endY - mouse.startY) + 'px';
        borderElement.style.left = Math.min(mouse.startX, mouse.endX) + 'px';
        borderElement.style.top = Math.min(mouse.startY, mouse.endY) + 'px';
      }
    };

    const resetOnEscapePress = e => {
      if (e.keyCode === finalOptions.resetKeyCode && borderElement) {
        borderElement.remove();
        borderElement = undefined;
        mapZoomData.borderElement = undefined;
        mouse = {
          endX: 0,
          endY: 0,
          startX: 0,
          startY: 0,
        };
      }
    };
    document.addEventListener('keydown', resetOnEscapePress);
    mapZoomData.resetOnEscapePressFunc = resetOnEscapePress;
  }

  public disable(mapId?: string) {
    if (!this.mapsManager && !mapId) {
      throw new Error('If the service was not initialized with MapsManager, mapId must be provided');
    }
    if (!mapId) {
      const map = this.mapsManager.getMap();
      mapId = map.getId();
    }
    const data = this.mapsZoomElements.get(mapId);
    if (data) {
      data.container.remove();
      if (data.borderElement) {
        data.borderElement.remove();
      }
      if (data.resetOnEscapePressFunc) {
        document.removeEventListener('keydown', data.resetOnEscapePressFunc);
      }
    }
    this.mapsZoomElements.delete(mapId);
  }

  private zoomCameraToRectangle(
    cameraService: CameraService,
    positions: { endX: number; endY: number; startX: number; startY: number },
    animationDuration,
    options,
  ): boolean {
    const camera = cameraService.getCamera();
    const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
    const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
    if (!cartesian1 || !cartesian2) {
      return false;
    }
    const cartographic1 = Cartographic.fromCartesian(cartesian1);
    const cartographic2 = Cartographic.fromCartesian(cartesian2);
    cameraService.cameraFlyTo({
      destination: new Rectangle(
        Math.min(cartographic1.longitude, cartographic2.longitude),
        Math.min(cartographic1.latitude, cartographic2.latitude),
        Math.max(cartographic1.longitude, cartographic2.longitude),
        Math.max(cartographic1.latitude, cartographic2.latitude),
      ),
      orientation: options.keepRotation ? { heading: camera.heading } : undefined,
      duration: animationDuration,
    });
    return true;
  }
}
