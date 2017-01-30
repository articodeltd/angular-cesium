/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicPolylineLayerComponent } from './dynamic-polyline-layer.component';

describe('DynamicPolylineLayerComponent', () => {
	let component: DynamicPolylineLayerComponent;
	let fixture: ComponentFixture<DynamicPolylineLayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [DynamicPolylineLayerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DynamicPolylineLayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});