import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { PolylineEditorObservable } from '../../models/polyline-editor-observable';
import { PolylineEditOptions } from '../../models/polyline-edit-options';
import { LabelProps, LabelStyle } from '../../models/label-props';
import { PolylineEditUpdate } from '../../models/polyline-edit-update';
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';
import * as i0 from "@angular/core";
/**
 *
 * Range and bearing component that is used to draw range and bearing on the map.
 * The inputs are used to customize the range and bearing style and behavior.
 * Create component reference and use the `create()` function to start creating R&B on the map.
 * The function receives an optional RangeAndBearingOptions object that defines the created range and bearing style and behavior
 * (on top of the default and global definitions).
 *
 * Usage:
 *
 * my-component.ts:
 *
 * ```
 * \@ViewChild('rangeAndBearing', {static: false}) private rangeAndBearing: RangeAndBearingComponent; // Get R&B reference
 *  // ...
 * this.rangeAndBearing.create({style: { pointProps: { pixelSize: 12 } }, bearingLabelsStyle: { fillColor: Color.GREEN } });
 * ```
 *
 * my-component.html
 * ```
 * <range-and-bearing #rangeAndBearing></range-and-bearing> // Optional inputs defines global style and behavior.
 * ```
 *
 */
export declare class RangeAndBearingComponent {
    private polylineEditor;
    private coordinateConverter;
    lineEditOptions?: PolylineEditOptions;
    labelsStyle?: LabelStyle;
    distanceLabelsStyle?: LabelStyle;
    bearingLabelsStyle?: LabelStyle;
    bearingStringFn?: (value: number) => string;
    distanceStringFn?: (value: number) => string;
    labelsRenderFn?: (update: PolylineEditUpdate, labels: LabelProps[]) => LabelProps[];
    constructor(polylineEditor: PolylinesEditorService, coordinateConverter: CoordinateConverter);
    create({ lineEditOptions, labelsStyle, distanceLabelsStyle, bearingLabelsStyle, bearingStringFn, distanceStringFn, labelsRenderFn, }?: RangeAndBearingOptions): PolylineEditorObservable;
    static ɵfac: i0.ɵɵFactoryDeclaration<RangeAndBearingComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<RangeAndBearingComponent, "range-and-bearing", never, { "lineEditOptions": "lineEditOptions"; "labelsStyle": "labelsStyle"; "distanceLabelsStyle": "distanceLabelsStyle"; "bearingLabelsStyle": "bearingLabelsStyle"; "bearingStringFn": "bearingStringFn"; "distanceStringFn": "distanceStringFn"; "labelsRenderFn": "labelsRenderFn"; }, {}, never, never>;
}
export interface RangeAndBearingOptions {
    lineEditOptions?: PolylineEditOptions;
    labelsStyle?: LabelStyle;
    distanceLabelsStyle?: LabelStyle;
    bearingLabelsStyle?: LabelStyle;
    bearingStringFn?: (value: number) => string;
    distanceStringFn?: (value: number) => string;
    labelsRenderFn?: (update: PolylineEditUpdate, labels: LabelProps[]) => LabelProps[];
}
