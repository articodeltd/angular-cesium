import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcPolylineDescComponent } from './ac-polyline-desc.component';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { instance, mock, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';

describe('AcPolylineDescComponent', () => {
  let component: AcPolylineDescComponent;
  let fixture: ComponentFixture<AcPolylineDescComponent>;

  const cesiumService = mock(CesiumService);
  const collection = mock(Cesium.PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(collection)});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcPolylineDescComponent],
      providers: [PolylineDrawerService,
        providerFromMock(CesiumService, cesiumService),
        mockProvider(LayerService),
        mockProvider(CesiumProperties),
        mockProvider(ComputationCache)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcPolylineDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
