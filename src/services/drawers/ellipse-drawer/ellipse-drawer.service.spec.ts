/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { EllipseDrawerService } from './ellipse-drawer.service';
import { CesiumService } from '../../cesium/cesium.service';
import { ViewerFactory } from '../../viewer-factory/viewer-factory.service';
import { mockProvider } from '../../../utils/testingUtils';

fdescribe('EllipseDrawerService', () => {
  
  
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [EllipseDrawerService, mockProvider(CesiumService), ]
    });
  });

  it('should create', inject([EllipseDrawerService], (service: EllipseDrawerService) => {
    expect(service).toBeTruthy();
  }));
});
