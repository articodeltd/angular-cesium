import { EllipseGeometry } from 'cesium';
import { Injectable } from '@angular/core';
import { StaticPrimitiveDrawer } from '../static-primitive-drawer/static-primitive-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 + *  This drawer is responsible for drawing an ellipse over the Cesium map.
 + *  This implementation uses simple EllipseGeometry and Primitive parameters.
 + *  This doesn't allow us to change the position, color, etc.. of the ellipses. For that you may use the dynamic ellipse component.
 + */
export class StaticEllipseDrawerService extends StaticPrimitiveDrawer {
    constructor(cesiumService) {
        super(EllipseGeometry, cesiumService);
    }
}
StaticEllipseDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
StaticEllipseDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: StaticEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZS1kcmF3ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUNBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFDekMsT0FBTyxFQUFFLFVBQVUsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUMzQyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQzs7O0FBR25HOzs7O0tBSUs7QUFFTCxNQUFNLE9BQU8sMEJBQTJCLFNBQVEscUJBQXFCO0lBQ25FLFlBQVksYUFBNEI7UUFDdEMsS0FBSyxDQUFDLGVBQWUsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUN4QyxDQUFDOzt1SEFIVSwwQkFBMEI7MkhBQTFCLDBCQUEwQjsyRkFBMUIsMEJBQTBCO2tCQUR0QyxVQUFVIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IEVsbGlwc2VHZW9tZXRyeSB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IEluamVjdGFibGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgU3RhdGljUHJpbWl0aXZlRHJhd2VyIH0gZnJvbSAnLi4vc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIvc3RhdGljLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XHJcblxyXG5cclxuLyoqXHJcbiArICogIFRoaXMgZHJhd2VyIGlzIHJlc3BvbnNpYmxlIGZvciBkcmF3aW5nIGFuIGVsbGlwc2Ugb3ZlciB0aGUgQ2VzaXVtIG1hcC5cclxuICsgKiAgVGhpcyBpbXBsZW1lbnRhdGlvbiB1c2VzIHNpbXBsZSBFbGxpcHNlR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxyXG4gKyAqICBUaGlzIGRvZXNuJ3QgYWxsb3cgdXMgdG8gY2hhbmdlIHRoZSBwb3NpdGlvbiwgY29sb3IsIGV0Yy4uIG9mIHRoZSBlbGxpcHNlcy4gRm9yIHRoYXQgeW91IG1heSB1c2UgdGhlIGR5bmFtaWMgZWxsaXBzZSBjb21wb25lbnQuXHJcbiArICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIFN0YXRpY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIGV4dGVuZHMgU3RhdGljUHJpbWl0aXZlRHJhd2VyIHtcclxuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihFbGxpcHNlR2VvbWV0cnksIGNlc2l1bVNlcnZpY2UpO1xyXG4gIH1cclxufVxyXG4iXX0=