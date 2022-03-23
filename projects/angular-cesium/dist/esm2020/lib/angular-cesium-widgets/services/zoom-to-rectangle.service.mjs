import { Injectable, Optional } from '@angular/core';
import { Cartographic, Rectangle } from 'cesium';
import * as i0 from "@angular/core";
import * as i1 from "../../angular-cesium/services/maps-manager/maps-manager.service";
import * as i2 from "../../angular-cesium/services/camera/camera.service";
import * as i3 from "../../angular-cesium/services/cesium/cesium.service";
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
export var MouseButtons;
(function (MouseButtons) {
    MouseButtons[MouseButtons["LEFT"] = 0] = "LEFT";
    MouseButtons[MouseButtons["MIDDLE"] = 1] = "MIDDLE";
    MouseButtons[MouseButtons["RIGHT"] = 2] = "RIGHT";
})(MouseButtons || (MouseButtons = {}));
export class ZoomToRectangleService {
    constructor(mapsManager, cameraService, cesiumService) {
        this.mapsManager = mapsManager;
        this.mapsZoomElements = new Map();
        this.defaultOptions = {
            animationDurationInSeconds: 0.5,
            resetKeyCode: 27,
            borderStyle: '2px solid rgba(0,0,0,0.5)',
            backgroundColor: 'rgba(0,0,0,0.2)',
            autoDisableOnZoom: true,
            threshold: 9,
            keepRotation: true,
            mouseButton: MouseButtons.LEFT,
        };
    }
    init(cesiumService, cameraService) {
        this.cameraService = cameraService;
        this.cesiumService = cesiumService;
    }
    activate(options = {}, mapId) {
        if ((!this.cameraService || !this.cesiumService) && !mapId) {
            throw new Error(`The function must receive a mapId if the service wasn't initialized`);
        }
        const finalOptions = Object.assign({}, this.defaultOptions, options);
        let cameraService = this.cameraService;
        let mapContainer;
        let map;
        if (this.cesiumService) {
            mapContainer = this.cesiumService.getViewer().container;
        }
        if (!mapId) {
            map = this.mapsManager.getMap();
            mapId = map.getId();
        }
        else {
            map = this.mapsManager.getMap(mapId);
            if (!map) {
                throw new Error(`Map not found with id: ${mapId}`);
            }
        }
        cameraService = map.getCameraService();
        mapContainer = map.getCesiumViewer().container;
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
        const mapZoomData = { container };
        this.mapsZoomElements.set(mapId, mapZoomData);
        let mouse = {
            endX: 0,
            endY: 0,
            startX: 0,
            startY: 0,
        };
        let borderElement;
        container.onmousedown = e => {
            if (e.button !== finalOptions.mouseButton) {
                return;
            }
            if (!borderElement) {
                if (options && options.onStart) {
                    options.onStart(map);
                }
                const rect = e.currentTarget.getBoundingClientRect();
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
                    zoomApplied = this.zoomCameraToRectangle(cameraService, mouse, finalOptions.animationDurationInSeconds, finalOptions);
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
                const rect = e.currentTarget.getBoundingClientRect();
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
    disable(mapId) {
        if (!this.mapsManager && !mapId) {
            throw new Error('If the service was not initialized with CesiumService, mapId must be provided');
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
    zoomCameraToRectangle(cameraService, positions, animationDuration, options) {
        const camera = cameraService.getCamera();
        const cartesian1 = camera.pickEllipsoid({ x: positions.startX, y: positions.startY });
        const cartesian2 = camera.pickEllipsoid({ x: positions.endX, y: positions.endY });
        if (!cartesian1 || !cartesian2) {
            return false;
        }
        const cartographic1 = Cartographic.fromCartesian(cartesian1);
        const cartographic2 = Cartographic.fromCartesian(cartesian2);
        cameraService.cameraFlyTo({
            destination: new Rectangle(Math.min(cartographic1.longitude, cartographic2.longitude), Math.min(cartographic1.latitude, cartographic2.latitude), Math.max(cartographic1.longitude, cartographic2.longitude), Math.max(cartographic1.latitude, cartographic2.latitude)),
            orientation: options.keepRotation ? { heading: camera.heading } : undefined,
            duration: animationDuration,
        });
        return true;
    }
}
ZoomToRectangleService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService, deps: [{ token: i1.MapsManagerService }, { token: i2.CameraService, optional: true }, { token: i3.CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
ZoomToRectangleService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ZoomToRectangleService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.MapsManagerService }, { type: i2.CameraService, decorators: [{
                    type: Optional
                }] }, { type: i3.CesiumService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiem9vbS10by1yZWN0YW5nbGUuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9zZXJ2aWNlcy96b29tLXRvLXJlY3RhbmdsZS5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsUUFBUSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBRSxZQUFZLEVBQUUsU0FBUyxFQUFFLE1BQU0sUUFBUSxDQUFDOzs7OztBQVlqRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFDRztBQUVILE1BQU0sQ0FBTixJQUFZLFlBSVg7QUFKRCxXQUFZLFlBQVk7SUFDdEIsK0NBQVEsQ0FBQTtJQUNSLG1EQUFVLENBQUE7SUFDVixpREFBUyxDQUFBO0FBQ1gsQ0FBQyxFQUpXLFlBQVksS0FBWixZQUFZLFFBSXZCO0FBR0QsTUFBTSxPQUFPLHNCQUFzQjtJQUNqQyxZQUNVLFdBQStCLEVBQzNCLGFBQTRCLEVBQzVCLGFBQTRCO1FBRmhDLGdCQUFXLEdBQVgsV0FBVyxDQUFvQjtRQVFqQyxxQkFBZ0IsR0FBRyxJQUFJLEdBQUcsRUFBb0IsQ0FBQztRQUMvQyxtQkFBYyxHQUFHO1lBQ3ZCLDBCQUEwQixFQUFFLEdBQUc7WUFDL0IsWUFBWSxFQUFFLEVBQUU7WUFDaEIsV0FBVyxFQUFFLDJCQUEyQjtZQUN4QyxlQUFlLEVBQUUsaUJBQWlCO1lBQ2xDLGlCQUFpQixFQUFFLElBQUk7WUFDdkIsU0FBUyxFQUFFLENBQUM7WUFDWixZQUFZLEVBQUUsSUFBSTtZQUNsQixXQUFXLEVBQUUsWUFBWSxDQUFDLElBQUk7U0FDL0IsQ0FBQztJQWZDLENBQUM7SUFpQkosSUFBSSxDQUFDLGFBQTRCLEVBQUUsYUFBNEI7UUFDN0QsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7UUFDbkMsSUFBSSxDQUFDLGFBQWEsR0FBRyxhQUFhLENBQUM7SUFDckMsQ0FBQztJQUVELFFBQVEsQ0FDTixVQVdJLEVBQUUsRUFDTixLQUFjO1FBRWQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLGFBQWEsSUFBSSxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMxRCxNQUFNLElBQUksS0FBSyxDQUFDLHFFQUFxRSxDQUFDLENBQUM7U0FDeEY7UUFDRCxNQUFNLFlBQVksR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxJQUFJLENBQUMsY0FBYyxFQUFFLE9BQU8sQ0FBQyxDQUFDO1FBQ3JFLElBQUksYUFBYSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUM7UUFDdkMsSUFBSSxZQUFZLENBQUM7UUFDakIsSUFBSSxHQUFHLENBQUM7UUFDUixJQUFJLElBQUksQ0FBQyxhQUFhLEVBQUU7WUFDdEIsWUFBWSxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsU0FBUyxDQUFDO1NBQ3pEO1FBQ0QsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUNWLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDO1lBQ2hDLEtBQUssR0FBRyxHQUFHLENBQUMsS0FBSyxFQUFFLENBQUM7U0FDckI7YUFBTTtZQUNMLEdBQUcsR0FBRyxJQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNyQyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNSLE1BQU0sSUFBSSxLQUFLLENBQUMsMEJBQTBCLEtBQUssRUFBRSxDQUFDLENBQUM7YUFDcEQ7U0FDRjtRQUNELGFBQWEsR0FBRyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsQ0FBQztRQUN2QyxZQUFZLEdBQUcsR0FBRyxDQUFDLGVBQWUsRUFBRSxDQUFDLFNBQVMsQ0FBQztRQUcvQyxJQUFJLENBQUMsYUFBYSxJQUFJLENBQUMsWUFBWSxFQUFFO1lBQ25DLE1BQU0sSUFBSSxLQUFLLENBQUMscUVBQXFFLENBQUMsQ0FBQztTQUN4RjtRQUNELElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDcEIsTUFBTSxTQUFTLEdBQUcsUUFBUSxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUNoRCxZQUFZLENBQUMsS0FBSyxDQUFDLFFBQVEsR0FBRyxVQUFVLENBQUM7UUFDekMsU0FBUyxDQUFDLEtBQUssQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDO1FBQ3RDLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLE1BQU0sQ0FBQztRQUMvQixTQUFTLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDaEMsU0FBUyxDQUFDLEtBQUssQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO1FBQzFCLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLEdBQUcsQ0FBQztRQUMzQixZQUFZLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQ3BDLE1BQU0sV0FBVyxHQUFhLEVBQUUsU0FBUyxFQUFFLENBQUM7UUFDNUMsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsV0FBVyxDQUFDLENBQUM7UUFDOUMsSUFBSSxLQUFLLEdBQUc7WUFDVixJQUFJLEVBQUUsQ0FBQztZQUNQLElBQUksRUFBRSxDQUFDO1lBQ1AsTUFBTSxFQUFFLENBQUM7WUFDVCxNQUFNLEVBQUUsQ0FBQztTQUNWLENBQUM7UUFDRixJQUFJLGFBQXNDLENBQUM7UUFFM0MsU0FBUyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUMxQixJQUFJLENBQUMsQ0FBQyxNQUFNLEtBQUssWUFBWSxDQUFDLFdBQVcsRUFBRTtnQkFDekMsT0FBTzthQUNSO1lBQ0QsSUFBSSxDQUFDLGFBQWEsRUFBRTtnQkFDbEIsSUFBSSxPQUFPLElBQUksT0FBTyxDQUFDLE9BQU8sRUFBRTtvQkFDOUIsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztpQkFDdEI7Z0JBRUQsTUFBTSxJQUFJLEdBQUksQ0FBQyxDQUFDLGFBQXFCLENBQUMscUJBQXFCLEVBQUUsQ0FBQztnQkFDOUQsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUN0QyxNQUFNLE9BQU8sR0FBRyxDQUFDLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUM7Z0JBQ3JDLEtBQUssQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO2dCQUN2QixLQUFLLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQztnQkFDdkIsYUFBYSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLENBQUM7Z0JBQzlDLGFBQWEsQ0FBQyxTQUFTLEdBQUcsMEJBQTBCLENBQUM7Z0JBQ3JELGFBQWEsQ0FBQyxLQUFLLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQztnQkFDMUMsYUFBYSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsWUFBWSxDQUFDLFdBQVcsQ0FBQztnQkFDdEQsYUFBYSxDQUFDLEtBQUssQ0FBQyxlQUFlLEdBQUcsWUFBWSxDQUFDLGVBQWUsQ0FBQztnQkFDbkUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUM7Z0JBQy9DLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDO2dCQUM5QyxTQUFTLENBQUMsV0FBVyxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUNyQyxXQUFXLENBQUMsYUFBYSxHQUFHLGFBQWEsQ0FBQzthQUMzQztRQUNILENBQUMsQ0FBQztRQUVGLFNBQVMsQ0FBQyxTQUFTLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDeEIsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLElBQUksV0FBVyxDQUFDO2dCQUNoQixJQUFJLEtBQUssSUFBSSxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsWUFBWSxDQUFDLFNBQVMsRUFBRTtvQkFDL0csV0FBVyxHQUFHLElBQUksQ0FBQyxxQkFBcUIsQ0FDdEMsYUFBYSxFQUNiLEtBQUssRUFDTCxZQUFZLENBQUMsMEJBQTBCLEVBQ3ZDLFlBQVksQ0FDYixDQUFDO2lCQUNIO2dCQUNELGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdkIsYUFBYSxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsV0FBVyxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7Z0JBQ3RDLEtBQUssR0FBRztvQkFDTixJQUFJLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxNQUFNLEVBQUUsQ0FBQztvQkFDVCxNQUFNLEVBQUUsQ0FBQztpQkFDVixDQUFDO2dCQUNGLElBQUksQ0FBQyxDQUFDLFlBQVksQ0FBQyxVQUFVLEVBQUU7b0JBQzdCLFlBQVksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUM7aUJBQzlCO2dCQUNELElBQUksWUFBWSxDQUFDLGlCQUFpQixJQUFJLFdBQVcsRUFBRTtvQkFDakQsSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDckI7YUFDRjtRQUNILENBQUMsQ0FBQztRQUVGLFNBQVMsQ0FBQyxXQUFXLEdBQUcsQ0FBQyxDQUFDLEVBQUU7WUFDMUIsSUFBSSxhQUFhLEVBQUU7Z0JBQ2pCLE1BQU0sSUFBSSxHQUFJLENBQUMsQ0FBQyxhQUFxQixDQUFDLHFCQUFxQixFQUFFLENBQUM7Z0JBQzlELE1BQU0sT0FBTyxHQUFHLENBQUMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDdEMsTUFBTSxPQUFPLEdBQUcsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDO2dCQUNyQyxLQUFLLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztnQkFDckIsS0FBSyxDQUFDLElBQUksR0FBRyxPQUFPLENBQUM7Z0JBQ3JCLGFBQWEsQ0FBQyxLQUFLLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLEdBQUcsSUFBSSxDQUFDO2dCQUN2RSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLElBQUksQ0FBQztnQkFDeEUsYUFBYSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUMsR0FBRyxJQUFJLENBQUM7Z0JBQ3JFLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDO2FBQ3JFO1FBQ0gsQ0FBQyxDQUFDO1FBRUYsTUFBTSxrQkFBa0IsR0FBRyxDQUFDLENBQUMsRUFBRTtZQUM3QixJQUFJLENBQUMsQ0FBQyxPQUFPLEtBQUssWUFBWSxDQUFDLFlBQVksSUFBSSxhQUFhLEVBQUU7Z0JBQzVELGFBQWEsQ0FBQyxNQUFNLEVBQUUsQ0FBQztnQkFDdkIsYUFBYSxHQUFHLFNBQVMsQ0FBQztnQkFDMUIsV0FBVyxDQUFDLGFBQWEsR0FBRyxTQUFTLENBQUM7Z0JBQ3RDLEtBQUssR0FBRztvQkFDTixJQUFJLEVBQUUsQ0FBQztvQkFDUCxJQUFJLEVBQUUsQ0FBQztvQkFDUCxNQUFNLEVBQUUsQ0FBQztvQkFDVCxNQUFNLEVBQUUsQ0FBQztpQkFDVixDQUFDO2FBQ0g7UUFDSCxDQUFDLENBQUM7UUFDRixRQUFRLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLENBQUM7UUFDekQsV0FBVyxDQUFDLHNCQUFzQixHQUFHLGtCQUFrQixDQUFDO0lBQzFELENBQUM7SUFFTSxPQUFPLENBQUMsS0FBYztRQUMzQixJQUFJLENBQUMsSUFBSSxDQUFDLFdBQVcsSUFBSSxDQUFDLEtBQUssRUFBRTtZQUMvQixNQUFNLElBQUksS0FBSyxDQUFDLCtFQUErRSxDQUFDLENBQUM7U0FDbEc7UUFDRCxJQUFJLENBQUMsS0FBSyxFQUFFO1lBQ1YsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLFdBQVcsQ0FBQyxNQUFNLEVBQUUsQ0FBQztZQUN0QyxLQUFLLEdBQUcsR0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO1NBQ3JCO1FBQ0QsTUFBTSxJQUFJLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxJQUFJLElBQUksRUFBRTtZQUNSLElBQUksQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLENBQUM7WUFDeEIsSUFBSSxJQUFJLENBQUMsYUFBYSxFQUFFO2dCQUN0QixJQUFJLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxDQUFDO2FBQzdCO1lBQ0QsSUFBSSxJQUFJLENBQUMsc0JBQXNCLEVBQUU7Z0JBQy9CLFFBQVEsQ0FBQyxtQkFBbUIsQ0FBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLHNCQUFzQixDQUFDLENBQUM7YUFDdEU7U0FDRjtRQUNELElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDdEMsQ0FBQztJQUVPLHFCQUFxQixDQUMzQixhQUE0QixFQUM1QixTQUF5RSxFQUN6RSxpQkFBaUIsRUFDakIsT0FBTztRQUVQLE1BQU0sTUFBTSxHQUFHLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQztRQUN6QyxNQUFNLFVBQVUsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxFQUFFLFNBQVMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RGLE1BQU0sVUFBVSxHQUFHLE1BQU0sQ0FBQyxhQUFhLENBQUMsRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7UUFDbEYsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLFVBQVUsRUFBRTtZQUM5QixPQUFPLEtBQUssQ0FBQztTQUNkO1FBQ0QsTUFBTSxhQUFhLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUM3RCxNQUFNLGFBQWEsR0FBRyxZQUFZLENBQUMsYUFBYSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELGFBQWEsQ0FBQyxXQUFXLENBQUM7WUFDeEIsV0FBVyxFQUFFLElBQUksU0FBUyxDQUN4QixJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUN4RCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsYUFBYSxDQUFDLFNBQVMsQ0FBQyxFQUMxRCxJQUFJLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsYUFBYSxDQUFDLFFBQVEsQ0FBQyxDQUN6RDtZQUNELFdBQVcsRUFBRSxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUMsQ0FBQyxFQUFFLE9BQU8sRUFBRSxNQUFNLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFNBQVM7WUFDM0UsUUFBUSxFQUFFLGlCQUFpQjtTQUM1QixDQUFDLENBQUM7UUFDSCxPQUFPLElBQUksQ0FBQztJQUNkLENBQUM7O21IQTNOVSxzQkFBc0I7dUhBQXRCLHNCQUFzQjsyRkFBdEIsc0JBQXNCO2tCQURsQyxVQUFVOzswQkFJTixRQUFROzswQkFDUixRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgT3B0aW9uYWwgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2FydG9ncmFwaGljLCBSZWN0YW5nbGUgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXBzLW1hbmFnZXIvbWFwcy1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IEFjTWFwQ29tcG9uZW50IH0gZnJvbSAnLi4vLi4vYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudCc7XHJcblxyXG5pbnRlcmZhY2UgWm9vbURhdGEge1xyXG4gIGNvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcbiAgYm9yZGVyRWxlbWVudD86IEhUTUxFbGVtZW50O1xyXG4gIHJlc2V0T25Fc2NhcGVQcmVzc0Z1bmM/OiBFdmVudExpc3RlbmVyT3JFdmVudExpc3RlbmVyT2JqZWN0O1xyXG59XHJcblxyXG4vKipcclxuICogVGhlIFNlcnZpY2UgaXMgYXMgYSBcInpvb20gdG8gcmVjdGFuZ2xlXCIgdG9vbFxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiBgYGBcclxuICogY29uc3RydWN0b3IoXHJcbiAqICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxyXG4gKiAgIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZSxcclxuICogICBwcml2YXRlIHpvb21Ub1JlY3RhbmdsZVNlcnZpY2U6IFpvb21Ub1JlY3RhbmdsZVNlcnZpY2UsXHJcbiAqICkge1xyXG4gKiAgIHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5pbml0KGNlc2l1bVNlcnZpY2UsIGNhbWVyYVNlcnZpY2UpO1xyXG4gKiB9XHJcbiAqIC4uLlxyXG4gKiB0aGlzLnpvb21Ub1JlY3RhbmdsZVNlcnZpY2UuYWN0aXZhdGUoe29uQ29tcGxldGU6ICgpID0+IHRoaXMuem9vbVRvUmVjdGFuZ2xlU2VydmljZS5kaXNhYmxlKCl9KTtcclxuICogYGBgXHJcbiAqXHJcbiAqIGBpbml0KClgIC0gaW5pdGlhbGl6ZSB0aGUgc2VydmljZSB3aXRoIENhbWVyYVNlcnZpY2UgYW5kIENlc2l1bVNlcnZpY2UuXHJcbiAqIElmIG5vIG1hcElkIGlzIHByb3ZpZGVkIHRvIGFjdGl2YXRlKCkgLSBtdXN0IGJlIGNhbGxlZCBiZWZvcmUgY2FsbGluZyBgYWN0aXZhdGUoKWAuXHJcbiAqXHJcbiAqIGBkaXNhYmxlKClgIC0gZGlzYWJsZXMgdGhlIHRvb2wuXHJcbiAqXHJcbiAqIGBhY3RpdmF0ZSgpYCAtXHJcbiAqIEBwYXJhbSBvcHRpb25zXHJcbiAqIHtcclxuICogIG9uU3RhcnQgLSBvcHRpb25hbCAtIGEgY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGNhbGxlZCB3aGVuIHRoZSB1c2VyIHN0YXJ0IGRyYXdpbmcgdGhlIHJlY3RhbmdsZVxyXG4gKiAgb25Db21wbGV0ZSAtIG9wdGlvbmFsIC0gYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgY2FsbGVkIHdoZW4gdGhlIHRvb2wgem9vbSBpblxyXG4gKiAgYXV0b0Rpc2FibGVPblpvb20gLSBvcHRpb25hbCAtIGRldGVybWluZXMgaWYgdGhlIHRvb2wgc2hvdWxkIGF1dG8gZGlzYWJsZSBhZnRlciB6b29tIC0gZGVmYXVsdDogdHJ1ZVxyXG4gKiAgYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHMgLSBvcHRpb25hbCAtIHpvb20gYW5pbWF0aW9uIGR1cmF0aW9uIGluIHNlY29uZHMgLSBkZWZhdWx0OiAwLjVcclxuICogIGJvcmRlclN0eWxlIC0gb3B0aW9uYWwgLSB0aGUgc3R5bGUgb2YgdGhlIHJlY3RhbmdsZSBlbGVtZW50IGJvcmRlciAtIGRlZmF1bHQ6ICczcHggZGFzaGVkICNGRkZGRkYnXHJcbiAqICBiYWNrZ3JvdW5kQ29sb3IgLSBvcHRpb25hbCAtIHRoZSBiYWNrZ3JvdW5kIGNvbG9yIG9mIHRoZSByZWN0YW5nbGUgZWxlbWVudCAtIGRlZmF1bHQ6ICd0cmFuc3BhcmVudCdcclxuICogIHJlc2V0S2V5Q29kZSAtIG9wdGlvbmFsIC0gdGhlIGtleSBjb2RlIG9mIHRoZSBrZXkgdGhhdCBpcyB1c2VkIHRvIHJlc2V0IHRoZSBkcmF3aW5nIG9mIHRoZSByZWN0YW5nbGUgLSBkZWZhdWx0OiAyNyAoRVNDIGtleSlcclxuICogIHRocmVzaG9sZCAtIG9wdGlvbmFsIC0gdGhlIG1pbmltdW0gYXJlYSBvZiB0aGUgc2NyZWVuIHJlY3RhbmdsZSAoaW4gcGl4ZWxzKSB0aGF0IGlzIHJlcXVpcmVkIHRvIHBlcmZvcm0gem9vbSAtIGRlZmF1bHQ6IDlcclxuICogIGtlZXBSb3RhdGlvbiAtIG9wdGlvbmFsIC0gd2hldGhlciBvciBub3QgdG8ga2VlcCB0aGUgcm90YXRpb24gd2hlbiB6b29taW5nIGluIC0gZGVmYXVsdDogdHJ1ZVxyXG4gKiAgbW91c2VCdXR0b24gLSBvcHRpb25hbCAtIHNldHMgdGhlIG1vdXNlIGJ1dHRvbiBmb3IgZHJhd2luZyB0aGUgcmVjdGFuZ2xlIC0gZGVmYXVsdDogbGVmdCBtb3VzZSBidXR0b24gKDApXHJcbiAqIH1cclxuICogQHBhcmFtIG1hcElkIC0gb3B0aW9uYWwgLSB0aGUgbWFwSWQgb2YgdGhlIG1hcCB0aGF0IHRoZSB0b29sIHdpbGwgYmUgdXNlZCBpbi5cclxuICpcclxuICovXHJcblxyXG5leHBvcnQgZW51bSBNb3VzZUJ1dHRvbnMge1xyXG4gIExFRlQgPSAwLFxyXG4gIE1JRERMRSA9IDEsXHJcbiAgUklHSFQgPSAyLFxyXG59XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBab29tVG9SZWN0YW5nbGVTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgbWFwc01hbmFnZXI6IE1hcHNNYW5hZ2VyU2VydmljZSxcclxuICAgIEBPcHRpb25hbCgpIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXHJcbiAgICBAT3B0aW9uYWwoKSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxyXG4gICkge31cclxuXHJcbiAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlO1xyXG4gIHByaXZhdGUgY2VzaXVtU2VydmljZTogQ2VzaXVtU2VydmljZTtcclxuXHJcbiAgcHJpdmF0ZSBtYXBzWm9vbUVsZW1lbnRzID0gbmV3IE1hcDxzdHJpbmcsIFpvb21EYXRhPigpO1xyXG4gIHByaXZhdGUgZGVmYXVsdE9wdGlvbnMgPSB7XHJcbiAgICBhbmltYXRpb25EdXJhdGlvbkluU2Vjb25kczogMC41LFxyXG4gICAgcmVzZXRLZXlDb2RlOiAyNyxcclxuICAgIGJvcmRlclN0eWxlOiAnMnB4IHNvbGlkIHJnYmEoMCwwLDAsMC41KScsXHJcbiAgICBiYWNrZ3JvdW5kQ29sb3I6ICdyZ2JhKDAsMCwwLDAuMiknLFxyXG4gICAgYXV0b0Rpc2FibGVPblpvb206IHRydWUsXHJcbiAgICB0aHJlc2hvbGQ6IDksXHJcbiAgICBrZWVwUm90YXRpb246IHRydWUsXHJcbiAgICBtb3VzZUJ1dHRvbjogTW91c2VCdXR0b25zLkxFRlQsXHJcbiAgfTtcclxuXHJcbiAgaW5pdChjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLCBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlKSB7XHJcbiAgICB0aGlzLmNhbWVyYVNlcnZpY2UgPSBjYW1lcmFTZXJ2aWNlO1xyXG4gICAgdGhpcy5jZXNpdW1TZXJ2aWNlID0gY2VzaXVtU2VydmljZTtcclxuICB9XHJcblxyXG4gIGFjdGl2YXRlKFxyXG4gICAgb3B0aW9uczoge1xyXG4gICAgICBvblN0YXJ0PzogKGFjTWFwPzogQWNNYXBDb21wb25lbnQpID0+IGFueTtcclxuICAgICAgb25Db21wbGV0ZT86IChhY01hcD86IEFjTWFwQ29tcG9uZW50KSA9PiBhbnk7XHJcbiAgICAgIG1vdXNlQnV0dG9uPzogTW91c2VCdXR0b25zO1xyXG4gICAgICBhdXRvRGlzYWJsZU9uWm9vbT86IGJvb2xlYW47XHJcbiAgICAgIGFuaW1hdGlvbkR1cmF0aW9uSW5TZWNvbmRzPzogbnVtYmVyO1xyXG4gICAgICB0aHJlc2hvbGQ/OiBudW1iZXI7XHJcbiAgICAgIGtlZXBSb3RhdGlvbj86IGJvb2xlYW47XHJcbiAgICAgIGJvcmRlclN0eWxlPzogc3RyaW5nO1xyXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I/OiBzdHJpbmc7XHJcbiAgICAgIHJlc2V0S2V5Q29kZT86IG51bWJlcjtcclxuICAgIH0gPSB7fSxcclxuICAgIG1hcElkPzogc3RyaW5nLFxyXG4gICkge1xyXG4gICAgaWYgKCghdGhpcy5jYW1lcmFTZXJ2aWNlIHx8ICF0aGlzLmNlc2l1bVNlcnZpY2UpICYmICFtYXBJZCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFRoZSBmdW5jdGlvbiBtdXN0IHJlY2VpdmUgYSBtYXBJZCBpZiB0aGUgc2VydmljZSB3YXNuJ3QgaW5pdGlhbGl6ZWRgKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGZpbmFsT3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuZGVmYXVsdE9wdGlvbnMsIG9wdGlvbnMpO1xyXG4gICAgbGV0IGNhbWVyYVNlcnZpY2UgPSB0aGlzLmNhbWVyYVNlcnZpY2U7XHJcbiAgICBsZXQgbWFwQ29udGFpbmVyO1xyXG4gICAgbGV0IG1hcDtcclxuICAgIGlmICh0aGlzLmNlc2l1bVNlcnZpY2UpIHtcclxuICAgICAgbWFwQ29udGFpbmVyID0gdGhpcy5jZXNpdW1TZXJ2aWNlLmdldFZpZXdlcigpLmNvbnRhaW5lcjtcclxuICAgIH1cclxuICAgIGlmICghbWFwSWQpIHtcclxuICAgICAgbWFwID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAoKTtcclxuICAgICAgbWFwSWQgPSBtYXAuZ2V0SWQoKTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgIG1hcCA9IHRoaXMubWFwc01hbmFnZXIuZ2V0TWFwKG1hcElkKTtcclxuICAgICAgaWYgKCFtYXApIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE1hcCBub3QgZm91bmQgd2l0aCBpZDogJHttYXBJZH1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgY2FtZXJhU2VydmljZSA9IG1hcC5nZXRDYW1lcmFTZXJ2aWNlKCk7XHJcbiAgICBtYXBDb250YWluZXIgPSBtYXAuZ2V0Q2VzaXVtVmlld2VyKCkuY29udGFpbmVyO1xyXG4gICAgXHJcblxyXG4gICAgaWYgKCFjYW1lcmFTZXJ2aWNlIHx8ICFtYXBDb250YWluZXIpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBUaGUgZnVuY3Rpb24gbXVzdCByZWNlaXZlIGEgbWFwSWQgaWYgdGhlIHNlcnZpY2Ugd2Fzbid0IGluaXRpYWxpemVkYCk7XHJcbiAgICB9XHJcbiAgICB0aGlzLmRpc2FibGUobWFwSWQpO1xyXG4gICAgY29uc3QgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XHJcbiAgICBtYXBDb250YWluZXIuc3R5bGUucG9zaXRpb24gPSAncmVsYXRpdmUnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS53aWR0aCA9ICcxMDAlJztcclxuICAgIGNvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICBjb250YWluZXIuc3R5bGUudG9wID0gJzAnO1xyXG4gICAgY29udGFpbmVyLnN0eWxlLmxlZnQgPSAnMCc7XHJcbiAgICBtYXBDb250YWluZXIuYXBwZW5kQ2hpbGQoY29udGFpbmVyKTtcclxuICAgIGNvbnN0IG1hcFpvb21EYXRhOiBab29tRGF0YSA9IHsgY29udGFpbmVyIH07XHJcbiAgICB0aGlzLm1hcHNab29tRWxlbWVudHMuc2V0KG1hcElkLCBtYXBab29tRGF0YSk7XHJcbiAgICBsZXQgbW91c2UgPSB7XHJcbiAgICAgIGVuZFg6IDAsXHJcbiAgICAgIGVuZFk6IDAsXHJcbiAgICAgIHN0YXJ0WDogMCxcclxuICAgICAgc3RhcnRZOiAwLFxyXG4gICAgfTtcclxuICAgIGxldCBib3JkZXJFbGVtZW50OiBIVE1MRWxlbWVudCB8IHVuZGVmaW5lZDtcclxuXHJcbiAgICBjb250YWluZXIub25tb3VzZWRvd24gPSBlID0+IHtcclxuICAgICAgaWYgKGUuYnV0dG9uICE9PSBmaW5hbE9wdGlvbnMubW91c2VCdXR0b24pIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgaWYgKCFib3JkZXJFbGVtZW50KSB7XHJcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5vblN0YXJ0KSB7XHJcbiAgICAgICAgICBvcHRpb25zLm9uU3RhcnQobWFwKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHJlY3QgPSAoZS5jdXJyZW50VGFyZ2V0IGFzIGFueSkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgY29uc3Qgb2Zmc2V0WCA9IGUuY2xpZW50WCAtIHJlY3QubGVmdDtcclxuICAgICAgICBjb25zdCBvZmZzZXRZID0gZS5jbGllbnRZIC0gcmVjdC50b3A7XHJcbiAgICAgICAgbW91c2Uuc3RhcnRYID0gb2Zmc2V0WDtcclxuICAgICAgICBtb3VzZS5zdGFydFkgPSBvZmZzZXRZO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcclxuICAgICAgICBib3JkZXJFbGVtZW50LmNsYXNzTmFtZSA9ICd6b29tLXRvLXJlY3RhbmdsZS1ib3JkZXInO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuYm9yZGVyID0gZmluYWxPcHRpb25zLmJvcmRlclN0eWxlO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gZmluYWxPcHRpb25zLmJhY2tncm91bmRDb2xvcjtcclxuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLmxlZnQgPSBtb3VzZS5zdGFydFggKyAncHgnO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gbW91c2Uuc3RhcnRZICsgJ3B4JztcclxuICAgICAgICBjb250YWluZXIuYXBwZW5kQ2hpbGQoYm9yZGVyRWxlbWVudCk7XHJcbiAgICAgICAgbWFwWm9vbURhdGEuYm9yZGVyRWxlbWVudCA9IGJvcmRlckVsZW1lbnQ7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29udGFpbmVyLm9ubW91c2V1cCA9IGUgPT4ge1xyXG4gICAgICBpZiAoYm9yZGVyRWxlbWVudCkge1xyXG4gICAgICAgIGxldCB6b29tQXBwbGllZDtcclxuICAgICAgICBpZiAobW91c2UgJiYgTWF0aC5hYnMobW91c2UuZW5kWCAtIG1vdXNlLnN0YXJ0WCkgKiBNYXRoLmFicyhtb3VzZS5lbmRZIC0gbW91c2Uuc3RhcnRZKSA+IGZpbmFsT3B0aW9ucy50aHJlc2hvbGQpIHtcclxuICAgICAgICAgIHpvb21BcHBsaWVkID0gdGhpcy56b29tQ2FtZXJhVG9SZWN0YW5nbGUoXHJcbiAgICAgICAgICAgIGNhbWVyYVNlcnZpY2UsXHJcbiAgICAgICAgICAgIG1vdXNlLFxyXG4gICAgICAgICAgICBmaW5hbE9wdGlvbnMuYW5pbWF0aW9uRHVyYXRpb25JblNlY29uZHMsXHJcbiAgICAgICAgICAgIGZpbmFsT3B0aW9ucyxcclxuICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIG1vdXNlID0ge1xyXG4gICAgICAgICAgZW5kWDogMCxcclxuICAgICAgICAgIGVuZFk6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDAsXHJcbiAgICAgICAgfTtcclxuICAgICAgICBpZiAoISFmaW5hbE9wdGlvbnMub25Db21wbGV0ZSkge1xyXG4gICAgICAgICAgZmluYWxPcHRpb25zLm9uQ29tcGxldGUobWFwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgaWYgKGZpbmFsT3B0aW9ucy5hdXRvRGlzYWJsZU9uWm9vbSAmJiB6b29tQXBwbGllZCkge1xyXG4gICAgICAgICAgdGhpcy5kaXNhYmxlKG1hcElkKTtcclxuICAgICAgICB9XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29udGFpbmVyLm9ubW91c2Vtb3ZlID0gZSA9PiB7XHJcbiAgICAgIGlmIChib3JkZXJFbGVtZW50KSB7XHJcbiAgICAgICAgY29uc3QgcmVjdCA9IChlLmN1cnJlbnRUYXJnZXQgYXMgYW55KS5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcclxuICAgICAgICBjb25zdCBvZmZzZXRYID0gZS5jbGllbnRYIC0gcmVjdC5sZWZ0O1xyXG4gICAgICAgIGNvbnN0IG9mZnNldFkgPSBlLmNsaWVudFkgLSByZWN0LnRvcDtcclxuICAgICAgICBtb3VzZS5lbmRYID0gb2Zmc2V0WDtcclxuICAgICAgICBtb3VzZS5lbmRZID0gb2Zmc2V0WTtcclxuICAgICAgICBib3JkZXJFbGVtZW50LnN0eWxlLndpZHRoID0gTWF0aC5hYnMobW91c2UuZW5kWCAtIG1vdXNlLnN0YXJ0WCkgKyAncHgnO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUuaGVpZ2h0ID0gTWF0aC5hYnMobW91c2UuZW5kWSAtIG1vdXNlLnN0YXJ0WSkgKyAncHgnO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUubGVmdCA9IE1hdGgubWluKG1vdXNlLnN0YXJ0WCwgbW91c2UuZW5kWCkgKyAncHgnO1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQuc3R5bGUudG9wID0gTWF0aC5taW4obW91c2Uuc3RhcnRZLCBtb3VzZS5lbmRZKSArICdweCc7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgY29uc3QgcmVzZXRPbkVzY2FwZVByZXNzID0gZSA9PiB7XHJcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IGZpbmFsT3B0aW9ucy5yZXNldEtleUNvZGUgJiYgYm9yZGVyRWxlbWVudCkge1xyXG4gICAgICAgIGJvcmRlckVsZW1lbnQucmVtb3ZlKCk7XHJcbiAgICAgICAgYm9yZGVyRWxlbWVudCA9IHVuZGVmaW5lZDtcclxuICAgICAgICBtYXBab29tRGF0YS5ib3JkZXJFbGVtZW50ID0gdW5kZWZpbmVkO1xyXG4gICAgICAgIG1vdXNlID0ge1xyXG4gICAgICAgICAgZW5kWDogMCxcclxuICAgICAgICAgIGVuZFk6IDAsXHJcbiAgICAgICAgICBzdGFydFg6IDAsXHJcbiAgICAgICAgICBzdGFydFk6IDAsXHJcbiAgICAgICAgfTtcclxuICAgICAgfVxyXG4gICAgfTtcclxuICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCByZXNldE9uRXNjYXBlUHJlc3MpO1xyXG4gICAgbWFwWm9vbURhdGEucmVzZXRPbkVzY2FwZVByZXNzRnVuYyA9IHJlc2V0T25Fc2NhcGVQcmVzcztcclxuICB9XHJcblxyXG4gIHB1YmxpYyBkaXNhYmxlKG1hcElkPzogc3RyaW5nKSB7XHJcbiAgICBpZiAoIXRoaXMubWFwc01hbmFnZXIgJiYgIW1hcElkKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignSWYgdGhlIHNlcnZpY2Ugd2FzIG5vdCBpbml0aWFsaXplZCB3aXRoIENlc2l1bVNlcnZpY2UsIG1hcElkIG11c3QgYmUgcHJvdmlkZWQnKTtcclxuICAgIH1cclxuICAgIGlmICghbWFwSWQpIHtcclxuICAgICAgY29uc3QgbWFwID0gdGhpcy5tYXBzTWFuYWdlci5nZXRNYXAoKTtcclxuICAgICAgbWFwSWQgPSBtYXAuZ2V0SWQoKTtcclxuICAgIH1cclxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLm1hcHNab29tRWxlbWVudHMuZ2V0KG1hcElkKTtcclxuICAgIGlmIChkYXRhKSB7XHJcbiAgICAgIGRhdGEuY29udGFpbmVyLnJlbW92ZSgpO1xyXG4gICAgICBpZiAoZGF0YS5ib3JkZXJFbGVtZW50KSB7XHJcbiAgICAgICAgZGF0YS5ib3JkZXJFbGVtZW50LnJlbW92ZSgpO1xyXG4gICAgICB9XHJcbiAgICAgIGlmIChkYXRhLnJlc2V0T25Fc2NhcGVQcmVzc0Z1bmMpIHtcclxuICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgZGF0YS5yZXNldE9uRXNjYXBlUHJlc3NGdW5jKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgdGhpcy5tYXBzWm9vbUVsZW1lbnRzLmRlbGV0ZShtYXBJZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHpvb21DYW1lcmFUb1JlY3RhbmdsZShcclxuICAgIGNhbWVyYVNlcnZpY2U6IENhbWVyYVNlcnZpY2UsXHJcbiAgICBwb3NpdGlvbnM6IHsgZW5kWDogbnVtYmVyOyBlbmRZOiBudW1iZXI7IHN0YXJ0WDogbnVtYmVyOyBzdGFydFk6IG51bWJlciB9LFxyXG4gICAgYW5pbWF0aW9uRHVyYXRpb24sXHJcbiAgICBvcHRpb25zLFxyXG4gICk6IGJvb2xlYW4ge1xyXG4gICAgY29uc3QgY2FtZXJhID0gY2FtZXJhU2VydmljZS5nZXRDYW1lcmEoKTtcclxuICAgIGNvbnN0IGNhcnRlc2lhbjEgPSBjYW1lcmEucGlja0VsbGlwc29pZCh7IHg6IHBvc2l0aW9ucy5zdGFydFgsIHk6IHBvc2l0aW9ucy5zdGFydFkgfSk7XHJcbiAgICBjb25zdCBjYXJ0ZXNpYW4yID0gY2FtZXJhLnBpY2tFbGxpcHNvaWQoeyB4OiBwb3NpdGlvbnMuZW5kWCwgeTogcG9zaXRpb25zLmVuZFkgfSk7XHJcbiAgICBpZiAoIWNhcnRlc2lhbjEgfHwgIWNhcnRlc2lhbjIpIHtcclxuICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG4gICAgY29uc3QgY2FydG9ncmFwaGljMSA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjEpO1xyXG4gICAgY29uc3QgY2FydG9ncmFwaGljMiA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjIpO1xyXG4gICAgY2FtZXJhU2VydmljZS5jYW1lcmFGbHlUbyh7XHJcbiAgICAgIGRlc3RpbmF0aW9uOiBuZXcgUmVjdGFuZ2xlKFxyXG4gICAgICAgIE1hdGgubWluKGNhcnRvZ3JhcGhpYzEubG9uZ2l0dWRlLCBjYXJ0b2dyYXBoaWMyLmxvbmdpdHVkZSksXHJcbiAgICAgICAgTWF0aC5taW4oY2FydG9ncmFwaGljMS5sYXRpdHVkZSwgY2FydG9ncmFwaGljMi5sYXRpdHVkZSksXHJcbiAgICAgICAgTWF0aC5tYXgoY2FydG9ncmFwaGljMS5sb25naXR1ZGUsIGNhcnRvZ3JhcGhpYzIubG9uZ2l0dWRlKSxcclxuICAgICAgICBNYXRoLm1heChjYXJ0b2dyYXBoaWMxLmxhdGl0dWRlLCBjYXJ0b2dyYXBoaWMyLmxhdGl0dWRlKSxcclxuICAgICAgKSxcclxuICAgICAgb3JpZW50YXRpb246IG9wdGlvbnMua2VlcFJvdGF0aW9uID8geyBoZWFkaW5nOiBjYW1lcmEuaGVhZGluZyB9IDogdW5kZWZpbmVkLFxyXG4gICAgICBkdXJhdGlvbjogYW5pbWF0aW9uRHVyYXRpb24sXHJcbiAgICB9KTtcclxuICAgIHJldHVybiB0cnVlO1xyXG4gIH1cclxufVxyXG4iXX0=