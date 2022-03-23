import { Observable } from 'rxjs';
import { Cartesian3 } from 'cesium';
import { Vec2 } from '../../angular-cesium/models/vec2';
import { CoordinateConverter } from '../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapsManagerService } from '../../angular-cesium/services/maps-manager/maps-manager.service';
import * as i0 from "@angular/core";
export interface IconDragEvent {
    initialScreenPosition: Vec2;
    screenPosition: Vec2;
    mapPosition: Cartesian3;
    drop: boolean;
}
/**
 * The Service is used to preform, handle and subscribe to icon dragging when using the `DraggableToMapDirective`.
 * For more info check `DraggableToMapDirective` docs.
 */
export declare class DraggableToMapService {
    private document;
    private mapsManager;
    private coordinateConverter;
    private dragObservable;
    private stopper;
    private mainSubject;
    constructor(document: any, mapsManager: MapsManagerService);
    setCoordinateConverter(coordinateConverter: CoordinateConverter): void;
    drag(imageSrc: string, style?: any): void;
    dragUpdates(): Observable<IconDragEvent>;
    cancel(): void;
    private createDragObservable;
    static ɵfac: i0.ɵɵFactoryDeclaration<DraggableToMapService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<DraggableToMapService>;
}
