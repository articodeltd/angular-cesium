/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {DynamicPolylineDrawerService} from "./dynamic-polyline-drawer.service";

describe('BillboardDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DynamicPolylineDrawerService]
    });
  });

  it('should ...', inject([DynamicPolylineDrawerService], (service: DynamicPolylineDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
