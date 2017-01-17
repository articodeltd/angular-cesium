/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {PolylineDynamicDrawerService} from "./polyline-dynamic-drawer.service";

describe('BillboardDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PolylineDynamicDrawerService]
    });
  });

  it('should ...', inject([PolylineDynamicDrawerService], (service: PolylineDynamicDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
