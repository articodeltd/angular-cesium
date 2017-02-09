import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';

import { CesiumService } from '../cesium/cesium.service';
import { LayerService } from '../layer-service/layer-service.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service'
import { ComputationCache } from '../computation-cache/computation-cache.service'
import { mock } from 'ts-mockito';
import { providerFromMock, mockProvider } from '../../utils/testingUtils';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { BasicDesc } from './basic-desc.service';

@Component({
	template: '',
	selector: 'basic-desc-test-class',
})
class BasicDescTestClass extends BasicDesc {
	constructor(drawer: SimpleDrawerService,
	            layerService: LayerService,
	            computationCache: ComputationCache,
	            cesiumProperties: CesiumProperties) {
		super(drawer, layerService, computationCache, cesiumProperties)
	}
}

fdescribe('BasicDescTestClass', () => {
	let component: BasicDescTestClass;
	let fixture: ComponentFixture<BasicDescTestClass>;

	beforeEach(async(() => {
		const cesiumService = mock(CesiumService);

		TestBed.configureTestingModule({
			declarations: [BasicDescTestClass],
			providers: [
				providerFromMock(CesiumService, cesiumService),
				mockProvider(LayerService),
				mockProvider(SimpleDrawerService),
				mockProvider(CesiumProperties),
				mockProvider(ComputationCache)
			]
		})
			.compileComponents();
	}));
	beforeEach(() => {
		fixture = TestBed.createComponent(BasicDescTestClass);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
