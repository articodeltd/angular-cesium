import { TestBed, inject } from '@angular/core/testing';

import { mock, when, instance, verify, anything } from 'ts-mockito';
import { ArcDrawerService } from './arc-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { providerFromMock } from '../../../utils/testingUtils';

declare const Cesium;

describe('ArcDrawerService', () => {
	const geometryProps: any = {
		angle: Math.random() * 3 - 1,
		delta: Math.PI,
		radius: Math.random() * 1000000,
		center: Cesium.Cartesian3.fromDegrees(Math.random() * 90 - 40, Math.random() * 90 - 40),
	};

	const instanceProps: any = {
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.RED)
		},
	};

	const primitiveProps: any = new Cesium.PolylineMaterialAppearance({
		material: Cesium.Material.fromType('Color')
	});

	const arcProps = {
		geometryProps,
		instanceProps,
		primitiveProps
	};

	const cesiumService = mock(CesiumService);
	const primitiveCollection: any = mock(Cesium.PrimitiveCollection);
	const otherArcAttribute = {
		attributes: {
			color: Cesium.ColorGeometryInstanceAttribute.fromColor(Cesium.Color.GREEN)
		}
	};

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [ArcDrawerService, providerFromMock(CesiumService, cesiumService)],
		});
	});

	it('should create and return a new  arc primitive.', inject([ArcDrawerService], (service: ArcDrawerService) => {
		console.log('serice',service.add);
		const arc = service.add(arcProps.geometryProps, arcProps.instanceProps, arcProps.primitiveProps);

		verify(primitiveCollection.add(anything())).once();
		expect(arc).toBeDefined();
	}));

	it('should throw if geometry props are not given', inject([ArcDrawerService], (service: ArcDrawerService) => {
		arcProps.geometryProps = undefined;

		expect(() => service.add(arcProps.geometryProps, arcProps.instanceProps, arcProps.primitiveProps)).toThrow();
	}));

	it('should throw if instance is not given', inject([ArcDrawerService], (service: ArcDrawerService) => {
		arcProps.instanceProps = undefined;

		expect(() => service.add(arcProps.geometryProps, arcProps.instanceProps, arcProps.primitiveProps)).toThrow();
	}));

	it('should throw if primitive props are not given', inject([ArcDrawerService], (service: ArcDrawerService) => {
		arcProps.primitiveProps = undefined;

		expect(() => service.add(arcProps.geometryProps, arcProps.instanceProps, arcProps.primitiveProps)).toThrow();
	}));
});

