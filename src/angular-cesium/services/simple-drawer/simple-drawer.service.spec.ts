/* tslint:disable:no-unused-variable */
import { TestBed, inject } from '@angular/core/testing';
import { SimpleDrawerService } from './simple-drawer.service';

describe('SimpleDrawerService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [SimpleDrawerService]
		});
	});

	it('should ...', inject([SimpleDrawerService], (service: SimpleDrawerService) => {
		expect(service).toBeTruthy();
	}));
});
