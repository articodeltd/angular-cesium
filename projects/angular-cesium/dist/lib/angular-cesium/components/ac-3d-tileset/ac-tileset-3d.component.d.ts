import { OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import * as i0 from "@angular/core";
/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
export declare class AcTileset3dComponent implements OnInit, OnChanges, OnDestroy {
    private cesiumService;
    /**
     * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
     */
    options: {
        url: any;
    };
    /**
     * index (optional) - The index to add the layer at. If omitted, the layer will added on top of all existing layers.
     */
    index: Number;
    /**
     * show (optional) - Determines if the map layer is shown.
     */
    show: boolean;
    /**
     * show (optional) - Sets 3Dtiles style.
     */
    style: any;
    tilesetInstance: any;
    private _3dtilesCollection;
    constructor(cesiumService: CesiumService);
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcTileset3dComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcTileset3dComponent, "ac-3d-tile-layer", never, { "options": "options"; "index": "index"; "show": "show"; "style": "style"; }, {}, never, never>;
}
