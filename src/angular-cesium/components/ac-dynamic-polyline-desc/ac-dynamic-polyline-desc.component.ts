import {Component} from "@angular/core";
import {BasicDesc} from "../../services/basic-desc/basic-desc.service";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {PolylineDynamicDrawerService} from "../../services/dynamic-polyline-drawer/dynamic-polyline-drawer.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";

@Component({
    selector: 'ac-dynamic-polyline-desc',
    templateUrl: './ac-dynamic-polyline-desc.component.html',
    styleUrls: ['./ac-dynamic-polyline-desc.component.css']
})
export class AcDynamicPolylineDescComponent extends BasicDesc {

    constructor(polylineDynamicDrawer: PolylineDynamicDrawerService, layerService: LayerService,
                computationCache: ComputationCache, cesiumProperties: CesiumProperties
    ) {
        super(polylineDynamicDrawer, layerService, computationCache, cesiumProperties);
    }
}
