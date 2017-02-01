/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcMapComponent } from './ac-map.component.ts';

describe('AcMapComponent', () => {
	let component: AcMapComponent;
	let fixture: ComponentFixture<AcMapComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcMapComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcMapComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
