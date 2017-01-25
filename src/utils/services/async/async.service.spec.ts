/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { AsyncService } from './async.service';

describe('AsyncForEachService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AsyncService]
    });
  });

  it('should ...', inject([AsyncService], (service: AsyncService) => {
    expect(service).toBeTruthy();
  }));
});
