import {Component, OnInit, Input} from '@angular/core';
import {CesiumService} from "../../services/cesium/cesium.service";

@Component({
    selector: 'ac-map-layer-provider',
    templateUrl: 'ac-map-layer-provider.component.html',
    styleUrls: ['ac-map-layer-provider.component.css']
})
export class AcMapLayerProviderComponent implements OnInit {

    @Input()
    url: string;
    @Input()
    layers: string;
    @Input()
    srs: string;
    @Input()
    format: string;

    constructor(private cesiumService: CesiumService) {
        this.createWMSLayer();
    }

    private createWMSLayer() {
        const provider = new Cesium.WebMapServieImageryProvider({
            url: this.url,
            layers: this.layers,
            parameters:{
                transparent: true,
                format: this.format,
                srs: this.srs
            }
        });

        this.cesiumService.getScene().imageryLayers.addImageryProvider(provider);
    }

    ngOnInit() {
    }

}
