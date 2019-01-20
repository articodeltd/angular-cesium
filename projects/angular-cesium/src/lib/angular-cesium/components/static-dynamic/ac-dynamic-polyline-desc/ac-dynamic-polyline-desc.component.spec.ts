// tslint:disable
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcDynamicPolylineDescComponent } from './ac-dynamic-polyline-desc.component';
import { DynamicPolylineDrawerService } from '../../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { instance, mock, when } from 'ts-mockito';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../../utils/testingUtils';

describe('AcDynamicPolylineDescComponent', () => {
  let component: AcDynamicPolylineDescComponent;
  let fixture: ComponentFixture<AcDynamicPolylineDescComponent>;

  const cesiumService = mock(CesiumService);
  const collection = mock(Cesium.PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(collection)} as any);

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcDynamicPolylineDescComponent],
      providers: [DynamicPolylineDrawerService,
        providerFromMock(CesiumService, cesiumService),
        mockProvider(LayerService),
        mockProvider(CesiumProperties),
        mockProvider(ComputationCache)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcDynamicPolylineDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
