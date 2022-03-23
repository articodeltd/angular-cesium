import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
import { CameraService } from '../../angular-cesium/services/camera/camera.service';
import { CesiumService } from '../../angular-cesium/services/cesium/cesium.service';
import { AcMapComponent } from '../../angular-cesium/components/ac-map/ac-map.component';
import * as i0 from "@angular/core";
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
export declare enum MouseButtons {
    LEFT = 0,
    MIDDLE = 1,
    RIGHT = 2
}
export declare class ZoomToRectangleService {
    private mapsManager;
    constructor(mapsManager: MapsManagerService, cameraService: CameraService, cesiumService: CesiumService);
    private cameraService;
    private cesiumService;
    private mapsZoomElements;
    private defaultOptions;
    init(cesiumService: CesiumService, cameraService: CameraService): void;
    activate(options?: {
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
    }, mapId?: string): void;
    disable(mapId?: string): void;
    private zoomCameraToRectangle;
    static ɵfac: i0.ɵɵFactoryDeclaration<ZoomToRectangleService, [null, { optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<ZoomToRectangleService>;
}
