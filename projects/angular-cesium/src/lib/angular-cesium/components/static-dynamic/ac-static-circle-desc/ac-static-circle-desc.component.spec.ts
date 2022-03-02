import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AcStaticCircleDescComponent } from './ac-static-circle-desc.component';
import { PrimitiveCollection } from 'cesium';
import { CesiumService } from '../../../services/cesium/cesium.service';
import { StaticCircleDrawerService } from '../../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { instance, mock, when } from 'ts-mockito';

xdescribe('AcStaticCircleDescComponent', () => {
  let component: AcStaticCircleDescComponent;
  let fixture: ComponentFixture<AcStaticCircleDescComponent>;

  beforeEach(waitForAsync(() => {
    const mockStaticCircleDrawerService = mock(StaticCircleDrawerService);
    const mockLayerService = mock(LayerService);
    const mockComputationCache = mock(ComputationCache);
    const mockCesiumProperties = mock(CesiumProperties);

    const cesiumService = mock(CesiumService);
    const collection = mock(PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(collection)} as any);


    TestBed.configureTestingModule({
      declarations: [AcStaticCircleDescComponent],
      providers: [
        {
          provide: CesiumService,
          useValue: cesiumService
        },
        {
          provide: StaticCircleDrawerService,
          useValue: mockStaticCircleDrawerService
        },
        {
          provide: LayerService,
          useValue: mockLayerService
        },
        {
          provide: ComputationCache,
          useValue: mockComputationCache
        },
        {
          provide: CesiumProperties,
          useValue: mockCesiumProperties
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcStaticCircleDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
