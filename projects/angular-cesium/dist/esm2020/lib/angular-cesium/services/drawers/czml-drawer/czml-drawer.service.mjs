import { Injectable } from '@angular/core';
import { CzmlDataSource } from 'cesium';
import { BasicDrawerService } from '../basic-drawer/basic-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 *  This drawer is responsible for drawing czml dataSources.
 */
export class CzmlDrawerService extends BasicDrawerService {
    constructor(cesiumService) {
        super();
        this.cesiumService = cesiumService;
    }
    init(options) {
        const dataSources = [];
        this.czmlStream = new CzmlDataSource('czml');
        dataSources.push(this.czmlStream);
        this.cesiumService.getViewer().dataSources.add(this.czmlStream);
        return dataSources;
    }
    // returns the packet, provided by the stream
    add(cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
        return cesiumProps;
    }
    update(entity, cesiumProps) {
        this.czmlStream.process(cesiumProps.czmlPacket);
    }
    remove(entity) {
        this.czmlStream.entities.removeById(entity.acEntity.id);
    }
    removeAll() {
        this.czmlStream.entities.removeAll();
    }
    setShow(showValue) {
        this.czmlStream.entities.show = showValue;
    }
}
CzmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
CzmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CzmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY3ptbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGNBQWMsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUV4QyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQzs7O0FBRzFFOztHQUVHO0FBRUgsTUFBTSxPQUFPLGlCQUFrQixTQUFRLGtCQUFrQjtJQUl2RCxZQUNVLGFBQTRCO1FBRXBDLEtBQUssRUFBRSxDQUFDO1FBRkEsa0JBQWEsR0FBYixhQUFhLENBQWU7SUFHdEMsQ0FBQztJQUdELElBQUksQ0FBQyxPQUErQjtRQUNsQyxNQUFNLFdBQVcsR0FBRyxFQUFFLENBQUM7UUFFdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUU3QyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVsQyxJQUFJLENBQUMsYUFBYSxDQUFDLFNBQVMsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBRWhFLE9BQU8sV0FBVyxDQUFDO0lBQ3JCLENBQUM7SUFFRCw2Q0FBNkM7SUFDN0MsR0FBRyxDQUFDLFdBQWdCO1FBRWxCLElBQUksQ0FBQyxVQUFVLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsQ0FBQztRQUVoRCxPQUFPLFdBQVcsQ0FBQztJQUNyQixDQUFDO0lBRUQsTUFBTSxDQUFDLE1BQVcsRUFBRSxXQUFnQjtRQUNsQyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7SUFDbEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFXO1FBQ2hCLElBQUksQ0FBQyxVQUFVLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLEVBQUUsQ0FBQyxDQUFDO0lBQzFELENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLFVBQVUsQ0FBQyxRQUFRLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDdkMsQ0FBQztJQUVELE9BQU8sQ0FBQyxTQUFrQjtRQUN4QixJQUFJLENBQUMsVUFBVSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEdBQUcsU0FBUyxDQUFDO0lBQzVDLENBQUM7OzhHQTdDVSxpQkFBaUI7a0hBQWpCLGlCQUFpQjsyRkFBakIsaUJBQWlCO2tCQUQ3QixVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSW5qZWN0YWJsZSB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDem1sRGF0YVNvdXJjZSB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCYXNpY0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBFbnRpdGllc0RyYXdlck9wdGlvbnMgfSBmcm9tICcuLi8uLi8uLi9tb2RlbHMvZW50aXRpZXMtZHJhd2VyLW9wdGlvbnMnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGRyYXdlciBpcyByZXNwb25zaWJsZSBmb3IgZHJhd2luZyBjem1sIGRhdGFTb3VyY2VzLlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ3ptbERyYXdlclNlcnZpY2UgZXh0ZW5kcyBCYXNpY0RyYXdlclNlcnZpY2Uge1xyXG5cclxuICBjem1sU3RyZWFtOiBhbnk7XHJcblxyXG4gIGNvbnN0cnVjdG9yKFxyXG4gICAgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlLFxyXG4gICkge1xyXG4gICAgc3VwZXIoKTtcclxuICB9XHJcblxyXG5cclxuICBpbml0KG9wdGlvbnM/OiBFbnRpdGllc0RyYXdlck9wdGlvbnMpIHtcclxuICAgIGNvbnN0IGRhdGFTb3VyY2VzID0gW107XHJcblxyXG4gICAgdGhpcy5jem1sU3RyZWFtID0gbmV3IEN6bWxEYXRhU291cmNlKCdjem1sJyk7XHJcblxyXG4gICAgZGF0YVNvdXJjZXMucHVzaCh0aGlzLmN6bWxTdHJlYW0pO1xyXG5cclxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5kYXRhU291cmNlcy5hZGQodGhpcy5jem1sU3RyZWFtKTtcclxuXHJcbiAgICByZXR1cm4gZGF0YVNvdXJjZXM7XHJcbiAgfVxyXG5cclxuICAvLyByZXR1cm5zIHRoZSBwYWNrZXQsIHByb3ZpZGVkIGJ5IHRoZSBzdHJlYW1cclxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XHJcblxyXG4gICAgdGhpcy5jem1sU3RyZWFtLnByb2Nlc3MoY2VzaXVtUHJvcHMuY3ptbFBhY2tldCk7XHJcblxyXG4gICAgcmV0dXJuIGNlc2l1bVByb3BzO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlKGVudGl0eTogYW55LCBjZXNpdW1Qcm9wczogYW55KSB7XHJcbiAgICB0aGlzLmN6bWxTdHJlYW0ucHJvY2VzcyhjZXNpdW1Qcm9wcy5jem1sUGFja2V0KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShlbnRpdHk6IGFueSkge1xyXG4gICAgdGhpcy5jem1sU3RyZWFtLmVudGl0aWVzLnJlbW92ZUJ5SWQoZW50aXR5LmFjRW50aXR5LmlkKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUFsbCgpIHtcclxuICAgIHRoaXMuY3ptbFN0cmVhbS5lbnRpdGllcy5yZW1vdmVBbGwoKTtcclxuICB9XHJcblxyXG4gIHNldFNob3coc2hvd1ZhbHVlOiBib29sZWFuKSB7XHJcbiAgICB0aGlzLmN6bWxTdHJlYW0uZW50aXRpZXMuc2hvdyA9IHNob3dWYWx1ZTtcclxuICB9XHJcblxyXG59XHJcblxyXG5cclxuIl19