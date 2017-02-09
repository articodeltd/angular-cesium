import {Component, OnInit, Input} from '@angular/core';
import {CesiumService} from "../../services/cesium/cesium.service";
import {MapLayerProviderOptions} from "./enums/map-layer-provider-options.enum";

/**
 *  This component is used for adding a map provider service to the map (ac-map).
 *  The component must be a child of <ac-map>.
 *
 *  __Usage :__
 *  ```
 *    &lt;ac-map-layer-provider options="optionsObject" provider="MapLayerProviderOptions.WebMapService"&gt;
 *    &lt;/ac-map-layer-provider&gt;
 *  ```
 *
 *  @param {Object} options
 *  @param {MapLayerProviderOptions} provider
 */

@Component({
    selector: 'ac-map-layer-provider',
    templateUrl: 'ac-map-layer-provider.component.html',
    styleUrls: ['ac-map-layer-provider.component.css']
})
export class AcMapLayerProviderComponent implements OnInit {

    @Input()
    options: any = {};
    @Input()
    provider: MapLayerProviderOptions = MapLayerProviderOptions.OFFLINE;


    constructor(private cesiumService: CesiumService) {}

    ngOnInit() {
        if(this.options.url === undefined && this.provider !== MapLayerProviderOptions.OFFLINE){
            throw 'options must have a url'
        }

        let provider;

        switch(this.provider){
            case MapLayerProviderOptions.WebMapService:
                provider = this.createWebMapServiceProvider();
                break;
            case MapLayerProviderOptions.WebMapTileService:
                provider = this.createWebMapTileServiceProvider();
                break;
            case MapLayerProviderOptions.ArcGisMapServer:
                provider = this.createArcGisMapServerProvider();
                break;
            case MapLayerProviderOptions.OFFLINE:
            default:
                provider = this.createOfflineMapProvider();
                break;
        }
        this.cesiumService.getScene().imageryLayers.addImageryProvider(provider);
    }

    private createWebMapServiceProvider() {
        return new Cesium.WebMapServiceImageryProvider(this.options);
    }

    private createWebMapTileServiceProvider() {
        return new Cesium.WebMapTileServiceImageryProvider(this.options);
    }

    private createArcGisMapServerProvider(){
        return new Cesium.ArcGisMapServerImageryProvider(this.options);
    }

    private createOfflineMapProvider(){
        return Cesium.createTileMapServiceImageryProvider({
            url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')});
    }
}
