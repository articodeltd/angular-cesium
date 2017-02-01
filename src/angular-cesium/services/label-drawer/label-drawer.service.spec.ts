/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { LabelDrawerService } from './label-drawer.service';

describe('LabelDrawerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [LabelDrawerService]
		});
	});

	it('should ...', inject([LabelDrawerService], (service: LabelDrawerService) => {
		expect(service).toBeTruthy();
	}));
});
