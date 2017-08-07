import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcStaticPolylineDescComponent } from './ac-static-polyline-desc.component';
import { CesiumService } from '../../services/cesium/cesium.service';
import { StaticPolylineDrawerService } from '../../services/drawers/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service'
import { ComputationCache } from '../../services/computation-cache/computation-cache.service'
import { mock } from 'ts-mockito';
import { providerFromMock, mockProvider } from '../../utils/testingUtils';

describe('AcStaticPolylineDescComponent', () => {
	let component: AcStaticPolylineDescComponent;
	let fixture: ComponentFixture<AcStaticPolylineDescComponent>;

	beforeEach(async(() => {
		const cesiumService = mock(CesiumService);

		TestBed.configureTestingModule({
			declarations: [AcStaticPolylineDescComponent],
			providers: [
				providerFromMock(CesiumService, cesiumService),
				mockProvider(LayerService),
				mockProvider(StaticPolylineDrawerService),
				mockProvider(CesiumProperties),
				mockProvider(ComputationCache)
			]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcStaticPolylineDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});