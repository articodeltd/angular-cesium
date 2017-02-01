/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcBillboradDescComponent } from './ac-billborad-desc.component';

describe('AcBillboradDescComponent', () => {
	let component: AcBillboradDescComponent;
	let fixture: ComponentFixture<AcBillboradDescComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcBillboradDescComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcBillboradDescComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
