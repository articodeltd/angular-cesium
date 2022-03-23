import { Injectable } from '@angular/core';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
export class HtmlDrawerService extends PrimitivesDrawerService {
    constructor(_cesiumService) {
        super(Cesium.HtmlCollection, _cesiumService);
        this._cesiumService = _cesiumService;
    }
    add(cesiumProps) {
        cesiumProps.scene = this._cesiumService.getScene();
        // cesiumProps.mapContainer = this._cesiumService.getMap().getMapContainer();
        cesiumProps.mapContainer = this._cesiumService.getMapContainer();
        return super.add(cesiumProps);
    }
}
HtmlDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
HtmlDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: HtmlDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHRtbC1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFFM0MsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sZ0RBQWdELENBQUM7OztBQUl6RixNQUFNLE9BQU8saUJBQWtCLFNBQVEsdUJBQXVCO0lBQzVELFlBQW9CLGNBQTZCO1FBQy9DLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBRDNCLG1CQUFjLEdBQWQsY0FBYyxDQUFlO0lBRWpELENBQUM7SUFFRCxHQUFHLENBQUMsV0FBZ0I7UUFDbEIsV0FBVyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFFBQVEsRUFBRSxDQUFDO1FBQ25ELDZFQUE2RTtRQUM3RSxXQUFXLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsZUFBZSxFQUFFLENBQUM7UUFDakUsT0FBTyxLQUFLLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2hDLENBQUM7OzhHQVZVLGlCQUFpQjtrSEFBakIsaUJBQWlCOzJGQUFqQixpQkFBaUI7a0JBRDdCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xyXG5kZWNsYXJlIHZhciBDZXNpdW06IGFueTtcclxuXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIEh0bWxEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2Uge1xyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX2Nlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcclxuICAgIHN1cGVyKENlc2l1bS5IdG1sQ29sbGVjdGlvbiwgX2Nlc2l1bVNlcnZpY2UpO1xyXG4gIH1cclxuXHJcbiAgYWRkKGNlc2l1bVByb3BzOiBhbnkpOiBhbnkge1xyXG4gICAgY2VzaXVtUHJvcHMuc2NlbmUgPSB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldFNjZW5lKCk7XHJcbiAgICAvLyBjZXNpdW1Qcm9wcy5tYXBDb250YWluZXIgPSB0aGlzLl9jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldE1hcENvbnRhaW5lcigpO1xyXG4gICAgY2VzaXVtUHJvcHMubWFwQ29udGFpbmVyID0gdGhpcy5fY2VzaXVtU2VydmljZS5nZXRNYXBDb250YWluZXIoKTtcclxuICAgIHJldHVybiBzdXBlci5hZGQoY2VzaXVtUHJvcHMpO1xyXG4gIH1cclxufVxyXG4iXX0=