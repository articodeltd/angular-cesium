import { AcEntity } from '../../../../src/models/ac-entity';
let oneAndOnlyMaterial = new Cesium.PerInstanceColorAppearance({
	translucent: false,
	closed: true
});

let yellowMatirial = new Cesium.Material({
	fabric : {
		type : 'Color',
		uniforms : {
			color : new Cesium.Color(1.0, 1.0, 0.0, 1.0)
		}
	}
});

let redMatirial = new Cesium.Material({
	fabric : {
		type : 'Color',
		uniforms : {
			color : new Cesium.Color(1.0, 0.0, 0.0, 1.0)
		}
	}
});

export function convertToCesiumObj(entity): any {
	entity.scale = entity.id === 1 ? 0.3 : 0.15;
	entity.color = entity.id === 1 ? Cesium.Color.RED : undefined;
	entity.position = Cesium.Cartesian3.fromDegrees(entity.position.long, entity.position.lat);
	entity.geometry = {
		center: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
		semiMajorAxis: 500000.0,
		semiMinorAxis: 300000.0,
		height: 15000.0,
		rotation: Cesium.Math.toRadians(45)
	};
	entity.attributes = {
		color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
	};
	entity.appearance = oneAndOnlyMaterial;

	entity.staticCircle = {
		geometry: {
			center: Cesium.Cartesian3.fromDegrees(Math.random() * 90, Math.random() * 90),
			radius: 100000.0,
			height: 1000000
		},
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
		},
		appearance: new Cesium.PerInstanceColorAppearance({
			translucent: false,
			closed: true
		})
	};

	entity.staticPolyline = {
		geometry: {
			width: 1,
			height: 50,
			positions: Cesium.Cartesian3.fromDegreesArray(
				[
					Math.floor(Math.random() * 50), Math.floor(Math.random() * 50),
					Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)
				]),
		},
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
		},
		appearance: new Cesium.PolylineColorAppearance({
			closed: true,
			translucent: false
		})
	};

	entity.polygonProps = {
		geometry: {
			height: 15000.0,
			polygonHierarchy: new Cesium.PolygonHierarchy(
				Cesium.Cartesian3.fromDegreesArray([
					30 * Math.random(), 30 * Math.random(),
					30 * Math.random(), 30 * Math.random(),
					30 * Math.random(), 30 * Math.random(),
					30 * Math.random(), 30 * Math.random(),
					30 * Math.random(), 30 * Math.random()
				])
			)
		},
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
		},
		appearance: oneAndOnlyMaterial
	};

	entity.dynamicPolyline = {
		width : 2,
		positions: Cesium.Cartesian3.fromDegreesArray(
			[
				Math.floor(Math.random() * 50), Math.floor(Math.random() * 50),
				Math.floor(Math.random() * 50), Math.floor(Math.random() * 50)
			]),
		material: entity.id === 1 ? yellowMatirial : redMatirial
	};

	entity.point = {
		pixelSize : 15,
		color : new Cesium.Color(1.0, 1.0, 0.0, 1.0),
		position : new Cesium.Cartesian3.fromDegrees(Math.floor(Math.random() * 50), Math.floor(Math.random() * 50))
	};

	return AcEntity.create(entity);
}

