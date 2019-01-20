import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcStaticPolygonDescComponent } from './ac-static-polygon-desc.component';
import { instance, mock, when } from 'ts-mockito';
import { LayerService } from '../../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../../utils/testingUtils';
import { StaticPolygonDrawerService } from '../../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service';

describe('AcStaticPolygonDescComponent', () => {
  let component: AcStaticPolygonDescComponent;
  let fixture: ComponentFixture<AcStaticPolygonDescComponent>;

  const cesiumService = mock(CesiumService);
  const primitiveCollection = mock(Cesium.PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AcStaticPolygonDescComponent],
      providers: [StaticPolygonDrawerService,
        providerFromMock(CesiumService, cesiumService),
        mockProvider(LayerService),
        mockProvider(CesiumProperties),
        mockProvider(ComputationCache)]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcStaticPolygonDescComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
