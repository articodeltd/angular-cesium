/* tslint:disable:no-unused-variable */

import { inject, TestBed } from '@angular/core/testing';
import { EllipseDrawerService } from './ellipse-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { mockProvider } from '../../../utils/testingUtils';

describe('EllipseDrawerService', () => {


  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EllipseDrawerService, mockProvider(CesiumService), ]
    });
  });

  it('should create', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
