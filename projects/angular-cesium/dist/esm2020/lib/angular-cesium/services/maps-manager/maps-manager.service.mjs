import { Injectable } from '@angular/core';
import { Ellipsoid, SceneMode, Cartographic } from 'cesium';
import * as i0 from "@angular/core";
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
export class MapsManagerService {
    constructor() {
        this.defaultIdCounter = 0;
        this._Maps = new Map();
        this.eventRemoveCallbacks = [];
    }
    getMap(id) {
        if (!id) {
            return this.firstMap;
        }
        return this._Maps.get(id);
    }
    _registerMap(id, acMap) {
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
    _removeMapById(id) {
        return this._Maps.delete(id);
    }
    generateDefaultId() {
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
    sync2DMapsCameras(mapsConfiguration) {
        const DEFAULT_SENSITIVITY = 0.01;
        this.unsyncMapsCameras();
        const maps = mapsConfiguration.map(config => {
            const map = this.getMap(config.id);
            if (!map) {
                throw new Error(`Couldn't find map with id: ${config.id}`);
            }
            return { map, options: { sensitivity: config.sensitivity, bindZoom: config.bindZoom } };
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
                    const position = Ellipsoid.WGS84.cartographicToCartesian(new Cartographic(masterCameraCartographic.longitude, masterCameraCartographic.latitude, slaveMapOptions.bindZoom ? masterCameraCartographic.height : slaveCameraCartographic.height));
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
MapsManagerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
MapsManagerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapsManagerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwcy1tYW5hZ2VyLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxTQUFTLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBRSxNQUFNLFFBQVEsQ0FBQzs7QUFHNUQ7OztHQUdHO0FBRUgsTUFBTSxPQUFPLGtCQUFrQjtJQU03QjtRQUxRLHFCQUFnQixHQUFHLENBQUMsQ0FBQztRQUNyQixVQUFLLEdBQUcsSUFBSSxHQUFHLEVBQTBCLENBQUM7UUFFMUMseUJBQW9CLEdBQWUsRUFBRSxDQUFDO0lBRzlDLENBQUM7SUFFRCxNQUFNLENBQUMsRUFBVztRQUNoQixJQUFJLENBQUMsRUFBRSxFQUFFO1lBQ1AsT0FBTyxJQUFJLENBQUMsUUFBUSxDQUFDO1NBQ3RCO1FBQ0QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQztJQUM1QixDQUFDO0lBRUQsWUFBWSxDQUFDLEVBQVUsRUFBRSxLQUFxQjtRQUM1QyxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtZQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztTQUN2QjtRQUVELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztRQUNqRCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQ3pCLE1BQU0sSUFBSSxLQUFLLENBQUMsZ0JBQWdCLEtBQUssZ0JBQWdCLENBQUMsQ0FBQztTQUN4RDtRQUNELElB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Q0FBQztxQkFDSjtnQkFDSCxDQUFDLENBQUMsQ0FBQztZQUNMLENBQUMsQ0FBQyxDQUFDO1lBQ0gsSUFBSSxDQUFDLG9CQUFvQixDQUFDLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztRQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRDs7T0FFRztJQUNILGlCQUFpQjtRQUNmLElBQUksQ0FBQyxvQkFBb0IsQ0FBQyxPQUFPLENBQUMsY0FBYyxDQUFDLEVBQUUsQ0FBQyxjQUFjLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLElBQUksQ0FBQyxvQkFBb0IsR0FBRyxFQUFFLENBQUM7SUFDakMsQ0FBQzs7K0dBckdVLGtCQUFrQjttSEFBbEIsa0JBQWtCOzJGQUFsQixrQkFBa0I7a0JBRDlCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEVsbGlwc29pZCwgU2NlbmVNb2RlLCBDYXJ0b2dyYXBoaWMgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBBY01hcENvbXBvbmVudCB9IGZyb20gJy4uLy4uL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xyXG5cclxuLyoqXHJcbiAqICBUaGUgc2VydmljZSBtYW5hZ2VzIGBhYy1tYXBgIGluc3RhbmNlcy4gYGFjLW1hcGAgcmVnaXN0ZXIgaXRzZWxmIHRvIHRoaXMgc2VydmljZS5cclxuICogIFRoaXMgYWxsb3dzIHJldHJpZXZhbCBvZiBtYXBzIHByb3ZpZGVkIHNlcnZpY2VzIG91dHNpZGUgb2YgYGFjLW1hcGAgc2NvcGUuXHJcbiAqL1xyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBNYXBzTWFuYWdlclNlcnZpY2Uge1xyXG4gIHByaXZhdGUgZGVmYXVsdElkQ291bnRlciA9IDA7XHJcbiAgcHJpdmF0ZSBfTWFwcyA9IG5ldyBNYXA8c3RyaW5nLCBBY01hcENvbXBvbmVudD4oKTtcclxuICBwcml2YXRlIGZpcnN0TWFwOiBhbnk7XHJcbiAgcHJpdmF0ZSBldmVudFJlbW92ZUNhbGxiYWNrczogRnVuY3Rpb25bXSA9IFtdO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIGdldE1hcChpZD86IHN0cmluZyk6IEFjTWFwQ29tcG9uZW50IHwgdW5kZWZpbmVkIHtcclxuICAgIGlmICghaWQpIHtcclxuICAgICAgcmV0dXJuIHRoaXMuZmlyc3RNYXA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gdGhpcy5fTWFwcy5nZXQoaWQpO1xyXG4gIH1cclxuXHJcbiAgX3JlZ2lzdGVyTWFwKGlkOiBzdHJpbmcsIGFjTWFwOiBBY01hcENvbXBvbmVudCk6IHN0cmluZyB7XHJcbiAgICBpZiAoIXRoaXMuZmlyc3RNYXApIHtcclxuICAgICAgdGhpcy5maXJzdE1hcCA9IGFjTWFwO1xyXG4gICAgfVxyXG5cclxuICAgIGNvbnN0IG1hcElkID0gaWQgPyBpZCA6IHRoaXMuZ2VuZXJhdGVEZWZhdWx0SWQoKTtcclxuICAgIGlmICh0aGlzLl9NYXBzLmhhcyhtYXBJZCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBNYXAgd2l0aCBpZDogJHttYXBJZH0gYWxyZWFkeSBleGlzdGApO1xyXG4gICAgfVxyXG4gICAgdGhpcy5fTWFwcy5zZXQobWFwSWQsIGFjTWFwKTtcclxuICAgIHJldHVybiBtYXBJZDtcclxuICB9XHJcblxyXG4gIF9yZW1vdmVNYXBCeUlkKGlkOiBzdHJpbmcpIHtcclxuICAgIHJldHVybiB0aGlzLl9NYXBzLmRlbGV0ZShpZCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGdlbmVyYXRlRGVmYXVsdElkKCk6IHN0cmluZyB7XHJcbiAgICB0aGlzLmRlZmF1bHRJZENvdW50ZXIrKztcclxuICAgIHJldHVybiAnZGVmYXVsdC1tYXAtaWQtJyArIHRoaXMuZGVmYXVsdElkQ291bnRlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEJpbmRzIG11bHRpcGxlIDJEIG1hcCdzIGNhbWVyYXMgdG9nZXRoZXIuXHJcbiAgICogQHBhcmFtIG1hcHNDb25maWd1cmF0aW9uIC0gYmluZGluZyBvcHRpb25zLlxyXG4gICAqIG1hcElkIC0gdGhlIGlkIG9mIHRoZSBtYXBzIHRvIGJpbmQuXHJcbiAgICogc2Vuc2l0aXZpdHkgLSB0aGUgYW1vdW50IHRoZSBjYW1lcmEgcG9zaXRpb24gc2hvdWxkIGNoYW5nZSBpbiBvcmRlciB0byBzeW5jIG90aGVyIG1hcHMuXHJcbiAgICogYmluZFpvb20gLSBzaG91bGQgYmluZCB6b29tIGxldmVsXHJcbiAgICovXHJcbiAgc3luYzJETWFwc0NhbWVyYXMobWFwc0NvbmZpZ3VyYXRpb246IHsgaWQ6IHN0cmluZzsgc2Vuc2l0aXZpdHk/OiBudW1iZXI7IGJpbmRab29tPzogYm9vbGVhbiB9W10pIHtcclxuICAgIGNvbnN0IERFRkFVTFRfU0VOU0lUSVZJVFkgPSAwLjAxO1xyXG4gICAgdGhpcy51bnN5bmNNYXBzQ2FtZXJhcygpO1xyXG4gICAgY29uc3QgbWFwczogeyBtYXA6IEFjTWFwQ29tcG9uZW50OyBvcHRpb25zPzogeyBzZW5zaXRpdml0eT86IG51bWJlcjsgYmluZFpvb20/OiBib29sZWFuIH0gfVtdID0gbWFwc0NvbmZpZ3VyYXRpb24ubWFwKGNvbmZpZyA9PiB7XHJcbiAgICAgIGNvbnN0IG1hcCA9IHRoaXMuZ2V0TWFwKGNvbmZpZy5pZCk7XHJcbiAgICAgIGlmICghbWFwKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZG4ndCBmaW5kIG1hcCB3aXRoIGlkOiAke2NvbmZpZy5pZH1gKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgcmV0dXJuIHttYXAsIG9wdGlvbnM6IHtzZW5zaXRpdml0eTogY29uZmlnLnNlbnNpdGl2aXR5LCBiaW5kWm9vbTogY29uZmlnLmJpbmRab29tfX07XHJcbiAgICB9KTtcclxuXHJcbiAgICBtYXBzLmZvckVhY2gobWFzdGVyTWFwQ29uZmlnID0+IHtcclxuICAgICAgY29uc3QgbWFzdGVyTWFwID0gbWFzdGVyTWFwQ29uZmlnLm1hcDtcclxuICAgICAgY29uc3Qgb3B0aW9ucyA9IG1hc3Rlck1hcENvbmZpZy5vcHRpb25zO1xyXG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmEgPSBtYXN0ZXJNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xyXG4gICAgICBjb25zdCBtYXN0ZXJDYW1lcmFDYXJ0b2dyYXBoaWMgPSBtYXN0ZXJDYW1lcmEucG9zaXRpb25DYXJ0b2dyYXBoaWM7XHJcbiAgICAgIG1hc3RlckNhbWVyYS5wZXJjZW50YWdlQ2hhbmdlZCA9IG9wdGlvbnMuc2Vuc2l0aXZpdHkgfHwgREVGQVVMVF9TRU5TSVRJVklUWTtcclxuICAgICAgY29uc3QgcmVtb3ZlQ2FsbGJhY2sgPSBtYXN0ZXJDYW1lcmEuY2hhbmdlZC5hZGRFdmVudExpc3RlbmVyKCgpID0+IHtcclxuICAgICAgICBtYXBzLmZvckVhY2goc2xhdmVNYXBDb25maWcgPT4ge1xyXG4gICAgICAgICAgY29uc3Qgc2xhdmVNYXAgPSBzbGF2ZU1hcENvbmZpZy5tYXA7XHJcbiAgICAgICAgICBjb25zdCBzbGF2ZU1hcE9wdGlvbnMgPSBzbGF2ZU1hcENvbmZpZy5vcHRpb25zO1xyXG4gICAgICAgICAgaWYgKHNsYXZlTWFwID09PSBtYXN0ZXJNYXApIHtcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG4gICAgICAgICAgfVxyXG5cclxuICAgICAgICAgIGNvbnN0IHNsYXZlQ2FtZXJhID0gc2xhdmVNYXAuZ2V0Q2FtZXJhU2VydmljZSgpLmdldENhbWVyYSgpO1xyXG4gICAgICAgICAgY29uc3Qgc2xhdmVDYW1lcmFDYXJ0b2dyYXBoaWMgPSBzbGF2ZUNhbWVyYS5wb3NpdGlvbkNhcnRvZ3JhcGhpYztcclxuICAgICAgICAgIGNvbnN0IHBvc2l0aW9uID0gRWxsaXBzb2lkLldHUzg0LmNhcnRvZ3JhcGhpY1RvQ2FydGVzaWFuKFxyXG4gICAgICAgICAgICBuZXcgQ2FydG9ncmFwaGljKFxyXG4gICAgICAgICAgICAgICAgbWFzdGVyQ2FtZXJhQ2FydG9ncmFwaGljLmxvbmdpdHVkZSxcclxuICAgICAgICAgICAgICAgIG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5sYXRpdHVkZSxcclxuICAgICAgICAgICAgICAgIHNsYXZlTWFwT3B0aW9ucy5iaW5kWm9vbSA/IG1hc3RlckNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQgOiBzbGF2ZUNhbWVyYUNhcnRvZ3JhcGhpYy5oZWlnaHQpXHJcbiAgICAgICAgICApO1xyXG5cclxuICAgICAgICAgIGlmIChzbGF2ZU1hcC5nZXRDZXNpdW1WaWV3ZXIoKS5zY2VuZS5tb2RlICE9PSBTY2VuZU1vZGUuTU9SUEhJTkcpIHtcclxuICAgICAgICAgICAgc2xhdmVDYW1lcmEuc2V0Vmlldyh7XHJcbiAgICAgICAgICAgICAgZGVzdGluYXRpb246IHBvc2l0aW9uLFxyXG4gICAgICAgICAgICAgIG9yaWVudGF0aW9uOiB7XHJcbiAgICAgICAgICAgICAgICBoZWFkaW5nOiBzbGF2ZUNhbWVyYS5oZWFkaW5nLFxyXG4gICAgICAgICAgICAgICAgcGl0Y2g6IHNsYXZlQ2FtZXJhLnBpdGNoLFxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgICB9KTtcclxuICAgICAgdGhpcy5ldmVudFJlbW92ZUNhbGxiYWNrcy5wdXNoKHJlbW92ZUNhbGxiYWNrKTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogVW5zeW5jcyBtYXBzIGNhbWVyYXNcclxuICAgKi9cclxuICB1bnN5bmNNYXBzQ2FtZXJhcygpIHtcclxuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MuZm9yRWFjaChyZW1vdmVDYWxsYmFjayA9PiByZW1vdmVDYWxsYmFjaygpKTtcclxuICAgIHRoaXMuZXZlbnRSZW1vdmVDYWxsYmFja3MgPSBbXTtcclxuICB9XHJcbn1cclxuIl19