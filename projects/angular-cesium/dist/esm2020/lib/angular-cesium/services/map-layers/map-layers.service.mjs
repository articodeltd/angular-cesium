import { Injectable } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
export class MapLayersService {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        this.layersDataSources = [];
    }
    registerLayerDataSources(dataSources, zIndex) {
        dataSources.forEach(ds => {
            ds.zIndex = zIndex;
            this.layersDataSources.push(ds);
        });
    }
    drawAllLayers() {
        this.layersDataSources.sort((a, b) => a.zIndex - b.zIndex);
        this.layersDataSources.forEach((dataSource) => {
            this.cesiumService.getViewer().dataSources.add(dataSource);
        });
    }
    updateAndRefresh(dataSources, newZIndex) {
        if (dataSources && dataSources.length) {
            dataSources.forEach((ds) => {
                const index = this.layersDataSources.indexOf(ds);
                if (index !== -1) {
                    this.layersDataSources[index].zIndex = newZIndex;
                }
            });
            this.cesiumService.getViewer().dataSources.removeAll();
            this.drawAllLayers();
        }
    }
    removeDataSources(dataSources) {
        dataSources.forEach(ds => {
            const index = this.layersDataSources.indexOf(ds);
            if (index !== -1) {
                this.layersDataSources.splice(index, 1);
                this.cesiumService.getViewer().dataSources.remove(ds, true);
            }
        });
    }
}
MapLayersService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
MapLayersService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: MapLayersService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFwLWxheWVycy5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDOzs7QUFHM0MsTUFBTSxPQUFPLGdCQUFnQjtJQUkzQixZQUFvQixhQUE0QjtRQUE1QixrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUZ4QyxzQkFBaUIsR0FBVSxFQUFFLENBQUM7SUFJdEMsQ0FBQztJQUVELHdCQUF3QixDQUFDLFdBQWtCLEVBQUUsTUFBYztRQUN6RCxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1lBQ25CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUQsYUFBYTtRQUNYLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzRCxJQUFJLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLENBQUMsVUFBVSxFQUFFLEVBQUU7WUFDNUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxTQUFTLEVBQUUsQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQzdELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVELGdCQUFnQixDQUFDLFdBQWtCLEVBQUUsU0FBaUI7UUFDcEQsSUFBSSxXQUFXLElBQUksV0FBVyxDQUFDLE1BQU0sRUFBRTtZQUNyQyxXQUFXLENBQUMsT0FBTyxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUU7Z0JBQ3pCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ2pELElBQUksS0FBSyxLQUFLLENBQUMsQ0FBQyxFQUFFO29CQUNoQixJQUFJLENBQUMsaUJBQWlCLENBQUMsS0FBSyxDQUFDLENBQUMsTUFBTSxHQUFHLFNBQVMsQ0FBQztpQkFDbEQ7WUFDSCxDQUFDLENBQUMsQ0FBQztZQUVILElBQUksQ0FBQyxhQUFhLENBQUMsU0FBUyxFQUFFLENBQUMsV0FBVyxDQUFDLFNBQVMsRUFBRSxDQUFDO1lBQ3ZELElBQUksQ0FBQyxhQUFhLEVBQUUsQ0FBQztTQUN0QjtJQUNILENBQUM7SUFFRCxpQkFBaUIsQ0FBQyxXQUFrQjtRQUNsQyxXQUFXLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxFQUFFO1lBQ3ZCLE1BQU0sS0FBSyxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDakQsSUFBSSxLQUFLLEtBQUssQ0FBQyxDQUFDLEVBQUU7Z0JBQ2hCLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFFLENBQUMsQ0FBQyxDQUFDO2dCQUN4QyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2FBQzdEO1FBQ0gsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDOzs2R0E3Q1UsZ0JBQWdCO2lIQUFoQixnQkFBZ0I7MkZBQWhCLGdCQUFnQjtrQkFENUIsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG5ASW5qZWN0YWJsZSgpXHJcbmV4cG9ydCBjbGFzcyBNYXBMYXllcnNTZXJ2aWNlIHtcclxuXHJcbiAgcHJpdmF0ZSBsYXllcnNEYXRhU291cmNlczogYW55W10gPSBbXTtcclxuXHJcbiAgY29uc3RydWN0b3IocHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcblxyXG4gIH1cclxuXHJcbiAgcmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRhdGFTb3VyY2VzOiBhbnlbXSwgekluZGV4OiBudW1iZXIpIHtcclxuICAgIGRhdGFTb3VyY2VzLmZvckVhY2goZHMgPT4ge1xyXG4gICAgICBkcy56SW5kZXggPSB6SW5kZXg7XHJcbiAgICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMucHVzaChkcyk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIGRyYXdBbGxMYXllcnMoKSB7XHJcbiAgICB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLnNvcnQoKGEsIGIpID0+IGEuekluZGV4IC0gYi56SW5kZXgpO1xyXG5cclxuICAgIHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuZm9yRWFjaCgoZGF0YVNvdXJjZSkgPT4ge1xyXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMuYWRkKGRhdGFTb3VyY2UpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGVBbmRSZWZyZXNoKGRhdGFTb3VyY2VzOiBhbnlbXSwgbmV3WkluZGV4OiBudW1iZXIpIHtcclxuICAgIGlmIChkYXRhU291cmNlcyAmJiBkYXRhU291cmNlcy5sZW5ndGgpIHtcclxuICAgICAgZGF0YVNvdXJjZXMuZm9yRWFjaCgoZHMpID0+IHtcclxuICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMubGF5ZXJzRGF0YVNvdXJjZXMuaW5kZXhPZihkcyk7XHJcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xyXG4gICAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlc1tpbmRleF0uekluZGV4ID0gbmV3WkluZGV4O1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcblxyXG4gICAgICB0aGlzLmNlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCkuZGF0YVNvdXJjZXMucmVtb3ZlQWxsKCk7XHJcbiAgICAgIHRoaXMuZHJhd0FsbExheWVycygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlRGF0YVNvdXJjZXMoZGF0YVNvdXJjZXM6IGFueVtdKSB7XHJcbiAgICBkYXRhU291cmNlcy5mb3JFYWNoKGRzID0+IHtcclxuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmxheWVyc0RhdGFTb3VyY2VzLmluZGV4T2YoZHMpO1xyXG4gICAgICBpZiAoaW5kZXggIT09IC0xKSB7XHJcbiAgICAgICAgdGhpcy5sYXllcnNEYXRhU291cmNlcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5yZW1vdmUoZHMsIHRydWUpO1xyXG4gICAgICB9XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuIl19