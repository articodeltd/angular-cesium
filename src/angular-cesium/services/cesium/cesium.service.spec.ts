/!* tslint:disable:no-unused-variable *!/
import { when, mock } from 'ts-mockito';
import { TestBed, inject } from '@angular/core/testing';
import { CesiumService } from './cesium.service';
import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
import { providerFromMock } from '../../utils/testingUtils';

describe('CesiumService', () => {

	const defaultZooms = 1;
	const viewerFactory = mock(ViewerFactory);
	const element = document.createElement("div");
	const mode3D  = 3;
	const mode2D  = 2;
	const modeColombus  = 1;

	when(viewerFactory.createViewer(element)).thenReturn({
		scene: {
			screenSpaceCameraController: {
				minimumZoomDistance: defaultZooms,
				maximumZoomDistance: defaultZooms
			},
			mode: mode3D
		}
	});

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CesiumService, providerFromMock(ViewerFactory, viewerFactory)]
		});
	});

	beforeEach(inject([CesiumService], (service: CesiumService) => {
		service.init(element);
	}));

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

	it('Set to 2D mode', inject([CesiumService], (service: CesiumService) => {
		expect(service.getScene().mode).toBe(mode3D);
		service.morphTo2D();
		expect(service.getScene().mode).toBe(mode2D);
	}));

	it('Set to 3D mode', inject([CesiumService], (service: CesiumService) => {
		expect(service.getScene().mode).toBe(mode3D);
		service.morphTo3D();
		expect(service.getScene().mode).toBe(mode3D);
	}));

	it('Set to Columbus mode', inject([CesiumService], (service: CesiumService) => {
		expect(service.getScene().mode).toBe(mode3D);
		service.morphToColumbusView();
		expect(service.getScene().mode).toBe(modeColombus);
	}));
});
