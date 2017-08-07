import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcStaticCircleDescComponent } from './ac-static-circle-desc.component';
import { CesiumService } from '../../services/cesium/cesium.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-circle-drawer/static-circle-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { mock } from 'ts-mockito';

describe('AcStaticCircleDescComponent', () => {
	let component: AcStaticCircleDescComponent;
	let fixture: ComponentFixture<AcStaticCircleDescComponent>;

	beforeEach(async(() => {
		const mockCesiumService = mock(CesiumService);
		const mockStaticCircleDrawerService = mock(StaticCircleDrawerService);
		const mockLayerService = mock(LayerService);
		const mockComputationCache = mock(ComputationCache);
		const mockCesiumProperties = mock(CesiumProperties);

		TestBed.configureTestingModule({
			declarations: [AcStaticCircleDescComponent],
			providers: [
				{
					provide: CesiumService,
					useValue: mockCesiumService
				},
				{
					provide: StaticCircleDrawerService,
					useValue: mockStaticCircleDrawerService
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
		fixture = TestBed.createComponent(AcStaticCircleDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});