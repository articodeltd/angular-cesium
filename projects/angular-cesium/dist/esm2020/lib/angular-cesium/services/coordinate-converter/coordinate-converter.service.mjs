import { Injectable, Optional } from '@angular/core';
import { Cartographic, Math as cMath, Cartesian3, SceneTransforms, Cartesian2 } from 'cesium';
import * as geodesy from 'geodesy';
import { LatLonEllipsoidal, Utm } from 'geodesy';
import * as i0 from "@angular/core";
import * as i1 from "../cesium/cesium.service";
const LatLonVectors = geodesy['LatLonVectors']; // doesnt exists on typings
window['geodesy'] = geodesy;
/**
 *  Given different types of coordinates, we provide you a service converting those types to the most common other types.
 *  We are using the geodesy implementation of UTM conversion. see: https://github.com/chrisveness/geodesy.
 *
 * @example
 * import { Component, OnInit } from '@angular/core';
 * import { CoordinateConverter } from 'angular2-cesium';
 *
 * @Component({
 * 		selector:'my-component',
 * 		template:'<div>{{showCartographic}}</div>',
 * 		providers:[CoordinateConverter]
 * })
 * export class MyComponent implements OnInit {
 * 		showCartographic;
 *
 * 		constructor(private coordinateConverter:CoordinateConverter){
 * 		}
 *
 * 		ngOnInit(){
 * 			this.showCartographic = this.coordinateConverter.degreesToCartographic(5, 5, 5);
 *  }
 * }
 *
 */
export class CoordinateConverter {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
    }
    static cartesian3ToLatLon(cartesian3, ellipsoid) {
        const cart = Cartographic.fromCartesian(cartesian3, ellipsoid);
        return {
            lon: cMath.toDegrees(cart.longitude),
            lat: cMath.toDegrees(cart.latitude),
            height: cart.height
        };
    }
    screenToCartesian3(screenPos, addMapCanvasBoundsToPos) {
        if (!this.cesiumService) {
            throw new Error('ANGULAR2-CESIUM - Cesium service should be provided in order' +
                ' to do screen position calculations');
        }
        else {
            const screenPosition = { ...screenPos };
            if (addMapCanvasBoundsToPos) {
                const mapBounds = this.cesiumService.getViewer().canvas.getBoundingClientRect();
                screenPosition.x += mapBounds.left;
                screenPosition.y += mapBounds.top;
            }
            const camera = this.cesiumService.getViewer().camera;
            return camera.pickEllipsoid(screenPosition);
        }
    }
    screenToCartographic(screenPos, ellipsoid) {
        return this.cartesian3ToCartographic(this.screenToCartesian3(screenPos), ellipsoid);
    }
    cartesian3ToCartographic(cartesian, ellipsoid) {
        return Cartographic.fromCartesian(cartesian, ellipsoid);
    }
    degreesToCartographic(longitude, latitude, height) {
        return Cartographic.fromDegrees(longitude, latitude, height);
    }
    radiansToCartographic(longitude, latitude, height) {
        return Cartographic.fromRadians(longitude, latitude, height);
    }
    degreesToUTM(longitude, latitude) {
        return new LatLonEllipsoidal(latitude, longitude).toUtm();
    }
    UTMToDegrees(zone, hemisphereType, easting, northing) {
        return this.geodesyToCesiumObject(new Utm(zone, hemisphereType, easting, northing).toLatLonE());
    }
    geodesyToCesiumObject(geodesyRadians) {
        return {
            longitude: geodesyRadians.lon,
            latitude: geodesyRadians.lat,
            height: geodesyRadians['height'] ? geodesyRadians['height'] : 0
        };
    }
    /**
     * middle point between two points
     * @param first  (latitude,longitude) in radians
     * @param second (latitude,longitude) in radians
     */
    midPointToCartesian3(first, second) {
        const toDeg = (rad) => cMath.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const middlePoint = firstPoint.midpointTo(secondPoint);
        return Cartesian3.fromDegrees(middlePoint.lon, middlePoint.lat);
    }
    middlePointByScreen(position0, position1) {
        const scene = this.cesiumService.getScene();
        const screenPosition1 = SceneTransforms.wgs84ToWindowCoordinates(scene, position0);
        const screenPosition2 = SceneTransforms.wgs84ToWindowCoordinates(scene, position1);
        const middleScreenPoint = new Cartesian2((screenPosition2.x + screenPosition1.x) / 2.0, (screenPosition2.y + screenPosition1.y) / 2.0);
        return scene.pickPosition(middleScreenPoint);
    }
    /**
     * initial bearing between two points
     *
     * * @return bearing in degrees
     * @param first - {latitude,longitude} in radians
     * @param second - {latitude,longitude} in radians
     */
    bearingTo(first, second) {
        const toDeg = (rad) => cMath.toDegrees(rad);
        const firstPoint = new LatLonVectors(toDeg(first.latitude), toDeg(first.longitude));
        const secondPoint = new LatLonVectors(toDeg(second.latitude), toDeg(second.longitude));
        const bearing = firstPoint.bearingTo(secondPoint);
        return bearing;
    }
    /**
     * initial bearing between two points
     *
     * @return bearing in degrees
     */
    bearingToCartesian(firstCartesian3, secondCartesian3) {
        const firstCart = Cartographic.fromCartesian(firstCartesian3);
        const secondCart = Cartographic.fromCartesian(secondCartesian3);
        return this.bearingTo(firstCart, secondCart);
    }
}
CoordinateConverter.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter, deps: [{ token: i1.CesiumService, optional: true }], target: i0.ɵɵFactoryTarget.Injectable });
CoordinateConverter.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: CoordinateConverter, decorators: [{
            type: Injectable
        }], ctorParameters: function () { return [{ type: i1.CesiumService, decorators: [{
                    type: Optional
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY29vcmRpbmF0ZS1jb252ZXJ0ZXIvY29vcmRpbmF0ZS1jb252ZXJ0ZXIuc2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsVUFBVSxFQUFFLFFBQVEsRUFBRSxNQUFNLGVBQWUsQ0FBQztBQUNyRCxPQUFPLEVBQUUsWUFBWSxFQUFFLElBQUksSUFBSSxLQUFLLEVBQUUsVUFBVSxFQUFFLGVBQWUsRUFBRSxVQUFVLEVBQUUsTUFBTSxRQUFRLENBQUM7QUFFOUYsT0FBTyxLQUFLLE9BQU8sTUFBTSxTQUFTLENBQUM7QUFDbkMsT0FBTyxFQUFzQixpQkFBaUIsRUFBRSxHQUFHLEVBQUUsTUFBTSxTQUFTLENBQUM7OztBQUVyRSxNQUFNLGFBQWEsR0FBRyxPQUFPLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQywyQkFBMkI7QUFFM0UsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLE9BQU8sQ0FBQztBQUU1Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBRUgsTUFBTSxPQUFPLG1CQUFtQjtJQUM5QixZQUFnQyxhQUE2QjtRQUE3QixrQkFBYSxHQUFiLGFBQWEsQ0FBZ0I7SUFDN0QsQ0FBQztJQUVELE1BQU0sQ0FBQyxrQkFBa0IsQ0FBQyxVQUFzQixFQUFFLFNBQWU7UUFDL0QsTUFBTSxJQUFJLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxVQUFVLEVBQUUsU0FBUyxDQUFDLENBQUM7UUFDL0QsT0FBTztZQUNMLEdBQUcsRUFBRSxLQUFLLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDcEMsR0FBRyxFQUFFLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQztZQUNuQyxNQUFNLEVB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QUM7UUFDcEYsTUFBTSxXQUFXLEdBQUcsSUFBSSxhQUFhLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUMsRUFBRSxLQUFLLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7UUFDdkYsTUFBTSxPQUFPLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVsRCxPQUFPLE9BQU8sQ0FBQztJQUNqQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNILGtCQUFrQixDQUFDLGVBQTJCLEVBQUUsZ0JBQTRCO1FBQzFFLE1BQU0sU0FBUyxHQUFHLFlBQVksQ0FBQyxhQUFhLENBQUMsZUFBZSxDQUFDLENBQUM7UUFDOUQsTUFBTSxVQUFVLEdBQUcsWUFBWSxDQUFDLGFBQWEsQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDO1FBRWhFLE9BQU8sSUFBSSxDQUFDLFNBQVMsQ0FBQyxTQUFTLEVBQUUsVUFBVSxDQUFDLENBQUM7SUFDL0MsQ0FBQzs7Z0hBL0dVLG1CQUFtQjtvSEFBbkIsbUJBQW1COzJGQUFuQixtQkFBbUI7a0JBRC9CLFVBQVU7OzBCQUVJLFFBQVEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJbmplY3RhYmxlLCBPcHRpb25hbCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDYXJ0b2dyYXBoaWMsIE1hdGggYXMgY01hdGgsIENhcnRlc2lhbjMsIFNjZW5lVHJhbnNmb3JtcywgQ2FydGVzaWFuMiB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgKiBhcyBnZW9kZXN5IGZyb20gJ2dlb2Rlc3knO1xyXG5pbXBvcnQgeyBoZW1pc3BoZXJlLCBMYXRMb24sIExhdExvbkVsbGlwc29pZGFsLCBVdG0gfSBmcm9tICdnZW9kZXN5JztcclxuXHJcbmNvbnN0IExhdExvblZlY3RvcnMgPSBnZW9kZXN5WydMYXRMb25WZWN0b3JzJ107IC8vIGRvZXNudCBleGlzdHMgb24gdHlwaW5nc1xyXG5cclxud2luZG93WydnZW9kZXN5J10gPSBnZW9kZXN5O1xyXG5cclxuLyoqXHJcbiAqICBHaXZlbiBkaWZmZXJlbnQgdHlwZXMgb2YgY29vcmRpbmF0ZXMsIHdlIHByb3ZpZGUgeW91IGEgc2VydmljZSBjb252ZXJ0aW5nIHRob3NlIHR5cGVzIHRvIHRoZSBtb3N0IGNvbW1vbiBvdGhlciB0eXBlcy5cclxuICogIFdlIGFyZSB1c2luZyB0aGUgZ2VvZGVzeSBpbXBsZW1lbnRhdGlvbiBvZiBVVE0gY29udmVyc2lvbi4gc2VlOiBodHRwczovL2dpdGh1Yi5jb20vY2hyaXN2ZW5lc3MvZ2VvZGVzeS5cclxuICpcclxuICogQGV4YW1wbGVcclxuICogaW1wb3J0IHsgQ29tcG9uZW50LCBPbkluaXQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuICogaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJ2FuZ3VsYXIyLWNlc2l1bSc7XHJcbiAqXHJcbiAqIEBDb21wb25lbnQoe1xyXG4gKiBcdFx0c2VsZWN0b3I6J215LWNvbXBvbmVudCcsXHJcbiAqIFx0XHR0ZW1wbGF0ZTonPGRpdj57e3Nob3dDYXJ0b2dyYXBoaWN9fTwvZGl2PicsXHJcbiAqIFx0XHRwcm92aWRlcnM6W0Nvb3JkaW5hdGVDb252ZXJ0ZXJdXHJcbiAqIH0pXHJcbiAqIGV4cG9ydCBjbGFzcyBNeUNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCB7XHJcbiAqIFx0XHRzaG93Q2FydG9ncmFwaGljO1xyXG4gKlxyXG4gKiBcdFx0Y29uc3RydWN0b3IocHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOkNvb3JkaW5hdGVDb252ZXJ0ZXIpe1xyXG4gKiBcdFx0fVxyXG4gKlxyXG4gKiBcdFx0bmdPbkluaXQoKXtcclxuICogXHRcdFx0dGhpcy5zaG93Q2FydG9ncmFwaGljID0gdGhpcy5jb29yZGluYXRlQ29udmVydGVyLmRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyg1LCA1LCA1KTtcclxuICogIH1cclxuICogfVxyXG4gKlxyXG4gKi9cclxuQEluamVjdGFibGUoKVxyXG5leHBvcnQgY2xhc3MgQ29vcmRpbmF0ZUNvbnZlcnRlciB7XHJcbiAgY29uc3RydWN0b3IoQE9wdGlvbmFsKCkgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlPzogQ2VzaXVtU2VydmljZSkge1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNhcnRlc2lhbjNUb0xhdExvbihjYXJ0ZXNpYW4zOiBDYXJ0ZXNpYW4zLCBlbGxpcHNvaWQ/OiBhbnkpOiB7bG9uOiBudW1iZXIsIGxhdDogbnVtYmVyOyBoZWlnaHQ6IG51bWJlcn0ge1xyXG4gICAgY29uc3QgY2FydCA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbjMsIGVsbGlwc29pZCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICBsb246IGNNYXRoLnRvRGVncmVlcyhjYXJ0LmxvbmdpdHVkZSksXHJcbiAgICAgIGxhdDogY01hdGgudG9EZWdyZWVzKGNhcnQubGF0aXR1ZGUpLFxyXG4gICAgICBoZWlnaHQ6IGNhcnQuaGVpZ2h0XHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgc2NyZWVuVG9DYXJ0ZXNpYW4zKHNjcmVlblBvczogeyB4OiBudW1iZXIsIHk6IG51bWJlciB9LCBhZGRNYXBDYW52YXNCb3VuZHNUb1Bvcz86IGJvb2xlYW4pIHtcclxuICAgIGlmICghdGhpcy5jZXNpdW1TZXJ2aWNlKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcignQU5HVUxBUjItQ0VTSVVNIC0gQ2VzaXVtIHNlcnZpY2Ugc2hvdWxkIGJlIHByb3ZpZGVkIGluIG9yZGVyJyArXHJcbiAgICAgICAgJyB0byBkbyBzY3JlZW4gcG9zaXRpb24gY2FsY3VsYXRpb25zJyk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBzY3JlZW5Qb3NpdGlvbiA9IHsgLi4uc2NyZWVuUG9zIH07XHJcbiAgICAgIGlmIChhZGRNYXBDYW52YXNCb3VuZHNUb1Bvcykge1xyXG4gICAgICAgIGNvbnN0IG1hcEJvdW5kcyA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW52YXMuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XHJcbiAgICAgICAgc2NyZWVuUG9zaXRpb24ueCArPSBtYXBCb3VuZHMubGVmdDtcclxuICAgICAgICBzY3JlZW5Qb3NpdGlvbi55ICs9IG1hcEJvdW5kcy50b3A7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGNhbWVyYSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRWaWV3ZXIoKS5jYW1lcmE7XHJcbiAgICAgIHJldHVybiBjYW1lcmEucGlja0VsbGlwc29pZChzY3JlZW5Qb3NpdGlvbik7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzY3JlZW5Ub0NhcnRvZ3JhcGhpYyhzY3JlZW5Qb3M6IHsgeDogbnVtYmVyLCB5OiBudW1iZXIgfSwgZWxsaXBzb2lkPzogYW55KSB7XHJcbiAgICByZXR1cm4gdGhpcy5jYXJ0ZXNpYW4zVG9DYXJ0b2dyYXBoaWModGhpcy5zY3JlZW5Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zKSwgZWxsaXBzb2lkKTtcclxuICB9XHJcblxyXG4gIGNhcnRlc2lhbjNUb0NhcnRvZ3JhcGhpYyhjYXJ0ZXNpYW46IENhcnRlc2lhbjMsIGVsbGlwc29pZD86IGFueSkge1xyXG4gICAgcmV0dXJuIENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGNhcnRlc2lhbiwgZWxsaXBzb2lkKTtcclxuICB9XHJcblxyXG4gIGRlZ3JlZXNUb0NhcnRvZ3JhcGhpYyhsb25naXR1ZGU6IG51bWJlciwgbGF0aXR1ZGU6IG51bWJlciwgaGVpZ2h0PzogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gQ2FydG9ncmFwaGljLmZyb21EZWdyZWVzKGxvbmdpdHVkZSwgbGF0aXR1ZGUsIGhlaWdodCk7XHJcbiAgfVxyXG5cclxuICByYWRpYW5zVG9DYXJ0b2dyYXBoaWMobG9uZ2l0dWRlOiBudW1iZXIsIGxhdGl0dWRlOiBudW1iZXIsIGhlaWdodD86IG51bWJlcikge1xyXG4gICAgcmV0dXJuIENhcnRvZ3JhcGhpYy5mcm9tUmFkaWFucyhsb25naXR1ZGUsIGxhdGl0dWRlLCBoZWlnaHQpO1xyXG4gIH1cclxuXHJcbiAgZGVncmVlc1RvVVRNKGxvbmdpdHVkZTogbnVtYmVyLCBsYXRpdHVkZTogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gbmV3IExhdExvbkVsbGlwc29pZGFsKGxhdGl0dWRlLCBsb25naXR1ZGUpLnRvVXRtKCk7XHJcbiAgfVxyXG5cclxuICBVVE1Ub0RlZ3JlZXMoem9uZTogbnVtYmVyLCBoZW1pc3BoZXJlVHlwZTogaGVtaXNwaGVyZSwgZWFzdGluZzogbnVtYmVyLCBub3J0aGluZzogbnVtYmVyKSB7XHJcbiAgICByZXR1cm4gdGhpcy5nZW9kZXN5VG9DZXNpdW1PYmplY3QobmV3IFV0bSh6b25lLCBoZW1pc3BoZXJlVHlwZSwgZWFzdGluZywgbm9ydGhpbmcpLnRvTGF0TG9uRSgpKTtcclxuICB9XHJcblxyXG4gIHByaXZhdGUgZ2VvZGVzeVRvQ2VzaXVtT2JqZWN0KGdlb2Rlc3lSYWRpYW5zOiBMYXRMb24pIHtcclxuICAgIHJldHVybiB7XHJcbiAgICAgIGxvbmdpdHVkZTogZ2VvZGVzeVJhZGlhbnMubG9uLFxyXG4gICAgICBsYXRpdHVkZTogZ2VvZGVzeVJhZGlhbnMubGF0LFxyXG4gICAgICBoZWlnaHQ6IGdlb2Rlc3lSYWRpYW5zWydoZWlnaHQnXSA/IGdlb2Rlc3lSYWRpYW5zWydoZWlnaHQnXSA6IDBcclxuICAgIH07XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBtaWRkbGUgcG9pbnQgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICogQHBhcmFtIGZpcnN0ICAobGF0aXR1ZGUsbG9uZ2l0dWRlKSBpbiByYWRpYW5zXHJcbiAgICogQHBhcmFtIHNlY29uZCAobGF0aXR1ZGUsbG9uZ2l0dWRlKSBpbiByYWRpYW5zXHJcbiAgICovXHJcbiAgbWlkUG9pbnRUb0NhcnRlc2lhbjMoZmlyc3Q6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSwgc2Vjb25kOiB7IGxhdGl0dWRlOiBudW1iZXIsIGxvbmdpdHVkZTogbnVtYmVyIH0pIHtcclxuICAgIGNvbnN0IHRvRGVnID0gKHJhZDogbnVtYmVyKSA9PiBjTWF0aC50b0RlZ3JlZXMocmFkKTtcclxuICAgIGNvbnN0IGZpcnN0UG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhmaXJzdC5sYXRpdHVkZSksIHRvRGVnKGZpcnN0LmxvbmdpdHVkZSkpO1xyXG4gICAgY29uc3Qgc2Vjb25kUG9pbnQgPSBuZXcgTGF0TG9uVmVjdG9ycyh0b0RlZyhzZWNvbmQubGF0aXR1ZGUpLCB0b0RlZyhzZWNvbmQubG9uZ2l0dWRlKSk7XHJcbiAgICBjb25zdCBtaWRkbGVQb2ludDogYW55ID0gZmlyc3RQb2ludC5taWRwb2ludFRvKHNlY29uZFBvaW50KTtcclxuXHJcbiAgICByZXR1cm4gQ2FydGVzaWFuMy5mcm9tRGVncmVlcyhtaWRkbGVQb2ludC5sb24sIG1pZGRsZVBvaW50LmxhdCk7XHJcbiAgfVxyXG5cclxuICBtaWRkbGVQb2ludEJ5U2NyZWVuKHBvc2l0aW9uMDogQ2FydGVzaWFuMywgcG9zaXRpb24xOiBDYXJ0ZXNpYW4zKTogQ2FydGVzaWFuMyB7XHJcbiAgICBjb25zdCBzY2VuZSA9IHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpO1xyXG4gICAgY29uc3Qgc2NyZWVuUG9zaXRpb24xID0gU2NlbmVUcmFuc2Zvcm1zLndnczg0VG9XaW5kb3dDb29yZGluYXRlcyhzY2VuZSwgcG9zaXRpb24wKTtcclxuICAgIGNvbnN0IHNjcmVlblBvc2l0aW9uMiA9IFNjZW5lVHJhbnNmb3Jtcy53Z3M4NFRvV2luZG93Q29vcmRpbmF0ZXMoc2NlbmUsIHBvc2l0aW9uMSk7XHJcbiAgICBjb25zdCBtaWRkbGVTY3JlZW5Qb2ludCA9XHJcbiAgICAgIG5ldyBDYXJ0ZXNpYW4yKChzY3JlZW5Qb3NpdGlvbjIueCArIHNjcmVlblBvc2l0aW9uMS54KSAvIDIuMCwgKHNjcmVlblBvc2l0aW9uMi55ICsgc2NyZWVuUG9zaXRpb24xLnkpIC8gMi4wKTtcclxuICAgIHJldHVybiBzY2VuZS5waWNrUG9zaXRpb24obWlkZGxlU2NyZWVuUG9pbnQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogaW5pdGlhbCBiZWFyaW5nIGJldHdlZW4gdHdvIHBvaW50c1xyXG4gICAqXHJcbiAgICogKiBAcmV0dXJuIGJlYXJpbmcgaW4gZGVncmVlc1xyXG4gICAqIEBwYXJhbSBmaXJzdCAtIHtsYXRpdHVkZSxsb25naXR1ZGV9IGluIHJhZGlhbnNcclxuICAgKiBAcGFyYW0gc2Vjb25kIC0ge2xhdGl0dWRlLGxvbmdpdHVkZX0gaW4gcmFkaWFuc1xyXG4gICAqL1xyXG4gIGJlYXJpbmdUbyhmaXJzdDogeyBsYXRpdHVkZTogbnVtYmVyLCBsb25naXR1ZGU6IG51bWJlciB9LCBzZWNvbmQ6IHsgbGF0aXR1ZGU6IG51bWJlciwgbG9uZ2l0dWRlOiBudW1iZXIgfSkge1xyXG4gICAgY29uc3QgdG9EZWcgPSAocmFkOiBudW1iZXIpID0+IGNNYXRoLnRvRGVncmVlcyhyYWQpO1xyXG4gICAgY29uc3QgZmlyc3RQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKGZpcnN0LmxhdGl0dWRlKSwgdG9EZWcoZmlyc3QubG9uZ2l0dWRlKSk7XHJcbiAgICBjb25zdCBzZWNvbmRQb2ludCA9IG5ldyBMYXRMb25WZWN0b3JzKHRvRGVnKHNlY29uZC5sYXRpdHVkZSksIHRvRGVnKHNlY29uZC5sb25naXR1ZGUpKTtcclxuICAgIGNvbnN0IGJlYXJpbmcgPSBmaXJzdFBvaW50LmJlYXJpbmdUbyhzZWNvbmRQb2ludCk7XHJcblxyXG4gICAgcmV0dXJuIGJlYXJpbmc7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBpbml0aWFsIGJlYXJpbmcgYmV0d2VlbiB0d28gcG9pbnRzXHJcbiAgICpcclxuICAgKiBAcmV0dXJuIGJlYXJpbmcgaW4gZGVncmVlc1xyXG4gICAqL1xyXG4gIGJlYXJpbmdUb0NhcnRlc2lhbihmaXJzdENhcnRlc2lhbjM6IENhcnRlc2lhbjMsIHNlY29uZENhcnRlc2lhbjM6IENhcnRlc2lhbjMpIHtcclxuICAgIGNvbnN0IGZpcnN0Q2FydCA9IENhcnRvZ3JhcGhpYy5mcm9tQ2FydGVzaWFuKGZpcnN0Q2FydGVzaWFuMyk7XHJcbiAgICBjb25zdCBzZWNvbmRDYXJ0ID0gQ2FydG9ncmFwaGljLmZyb21DYXJ0ZXNpYW4oc2Vjb25kQ2FydGVzaWFuMyk7XHJcblxyXG4gICAgcmV0dXJuIHRoaXMuYmVhcmluZ1RvKGZpcnN0Q2FydCwgc2Vjb25kQ2FydCk7XHJcbiAgfVxyXG59XHJcbiJdfQ==