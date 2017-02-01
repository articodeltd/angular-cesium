/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcBillboardComponent } from './ac-billboard.component';

describe('AcBillboardComponent', () => {
	let component: AcBillboardComponent;
	let fixture: ComponentFixture<AcBillboardComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcBillboardComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcBillboardComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
