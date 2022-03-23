import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This component is used for adding a map provider service to the map (ac-map)
 *  options according to selected map provider MapLayerProviderOptions enum.
 *  additional setting can be done with cesium imageryLayer (exposed as class member)
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayer.html
 *  and: https://cesiumjs.org/Cesium/Build/Documentation/ImageryLayerCollection.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-map-layer-provider [options]="optionsObject" [provider]="myProvider">
 *    </ac-map-layer-provider>
 *  ```
 */
export declare class AcMapLayerProviderComponent implements OnInit, OnChanges, OnDestroy {
    private cesiumService;
    /**
     * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/ImageryProvider.html
     */
    options: {
        url?: string;
    };
    /**
     * the provider
     */
    provider: any;
    /**
     * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
     */
    index: Number;
    /**
     * show (optional) - Determines if the map layer is shown.
     */
    show: boolean;
    /**
     * The alpha blending value of this layer: 0.0 to 1.0
     */
    alpha: number;
    /**
     * The brightness of this layer: 0.0 to 1.0
     */
    brightness: number;
    /**
     * The contrast of this layer: 0.0 to 1.0
     */
    contrast: number;
    imageryLayer: any;
    imageryLayersCollection: any;
    layerProvider: any;
    constructor(cesiumService: CesiumService);
    private createOfflineMapProvider;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcMapLayerProviderComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcMapLayerProviderComponent, "ac-map-layer-provider", never, { "options": "options"; "provider": "provider"; "index": "index"; "show": "show"; "alpha": "alpha"; "brightness": "brightness"; "contrast": "contrast"; }, {}, never, never>;
}
