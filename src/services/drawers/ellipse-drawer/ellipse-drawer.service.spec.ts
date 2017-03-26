import { TestBed, inject } from '@angular/core/testing';
import { EllipseDrawerService } from './ellipse-drawer.service';
import { mock, when, instance, verify, anything } from 'ts-mockito';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

describe('EllipseDrawerService', () => {
	let geometryProps: any = {
		center: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
		semiMajorAxis: 500000.0,
		semiMinorAxis: 300000.0,
		height: 15000.0,
		rotation: Cesium.Math.toRadians(45)
	};

	let instanceProps: any = {
		color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
	};
	let primitiveProps: any = new Cesium.PerInstanceColorAppearance({
		translucent: false,
		closed: true
	});

	let otherGeometryProps = {
		center: Cesium.Cartesian3.fromRadians(Math.random(), Math.random()),
		semiMajorAxis: 900000.0,
		semiMinorAxis: 1000000.0,
		height: 9000.0,
		rotation: Cesium.Math.toRadians(20)
	};

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [EllipseDrawerService, providerFromMock(CesiumService, cesiumService)]
		});
	});

	it('should create and return a new ellipse primitive.', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);

		verify(primitiveCollection.add(anything())).once();
		expect(ellipsePrimitive).toBeDefined();
	}));

	it('should not update a given ellipse\'s semi axises', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldAxis = ellipsePrimitive.semiMajorAxis;

		service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldAxis).toEqual(ellipsePrimitive.semiMajorAxis);
	}));

	it('should not update given ellipse\'s height', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldHeight = ellipsePrimitive.height;

		service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldHeight).toEqual(ellipsePrimitive.height);
	}));

	it('should not update given ellipse\'s rotation', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldRotation = ellipsePrimitive.rotation;

		service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldRotation).toEqual(ellipsePrimitive.rotation);
	}));

	it('should not update given ellipse\'s center', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		const ellipsePrimitive = service.add(geometryProps, instanceProps, primitiveProps);
		const oldCenter = ellipsePrimitive.center;

		service.update(ellipsePrimitive, otherGeometryProps, instanceProps, primitiveProps);

		expect(oldCenter).toEqual(ellipsePrimitive.center);
	}));

	it('should throw if geometry props are empty', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		geometryProps = {};

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should throw if geometry props are not given', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		geometryProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should throw if instance props are empty', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		instanceProps = {};

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should throw if instance props are not given', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		instanceProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));

	it('should NOT throw if primitive props are empty', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		primitiveProps = {};

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toBeDefined();
	}));

	it('should throw if primitive props are not given', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		primitiveProps = undefined;

		expect(() => service.add(geometryProps, instanceProps, primitiveProps)).toThrow();
	}));
});
