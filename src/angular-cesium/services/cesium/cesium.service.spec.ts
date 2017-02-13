import { TestBed, inject } from '@angular/core/testing';

import { CesiumService } from './cesium.service';

fdescribe('CesiumService', () => {
	let mapContainer = document.createElement('mapContainer');

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CesiumService]
		});
	});

	afterEach(() => {
		mapContainer.remove();
	});

	it('should create', inject([CesiumService], (service: CesiumService) => {
		expect(service.cesium).toBeDefined();
	}));

	it('should create', inject([CesiumService], (service: CesiumService) => {
		service.init(mapContainer);
		expect(service.getViewer()).toBeDefined();
	}));

	it('should return scene', inject([CesiumService], (service: CesiumService) => {
		service.init(mapContainer);
		expect(service.getScene()).toBeDefined();
	}));
});