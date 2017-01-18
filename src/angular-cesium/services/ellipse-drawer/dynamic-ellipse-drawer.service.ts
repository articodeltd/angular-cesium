import {Injectable} from '@angular/core';
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";

@Injectable()
export class DynamicEllipseDrawerService extends SimpleDrawerService {
    constructor(cesiumService: CesiumService) {
        super(Cesium.PolylineCollection, cesiumService);
    }

    add(id: number, cesiumProps: any): any {
        let positions = DynamicEllipseDrawerService.generatePositions(cesiumProps);

        let polyline = this.cesiumCollection.add({
            positions: positions,
            loop: true,
            width: cesiumProps.width,
            material: cesiumProps.material
        });

        polyline.id = id;
        polyline.center = cesiumProps.center;

        return polyline;
    }

    update(id: number, cesiumProps: Object): any {
        let ellipse = this.getPrimitiveById(id);

        ellipse.positions = DynamicEllipseDrawerService.generatePositions(cesiumProps);
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
