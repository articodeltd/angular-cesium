import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcPolylineComponent } from './ac-polyline.component';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';

describe('AcPolylineComponent', () => {
	let component: AcPolylineComponent;
	let fixture: ComponentFixture<AcPolylineComponent>;

	const cesiumService = mock(CesiumService);
  const polylineCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(polylineCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcPolylineComponent],
			providers: [PolylineDrawerService,
				providerFromMock(CesiumService, cesiumService)]
		})
			.compileComponents();
		fixture = TestBed.createComponent(AcPolylineComponent);
		component = fixture.componentInstance;

	}));

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
