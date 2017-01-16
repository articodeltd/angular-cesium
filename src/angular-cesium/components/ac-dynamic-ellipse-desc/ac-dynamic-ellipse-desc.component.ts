import {Component} from "@angular/core";
import {CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {LayerService} from "../../services/layer-service/layer-service.service";
import {BasicDesc} from "../../services/basic-desc/basic-desc.service";
import {EllipseDrawerService} from "../../services/ellipse-drawer/ellipse-drawer.service";


@Component({
    selector: 'ac-dynamic-ellipse-desc',
    templateUrl: 'ac-dynamic-ellipse-desc.component.html',
    styleUrls: ['ac-dynamic-ellipse-desc.component.css'],
    providers:[EllipseDrawerService]
})
export class AcDynamicEllipseDescComponent extends BasicDesc {

    constructor(ellipseDrawer: EllipseDrawerService, layerService: LayerService,
                computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
        super(ellipseDrawer, layerService, computationCache, cesiumProperties);
    }
}
