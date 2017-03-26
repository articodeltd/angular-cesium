import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { LabelDrawerService } from '../../services/label-drawer/label-drawer.service';
import { AcLabelComponent } from './ac-label.component';

describe('AcLabelComponent', () => {
	let component: AcLabelComponent;
	let fixture: ComponentFixture<AcLabelComponent>;

	const cesiumService = mock(CesiumService);
	const labelCollection = mock(Cesium.LabelCollection);

	when(cesiumService.getScene()).thenReturn({primitives: instance(labelCollection)});

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [AcLabelComponent],
			providers: [LabelDrawerService,
				providerFromMock(CesiumService, cesiumService)]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AcLabelComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});