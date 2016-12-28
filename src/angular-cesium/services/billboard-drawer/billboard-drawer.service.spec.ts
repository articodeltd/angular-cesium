/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {BillboardDrawerService} from "./billboard-drawer.service";

describe('BillboardDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BillboardDrawerService]
    });
  });

  it('should ...', inject([BillboardDrawerService], (service: BillboardDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
