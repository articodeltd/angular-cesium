/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcLabelDescComponent } from './ac-label-desc.component';

describe('AcLabelDescComponent', () => {
	let component: AcLabelDescComponent;
	let fixture: ComponentFixture<AcLabelDescComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcLabelDescComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcLabelDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
