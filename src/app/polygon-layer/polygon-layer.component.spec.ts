/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PolygonLayerComponent } from './polygon-layer.component';

describe('PolygonLayerComponent', () => {
	let component: PolygonLayerComponent;
	let fixture: ComponentFixture<PolygonLayerComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PolygonLayerComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PolygonLayerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});