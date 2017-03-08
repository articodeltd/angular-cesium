import { TestBed, inject } from '@angular/core/testing';

import { mock, when, instance, verify, anything } from 'ts-mockito';
import { StaticPolylineDrawerService } from './static-polyline-drawer.service';
import { CesiumService } from '../cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';

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
		})
	};

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		staticPolylineAttribute = {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.fromRandom())
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

	it('should update a given static polyline\'s color', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService, done) => {
		const staticPolyline = service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance);
		let oldColors;

		Cesium.when(staticPolyline.readyPromise).then(function (primitive) {
			oldColors = primitive.getGeometryInstanceAttributes().color.value;
			service.update(staticPolylineProps, null, staticPolylineAttribute, null);
			expect(oldColors).not.toEqual(staticPolylineProps.attributes.color);
			done();
		});
	}));

	it('should throw if positions is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService, done) => {
		staticPolylineProps.geometry.positions = undefined;

		expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
	}));

	it('should throw if appearance is not given', inject([StaticPolylineDrawerService], (service: StaticPolylineDrawerService) => {
		staticPolylineProps.appearance = undefined;

		expect(() => service.add(staticPolylineProps.geometry, staticPolylineProps.attributes, staticPolylineProps.appearance)).toThrow();
	}));
});

