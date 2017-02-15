import { TestBed, inject } from '@angular/core/testing';

import { CesiumService } from './cesium.service';
import { when, mock } from 'ts-mockito';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';

describe('CesiumService', () => {
	let mapContainer;
	const defaultZooms = 1;
	const viewerFactory = mock(ViewerFactory);
	const element = document.createElement("div");

	when(viewerFactory.createViewer(element)).thenReturn({
		scene: {
			screenSpaceCameraController: {
				minimumZoomDistance: defaultZooms,
				maximumZoomDistance: defaultZooms
			}
		}
	});

	beforeEach(() => {
		mapContainer = document.createElement('mapContainer');
		document.body.appendChild(mapContainer);

		TestBed.configureTestingModule({
			providers: [CesiumService]
		});
	});
	beforeEach(inject([CesiumService], (service: CesiumService) => {
		service.init(element);
	}));

	afterEach(() => {
		mapContainer.remove();
	});

	it('should create', inject([CesiumService], (service: CesiumService) => {
		expect(service.cesium).toBeDefined();
	}));

	it('should initialize and return viewer', inject([CesiumService], (service: CesiumService) => {
		service.init(mapContainer);
		expect(service.getViewer()).toBeDefined();
	}));

	it('should return scene', inject([CesiumService], (service: CesiumService) => {
		service.init(mapContainer);
		expect(service.getScene()).toBeDefined();
	}));
});
	it('should ...', inject([CesiumService], (service: CesiumService) => {
		expect(service).toBeTruthy();
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
});
