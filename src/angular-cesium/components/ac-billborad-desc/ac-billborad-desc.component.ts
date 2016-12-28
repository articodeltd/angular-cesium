import {Component} from "@angular/core";
import {BasicDesc} from "../../services/basic-desc/basic-desc.service";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";

@Component({
    selector: 'ac-billboard-desc',
    templateUrl: './ac-billborad-desc.component.html',
    styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent extends BasicDesc {

    constructor(billboardDrawer: BillboardDrawerService, layerService: LayerService,
                computationCache: ComputationCache, cesiumProperties: CesiumProperties
    ) {
        super(billboardDrawer, layerService, computationCache, cesiumProperties);
    }
}
