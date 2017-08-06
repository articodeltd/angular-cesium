import {Component, OnInit} from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';

@Component({
    selector: 'ac-polygon-desc',
    template: ''
})
export class AcPolygonDescComponent extends BasicDesc implements OnInit {

    constructor(polygonDrawer: PolygonDrawerService, layerService: LayerService,
                computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
        super(polygonDrawer, layerService, computationCache, cesiumProperties);
    }
}
