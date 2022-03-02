import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PointPrimitiveCollection } from 'cesium';
import { AcPointDescComponent } from './ac-point-desc.component';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { instance, mock, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';

describe('AcPointDescComponent', () => {
  let component: AcPointDescComponent;
  let fixture: ComponentFixture<AcPointDescComponent>;

  const cesiumService = mock(CesiumService);
  const pointCollection = mock(PointPrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(pointCollection)});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcPointDescComponent],
      providers: [PointDrawerService,
        providerFromMock(CesiumService, cesiumService),
        mockProvider(LayerService),
        mockProvider(CesiumProperties),
        mockProvider(ComputationCache)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcPointDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
