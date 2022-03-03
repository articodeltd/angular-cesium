import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrimitiveCollection } from 'cesium';
import { instance, mock, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcPrimitivePolylineComponent } from './ac-primitive-polyline.component';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';

describe('AcPrimitivePolylineComponent', () => {
  let component: AcPrimitivePolylineComponent;
  let fixture: ComponentFixture<AcPrimitivePolylineComponent>;

  const cesiumService = mock(CesiumService);
  const polylineCollection = mock(PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(polylineCollection)});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcPrimitivePolylineComponent],
      providers: [PolylinePrimitiveDrawerService, MapLayersService,
        providerFromMock(CesiumService, cesiumService)]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AcPrimitivePolylineComponent);
    component = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
