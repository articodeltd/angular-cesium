import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AcDynamicCircleDescComponent } from './ac-dynamic-circle-desc.component';
import { mock, instance, when } from 'ts-mockito';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { CesiumService } from '../../services/cesium/cesium.service';
import { mockProvider, providerFromMock } from '../../utils/testingUtils';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';

describe('AcDynamicCircleDescComponent', () => {
    let component: AcDynamicCircleDescComponent;
    let fixture: ComponentFixture<AcDynamicCircleDescComponent>;

    const cesiumService = mock(CesiumService);
    const primitiveCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcDynamicCircleDescComponent],
            providers: [DynamicEllipseDrawerService,
                        providerFromMock(CesiumService, cesiumService),
                        mockProvider(LayerService),
                        mockProvider(CesiumProperties),
                        mockProvider(ComputationCache)]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AcDynamicCircleDescComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
