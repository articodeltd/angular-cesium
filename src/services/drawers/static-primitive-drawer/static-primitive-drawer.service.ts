import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';

export abstract class StaticPrimitiveDrawer extends SimpleDrawerService {
	constructor(private geometryType: any, cesiumService: CesiumService) {
		super(Cesium.PrimitiveCollection, cesiumService);
	}

	add(geometryProps: any, instanceProps: any, primitiveProps: any): any {
		instanceProps.geometry = new this.geometryType(geometryProps);
		primitiveProps.geometryInstances = new Cesium.GeometryInstance(instanceProps);

		return super.add(new Cesium.Primitive(primitiveProps));
	}

	update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any) {
	}
}
