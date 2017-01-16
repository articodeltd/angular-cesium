import {Injectable} from '@angular/core';
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";

@Injectable()
export class EllipseDrawerService extends SimpleDrawerService {
    constructor(cesiumService: CesiumService) {
        super(Cesium.PrimitiveCollection, cesiumService);
    }

    add(cesiumProps: any): any {
        let x = new Cesium.GeometryInstance({
            geometry: new Cesium.EllipseGeometry(cesiumProps),
            attributes: {
                color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
            }
        });

        let primitive = new Cesium.Primitive({
            geometryInstances:  [x],
            appearance : new Cesium.PerInstanceColorAppearance({
                translucent:false,
                closed:true
            })});

        return super.add(primitive);
    }


    update(primitive: any, cesiumProps: Object): any {
        this.remove(primitive)
        this.add(cesiumProps);
    }
}
