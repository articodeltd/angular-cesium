import { Injectable } from '@angular/core';
import { PolylineCollection, Material } from 'cesium';
import { PrimitivesDrawerService } from '../primitives-drawer/primitives-drawer.service';
import { GeoUtilsService } from '../../geo-utils/geo-utils.service';
import * as i0 from "@angular/core";
import * as i1 from "../../cesium/cesium.service";
/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */
export class ArcDrawerService extends PrimitivesDrawerService {
    constructor(cesiumService) {
        super(PolylineCollection, cesiumService);
    }
    _calculateArcPositions(cesiumProps) {
        const quality = cesiumProps.quality || 18;
        const delta = (cesiumProps.delta) / quality;
        const pointsArray = [];
        for (let i = 0; i < quality + 1; ++i) {
            const point = GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle + delta * i, true);
            pointsArray.push(point);
        }
        return pointsArray;
    }
    _calculateTriangle(cesiumProps) {
        return [
            cesiumProps.center,
            GeoUtilsService.pointByLocationDistanceAndAzimuth(cesiumProps.center, cesiumProps.radius, cesiumProps.angle, true)
        ];
    }
    _calculateArc(cesiumProps) {
        const arcPoints = this._calculateArcPositions(cesiumProps);
        return cesiumProps.drawEdges ? arcPoints.concat(this._calculateTriangle(cesiumProps)) : arcPoints;
    }
    add(cesiumProps) {
        cesiumProps.positions = this._calculateArc(cesiumProps);
        if (cesiumProps.color) {
            const material = Material.fromType('Color');
            material.uniforms.color = cesiumProps.color;
            cesiumProps.material = material;
        }
        return this._cesiumCollection.add(cesiumProps);
    }
    update(primitive, cesiumProps) {
        if (!cesiumProps.constantColor && cesiumProps.color &&
            !primitive.material.uniforms.color.equals(cesiumProps.color)) {
            primitive.material.uniforms.color = cesiumProps.color;
        }
        primitive.width = cesiumProps.width !== undefined ? cesiumProps.width : primitive.width;
        primitive.show = cesiumProps.show !== undefined ? cesiumProps.show : primitive.show;
        primitive.distanceDisplayCondition = cesiumProps.distanceDisplayCondition !== undefined ?
            cesiumProps.distanceDisplayCondition : primitive.distanceDisplayCondition;
        primitive.positions = this._calculateArc(cesiumProps);
        return primitive;
    }
}
ArcDrawerService.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Injectable });
ArcDrawerService.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: ArcDrawerService, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXJjLWRyYXdlci5zZXJ2aWNlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9kcmF3ZXJzL2FyYy1kcmF3ZXIvYXJjLWRyYXdlci5zZXJ2aWNlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDM0MsT0FBTyxFQUFFLGtCQUFrQixFQUFFLFFBQVEsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUV0RCxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSxnREFBZ0QsQ0FBQztBQUN6RixPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sbUNBQW1DLENBQUM7OztBQUVwRTs7OztHQUlHO0FBR0gsTUFBTSxPQUFPLGdCQUFpQixTQUFRLHVCQUF1QjtJQUMzRCxZQUFZLGFBQTRCO1FBQ3RDLEtBQUssQ0FBQyxrQkFBa0IsRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMzQyxDQUFDO0lBRUQsc0JBQXNCLENBQUMsV0FBZ0I7UUFDckMsTUFBTSxPQUFPLEdBQUcsV0FBVyxDQUFDLE9BQU8sSUFBSSxFQUFFLENBQUM7UUFDMUMsTUFBTSxLQUFLLEdBQUcsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEdBQUcsT0FBTyxDQUFDO1FBQzVDLE1BQU0sV0FBVyxHQUFHLEVBQUUsQ0FBQztRQUN2QixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTyxHQUFHLENBQUMsRUFBRSxFQUFFLENBQUMsRUFBRTtZQUNwQyxNQUFNLEtBQUssR0FDVCxlQUFlLENBQUMsaUNBQWlDLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEdBQUcsS0FBSyxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztZQUNqSSxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3pCO1FBRUQsT0FBTyxXQUFXLENBQUM7SUFDckIsQ0FBQztJQUVELGtCQUFrQixDQUFDLFdBQWdCO1FBQ2pDLE9BQU87WUFDTCxXQUFXLENBQUMsTUFBTTtZQUNsQixlQUFlLENBQUMsaUNBQWlDLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxXQUFXLENBQUMsTUFBTSxFQUFFLFdBQVcsQ0FBQyxLQUFLLEVBQUUsSUFBSSxDQUFDO1NBQ25ILENBQUM7SUFDSixDQUFDO0lBRUQsYUFBYSxDQUFDLFdBQWdCO1FBQzVCLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUMzRCxPQUFPLFdBQVcsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQztJQUNwRyxDQUFDO0lBRUQsR0FBRyxDQUFDLFdBQWdCO1FBQ2xCLFdBQVcsQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUN4RCxJQUFJLFdBQVcsQ0FBQyxLQUFLLEVBQUU7WUFDckIsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztZQUM1QyxRQUFRLENBQUMsUUFBUSxDQUFDLEtBQUssR0FBRyxXQUFXLENBQUMsS0FBSyxDQUFDO1lBQzVDLFdBQVcsQ0FBQyxRQUFRLEdBQUcsUUFBUSxDQUFDO1NBQ2pDO1FBRUQsT0FBTyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRCxNQUFNLENBQUMsU0FBYyxFQUFFLFdBQWdCO1FBQ3JDLElBQUksQ0FBQyxXQUFXLENBQUMsYUFBYSxJQUFJLFdBQVcsQ0FBQyxLQUFLO1lBQ2pELENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDOUQsU0FBUyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLENBQUM7U0FDdkQ7UUFDRCxTQUFTLENBQUMsS0FBSyxHQUFHLFdBQVcsQ0FBQyxLQUFLLEtBQUssU0FBUyxDQUFDLENBQUMsQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDO1FBQ3hGLFNBQVMsQ0FBQyxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksS0FBSyxTQUFTLENBQUMsQ0FBQyxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7UUFDcEYsU0FBUyxDQUFDLHdCQUF3QixHQUFHLFdBQVcsQ0FBQyx3QkFBd0IsS0FBSyxTQUFTLENBQUMsQ0FBQztZQUN2RixXQUFXLENBQUMsd0JBQXdCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyx3QkFBd0IsQ0FBQztRQUM1RSxTQUFTLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsV0FBVyxDQUFDLENBQUM7UUFFdEQsT0FBTyxTQUFTLENBQUM7SUFDbkIsQ0FBQzs7NkdBckRVLGdCQUFnQjtpSEFBaEIsZ0JBQWdCOzJGQUFoQixnQkFBZ0I7a0JBRDVCLFVBQVUiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IFBvbHlsaW5lQ29sbGVjdGlvbiwgTWF0ZXJpYWwgfSBmcm9tICdjZXNpdW0nO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUHJpbWl0aXZlc0RyYXdlclNlcnZpY2UgfSBmcm9tICcuLi9wcmltaXRpdmVzLWRyYXdlci9wcmltaXRpdmVzLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vZ2VvLXV0aWxzL2dlby11dGlscy5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKyAgVGhpcyBkcmF3ZXIgaXMgcmVzcG9uc2libGUgZm9yIGRyYXdpbmcgYW4gYXJjIG92ZXIgdGhlIENlc2l1bSBtYXAuXHJcbiArICBUaGlzIGltcGxlbWVudGF0aW9uIHVzZXMgc2ltcGxlIFBvbHlsaW5lR2VvbWV0cnkgYW5kIFByaW1pdGl2ZSBwYXJhbWV0ZXJzLlxyXG4gKyAgVGhpcyBkb2Vzbid0IGFsbG93IHVzIHRvIGNoYW5nZSB0aGUgcG9zaXRpb24sIGNvbG9yLCBldGMuLiBvZiB0aGUgYXJjIGJ1dCBzZXRTaG93IG9ubHkuXHJcbiAqL1xyXG5cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQXJjRHJhd2VyU2VydmljZSBleHRlbmRzIFByaW1pdGl2ZXNEcmF3ZXJTZXJ2aWNlIHtcclxuICBjb25zdHJ1Y3RvcihjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICBzdXBlcihQb2x5bGluZUNvbGxlY3Rpb24sIGNlc2l1bVNlcnZpY2UpO1xyXG4gIH1cclxuXHJcbiAgX2NhbGN1bGF0ZUFyY1Bvc2l0aW9ucyhjZXNpdW1Qcm9wczogYW55KSB7XHJcbiAgICBjb25zdCBxdWFsaXR5ID0gY2VzaXVtUHJvcHMucXVhbGl0eSB8fCAxODtcclxuICAgIGNvbnN0IGRlbHRhID0gKGNlc2l1bVByb3BzLmRlbHRhKSAvIHF1YWxpdHk7XHJcbiAgICBjb25zdCBwb2ludHNBcnJheSA9IFtdO1xyXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBxdWFsaXR5ICsgMTsgKytpKSB7XHJcbiAgICAgIGNvbnN0IHBvaW50ID1cclxuICAgICAgICBHZW9VdGlsc1NlcnZpY2UucG9pbnRCeUxvY2F0aW9uRGlzdGFuY2VBbmRBemltdXRoKGNlc2l1bVByb3BzLmNlbnRlciwgY2VzaXVtUHJvcHMucmFkaXVzLCBjZXNpdW1Qcm9wcy5hbmdsZSArIGRlbHRhICogaSwgdHJ1ZSk7XHJcbiAgICAgIHBvaW50c0FycmF5LnB1c2gocG9pbnQpO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBwb2ludHNBcnJheTtcclxuICB9XHJcblxyXG4gIF9jYWxjdWxhdGVUcmlhbmdsZShjZXNpdW1Qcm9wczogYW55KSB7XHJcbiAgICByZXR1cm4gW1xyXG4gICAgICBjZXNpdW1Qcm9wcy5jZW50ZXIsXHJcbiAgICAgIEdlb1V0aWxzU2VydmljZS5wb2ludEJ5TG9jYXRpb25EaXN0YW5jZUFuZEF6aW11dGgoY2VzaXVtUHJvcHMuY2VudGVyLCBjZXNpdW1Qcm9wcy5yYWRpdXMsIGNlc2l1bVByb3BzLmFuZ2xlLCB0cnVlKVxyXG4gICAgXTtcclxuICB9XHJcblxyXG4gIF9jYWxjdWxhdGVBcmMoY2VzaXVtUHJvcHM6IGFueSkge1xyXG4gICAgY29uc3QgYXJjUG9pbnRzID0gdGhpcy5fY2FsY3VsYXRlQXJjUG9zaXRpb25zKGNlc2l1bVByb3BzKTtcclxuICAgIHJldHVybiBjZXNpdW1Qcm9wcy5kcmF3RWRnZXMgPyBhcmNQb2ludHMuY29uY2F0KHRoaXMuX2NhbGN1bGF0ZVRyaWFuZ2xlKGNlc2l1bVByb3BzKSkgOiBhcmNQb2ludHM7XHJcbiAgfVxyXG5cclxuICBhZGQoY2VzaXVtUHJvcHM6IGFueSk6IGFueSB7XHJcbiAgICBjZXNpdW1Qcm9wcy5wb3NpdGlvbnMgPSB0aGlzLl9jYWxjdWxhdGVBcmMoY2VzaXVtUHJvcHMpO1xyXG4gICAgaWYgKGNlc2l1bVByb3BzLmNvbG9yKSB7XHJcbiAgICAgIGNvbnN0IG1hdGVyaWFsID0gTWF0ZXJpYWwuZnJvbVR5cGUoJ0NvbG9yJyk7XHJcbiAgICAgIG1hdGVyaWFsLnVuaWZvcm1zLmNvbG9yID0gY2VzaXVtUHJvcHMuY29sb3I7XHJcbiAgICAgIGNlc2l1bVByb3BzLm1hdGVyaWFsID0gbWF0ZXJpYWw7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bUNvbGxlY3Rpb24uYWRkKGNlc2l1bVByb3BzKTtcclxuICB9XHJcblxyXG4gIHVwZGF0ZShwcmltaXRpdmU6IGFueSwgY2VzaXVtUHJvcHM6IGFueSkge1xyXG4gICAgaWYgKCFjZXNpdW1Qcm9wcy5jb25zdGFudENvbG9yICYmIGNlc2l1bVByb3BzLmNvbG9yICYmXHJcbiAgICAgICFwcmltaXRpdmUubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IuZXF1YWxzKGNlc2l1bVByb3BzLmNvbG9yKSkge1xyXG4gICAgICBwcmltaXRpdmUubWF0ZXJpYWwudW5pZm9ybXMuY29sb3IgPSBjZXNpdW1Qcm9wcy5jb2xvcjtcclxuICAgIH1cclxuICAgIHByaW1pdGl2ZS53aWR0aCA9IGNlc2l1bVByb3BzLndpZHRoICE9PSB1bmRlZmluZWQgPyBjZXNpdW1Qcm9wcy53aWR0aCA6IHByaW1pdGl2ZS53aWR0aDtcclxuICAgIHByaW1pdGl2ZS5zaG93ID0gY2VzaXVtUHJvcHMuc2hvdyAhPT0gdW5kZWZpbmVkID8gY2VzaXVtUHJvcHMuc2hvdyA6IHByaW1pdGl2ZS5zaG93O1xyXG4gICAgcHJpbWl0aXZlLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiA9IGNlc2l1bVByb3BzLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbiAhPT0gdW5kZWZpbmVkID9cclxuICAgICAgY2VzaXVtUHJvcHMuZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uIDogcHJpbWl0aXZlLmRpc3RhbmNlRGlzcGxheUNvbmRpdGlvbjtcclxuICAgIHByaW1pdGl2ZS5wb3NpdGlvbnMgPSB0aGlzLl9jYWxjdWxhdGVBcmMoY2VzaXVtUHJvcHMpO1xyXG5cclxuICAgIHJldHVybiBwcmltaXRpdmU7XHJcbiAgfVxyXG59XHJcbiJdfQ==