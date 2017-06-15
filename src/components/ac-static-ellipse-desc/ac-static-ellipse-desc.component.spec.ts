import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcStaticEllipseDescComponent } from './ac-static-ellipse-desc.component';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { mock, instance, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';

describe('AcStaticEllipseDescComponent', () => {
	let component: AcStaticEllipseDescComponent;
	let fixture: ComponentFixture<AcStaticEllipseDescComponent>;

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcStaticEllipseDescComponent],
			providers: [EllipseDrawerService,
				providerFromMock(CesiumService, cesiumService),
				mockProvider(LayerService),
				mockProvider(CesiumProperties),
				mockProvider(ComputationCache)]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcStaticEllipseDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
