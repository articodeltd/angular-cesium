import { Injectable } from '@angular/core';
import { PrimitiveCollection } from 'cesium';
import { Checker } from '../../../../utils/checker';
import { EllipsePrimitive } from 'primitive-primitives';
import { PrimitivesDrawerService } from '../../primitives-drawer/primitives-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../../cesium/cesium.service";
/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  We are using the primitive-primitives implementation of an ellipse. see: https://github.com/gotenxds/Primitive-primitives
 *  This allows us to change the position of the ellipses without creating a new primitive object
 *  as Cesium does not allow updating an ellipse.
 */
export class DynamicEllipseDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PrimitiveCollection, cesiumService);
    }
    add(cesiumProps) {
        Checker.throwIfAnyNotPresent(cesiumProps, ['center', 'semiMajorAxis', 'semiMinorAxis']);
        return super.add(new EllipsePrimitive(cesiumProps));
    }
    update(ellipse, cesiumProps) {
        ellipse.updateLocationData(cesiumProps);
        return ellipse;
    }
}
DynamicEllipseDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
DynamicEllipseDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: DynamicEllipseDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZHluYW1pYy1lbGxpcHNlLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL3N0YXRpYy1keW5hbWljL2VsbGlwc2UtZHJhd2VyL2R5bmFtaWMtZWxsaXBzZS1kcmF3ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzNDLE9BQU8sRUFBRSxtQkFBbUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUU3QyxPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0sMkJBQTJCLENBQUM7QUFDcEQsT0FBTyxFQUFFLGdCQUFnQixFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDeEQsT0FBTyxFQUFFLHVCQUF1QixFQUFFLE1BQU0sbURBQW1ELENBQUM7OztBQUc1Rjs7Ozs7R0FLRztBQUVILE1BQU0sT0FBTywyQkFBNEIsU0FBUSx1QkFBdUI7SUFDdEUsWUFBWSxhQUE0QjtRQUN0QyxLQUFLLENBQUMsbUJBQW1CLEVBQUUsYUFBYSxDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELEdBQUcsQ0FBQyxXQUFnQjtRQUNsQixPQUFPLENBQUMsb0JBQW9CLENBQUMsV0FBVyxFQUFFLENBQUMsUUFBUSxFQUFFLGVBQWUsRUFBRSxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRXhGLE9BQU8sS0FBSyxDQUFDLEdBQUcsQ0FBQyxJQUFJLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7SUFDdEQsQ0FBQztJQUVELE1BQU0sQ0FBQyxPQUFZLEVBQUUsV0FBZ0I7UUFDbkMsT0FBTyxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBRXhDLE9BQU8sT0FBTyxDQUFDO0lBQ2pCLENBQUM7O3dIQWZVLDJCQUEyQjs0SEFBM0IsMkJBQTJCOzJGQUEzQiwyQkFBMkI7a0JBRHZDLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFByaW1pdGl2ZUNvbGxlY3Rpb24gfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2hlY2tlciB9IGZyb20gJy4uLy4uLy4uLy4uL3V0aWxzL2NoZWNrZXInO1xyXG5pbXBvcnQgeyBFbGxpcHNlUHJpbWl0aXZlIH0gZnJvbSAncHJpbWl0aXZlLXByaW1pdGl2ZXMnO1xyXG5pbXBvcnQgeyBQcmltaXRpdmVzRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3ByaW1pdGl2ZXMtZHJhd2VyL3ByaW1pdGl2ZXMtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuXHJcbi8qKlxyXG4gKiAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGNyZWF0aW5nIHRoZSBkeW5hbWljIHZlcnNpb24gb2YgdGhlIGVsbGlwc2UgY29tcG9uZW50LlxyXG4gKiAgV2UgYXJlIHVzaW5nIHRoZSBwcmltaXRpdmUtcHJpbWl0aXZlcyBpbXBsZW1lbnRhdGlvbiBvZiBhbiBlbGxpcHNlLiBzZWU6IGh0dHBzOi8vZ2l0aHViLmNvbS9nb3Rlbnhkcy9QcmltaXRpdmUtcHJpbWl0aXZlc1xyXG4gKiAgVGhpcyBhbGxvd3MgdXMgdG8gY2hhbmdlIHRoZSBwb3NpdGlvbiBvZiB0aGUgZWxsaXBzZXMgd2l0aG91dCBjcmVhdGluZyBhIG5ldyBwcmltaXRpdmUgb2JqZWN0XHJcbiAqICBhcyBDZXNpdW0gZG9lcyBub3QgYWxsb3cgdXBkYXRpbmcgYW4gZWxsaXBzZS5cclxuICovXHJcbkBJbmplY3RhYmxlKClcclxuZXhwb3J0IGNsYXNzIER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihQcmltaXRpdmVDb2xsZWN0aW9uLCBjZXNpdW1TZXJ2aWNlKTtcclxuICB9XHJcblxyXG4gIGFkZChjZXNpdW1Qcm9wczogYW55KTogYW55IHtcclxuICAgIENoZWNrZXIudGhyb3dJZkFueU5vdFByZXNlbnQoY2VzaXVtUHJvcHMsIFsnY2VudGVyJywgJ3NlbWlNYWpvckF4aXMnLCAnc2VtaU1pbm9yQXhpcyddKTtcclxuXHJcbiAgICByZXR1cm4gc3VwZXIuYWRkKG5ldyBFbGxpcHNlUHJpbWl0aXZlKGNlc2l1bVByb3BzKSk7XHJcbiAgfVxyXG5cclxuICB1cGRhdGUoZWxsaXBzZTogYW55LCBjZXNpdW1Qcm9wczogYW55KTogYW55IHtcclxuICAgIGVsbGlwc2UudXBkYXRlTG9jYXRpb25EYXRhKGNlc2l1bVByb3BzKTtcclxuXHJcbiAgICByZXR1cm4gZWxsaXBzZTtcclxuICB9XHJcbn1cclxuIl19