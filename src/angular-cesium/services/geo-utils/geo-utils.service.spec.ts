/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { GeoUtilsService } from './geo-utils.service';

describe('GeoUtilsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [GeoUtilsService]
		});
	});

	it('should ...', inject([GeoUtilsService], (service: GeoUtilsService) => {
		expect(service).toBeTruthy();
	}));
});
