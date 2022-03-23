import { Cartesian3 } from 'cesium';
import { CesiumService } from '../cesium/cesium.service';
import { Vec3 } from '../../models/vec3';
import * as i0 from "@angular/core";
export declare class GeoUtilsService {
    private cesiumService;
    static pointByLocationDistanceAndAzimuth(currentLocation: any, meterDistance: number, radianAzimuth: number, deprecated?: any): any;
    static _pointByLocationDistanceAndAzimuth(cartographicLocation: any, distance: number, radianAzimuth: number): Cartesian3;
    static distance(pos0: Cartesian3, pos1: Cartesian3): number;
    static getPositionsDelta(position0: Cartesian3, position1: Cartesian3): Vec3;
    static addDeltaToPosition(position: Cartesian3, delta: Vec3, updateReference?: boolean): Cartesian3;
    static middleCartesian3Point(position0: Cartesian3, position1: Cartesian3): Cartesian3;
    constructor(cesiumService: CesiumService);
    screenPositionToCartesian3(screenPos: {
        x: number;
        y: number;
    }): any;
    static ɵfac: i0.ɵɵFactoryDeclaration<GeoUtilsService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<GeoUtilsService>;
}
