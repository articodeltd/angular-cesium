import { Observable } from 'rxjs';
import { Cartesian3 } from 'cesium';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { CircleEditOptions } from '../../../models/circle-edit-options';
import { CircleEditUpdate } from '../../../models/circle-edit-update';
import { CircleEditorObservable } from '../../../models/circle-editor-observable';
import { CirclesManagerService } from './circles-manager.service';
import * as i0 from "@angular/core";
export declare const DEFAULT_CIRCLE_OPTIONS: CircleEditOptions;
/**
 * Service for creating editable circles
 *
 * You must provide `CircleEditorService` yourself.
 * PolygonsEditorService works together with `<circle-editor>` component. Therefor you need to create `<circle-editor>`
 * for each `CircleEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `CircleEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `CircleEditorObservable`.
 * + To stop editing call `dsipose()` from the `CircleEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `CircleEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 * usage:
 * ```typescript
 *  // Start creating circle
 *  const editing$ = circlesEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit circle from existing center point and radius
 *  const editing$ = this.circlesEditorService.edit(center, radius);
 *
 * ```
 */
export declare class CirclesEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private circlesManager;
    private observablesMap;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, circlesManager: CirclesManagerService): void;
    onUpdate(): Observable<CircleEditUpdate>;
    create(options?: CircleEditOptions, priority?: number): CircleEditorObservable;
    edit(center: Cartesian3, radius: number, options?: CircleEditOptions, priority?: number): CircleEditorObservable;
    private editCircle;
    private createEditorObservable;
    private setOptions;
    private getCenterPosition;
    private getCenterPoint;
    private getRadiusPosition;
    private getRadius;
    private getCircleProperties;
    static ɵfac: i0.ɵɵFactoryDeclaration<CirclesEditorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<CirclesEditorService>;
}
