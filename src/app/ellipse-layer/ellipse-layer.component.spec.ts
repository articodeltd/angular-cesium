/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipseLayerComponent } from './ellipse-layer.component';

describe('EllipseLayerComponent', () => {
	let component: EllipseLayerComponent;
	let fixture: ComponentFixture<EllipseLayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [EllipseLayerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(EllipseLayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});