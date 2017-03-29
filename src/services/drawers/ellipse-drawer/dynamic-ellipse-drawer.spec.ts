import { TestBed, inject } from '@angular/core/testing';
import { DynamicEllipseDrawerService } from './dynamic-ellipse-drawer.service';
import { mock, when, instance, verify, anything } from 'ts-mockito';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

describe('DynamicEllipseDrawerService', () => {
	let ellipseProps;
	const ellipseProps2 = {
		width: 2,
		center: new Cesium.Cartesian3.fromArray([2014908.2920381048, -7260819.093129401, -670601.4009049088]),
		granularity: 0.04,
		rotation: 0,
		semiMajorAxis: 240000,
		semiMinorAxis: 300000
	};
	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		ellipseProps = {
			center: new Cesium.Cartesian3.fromArray([1014908.2920381048, -6260819.093129401, -670601.4009049088]),
			granularity: 0.04,
			rotation: 0,
			semiMajorAxis: 250000,
			semiMinorAxis: 400000
		};

		TestBed.configureTestingModule({
			providers: [DynamicEllipseDrawerService, providerFromMock(CesiumService, cesiumService)]
		});
	});

	it('should create and return a new ellipse primitive.', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		const ellipsePrimitive = service.add(ellipseProps);

		verify(primitiveCollection.add(anything())).once();
		expect(ellipsePrimitive).toBeDefined();
	}));

	it('should update a given ellipse\'s center', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		const ellipsePrimitive = service.add(ellipseProps);
		const oldPositions = ellipsePrimitive.center;

		service.update(ellipsePrimitive, ellipseProps2);

		expect(oldPositions).not.toEqual(ellipsePrimitive.center);
	}));

	it('should throw if center is not given', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		ellipseProps.center = undefined;

		expect(() => service.add(ellipseProps)).toThrow();
	}));

	it('should throw if rotation is not given', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		ellipseProps.rotation = undefined;

		expect(() => service.add(ellipseProps)).toThrow();
	}));

	it('should throw if semiMajorAxis is not given', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		ellipseProps.semiMajorAxis = undefined;

		expect(() => service.add(ellipseProps)).toThrow();
	}));

	it('should throw if semiMinorAxis is not given', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		ellipseProps.semiMinorAxis = undefined;

		expect(() => service.add(ellipseProps)).toThrow();
	}));
});
