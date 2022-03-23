import { Cartesian3 } from 'cesium';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { EllipseEditUpdate } from '../../../models/ellipse-edit-update';
import { EllipsesManagerService } from './ellipses-manager.service';
import { EllipseEditorObservable } from '../../../models/ellipse-editor-observable';
import { EllipseEditOptions } from '../../../models/ellipse-edit-options';
import { CesiumService } from '../../../../angular-cesium';
import * as i0 from "@angular/core";
export declare const DEFAULT_ELLIPSE_OPTIONS: EllipseEditOptions;
/**
 * Service for creating editable ellipses
 *
 * You must provide `EllipsesEditorService` yourself.
 * EllipsesEditorService works together with `<ellipse-editor>` component. Therefor you need to create `<ellipse-editor>`
 * for each `EllipsesEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `EllipseEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `EllipseEditorObservable`.
 * + To stop editing call `dispose()` from the `EllipseEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over edited shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `EllipseEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating ellipse
 *  const editing$ = ellipsesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit ellipse from existing center point, two radiuses and rotation
 *  const editing$ = this.ellipsesEditorService.edit(center, majorRadius, rotation, minorRadius);
 *
 * ```
 */
export declare class EllipsesEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private ellipsesManager;
    private observablesMap;
    private cesiumScene;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, ellipsesManager: EllipsesManagerService, cesiumViewer: CesiumService): void;
    onUpdate(): Observable<EllipseEditUpdate>;
    create(options?: EllipseEditOptions, priority?: number): EllipseEditorObservable;
    edit(center: Cartesian3, majorRadius: number, rotation?: number, minorRadius?: number, options?: EllipseEditOptions, priority?: number): EllipseEditorObservable;
    private editEllipse;
    private createEditorObservable;
    private setOptions;
    private getCenterPosition;
    private getCenterPoint;
    private getMajorRadius;
    private getMinorRadius;
    private getEllipseProperties;
    static ɵfac: i0.ɵɵFactoryDeclaration<EllipsesEditorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<EllipsesEditorService>;
}
