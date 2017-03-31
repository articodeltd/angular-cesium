import { TestBed, inject } from '@angular/core/testing';
import { mock, when, instance } from 'ts-mockito';

import { providerFromMock, mockProvider } from '../../utils/testingUtils';
import { MapSelectionService } from './map-selection.service';
import { MapEventsManagerService } from '../map-events-mananger/map-events-manager';
import { CesiumService } from '../cesium/cesium.service';
import { PlonterService } from '../plonter/plonter.service';
import { AcEntity } from '../../models/ac-entity';

fdescribe('MapSelectionService', () => {
	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	let movement;

	let acEntity1 = {
		primitive: {
			acEntity: AcEntity.create({id: 0})
		}
	};

	let cesiumScene = {
		primitives: instance(primitiveCollection),
		pick: () => acEntity1
	};

	when(cesiumService.getScene()).thenReturn(cesiumScene);

	beforeEach(() => {
		movement = undefined;
		cesiumScene.pick = () => acEntity1;

		TestBed.configureTestingModule({
			providers: [
				MapSelectionService,
				mockProvider(PlonterService),
				mockProvider(MapEventsManagerService),
				providerFromMock(CesiumService, cesiumService)
			]
		}).compileComponents();
	});

	it('should inject', inject([MapSelectionService], (service: MapSelectionService) => {
		expect(service).toBeTruthy();
	}));
});
