import { AcMapComponent } from '../../components/ac-map/ac-map.component';
import * as i0 from "@angular/core";
/**
 *  The service manages `ac-map` instances. `ac-map` register itself to this service.
 *  This allows retrieval of maps provided services outside of `ac-map` scope.
 */
export declare class MapsManagerService {
    private defaultIdCounter;
    private _Maps;
    private firstMap;
    private eventRemoveCallbacks;
    constructor();
    getMap(id?: string): AcMapComponent | undefined;
    _registerMap(id: string, acMap: AcMapComponent): string;
    _removeMapById(id: string): boolean;
    private generateDefaultId;
    /**
     * Binds multiple 2D map's cameras together.
     * @param mapsConfiguration - binding options.
     * mapId - the id of the maps to bind.
     * sensitivity - the amount the camera position should change in order to sync other maps.
     * bindZoom - should bind zoom level
     */
    sync2DMapsCameras(mapsConfiguration: {
        id: string;
        sensitivity?: number;
        bindZoom?: boolean;
    }[]): void;
    /**
     * Unsyncs maps cameras
     */
    unsyncMapsCameras(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<MapsManagerService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MapsManagerService>;
}
