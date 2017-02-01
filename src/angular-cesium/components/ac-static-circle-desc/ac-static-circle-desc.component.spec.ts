/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcEllipseStaticDescComponent } from './ac-ellipse-static-desc.component';

describe('AcEllipseStaticDescComponent', () => {
	let component: AcEllipseStaticDescComponent;
	let fixture: ComponentFixture<AcEllipseStaticDescComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcEllipseStaticDescComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcEllipseStaticDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
