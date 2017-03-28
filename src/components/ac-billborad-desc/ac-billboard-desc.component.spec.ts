import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcBillboardDescComponent } from './ac-billborad-desc.component';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { mock, instance, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';
import { CesiumService } from '../../services/cesium/cesium.service';

describe('AcBillboardDescComponent', () => {
	let component: AcBillboardDescComponent;
	let fixture: ComponentFixture<AcBillboardDescComponent>;

	const cesiumService = mock(CesiumService);
	const billboardCollection = mock(Cesium.BillboardCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(billboardCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcBillboardDescComponent],
			providers: [BillboardDrawerService,
				providerFromMock(CesiumService, cesiumService),
				mockProvider(LayerService),
				mockProvider(CesiumProperties),
				mockProvider(ComputationCache)]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcBillboardDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});