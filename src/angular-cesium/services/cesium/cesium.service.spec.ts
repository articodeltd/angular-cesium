import { NgZone } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { mockProvider } from '../../utils/testingUtils';
import { CesiumService } from './cesium.service';

describe('CesiumService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				CesiumService,
				mockProvider(NgZone)
			]
		});
	});

	it('should create', () => {
	});
});
