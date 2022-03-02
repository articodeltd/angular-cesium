/* tslint:disable:no-unused-variable */
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrimitiveCollection, DataSource } from 'cesium';
import { AcLayerComponent } from './ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, provider, providerFromMock } from '../../utils/testingUtils';
import { instance, mock, when } from 'ts-mockito';
import { of } from 'rxjs';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { CesiumExtender } from '../../../cesium-extender/extender';


CesiumExtender.extend();
describe('AcLayerComponent', () => {
  let component: AcLayerComponent;
  let fixture: ComponentFixture<AcLayerComponent>;

  const cesiumService = mock(CesiumService);
  const primitiveCollection = mock(PrimitiveCollection);
  const dataSource = mock(DataSource);

  when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});
  when(cesiumService.getViewer()).thenReturn({dataSources: instance(primitiveCollection)});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcLayerComponent],
      providers: [providerFromMock(CesiumService, cesiumService), mockProvider(LayerService),
        mockProvider(ComputationCache), provider(BillboardDrawerService, {}),
        mockProvider(LabelDrawerService), mockProvider(EllipseDrawerService),
        mockProvider(EllipseDrawerService), mockProvider(PolylineDrawerService),
        mockProvider(EllipseDrawerService), mockProvider(PolylineDrawerService), mockProvider(MapLayersService)]
    })
      .compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AcLayerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('validation tests', () => {
    it('should created successfully after init', () => {
      component.context = {stream$: of('a')};
      component.acFor = 'let item of stream$';
      fixture.detectChanges();
      expect(component).toBeTruthy();
    });
    it('should throw exception if acFor in wrong format', () => {
      component.context = {stream$: of('a')};
      component.acFor = 'let item in stream$';
      expect(fixture.detectChanges).toThrow();
    });
    it('should throw exception if the stream is not instance of obeserver', () => {
      component.context = {stream$: [1, 2, 3]};
      component.acFor = 'let item of stream$';
      expect(fixture.detectChanges).toThrow();
    });

    it('should throw exception if the observer is not defined in the context', () => {
      component.context = {};
      component.acFor = 'let item of stream$';
      expect(fixture.detectChanges).toThrow();
    });

    it('should throw exception if the context is not defined ', () => {
      component.acFor = 'let item of stream$';
      expect(fixture.detectChanges).toThrow();
    });

  });
});
