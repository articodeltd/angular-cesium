import {Component, OnInit} from "@angular/core";
import {Parse} from "../angular2-parse/src/services/parse/parse.service";
import {WebSocketSupplier} from "../utils/services/webSocketSupplier/webSocketSupplier";
import {MapLayerProviderOptions} from "../angular-cesium/components/ac-map-layer-provider/enums/map-layer-provider-options.enum";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    providers: [Parse, WebSocketSupplier]
})

export class AppComponent implements OnInit {
    options;
    provider;
    constructor() {
        this.options = {
            url : 'http://sedac.ciesin.columbia.edu/geoserver/wms',
            layers : 'gpw-v3:gpw-v3-population-density_2000',
            parameters:{
                format: 'image/png'
            }
        };

        this.provider = MapLayerProviderOptions.WebMapService;

    }

    ngOnInit() {}
}
