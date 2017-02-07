/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AngularCesiumComponent } from './angular-cesium.component';

describe('AngularCesiumComponent', () => {
	let component: AngularCesiumComponent;
	let fixture: ComponentFixture<AngularCesiumComponent>;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AngularCesiumComponent]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AngularCesiumComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});
