import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcCircleComponent } from './ac-circle.component';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

describe('AcCircleComponent', () => {
    let component: AcCircleComponent;
    let fixture: ComponentFixture<AcCircleComponent>;

    const cesiumService = mock(CesiumService);
    const primitiveCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcCircleComponent],
            providers: [DynamicEllipseDrawerService,
                providerFromMock(CesiumService, cesiumService)]
        })
	        .compileComponents();
        fixture = TestBed.createComponent(AcCircleComponent);
        component = fixture.componentInstance;

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
