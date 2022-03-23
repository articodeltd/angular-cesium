import { OnDestroy } from '@angular/core';
import { CesiumService } from '../../../angular-cesium/services/cesium/cesium.service';
import { RectangleEditUpdate } from '../../models/rectangle-edit-update';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { RectanglesManagerService } from '../../services/entity-editors/rectangles-editor/rectangles-manager.service';
import { RectanglesEditorService } from '../../services/entity-editors/rectangles-editor/rectangles-editor.service';
import { LabelProps } from '../../models/label-props';
import { EditableRectangle } from '../../models/editable-rectangle';
import * as i0 from "@angular/core";
export declare class RectanglesEditorComponent implements OnDestroy {
    private rectanglesEditor;
    private coordinateConverter;
    private mapEventsManager;
    private cameraService;
    private rectanglesManager;
    private cesiumService;
    private editLabelsRenderFn;
    editPoints$: Subject<AcNotification>;
    editRectangles$: Subject<AcNotification>;
    private editRectanglesLayer;
    private editPointsLayer;
    constructor(rectanglesEditor: RectanglesEditorService, coordinateConverter: CoordinateConverter, mapEventsManager: MapEventsManagerService, cameraService: CameraService, rectanglesManager: RectanglesManagerService, cesiumService: CesiumService);
    private startListeningToEditorUpdates;
    getLabelId(element: any, index: number): string;
    renderEditLabels(rectangle: EditableRectangle, update: RectangleEditUpdate, labels?: LabelProps[]): void;
    removeEditLabels(rectangle: EditableRectangle): void;
    handleCreateUpdates(update: RectangleEditUpdate): void;
    handleEditUpdates(update: RectangleEditUpdate): void;
    ngOnDestroy(): void;
    getPointSize(point: EditPoint): number;
    getPointShow(point: EditPoint): boolean;
    static ɵfac: i0.ɵɵFactoryDeclaration<RectanglesEditorComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RectanglesEditorComponent, "rectangles-editor", never, {}, {}, never, never>;
}
