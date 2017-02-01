import { TestBed, inject } from '@angular/core/testing';
import { PolygonDrawerService } from './polygon-drawer.service';
import { mock, when, instance, verify, anything } from 'ts-mockito';
import { CesiumService } from '../cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';

fdescribe('PolygonDrawerService', () => {
	let geometryProps: any = {
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
	};

	let instanceProps: any = {
		color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
	};
	let primitiveProps: any = new Cesium.PerInstanceColorAppearance({
		translucent: false,
		closed: true
	});

	let otherGeometryProps = {
		height: 13000.0,
		polygonHierarchy: new Cesium.PolygonHierarchy(
			Cesium.Cartesian3.fromDegreesArray([
				30 * Math.random(), 30 * Math.random(),
				30 * Math.random(), 30 * Math.random(),
				30 * Math.random(), 30 * Math.random(),
				30 * Math.random(), 30 * Math.random(),
				30 * Math.random(), 30 * Math.random()
			])
		)
	};

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PolygonDrawerService, providerFromMock(CesiumService, cesiumService)]
		});
	});

	it('should create and return a new polygon primitive.', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);

		verify(primitiveCollection.add(anything())).once();
		expect(polygonPrimitive).toBeDefined();
	}));

	it('should not update a given polygon\'s positions', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldPositions = polygonPrimitive.positions;

		service.update(polygonPrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldPositions).toEqual(polygonPrimitive.positions);
	}));

	it('should not update given polygon\'s width', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		const polygonPrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldWidth = polygonPrimitive.width;

		service.update(polygonPrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldWidth).toEqual(polygonPrimitive.width);
	}));

	it('should throw if geometry props are not given', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		geometryProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should throw if instance props are not given', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		instanceProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should throw if primitive props are not given', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		primitiveProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));
});
