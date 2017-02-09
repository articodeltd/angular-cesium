import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Injectable } from '@angular/core';

import { CesiumService } from '../cesium/cesium.service';
import { LayerService } from '../layer-service/layer-service.service';
import { CesiumProperties } from '../cesium-properties/cesium-properties.service'
import { ComputationCache } from '../computation-cache/computation-cache.service'
import { mock, anything, when, verify } from 'ts-mockito';
import { providerFromMock, mockProvider } from '../../utils/testingUtils';
import { SimpleDrawerService } from '../simple-drawer/simple-drawer.service';
import { BasicDesc } from './basic-desc.service';

@Injectable()
class SimpleDrawerServiceTestClass extends SimpleDrawerService {
	constructor(cesiumService: CesiumService) {
		super(Cesium.PrimitiveCollection, cesiumService);
	}

	setPropsAssigner(assigner: Function) {
	}

	add(cesiumProps: any, ...moreProps): any {
		return {};
	}

	remove(primitive: any) {
	}

	update(primitive: any, cesiumProps: Object, ...moreProps) {
	}

	removeAll() {
	}
}

@Component({
	template: '',
	selector: 'basic-desc-test-class',
})
class BasicDescTestClass extends BasicDesc {
	constructor(drawer: SimpleDrawerServiceTestClass,
	            layerService: LayerService,
	            computationCache: ComputationCache,
	            cesiumProperties: CesiumProperties) {
		super(drawer, layerService, computationCache, cesiumProperties)
	}
}

fdescribe('BasicDescTestClass', () => {
	const cesiumProperties = mock(CesiumProperties);
	const simpleDrawerServiceTestClass = mock(SimpleDrawerServiceTestClass);
	let component: BasicDescTestClass;
	let fixture: ComponentFixture<BasicDescTestClass>;

	when(cesiumProperties.createEvaluator(anything())).thenReturn(() => {
		return {}
	});
	when(simpleDrawerServiceTestClass.add(anything())).thenReturn({});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [BasicDescTestClass],
			providers: [
				providerFromMock(CesiumProperties, cesiumProperties),
				providerFromMock(SimpleDrawerServiceTestClass, simpleDrawerServiceTestClass),
				mockProvider(LayerService),
				mockProvider(CesiumService),
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

	it('should draw', () => {
		component.draw({}, 0, {});
		verify(simpleDrawerServiceTestClass.add(anything())).once();
		expect(component._primitiveMap.size).toEqual(1);
	});

	it('should remove', () => {
		component.draw({}, 0, {});
		component.remove(0);
		verify(simpleDrawerServiceTestClass.remove(anything())).once();
		expect(component._primitiveMap.size).toEqual(0);
	});

	it('should update', () => {
		component.draw({}, 0, {});
		component.draw({}, 0, {});
		verify(simpleDrawerServiceTestClass.update(anything())).once();
	});

	it('should remove all', () => {
		component.draw({}, 0, {});
		component.draw({}, 1, {});
		component.removeAll();
		verify(simpleDrawerServiceTestClass.removeAll()).once();
		expect(component._primitiveMap.size).toEqual(0);
	});
});
