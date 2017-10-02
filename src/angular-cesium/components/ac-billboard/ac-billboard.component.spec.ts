import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { mock, instance, when } from 'ts-mockito';
import { CesiumService } from '../../services/cesium/cesium.service';
import { providerFromMock } from '../../utils/testingUtils';
import { AcBillboardComponent } from './ac-billboard.component';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';

describe('AcBillboardComponent', () => {
    let component: AcBillboardComponent;
    let fixture: ComponentFixture<AcBillboardComponent>;

    const cesiumService = mock(CesiumService);
    const billboardCollection = mock(Cesium.BillboardCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(billboardCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcBillboardComponent],
            providers: [BillboardDrawerService,
                providerFromMock(CesiumService, cesiumService)]
        })
	        .compileComponents();
        fixture = TestBed.createComponent(AcBillboardComponent);
        component = fixture.componentInstance;

    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
