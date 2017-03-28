import { TestBed, inject, fakeAsync, tick } from '@angular/core/testing';

import { mock, when, instance, verify, anything } from 'ts-mockito';
import { StaticPolylineDrawerService } from './static-polyline-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

describe('StaticPolylineDrawerService', () => {

	let staticPolylineAttribute;
	const staticPolylineProps = {
		geometry: {
			width: 1,
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
		}),
		ready: null,
		readyPromise: null,
		getGeometryInstanceAttributes: () => {
			return {color: null}
		}
	};

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		staticPolylineAttribute = {
			attributes: {
				color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
			}
		};

		TestBed.configureTestingModule({
			providers: [StaticPolylineDrawerService, providerFromMock(CesiumService, cesiumService)],
		});
	});

	it('should create and return a new static polyline primitive.', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
		const staticPolyline = service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance);

		verify(primitiveCollection.add(anything())).once();
		expect(staticPolyline).toBeDefined();
	}));

	it('should update a given static polyline\'s color', fakeAsync(inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
		staticPolylineProps.ready = true;
		let spy = spyOn(staticPolylineProps, "getGeometryInstanceAttributes").and.returnValue({color: null});
		service.update(staticPolylineProps, null, staticPolylineAttribute, null);
		expect(staticPolylineProps.getGeometryInstanceAttributes).toHaveBeenCalled();

		spy.calls.reset();
		staticPolylineProps.ready = null;
		staticPolylineProps.readyPromise = Promise.resolve(staticPolylineProps);
		service.update(staticPolylineProps, null, staticPolylineAttribute, null);
		tick();
		expect(staticPolylineProps.getGeometryInstanceAttributes).toHaveBeenCalled();
	})));

	it('should throw if positions is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
		staticPolylineProps.geometry.positions = undefined;

		expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
	}));

	it('should throw if appearance is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
		staticPolylineProps.appearance = undefined;

		expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
	}));
});

