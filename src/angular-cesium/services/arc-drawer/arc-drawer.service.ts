import {Injectable} from "@angular/core";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";
/**
+ *  This drawer is responsible for drawing an arc over the Cesium map.
+ *  This implementation uses simple PolylineGeometry and Primitive parameters.
+ *  This doesn't allow us to change the position, color, etc.. of the arc but show only.
+ */

@Injectable()
export class ArcDrawerService extends SimpleDrawerService {
    private numOfSamples: number;
    constructor(cesiumService: CesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
        this.numOfSamples = 300;
    }

    add(cesiumProps: any) {
        let arcPositions = [];
        for (let i = 0; i < this.numOfSamples + 1; i++) {
            let currentAngle = cesiumProps.angle + cesiumProps.delta * i / this.numOfSamples;
            let distance = cesiumProps.radius / Cesium.Ellipsoid.WGS84.maximumRadius;
            let curLat = Cesium.Cartographic.fromCartesian(cesiumProps.center).latitude;
            let curLon = Cesium.Cartographic.fromCartesian(cesiumProps.center).longitude;

            let destinationLat = Math.asin(
                Math.sin(curLat) * Math.cos(distance) +
                Math.cos(curLat) * Math.sin(distance) * Math.cos(currentAngle)
            );

            let destinationLon = curLon + Math.atan2(Math.sin(currentAngle) * Math.sin(distance) * Math.cos(curLat),
                    Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat)
                );

            destinationLon = (destinationLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

            arcPositions.push(Cesium.Cartesian3.fromRadians(destinationLon, destinationLat));
        }

    let colorMaterial = Cesium.Material.fromType('Color');
    colorMaterial.uniforms.color = Cesium.Color.WHITE;
        return super.add(new Cesium.Primitive({
            geometryInstances: new Cesium.GeometryInstance({
                geometry: new Cesium.PolylineGeometry({
                    positions: arcPositions
                })
            }),
            appearance: new Cesium.PolylineMaterialAppearance({
                material : colorMaterial
            })
        }));
    }
}