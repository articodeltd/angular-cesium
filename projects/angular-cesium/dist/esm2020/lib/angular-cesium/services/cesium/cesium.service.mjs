import { Injectable, Optional } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../viewer-factory/viewer-factory.service";
import * as i2 from "../viewer-configuration/viewer-configuration.service";
/**
 *  Service that initialize cesium viewer and expose cesium viewer and scene.
 */
export class CesiumService {
    constructor(ngZone, viewerFactory, viewerConfiguration) {
        this.ngZone = ngZone;
        this.viewerFactory = viewerFactory;
        this.viewerConfiguration = viewerConfiguration;
    }
    init(mapContainer) {
        this.mapContainer = mapContainer;
        this.ngZone.runOutsideAngular(() => {
            const options = this.viewerConfiguration ? this.viewerConfiguration.getNextViewerOptions() : undefined;
            this.cesiumViewer = this.viewerFactory.createViewer(mapContainer, options);
            const viewerModifier = this.viewerConfiguration && this.viewerConfiguration.getNextViewerModifier();
            if (typeof viewerModifier === 'function') {
                viewerModifier(this.cesiumViewer);
            }
        });
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Viewer.html?classFilter=viewe
     * @returns cesiumViewer
     */
    getViewer() {
        return this.cesiumViewer;
    }
    /**
     * For more information see https://cesiumjs.org/Cesium/Build/Documentation/Scene.html?classFilter=scene
     * @returns cesium scene
     */
    getScene() {
        return this.cesiumViewer.scene;
    }
    /**
     * For more information see https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
     * @returns cesium canvas
     */
    getCanvas() {
        return this.cesiumViewer.canvas;
    }
    getMapContainer() {
        return this.mapContainer;
    }
}
CesiumService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService, deps: [{ token: i0.NgZone }, { token: i1.ViewerFactory }, { token: i2.ViewerConfiguration, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CesiumService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CesiumService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i0.NgZone }, { type: i1.ViewerFactory }, { type: i2.ViewerConfiguration, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2VzaXVtLnNlcnZpY2UuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFVLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQzs7OztBQUk3RDs7R0FFRztBQUVILE1BQU0sT0FBTyxhQUFhO0lBSXhCLFlBQW9CLE1BQWMsRUFBVSxhQUE0QixFQUFzQixtQkFBd0M7UUFBbEgsV0FBTSxHQUFOLE1BQU0sQ0FBUTtRQUFVLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBQXNCLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7SUFDdEksQ0FBQztJQUVELElBQUksQ0FBQyxZQUF5QjtRQUM1QixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztRQUNqQyxJQUFJLENBQUMsTUFBTSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsRUFBRTtZQUNqQyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxvQkFBb0IsRUFBRSxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUM7WUFDdkcsSUFBSSxDQUFDLFlBQVksR0FBRyxJQUFJLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxZQUFZLEVBQUUsT0FBTyxDQUFDLENBQUM7WUFFM0UsTUFBTSxjQUFjLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixJQUFJLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxxQkFBcUIsRUFBRSxDQUFDO1lBQ3BHLElBQUksT0FBTyxjQUFjLEtBQUssVUFBVSxFQUFFO2dCQUN4QyxjQUFjLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO2FBQ25DO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsU0FBUztRQUNQLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsUUFBUTtRQUNOLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUM7SUFDakMsQ0FBQztJQUVEOzs7T0FHRztJQUNILFNBQVM7UUFDUCxPQUFPLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBMkIsQ0FBQztJQUN2RCxDQUFDO0lBRUQsZUFBZTtRQUNiLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQztJQUMzQixDQUFDOzswR0E5Q1UsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVU7OzBCQUtrRSxRQUFRIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSwgTmdab25lLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBWaWV3ZXJGYWN0b3J5IH0gZnJvbSAnLi4vdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZSc7XHJcbmltcG9ydCB7IFZpZXdlckNvbmZpZ3VyYXRpb24gfSBmcm9tICcuLi92aWV3ZXItY29uZmlndXJhdGlvbi92aWV3ZXItY29uZmlndXJhdGlvbi5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiAgU2VydmljZSB0aGF0IGluaXRpYWxpemUgY2VzaXVtIHZpZXdlciBhbmQgZXhwb3NlIGNlc2l1bSB2aWV3ZXIgYW5kIHNjZW5lLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ2VzaXVtU2VydmljZSB7XHJcbiAgcHJpdmF0ZSBjZXNpdW1WaWV3ZXI6IGFueTtcclxuICBwcml2YXRlIG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQ7XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbmdab25lOiBOZ1pvbmUsIHByaXZhdGUgdmlld2VyRmFjdG9yeTogVmlld2VyRmFjdG9yeSwgQE9wdGlvbmFsKCkgcHJpdmF0ZSB2aWV3ZXJDb25maWd1cmF0aW9uOiBWaWV3ZXJDb25maWd1cmF0aW9uKSB7XHJcbiAgfVxyXG5cclxuICBpbml0KG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQpIHtcclxuICAgIHRoaXMubWFwQ29udGFpbmVyID0gbWFwQ29udGFpbmVyO1xyXG4gICAgdGhpcy5uZ1pvbmUucnVuT3V0c2lkZUFuZ3VsYXIoKCkgPT4ge1xyXG4gICAgICBjb25zdCBvcHRpb25zID0gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uID8gdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uLmdldE5leHRWaWV3ZXJPcHRpb25zKCkgOiB1bmRlZmluZWQ7XHJcbiAgICAgIHRoaXMuY2VzaXVtVmlld2VyID0gdGhpcy52aWV3ZXJGYWN0b3J5LmNyZWF0ZVZpZXdlcihtYXBDb250YWluZXIsIG9wdGlvbnMpO1xyXG5cclxuICAgICAgY29uc3Qgdmlld2VyTW9kaWZpZXIgPSB0aGlzLnZpZXdlckNvbmZpZ3VyYXRpb24gJiYgdGhpcy52aWV3ZXJDb25maWd1cmF0aW9uLmdldE5leHRWaWV3ZXJNb2RpZmllcigpO1xyXG4gICAgICBpZiAodHlwZW9mIHZpZXdlck1vZGlmaWVyID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgdmlld2VyTW9kaWZpZXIodGhpcy5jZXNpdW1WaWV3ZXIpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9WaWV3ZXIuaHRtbD9jbGFzc0ZpbHRlcj12aWV3ZVxyXG4gICAqIEByZXR1cm5zIGNlc2l1bVZpZXdlclxyXG4gICAqL1xyXG4gIGdldFZpZXdlcigpIHtcclxuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlcjtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIEZvciBtb3JlIGluZm9ybWF0aW9uIHNlZSBodHRwczovL2Nlc2l1bWpzLm9yZy9DZXNpdW0vQnVpbGQvRG9jdW1lbnRhdGlvbi9TY2VuZS5odG1sP2NsYXNzRmlsdGVyPXNjZW5lXHJcbiAgICogQHJldHVybnMgY2VzaXVtIHNjZW5lXHJcbiAgICovXHJcbiAgZ2V0U2NlbmUoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jZXNpdW1WaWV3ZXIuc2NlbmU7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBGb3IgbW9yZSBpbmZvcm1hdGlvbiBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL0NhbnZhc19BUElcclxuICAgKiBAcmV0dXJucyBjZXNpdW0gY2FudmFzXHJcbiAgICovXHJcbiAgZ2V0Q2FudmFzKCk6IEhUTUxDYW52YXNFbGVtZW50IHtcclxuICAgIHJldHVybiB0aGlzLmNlc2l1bVZpZXdlci5jYW52YXMgYXMgSFRNTENhbnZhc0VsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBnZXRNYXBDb250YWluZXIoKTogSFRNTEVsZW1lbnQge1xyXG4gICAgcmV0dXJuIHRoaXMubWFwQ29udGFpbmVyO1xyXG4gIH1cclxufVxyXG4iXX0=