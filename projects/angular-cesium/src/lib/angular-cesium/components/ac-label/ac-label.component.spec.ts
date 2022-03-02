import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { LabelCollection } from 'cesium';
import { instance, mock, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcLabelComponent } from './ac-label.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

describe('AcLabelComponent', () => {
  let component: AcLabelComponent;
  let fixture: ComponentFixture<AcLabelComponent>;

  const cesiumService = mock(CesiumService);
  const labelCollection = mock(LabelCollection);

  when(cesiumService.getScene()).thenReturn({primitives: instance(labelCollection)});

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [AcLabelComponent],
      providers: [LabelDrawerService, MapLayersService,
        providerFromMock(CesiumService, cesiumService)]
    })
      .compileComponents();
    fixture = TestBed.createComponent(AcLabelComponent);
    component = fixture.componentInstance;

  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
