/* tslint:disable:no-unused-variable */
import {TestBed, inject} from "@angular/core/testing";
import {LayerContextService} from "./layer-context.service";

describe('LayerContextService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [LayerContextService]
    });
  });

  it('should ...', inject([LayerContextService], (service: LayerContextService) => {
    expect(service).toBeTruthy();
  }));
});
