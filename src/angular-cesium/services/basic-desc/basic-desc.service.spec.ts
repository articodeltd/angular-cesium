// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { Component } from '@angular/core';
//
// import { CesiumService } from '../cesium/cesium.service';
// import { LayerService } from '../layer-service/layer-service.service';
// import { CesiumProperties } from '../cesium-properties/cesium-properties.service';
// import { ComputationCache } from '../computation-cache/computation-cache.service';
// import { anything, mock, resetCalls, verify, when } from 'ts-mockito';
// import { mockProvider, providerFromMock } from '../../utils/testingUtils';
// import { PrimitivesDrawerService } from '../drawers/primitives-drawer/primitives-drawer.service';
// import { BasicDesc } from './basic-desc.service';
//
// @Component({
// 	template: '',
// 	selector: 'basic-desc-test-class'
// })
// class BasicDescTestClass extends BasicDesc {
// 	constructor(drawer: PrimitivesDrawerService,
// 	            layerService: LayerService,
// 	            computationCache: ComputationCache,
// 	            cesiumProperties: CesiumProperties) {
// 		super(drawer, layerService, computationCache, cesiumProperties)
// 	}
// }
//
// describe('BasicDescTestClass', () => {
// 	const id = '0';
// 	const secondId= '1';
// 	const cesiumProperties = mock(CesiumProperties);
// 	let component: BasicDescTestClass;
// 	let fixture: ComponentFixture<BasicDescTestClass>;
// 	let simpleDrawerService: any = mock(PrimitivesDrawerService);
//
// 	when(cesiumProperties.createEvaluator(anything())).thenReturn(() => {
// 		return {};
// 	});
// 	when(simpleDrawerService.add(anything())).thenReturn({});
//
// 	function addComponentsAddRemoveAll() {
// 		component.draw({}, id, {});
// 		component.draw({}, secondId, {});
// 		component.removeAll();
// 	}
//
// 	beforeEach(() => {
// 		TestBed.configureTestingModule({
// 			declarations: [BasicDescTestClass],
// 			providers: [
// 				providerFromMock(CesiumProperties, cesiumProperties),
// 				providerFromMock(PrimitivesDrawerService, simpleDrawerService),
// 				mockProvider(LayerService),
// 				mockProvider(CesiumService),
// 				mockProvider(ComputationCache)
// 			]
// 		})
// 			.compileComponents();
// 	});
//
// 	beforeEach(() => {
// 		fixture = TestBed.createComponent(BasicDescTestClass);
// 		component = fixture.componentInstance;
// 		fixture.detectChanges();
// 		resetCalls(simpleDrawerService);
// 	});
//
// 	it('should create', () => {
// 		expect(component).toBeTruthy();
// 	});
//
// 	it('should draw', () => {
// 		component.draw({}, id, {});
// 		component.draw({}, id, {});
// 		verify(simpleDrawerService.add(anything())).once();
// 	});
//
// 	it('should remove', () => {
// 		component.draw({}, id, {});
// 		component.remove(id);
// 		verify(simpleDrawerService.remove(anything())).once();
// 	});
//
// 	it('should add after remove', () => {
// 		component.draw({}, id, {});
// 		component.remove(id);
// 		component.draw({}, id, {});
// 		verify(simpleDrawerService.update(anything(), anything())).never();
// 		verify(simpleDrawerService.add(anything())).twice();
// 	});
//
// 	it('should update just once', () => {
// 		component.draw({}, id, {});
// 		component.draw({}, id, {});
// 		component.remove(id);
// 		component.draw({}, id, {});
// 		verify(simpleDrawerService.update(anything(), anything())).once();
// 	});
//
// 	it('should remove all', () => {
// 		addComponentsAddRemoveAll();
// 		verify(simpleDrawerService.removeAll()).once();
// 	});
//
// 	it('should add after remove all', () => {
// 		addComponentsAddRemoveAll();
// 		component.draw({}, id, {});
// 		component.draw({}, secondId, {});
// 		verify(simpleDrawerService.update(anything(), anything())).never();
// 		verify(simpleDrawerService.add(anything())).times(4);
// 	});
// });
