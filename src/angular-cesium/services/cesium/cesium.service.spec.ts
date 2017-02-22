import { TestBed, inject } from '@angular/core/testing';

import { CesiumService } from './cesium.service';
import { when, mock, anything } from 'ts-mockito';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { providerFromMock } from '../../utils/testingUtils';

describe('CesiumService', () => {
	let mapContainer;
	const defaultZooms = 1;
	const viewerFactory = mock(ViewerFactory);
	const element = document.createElement("div");
	const defaultTilt = true;

	when(viewerFactory.createViewer(anything())).thenReturn({
		scene: {
			screenSpaceCameraController: {
				minimumZoomDistance: defaultZooms,
				maximumZoomDistance: defaultZooms,
				enableTilt: defaultTilt
			}
		}
	});

	beforeEach(() => {
		mapContainer = document.createElement('mapContainer');
		document.body.appendChild(mapContainer);

		TestBed.configureTestingModule({
			providers: [CesiumService, providerFromMock(ViewerFactory, viewerFactory)]
		});
	});

	beforeEach(inject([CesiumService], (service: CesiumService) => {
		service.init(mapContainer);
	}));

	afterEach(() => {
		mapContainer.remove();
	});

	it('should create', inject([CesiumService], (service: CesiumService) => {
		expect(service).toBeDefined();
	}));

	it('should initialize and return viewer', inject([CesiumService], (service: CesiumService) => {
		expect(service.getViewer()).toBeDefined();
	}));

	it('should return scene', inject([CesiumService], (service: CesiumService) => {
		expect(service.getScene()).toBeDefined();
	}));

	it('Set minimum zoom', inject([CesiumService], (service: CesiumService) => {
		let newMinZoom = 1000;
		expect(service.getScene().screenSpaceCameraController.minimumZoomDistance).toBe(defaultZooms);
		service.setMinimumZoom(newMinZoom);
		expect(service.getScene().screenSpaceCameraController.minimumZoomDistance).toBe(newMinZoom);
	}));

	it('Set maximum zoom', inject([CesiumService], (service: CesiumService) => {
		let newMaxZoom = 1000;
		expect(service.getScene().screenSpaceCameraController.maximumZoomDistance).toBe(defaultZooms);
		service.setMaximumZoom(newMaxZoom);
		expect(service.getScene().screenSpaceCameraController.maximumZoomDistance).toBe(newMaxZoom);
	}));

	it('Set EnableTilt', inject([CesiumService], (service: CesiumService) => {
		let newTilt = false;
		expect(service.getScene().screenSpaceCameraController.enableTilt).toBe(defaultTilt);
		service.setEnableTilt(newTilt);
		expect(service.getScene().screenSpaceCameraController.enableTilt).toBe(newTilt);
	}));
});
