import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { PrimitiveCollection } from 'cesium';
import { instance, mock, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcCircleComponent } from './ac-circle.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

describe('AcCircleComponent', () => {
  let component: AcCircleComponent;
  let fixture: ComponentFixture<AcCircleComponent>;

  const cesiumService = mock(CesiumService);
  const primitiveCollection = mock(PrimitiveCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcCircleComponent],
      providers: [EllipseDrawerService, MapLayersService,
        providerFromMock(CesiumService, cesiumService)]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AcCircleComponent);
    component = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
