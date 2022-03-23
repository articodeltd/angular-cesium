import { Injectable } from '@angular/core';
import { PolygonGeometry } from 'cesium';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 + This drawer is responsible for drawing a polygon over the Cesium map.
 + This implementation uses simple PolygonGeometry and Primitive parameters.
 + This doesn't allow us to change the position, color, etc.. of the polygons. For that you may use the dynamic polygon component.
 */
export class StaticPolygonDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(PolygonGeometry, cesiumService);
    }
}
StaticPolygonDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticPolygonDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticPolygonDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicG9seWdvbi1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9zdGF0aWMtcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDekMsT0FBTyxFQUFFLHFCQUFxQixFQUFFLE1BQU0sNERBQTRELENBQUM7OztBQUduRzs7OztHQUlHO0FBRUgsTUFBTSxPQUFPLDBCQUEyQixTQUFRLHFCQUFxQjtJQUNuRSxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxlQUFlLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDeEMsQ0FBQzs7dUhBSFUsMEJBQTBCOzJIQUExQiwwQkFBMEI7MkZBQTFCLDBCQUEwQjtrQkFEdEMsVUFBVSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUG9seWdvbkdlb21ldHJ5IH0gZnJvbSAnY2VzaXVtJztcclxuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi8uLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiArIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGEgcG9seWdvbiBvdmVyIHRoZSBDZXNpdW0gbWFwLlxyXG4gKyBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgc2ltcGxlIFBvbHlnb25HZW9tZXRyeSBhbmQgUHJpbWl0aXZlIHBhcmFtZXRlcnMuXHJcbiArIFRoaXMgZG9lc24ndCBhbGxvdyB1cyB0byBjaGFuZ2UgdGhlIHBvc2l0aW9uLCBjb2xvciwgZXRjLi4gb2YgdGhlIHBvbHlnb25zLiBGb3IgdGhhdCB5b3UgbWF5IHVzZSB0aGUgZHluYW1pYyBwb2x5Z29uIGNvbXBvbmVudC5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcclxuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihQb2x5Z29uR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xyXG4gIH1cclxufVxyXG4iXX0=