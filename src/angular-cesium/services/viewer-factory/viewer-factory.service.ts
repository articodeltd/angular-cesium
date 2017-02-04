import {Injectable} from "@angular/core";

@Injectable()
export class ViewerFactory {
    cesium: any;

    constructor() {
        this.cesium = Cesium;
    }

    /**
     * Creates a viewer with default options
     * @param mapContainer - container to initialize the viewer on
     * @returns {any} new viewer
     */
    createViewer(mapContainer: HTMLElement) {
        window['CESIUM_BASE_URL'] = './assets/Cesium';
        return new this.cesium.Viewer(mapContainer,
            {
                // Poor internet connection - use default globe image, TODO: should be removed
                imageryProvider: Cesium.createTileMapServiceImageryProvider({
                    url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII')
                }),
                baseLayerPicker: false,
                geocoder: false
            });
    }

    /**
     * Creates a viewer with the received options
     * @param mapContainer - container to initialize the viewer on
     * @param options - Options to create the viewer with
     * @returns {any} new viewer
     */
    createViewerWithOptions(mapContainer: HTMLElement, options: any) {
        window['CESIUM_BASE_URL'] = './assets/Cesium';
        return new this.cesium.Viewer(mapContainer, options);
    }
}