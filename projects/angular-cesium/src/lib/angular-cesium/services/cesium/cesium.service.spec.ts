// import { inject, TestBed } from '@angular/core/testing';

// import { CesiumService } from './cesium.service';
// import { anything, mock, when } from 'ts-mockito';
// import { ViewerFactory } from '../viewer-factory/viewer-factory.service';
// import { providerFromMock } from '../../utils/testingUtils';

// describe('CesiumService', () => {
// 	let mapContainer;
// 	const defaultZooms = 1;
// 	const viewerFactory = mock(ViewerFactory);
// 	const element = document.createElement("div");
// 	const defaultTilt = true;
// 	const mode3D = SceneMode.SCENE3D;
// 	const mode2D = SceneMode.SCENE2D;
// 	const modeColumbus = SceneMode.COLUMBUS_VIEW;

// 	when(viewerFactory.createViewer(anything(),anything())).thenReturn({
// 		scene: {
// 			screenSpaceCameraController: {
// 				minimumZoomDistance: defaultZooms,
// 				maximumZoomDistance: defaultZooms,
// 				enableTilt: defaultTilt
// 			},
// 			mode: mode3D,
// 			morphTo2D: function () {
// 				this.mode = mode2D;
// 			},
// 			morphToColumbusView: function () {
// 				this.mode = modeColumbus;
// 			},
// 			morphTo3D: function () {
// 				this.mode = mode3D;
// 			}
// 		}
// 	});

// 	beforeEach(() => {
// 		mapContainer = document.createElement('mapContainer');
// 		document.body.appendChild(mapContainer);

// 		TestBed.configureTestingModule({
// 			providers: [CesiumService, providerFromMock(ViewerFactory, viewerFactory)]
// 		});
// 	});

// 	beforeEach(inject([CesiumService], (service: CesiumService) => {
// 		service.init(mapContainer);
// 	}));

// 	afterEach(() => {
// 		mapContainer.remove();
// 	});

// 	it('should create', inject([CesiumService], (service: CesiumService) => {
// 		expect(service).toBeDefined();
// 	}));

// 	it('should initialize and return viewer', inject([CesiumService], (service: CesiumService) => {
// 		expect(service.getViewer()).toBeDefined();
// 	}));

// 	it('should return scene', inject([CesiumService], (service: CesiumService) => {
// 		expect(service.getScene()).toBeDefined();
// 	}));
// });
