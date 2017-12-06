import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcPrimitivePolylineComponent } from './ac-primitive-polyline.component';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';

describe('AcPrimitivePolylineComponent', () => {
	let component: AcPrimitivePolylineComponent;
	let fixture: ComponentFixture<AcPrimitivePolylineComponent>;

	const cesiumService = mock(CesiumService);
  const polylineCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(polylineCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcPrimitivePolylineComponent],
			providers: [PolylineDrawerService, MapLayersService,
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
