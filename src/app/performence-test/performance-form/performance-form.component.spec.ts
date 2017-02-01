/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PerformanceFormComponent } from './performance-form.component';

describe('PerformanceFormComponent', () => {
	let component: PerformanceFormComponent;
	let fixture: ComponentFixture<PerformanceFormComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [PerformanceFormComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PerformanceFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
