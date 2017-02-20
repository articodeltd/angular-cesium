import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { CesiumService } from '../cesium/cesium.service';
import { LayerService } from '../layer-service/layer-service.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
import { ComputationCache } from '../computation-cache/computation-cache.service';
import { mock, anything, when, verify } from 'ts-mockito';
import { providerFromMock, mockProvider } from '../../utils/testingUtils';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { BasicDesc } from './basic-desc.service';

@Component({
	template: '',
	selector: 'basic-desc-test-class'
})
class BasicDescTestClass extends BasicDesc {
	constructor(drawer: SimpleDrawerService,
	            layerService: LayerService,
	            computationCache: ComputationCache,
	            cesiumProperties: CesiumProperties) {
		super(drawer, layerService, computationCache, cesiumProperties)
	}
}

describe('BasicDescTestClass', () => {
	const id = 0;
	const cesiumProperties = mock(CesiumProperties);
	let component: BasicDescTestClass;
	let fixture: ComponentFixture<BasicDescTestClass>;
	let simpleDrawerService = mock(SimpleDrawerService);

	when(cesiumProperties.createEvaluator(anything())).thenReturn(() => {
		return {}
	});
	when(simpleDrawerService.add(anything())).thenReturn({});

	beforeEach(() => {
		TestBed.configureTestingModule({
			declarations: [BasicDescTestClass],
			providers: [
				providerFromMock(CesiumProperties, cesiumProperties),
				providerFromMock(SimpleDrawerService, simpleDrawerService),
				mockProvider(LayerService),
				mockProvider(CesiumService),
				mockProvider(ComputationCache)
			]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(BasicDescTestClass);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should draw', () => {
		component.draw({}, id, {});
		verify(simpleDrawerService.add(anything())).once();
	});

	it('should remove', () => {
		component.draw({}, id, {});
		component.remove(id);
		verify(simpleDrawerService.remove(anything())).once();
	});

	it('should update', () => {
		component.draw({}, id, {});
		component.draw({}, id, {});
		verify(simpleDrawerService.update(anything(), anything())).once();
	});

	it('should remove all', () => {
		component.removeAll();
		verify(simpleDrawerService.removeAll()).once();
	});
});
