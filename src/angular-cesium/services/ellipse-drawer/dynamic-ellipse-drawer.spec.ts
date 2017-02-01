import { TestBed, inject } from '@angular/core/testing';
import { DynamicEllipseDrawerService } from './dynamic-ellipse-drawer.service';

describe('DynamicEllipseDrawerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [DynamicEllipseDrawerService]
		});
	});

	it('should ...', inject([DynamicEllipseDrawerService], (service: DynamicEllipseDrawerService) => {
		expect(service).toBeTruthy();
	}));
});
