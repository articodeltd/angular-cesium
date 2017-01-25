/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { PolygonDrawerService } from './polygon-drawer.service';

describe('PolygonDrawerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [PolygonDrawerService]
		});
	});

	it('should ...', inject([PolygonDrawerService], (service: PolygonDrawerService) => {
		expect(service).toBeTruthy();
	}));
});
