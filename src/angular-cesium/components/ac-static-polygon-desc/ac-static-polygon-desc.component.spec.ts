/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcPolygonStaticDescComponent } from './ac-polygon-static-desc.component';

describe('AcStaticPolygonDescComponent', () => {
	let component: AcPolygonStaticDescComponent;
	let fixture: ComponentFixture<AcPolygonStaticDescComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcPolygonStaticDescComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcPolygonStaticDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
