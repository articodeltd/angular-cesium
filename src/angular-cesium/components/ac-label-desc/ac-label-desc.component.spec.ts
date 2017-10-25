import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';
import { AcLabelDescComponent } from './ac-label-desc.component';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';

describe('AcLabelDescComponent', () => {
	let component: AcLabelDescComponent;
	let fixture: ComponentFixture<AcLabelDescComponent>;

	const cesiumService = mock(CesiumService);
	const labelCollection = mock(Cesium.LabelCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(labelCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcLabelDescComponent],
			providers: [LabelDrawerService,
				providerFromMock(CesiumService, cesiumService),
				mockProvider(LayerService),
				mockProvider(CesiumProperties),
				mockProvider(ComputationCache)]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcLabelDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});