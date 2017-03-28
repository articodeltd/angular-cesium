import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcDynamicEllipseDescComponent } from './ac-dynamic-ellipse-desc.component';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';
import { mock, instance, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';

describe('AcDynamicEllipseDescComponent', () => {
    let component: AcDynamicEllipseDescComponent;
    let fixture: ComponentFixture<AcDynamicEllipseDescComponent>;

    const cesiumService = mock(CesiumService);
    const primitiveCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcDynamicEllipseDescComponent],
            providers: [DynamicEllipseDrawerService,
                        providerFromMock(CesiumService, cesiumService),
                        mockProvider(LayerService),
                        mockProvider(CesiumProperties),
                        mockProvider(ComputationCache)]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AcDynamicEllipseDescComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
