import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcEllipseComponent } from './ac-ellipse.component';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

describe('AcEllipseComponent', () => {
    let component: AcEllipseComponent;
    let fixture: ComponentFixture<AcEllipseComponent>;

    const cesiumService = mock(CesiumService);
    const primitiveCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcEllipseComponent],
            providers: [DynamicEllipseDrawerService,
                providerFromMock(CesiumService, cesiumService)]
        })
	        .compileComponents();
        fixture = TestBed.createComponent(AcEllipseComponent);
        component = fixture.componentInstance;

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
