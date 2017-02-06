/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcLayerComponent } from './ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { StaticPolylineDrawerService } from '../../services/static-polyline-drawer/static-polyline-drawer.service';
import { StaticCircleDrawerService } from '../../services/static-circle-drawer/static-circle-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { BillboardDrawerService } from '../../services/billboard-drawer/billboard-drawer.service';
import { LabelDrawerService } from '../../services/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/ellipse-drawer/ellipse-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider } from '../../utils/testingUtils';

fdescribe('AcLayerComponent', () => {
	let component: AcLayerComponent;
	let fixture: ComponentFixture<AcLayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcLayerComponent],
			providers: [mockProvider(CesiumService), LayerService, ComputationCache, mockProvider(BillboardDrawerService),
				LabelDrawerService, EllipseDrawerService, DynamicEllipseDrawerService, DynamicPolylineDrawerService, StaticCircleDrawerService, StaticPolylineDrawerService]
			// providerFromMock(CesiumService, cesiumService),
			// mockProvider(LayerService),
			// mockProvider(CesiumProperties),
			// mockProvider(ComputationCache)]
		})
			.compileComponents();
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(AcLayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
