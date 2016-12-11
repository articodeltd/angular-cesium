/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CesiumService } from './cesium.service';

describe('CesiumService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CesiumService]
    });
  });

  it('should ...', inject([CesiumService], (service: CesiumService) => {
    expect(service).toBeTruthy();
  }));
});
