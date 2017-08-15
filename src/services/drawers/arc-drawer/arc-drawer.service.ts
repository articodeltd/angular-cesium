import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';
import { StaticPrimitiveDrawer } from '../static-dynamic/static-primitive-drawer/static-primitive-drawer.service';

/**
 +  This drawer is responsible for drawing an arc over the Cesium map.
 +  This implementation uses simple PolylineGeometry and Primitive parameters.
 +  This doesn't allow us to change the position, color, etc.. of the arc but setShow only.
 */

@Injectable()
export class ArcDrawerService extends StaticPrimitiveDrawer {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PolylineGeometry, cesiumService);
	}

	add(geometryProps: any, instanceProps: any, primitiveProps: any) {
		geometryProps.positions = this.generatePositions(geometryProps);

		return super.add(geometryProps, instanceProps, primitiveProps);
	}

	private generatePositions(cesiumProps: any): Array<any> {
		const arcPositions = [];
		const defaultGranularity = 0.004;
		const numOfSamples = 1 / (cesiumProps.granularity || defaultGranularity);

		for (let i = 0; i < numOfSamples + 1; i++) {
			const currentAngle = cesiumProps.angle + cesiumProps.delta * i / numOfSamples;
			const distance = cesiumProps.radius / Cesium.Ellipsoid.WGS84.maximumRadius;
			const curLat = Cesium.Cartographic.fromCartesian(cesiumProps.center).latitude;
			const curLon = Cesium.Cartographic.fromCartesian(cesiumProps.center).longitude;

			const destinationLat = Math.asin(
				Math.sin(curLat) * Math.cos(distance) +
				Math.cos(curLat) * Math.sin(distance) * Math.cos(currentAngle)
			);

			let destinationLon = curLon + Math.atan2(Math.sin(currentAngle) * Math.sin(distance) * Math.cos(curLat),
					Math.cos(distance) - Math.sin(curLat) * Math.sin(destinationLat)
				);

			destinationLon = (destinationLon + 3 * Math.PI) % (2 * Math.PI) - Math.PI;

			arcPositions.push(Cesium.Cartesian3.fromRadians(destinationLon, destinationLat));
		}

		return arcPositions;
	}

	update(primitive: any, geometryProps: any, instanceProps: any, primitiveProps: any) {
		if (instanceProps && instanceProps.attributes && instanceProps.attributes.color) {
			const color = instanceProps.attributes.color.value;

			if (primitive.ready) {
				primitive.getGeometryInstanceAttributes().color = color;
			}
			else {
				Cesium.when(primitive.readyPromise).then((readyPrimitive) => {
					readyPrimitive.getGeometryInstanceAttributes().color.value = color;
				});
			}
		}

		if (primitiveProps.appearance) {
			primitive.appearance = primitiveProps.appearance;
		}

		return primitive;
	}
}
