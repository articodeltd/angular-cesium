import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcArcComponent } from './ac-arc.component';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';

describe('AcAcrComponent', () => {
    let component: AcArcComponent;
    let fixture: ComponentFixture<AcArcComponent>;

    const cesiumService = mock(CesiumService);
    const arcCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(arcCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcArcComponent],
            providers: [ArcDrawerService,
                providerFromMock(CesiumService, cesiumService)]
        })
	        .compileComponents();
        fixture = TestBed.createComponent(AcArcComponent);
        component = fixture.componentInstance;

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
