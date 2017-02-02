import {Injectable, NgZone} from "@angular/core";
import {ViewerFactory} from "../viewer-factory/viewer-factory.service";


@Injectable()
export class CesiumService {
  cesiumViewer: any;

  constructor(private ngZone : NgZone, private viewerFactory : ViewerFactory) {
  }

  init(mapContainer: HTMLElement) {
    this.ngZone.runOutsideAngular(() => {
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer);
    });
  }

  getViewer() {
    return this.cesiumViewer;
  }

  getScene() {
    return this.cesiumViewer.scene;
  }

    /**
     * Gets the minimum zoom value
     * @returns {any}
     */
  getMinimumZoom() : number {
      return this.getScene().screenSpaceCameraController.minimumZoomDistance;
  }

    /**
     * Sets the minimum zoom value
     * @param amount - new value
     */
  setMinimumZoom(amount : number) : void {
      this.getScene().screenSpaceCameraController.minimumZoomDistance = amount;
  }

    /**
     * Gets the maxmimum zoom value
     * @returns {any}
     */
  getMaximumZoom() : number {
      return this.getScene().screenSpaceCameraController.maximumZoomDistance;
  }

    /**
     * Sets the maximum zoom value
     * @param amount - new value
     */
  setMaximumZoom(amount : number) : void {
      this.getScene().screenSpaceCameraController.maximumZoomDistance = amount;
  }
}
