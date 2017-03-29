/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcLayerComponent } from './ac-layer.component';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { StaticPolylineDrawerService } from '../../services/drawers/static-polyline-drawer/static-polyline-drawer.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-circle-drawer/static-circle-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, provider, providerFromMock } from '../../utils/testingUtils';
import { mock, instance, when } from 'ts-mockito';
import { Observable } from 'rxjs';

describe('AcLayerComponent', () => {
	let component: AcLayerComponent;
	let fixture: ComponentFixture<AcLayerComponent>;

	const cesiumService = mock(CesiumService);
	const primitiveCollection = mock(Cesium.PrimitiveCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcLayerComponent],
			providers: [providerFromMock(CesiumService, cesiumService), mockProvider(LayerService), mockProvider(ComputationCache), provider(BillboardDrawerService, {}),
				mockProvider(LabelDrawerService), mockProvider(EllipseDrawerService), mockProvider(DynamicEllipseDrawerService),
				mockProvider(DynamicPolylineDrawerService), mockProvider(StaticCircleDrawerService), mockProvider(StaticPolylineDrawerService)]
		})
			.compileComponents();
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(AcLayerComponent);
		component = fixture.componentInstance;
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
	describe('validation tests', () => {
		it('should created successfully after init', () => {
			component.context = {stream$: Observable.of('a')};
			component.acFor = 'let item of stream$';
			fixture.detectChanges();
			expect(component).toBeTruthy()
		});
		it('should throw exception if acFor in wrong format', () => {
			component.context = {stream$: Observable.of('a')};
			component.acFor = 'let item in stream$';
			expect(fixture.detectChanges).toThrow();
		});
		it('should throw exception if the stream is not instance of obeserver', () => {
			component.context = {stream$: [1,2,3]};
			component.acFor = 'let item of stream$';
			expect(fixture.detectChanges).toThrow();
		});

		it('should throw exception if the observer is not defined in the context', () => {
			component.context = {};
			component.acFor = 'let item of stream$';
			expect(fixture.detectChanges).toThrow();
		});

		it('should throw exception if the context is not defined ', () => {
			component.acFor = 'let item of stream$';
			expect(fixture.detectChanges).toThrow();
		});

	});
});
