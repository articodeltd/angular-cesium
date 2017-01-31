import {async, ComponentFixture, TestBed} from "@angular/core/testing";
import {AcDynamicEllipseDescComponent} from "./ac-dynamic-ellipse-desc.component";
import {DynamicEllipseDrawerService} from "../../services/ellipse-drawer/dynamic-ellipse-drawer.service";
import {mock, instance, when, anything} from "ts-mockito";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";
import {CesiumService} from "../../services/cesium/cesium.service";

describe('AcDynamicEllipseDescComponent', () => {
    let component: AcDynamicEllipseDescComponent;
    let fixture: ComponentFixture<AcDynamicEllipseDescComponent>;

    const layerService = mock(LayerService);
    const computationCache = mock(ComputationCache);
    const cesiumProperties = mock(CesiumProperties);
    const cesiumService = mock(CesiumService);
    const primitiveCollection = mock(Cesium.PrimitiveCollection);

    when(cesiumService.getScene()).thenReturn({primitives: instance(primitiveCollection)});

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AcDynamicEllipseDescComponent],
            providers: [DynamicEllipseDrawerService,
                        {provide: CesiumService, useValue: instance(cesiumService)},
                        {provide: LayerService, useValue: instance(layerService)},
                        {provide: CesiumProperties, useValue: instance(cesiumProperties)},
                        {provide: ComputationCache, useValue: instance(computationCache)}]
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
