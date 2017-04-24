import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcPolylineComponent } from './ac-polyline.component';
import { DynamicPolylineDrawerService } from '../../services/drawers/dynamic-polyline-drawer/dynamic-polyline-drawer.service';

describe('AcPolylineComponent', () => {
	let component: AcPolylineComponent;
	let fixture: ComponentFixture<AcPolylineComponent>;

	const cesiumService = mock(CesiumService);
	const polylineCollection = mock(Cesium.PolylineCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(polylineCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcPolylineComponent],
			providers: [DynamicPolylineDrawerService,
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
