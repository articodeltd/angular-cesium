import { Injectable } from '@angular/core';
import { Viewer } from 'cesium';
import * as i0 from "@angular/core";
export class ViewerFactory {
    /**
     * Creates a viewer with default or custom options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with - Optional
     *
     * @returns new viewer
     */
    createViewer(mapContainer, options) {
        let viewer = null;
        if (options) {
            viewer = new Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
                ...options
            });
        }
        else {
            viewer = new Viewer(mapContainer, {
                contextOptions: {
                    webgl: { preserveDrawingBuffer: true }
                },
            });
        }
        return viewer;
    }
}
ViewerFactory.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory, deps: [], target: i0.ɵɵFactoryTarget.Injectable });
ViewerFactory.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ViewerFactory, decorators: [{
            type: Injectable
        }] });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidmlld2VyLWZhY3Rvcnkuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvdmlld2VyLWZhY3Rvcnkvdmlld2VyLWZhY3Rvcnkuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRTNDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxRQUFRLENBQUM7O0FBR2hDLE1BQU0sT0FBTyxhQUFhO0lBRXhCOzs7Ozs7T0FNRztJQUNILFlBQVksQ0FBQyxZQUF5QixFQUFFLE9BQWE7UUFDbkQsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2xCLElBQUksT0FBTyxFQUFFO1lBQ1gsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLFlBQVksRUFBRTtnQkFDaEMsY0FBYyxFQUFFO29CQUNkLEtBQUssRUFBRSxFQUFDLHFCQUFxQixFQUFFLElBQUksRUFBQztpQkFDckM7Z0JBQ0QsR0FBRyxPQUFPO2FBQ1gsQ0FBQyxDQUFDO1NBQ0o7YUFBTTtZQUNMLE1BQU0sR0FBRyxJQUFJLE1BQU0sQ0FBQyxZQUFZLEVBQzlCO2dCQUNFLGNBQWMsRUFBRTtvQkFDZCxLQUFLLEVBQUUsRUFBQyxxQkFBcUIsRUFBRSxJQUFJLEVBQUM7aUJBQ3JDO2FBQ0YsQ0FBQyxDQUFDO1NBQ047UUFFRCxPQUFPLE1BQU0sQ0FBQztJQUNoQixDQUFDOzswR0E1QlUsYUFBYTs4R0FBYixhQUFhOzJGQUFiLGFBQWE7a0JBRHpCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5pbXBvcnQgeyBWaWV3ZXIgfSBmcm9tICdjZXNpdW0nO1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgVmlld2VyRmFjdG9yeSB7XHJcblxyXG4gIC8qKlxyXG4gICAqIENyZWF0ZXMgYSB2aWV3ZXIgd2l0aCBkZWZhdWx0IG9yIGN1c3RvbSBvcHRpb25zXHJcbiAgICogQHBhcmFtIG1hcENvbnRhaW5lciAtIGNvbnRhaW5lciB0byBpbml0aWFsaXplIHRoZSB2aWV3ZXIgb25cclxuICAgKiBAcGFyYW0gb3B0aW9ucyAtIE9wdGlvbnMgdG8gY3JlYXRlIHRoZSB2aWV3ZXIgd2l0aCAtIE9wdGlvbmFsXHJcbiAgICpcclxuICAgKiBAcmV0dXJucyBuZXcgdmlld2VyXHJcbiAgICovXHJcbiAgY3JlYXRlVmlld2VyKG1hcENvbnRhaW5lcjogSFRNTEVsZW1lbnQsIG9wdGlvbnM/OiBhbnkpIHtcclxuICAgIGxldCB2aWV3ZXIgPSBudWxsO1xyXG4gICAgaWYgKG9wdGlvbnMpIHtcclxuICAgICAgdmlld2VyID0gbmV3IFZpZXdlcihtYXBDb250YWluZXIsIHtcclxuICAgICAgICBjb250ZXh0T3B0aW9uczoge1xyXG4gICAgICAgICAgd2ViZ2w6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9XHJcbiAgICAgICAgfSxcclxuICAgICAgICAuLi5vcHRpb25zXHJcbiAgICAgIH0pO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgdmlld2VyID0gbmV3IFZpZXdlcihtYXBDb250YWluZXIsXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgY29udGV4dE9wdGlvbnM6IHtcclxuICAgICAgICAgICAgd2ViZ2w6IHtwcmVzZXJ2ZURyYXdpbmdCdWZmZXI6IHRydWV9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB2aWV3ZXI7XHJcbiAgfVxyXG59XHJcbiJdfQ==