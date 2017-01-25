/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { EllipseDrawerService } from './ellipse-drawer.service';

describe('EllipseDrawerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [EllipseDrawerService]
		});
	});

	it('should ...', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
		expect(service).toBeTruthy();
	}));
});
