import { TestBed, inject } from '@angular/core/testing';

import { CesiumService } from './cesium.service';
import { AcMapComponent } from '../../components/ac-map/ac-map.component';
import { mock } from 'ts-mockito';

describe('CesiumService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CesiumService]
		});
	});

	it('should create', inject([CesiumService], (service: CesiumService) => {
		expect(service.cesium).toBeDefined();
	}));

	// it('should create', inject([CesiumService], (service: CesiumService) => {
	// 	let map = mock(AcMapComponent);
	// 	let mapContainer = document.createElement('div');
	// 	map.
	// 	service.init(mapContainer);
	// 	expect(service.cesiumViewer);
	// }));
});
