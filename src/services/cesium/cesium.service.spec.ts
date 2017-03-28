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
	const mode3D = Cesium.SceneMode.SCENE3D;
	const mode2D = Cesium.SceneMode.SCENE2D;
	const modeColumbus = Cesium.SceneMode.COLUMBUS_VIEW;

	when(viewerFactory.createViewer(anything(),anything())).thenReturn({
		scene: {
			screenSpaceCameraController: {
				minimumZoomDistance: defaultZooms,
				maximumZoomDistance: defaultZooms,
				enableTilt: defaultTilt
			},
			mode: mode3D,
			morphTo2D: function () {
				this.mode = mode2D;
			},
			morphToColumbusView: function () {
				this.mode = modeColumbus;
			},
			morphTo3D: function () {
				this.mode = mode3D;
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

	it('Set to 2D mode', inject([CesiumService], (service: CesiumService) => {
		service.morphTo2D();
		expect(service.getScene().mode).toBe(mode2D);
	}));

	it('Set to 3D mode', inject([CesiumService], (service:CesiumService) => {
		service.morphTo3D();
		expect(service.getScene().mode).toBe(mode3D);
	}));

	it('Set to Columbus mode', inject([CesiumService], (service:CesiumService) => {
		service.morphToColumbusView();
		expect(service.getScene().mode).toBe(modeColumbus);
	}));
});
