import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
;
import { Injectable } from '@angular/core';
import { CesiumService } from '../../cesium/cesium.service';

/**
  +  This drawer is responsible for drawing an arc over the Cesium map.
  +  This implementation uses simple PolylineGeometry and Primitive parameters.
  +  This doesn't allow us to change the position, color, etc.. of the arc but show only.
  */

@Injectable()
export class ArcDrawerService extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PrimitiveCollection, cesiumService);
	}

	add(cesiumProps: any) {
		const arcPositions = this.generatePositions(cesiumProps);
		const colorMaterial = Cesium.Material.fromType('Color');
		colorMaterial.uniforms.color = cesiumProps.color || Cesium.Color.WHITE;
		return super.add(new Cesium.Primitive({
			geometryInstances: new Cesium.GeometryInstance({
				geometry: new Cesium.PolylineGeometry({
					positions: arcPositions
				})
			}),
			appearance: new Cesium.PolylineMaterialAppearance({
				material: colorMaterial
			})
		}));
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
}
