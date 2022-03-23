import { CesiumService } from '../cesium/cesium.service';
import * as i0 from "@angular/core";
export declare class MapLayersService {
    private cesiumService;
    private layersDataSources;
    constructor(cesiumService: CesiumService);
    registerLayerDataSources(dataSources: any[], zIndex: number): void;
    drawAllLayers(): void;
    updateAndRefresh(dataSources: any[], newZIndex: number): void;
    removeDataSources(dataSources: any[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapLayersService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapLayersService>;
}
