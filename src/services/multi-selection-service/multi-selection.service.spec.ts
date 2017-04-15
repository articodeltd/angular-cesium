import { async, TestBed, inject } from '@angular/core/testing';
import { Observable } from 'rxjs';
import { mock, when, instance, anything } from 'ts-mockito';

import { providerFromMock, mockProvider } from  '../../utils/testingUtils';
import { MultiSelectionService } from './multi-selection.service';
import { MapEventsManagerService, EventResult } from '../map-events-mananger/map-events-manager';
import { CesiumService } from '../cesium/cesium.service';
import { PlonterService } from '../plonter/plonter.service';
import { AcEntity } from '../../models/ac-entity';
import { PickOptions } from '../map-events-mananger/consts/pickOptions.enum';
import { CesiumEvent } from '../map-events-mananger/consts/cesium-event.enum';
import { CesiumEventBuilder } from '../map-events-mananger/cesium-event-builder';
import { DisposableObservable } from '../map-events-mananger/disposable-observable';
import { MultiSelectionInput } from './MultiSelectionInput.model';

fdescribe('MultiSelectionService', () => {
	const cesiumService = mock(CesiumService);
	const cesiumEventBuilder = mock(CesiumEventBuilder);
	const mapEventsManagerService = mock(MapEventsManagerService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);
	const multiSelectionRegistrationInput: MultiSelectionInput = {
		event: CesiumEvent.LEFT_CLICK,
		pick: PickOptions.MULTI_PICK
	};
	let movement;
	let acEntity1 = {
		primitive: {
			acEntity: AcEntity.create({id: 0})
		}
	};

	let acEntity2 = {
		primitive: {
			acEntity: AcEntity.create({id: 1})
		}
	};

	let triggeredEventObserver;
	let cesiumScene = {
		primitives: instance(primitiveCollection),
		pick: () => acEntity1
	};

	function createMovement() {
		let position = {x: 0, y: 0};
		return {
			endPosition: position,
			position: position,
			startPosition: position
		};
	}

	when(cesiumService.getScene()).thenReturn(cesiumScene);

	when(mapEventsManagerService.register(anything()))
		.thenReturn(<DisposableObservable<EventResult>>Observable.create((observer) => {
			triggeredEventObserver = observer;
			if (movement) {
				observer.next(movement);
			}
		}));

	beforeEach(() => {
		movement = undefined;
		cesiumScene.pick = () => acEntity1;

		TestBed.configureTestingModule({
			providers: [
				MultiSelectionService,
				mockProvider(PlonterService),
				providerFromMock(MapEventsManagerService, mapEventsManagerService),
				providerFromMock(CesiumEventBuilder, cesiumEventBuilder),
				providerFromMock(CesiumService, cesiumService)
			]
		}).compileComponents();
	});

	it('should inject', inject([MultiSelectionService], (service: MultiSelectionService) => {
		expect(service).toBeTruthy();
	}));

	it('should return one picked entity', async(inject([MultiSelectionService], (service: MultiSelectionService) => {
		service.select(multiSelectionRegistrationInput).map((result) => result.entities).subscribe((entities) => {
			expect(entities.length).toBe(1);
		});

		movement = createMovement();
		triggeredEventObserver.next(movement);
	})));

	it('should add and remove entity from multi pick array', inject([MultiSelectionService], (service: MultiSelectionService) => {
		let pickCounter = 0;
		service.select(multiSelectionRegistrationInput).map((result) => result.entities).subscribe((entities) => {
			pickCounter++;
			if (pickCounter === 3) {
				expect(entities.length).toBe(1);
			}
		});

		movement = createMovement();
		triggeredEventObserver.next(movement);
		triggeredEventObserver.next(movement);
		triggeredEventObserver.next(movement);
	}));

	it('should return 2 picked entities', inject([MultiSelectionService], (service: MultiSelectionService) => {
		let pickCounter = 0;
		service.select(multiSelectionRegistrationInput).map((result) => result.entities).subscribe((entities) => {
			pickCounter++;
			if (pickCounter === 2) {
				expect(entities.length).toBe(2);
			}
		});

		movement = createMovement();
		triggeredEventObserver.next(movement);
		cesiumScene.pick = () => acEntity2;
		triggeredEventObserver.next(movement);
	}));

	it('should not add entity (pick did not return entity)', inject([MultiSelectionService], (service: MultiSelectionService) => {
		let pickCounter = 0;
		acEntity1 = undefined;
		service.select(multiSelectionRegistrationInput).map((result) => result.entities).subscribe(() => {
			pickCounter++;
		});

		movement = createMovement();
		triggeredEventObserver.next(movement);

		expect(pickCounter).toBe(0);
	}));
});

