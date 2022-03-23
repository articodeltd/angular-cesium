import { Cartesian3 } from 'cesium';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { PointsManagerService } from './points-manager.service';
import { CesiumService } from '../../../../angular-cesium';
import { PointEditOptions } from '../../../models/point-edit-options';
import { PointEditUpdate } from '../../../models/point-edit-update';
import { PointEditorObservable } from '../../../models/point-editor-observable';
import * as i0 from "@angular/core";
export declare const DEFAULT_POINT_OPTIONS: PointEditOptions;
/**
 * Service for creating editable point
 *
 *  * You must provide `PointsEditorService` yourself.
 * PolygonsEditorService works together with `<points-editor>` component. Therefor you need to create `<points-editor>`
 * for each `PointsEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `PointEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `PointEditorObservable`.
 * + To stop editing call `dsipose()` from the `PointEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `PointEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating point
 *  const editing$ = pointEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit point from existing point cartesian3 positions
 *  const editing$ = this.pointEditor.edit(initialPos);
 *
 * ```
 */
export declare class PointsEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private pointManager;
    private observablesMap;
    private cesiumScene;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, pointManager: PointsManagerService, cesiumViewer: CesiumService): void;
    onUpdate(): Observable<PointEditUpdate>;
    private screenToPosition;
    create(options?: PointEditOptions, eventPriority?: number): PointEditorObservable;
    private switchToEditMode;
    edit(position: Cartesian3, options?: PointEditOptions, priority?: number): PointEditorObservable;
    private editPoint;
    private setOptions;
    private createEditorObservable;
    private getPosition;
    private getPoint;
    static ɵfac: i0.ɵɵFactoryDeclaration<PointsEditorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<PointsEditorService>;
}
