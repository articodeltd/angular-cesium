import {Injectable} from '@angular/core';
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";

/**
 *  This drawer is responsible for creating the dynamic version of the ellipse component.
 *  This implementation uses polylines in order to draw the ellipses in a performant way.
 *  This also allows us to change the position of the ellipses without creating a new primitive object as Cesium does not allow updating an ellipse.
 */
@Injectable()
export class DynamicEllipseDrawerService extends SimpleDrawerService {
    constructor(cesiumService: CesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }

    add(cesiumProps: any): any {
        let positions = DynamicEllipseDrawerService.generatePositions(cesiumProps);

        let polylinedEllipse = {
            positions: positions,
            loop: true,
            width: cesiumProps.width,
            material: cesiumProps.material
        };

        return super.add(polylinedEllipse);
    }

    update(ellipse: any, cesiumProps: any): any {
        ellipse.positions = DynamicEllipseDrawerService.generatePositions(cesiumProps);
        super.update(ellipse, {width:cesiumProps.width, material: cesiumProps.material});

        return ellipse;
    }

    private static generatePositions(cesiumProps: any) {
        let points = Cesium.EllipseGeometryLibrary.computeEllipsePositions(cesiumProps, false, true);
        let positions = [];

        for (let startIndex = 0; startIndex < points.outerPositions.length; startIndex += 3) {
            positions.push(Cesium.Cartesian3.fromArray(points.outerPositions, startIndex));
        }

        return positions;
    }
}
