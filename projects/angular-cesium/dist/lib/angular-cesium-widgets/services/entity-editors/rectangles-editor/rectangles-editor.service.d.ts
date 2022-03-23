import { Cartesian3 } from 'cesium';
import { CesiumService } from '../../../../angular-cesium/services/cesium/cesium.service';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { RectangleEditUpdate } from '../../../models/rectangle-edit-update';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { RectanglesManagerService } from './rectangles-manager.service';
import { RectangleEditorObservable } from '../../../models/rectangle-editor-observable';
import { RectangleEditOptions } from '../../../models/rectangle-edit-options';
import * as i0 from "@angular/core";
export declare const DEFAULT_RECTANGLE_OPTIONS: RectangleEditOptions;
/**
 * Service for creating editable rectangles
 *
 * You must provide `RectanglesEditorService` yourself.
 * RectanglesEditorService works together with `<rectangles-editor>` component. Therefor you need to create `<rectangles-editor>`
 * for each `RectanglesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `RectangleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `RectangleEditorObservable`.
 * + To stop editing call `dsipose()` from the `RectangleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `RectangleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating rectangle
 *  const editing$ = rectanglesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit rectangle from existing rectangle positions
 *  const editing$ = this.rectanglesEditorService.edit(initialPos);
 *
 * ```
 */
export declare class RectanglesEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private rectanglesManager;
    private observablesMap;
    private cesiumScene;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, rectanglesManager: RectanglesManagerService, cesiumViewer: CesiumService): void;
    onUpdate(): Observable<RectangleEditUpdate>;
    create(options?: RectangleEditOptions, priority?: number): RectangleEditorObservable;
    edit(positions: Cartesian3[], options?: RectangleEditOptions, priority?: number): RectangleEditorObservable;
    private editRectangle;
    private setOptions;
    private createEditorObservable;
    private getPositions;
    private getPoints;
    static ɵfac: i0.ɵɵFactoryDeclaration<RectanglesEditorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<RectanglesEditorService>;
}
