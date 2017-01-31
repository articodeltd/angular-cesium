import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcStaticPolylineDescComponent } from './ac-static-polyline-desc.component';
import { CesiumService } from '../../services/cesium/cesium.service';
import { StaticPolylineDrawerService } from '../../services/static-polyline-drawer/static-polyline-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service'
import { ComputationCache } from '../../services/computation-cache/computation-cache.service'
import { mock } from 'ts-mockito';

describe('AcStaticPolylineDescComponent', () => {
	let component: AcStaticPolylineDescComponent;
	let fixture: ComponentFixture<AcStaticPolylineDescComponent>;

	beforeEach(async(() => {
		const mockCesiumService = mock(CesiumService);
		const mockStaticPolylineDrawerService = mock(StaticPolylineDrawerService);
		const mockLayerService = mock(LayerService);
		const mockComputationCache = mock(ComputationCache);
		const mockCesiumProperties = mock(CesiumProperties);

		TestBed.configureTestingModule({
			declarations: [AcStaticPolylineDescComponent],
			providers: [
				{
					provide: CesiumService,
					useValue: mockCesiumService
				},
				{
					provide: StaticPolylineDrawerService,
					useValue: mockStaticPolylineDrawerService
				},
				{
					provide: LayerService,
					useValue: mockLayerService
				},
				{
					provide: ComputationCache,
					useValue: mockComputationCache
				},
				{
					provide: CesiumProperties,
					useValue: mockCesiumProperties
				}
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