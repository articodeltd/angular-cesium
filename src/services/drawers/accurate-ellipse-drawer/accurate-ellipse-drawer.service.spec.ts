import { TestBed, inject } from '@angular/core/testing';
import {AccurateEllipseDrawerService} from './accurate-ellipse-drawer.service';

describe('AccurateEllipseDrawerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AccurateEllipseDrawerService]
    });
  });

  it('should ...', inject([AccurateEllipseDrawerService], (service: AccurateEllipseDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
