/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { LayerServiceService } from './layer-service.service';

describe('LayerServiceService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LayerServiceService]
		});
	});

	it('should ...', inject([LayerServiceService], (service: LayerServiceService) => {
		expect(service).toBeTruthy();
	}));
});
