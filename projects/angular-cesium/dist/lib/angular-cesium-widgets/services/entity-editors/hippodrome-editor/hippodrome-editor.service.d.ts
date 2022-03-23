import { Cartesian3 } from 'cesium';
import { MapEventsManagerService } from '../../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Observable } from 'rxjs';
import { CoordinateConverter } from '../../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { CameraService } from '../../../../angular-cesium/services/camera/camera.service';
import { HippodromeEditOptions } from '../../../models/hippodrome-edit-options';
import { HippodromeManagerService } from './hippodrome-manager.service';
import { HippodromeEditorObservable } from '../../../models/hippodrome-editor-oboservable';
import { HippodromeEditUpdate } from '../../../models/hippodrome-edit-update';
import * as i0 from "@angular/core";
export declare const DEFAULT_HIPPODROME_OPTIONS: HippodromeEditOptions;
/**
 * Service for creating editable hippodromes
 *
 * You must provide `HippodromeEditorService` yourself.
 * HippodromeEditorService works together with `<hippodromes-editor>` component. Therefor you need to create `<hippodromes-editor>`
 * for each `PolylineEditorService`, And of course somewhere under `<ac-map>`/
 *
 * + `create` for starting a creation of the shape over the map. Returns a extension of `HippodromeEditorObservable`.
 * + `edit` for editing shape over the map starting from a given positions. Returns an extension of `HippodromeEditorObservable`.
 * + To stop editing call `dsipose()` from the `HippodromeEditorObservable` you get back from `create()` \ `edit()`.
 *
 * **Labels over editted shapes**
 * Angular Cesium allows you to draw labels over a shape that is being edited with one of the editors.
 * To add label drawing logic to your editor use the function `setLabelsRenderFn()` that is defined on the
 * `HippodromeEditorObservable` that is returned from calling `create()` \ `edit()` of one of the editor services.
 * `setLabelsRenderFn()` - receives a callback that is called every time the shape is redrawn
 * (except when the shape is being dragged). The callback is called with the last shape state and with an array of the current labels.
 * The callback should return type `LabelProps[]`.
 * You can also use `updateLabels()` to pass an array of labels of type `LabelProps[]` to be drawn.
 *
 *
 * usage:
 * ```typescript
 *  // Start creating hippodrome
 *  const editing$ = hippodromeEditorService.create();
 *  this.editing$.subscribe(editResult => {
 *				console.log(editResult.positions);
 *		});
 *
 *  // Or edit hippodromes from existing hippodromes cartesian3 positions
 *  const editing$ = this.hippodromeEditor.edit(initialPos);
 *
 * ```
 */
export declare class HippodromeEditorService {
    private mapEventsManager;
    private updateSubject;
    private updatePublisher;
    private coordinateConverter;
    private cameraService;
    private hippodromeManager;
    private observablesMap;
    init(mapEventsManager: MapEventsManagerService, coordinateConverter: CoordinateConverter, cameraService: CameraService, managerService: HippodromeManagerService): void;
    onUpdate(): Observable<HippodromeEditUpdate>;
    create(options?: HippodromeEditOptions, eventPriority?: number): HippodromeEditorObservable;
    edit(positions: Cartesian3[], options?: HippodromeEditOptions, priority?: number): HippodromeEditorObservable;
    private editHippodrome;
    private setOptions;
    private createEditorObservable;
    private getPositions;
    private getPoints;
    private getWidth;
    static ɵfac: i0.ɵɵFactoryDeclaration<HippodromeEditorService, never>;
    static ɵprov: i0.ɵɵInjectableDeclaration<HippodromeEditorService>;
}
