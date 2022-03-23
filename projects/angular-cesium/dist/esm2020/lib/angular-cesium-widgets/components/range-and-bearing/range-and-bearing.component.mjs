import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Color, Cartesian2, Cartesian3 } from 'cesium';
import { EditActions } from '../../models/edit-actions.enum';
import { EditModes } from '../../models/edit-mode.enum';
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/polyline-editor/polylines-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../polylines-editor/polylines-editor.component";
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
export class RangeAndBearingComponent {
    constructor(polylineEditor, coordinateConverter) {
        this.polylineEditor = polylineEditor;
        this.coordinateConverter = coordinateConverter;
        this.lineEditOptions = {};
        this.labelsStyle = {};
        this.distanceLabelsStyle = {};
        this.bearingLabelsStyle = {};
    }
    create({ lineEditOptions = {}, labelsStyle = {}, distanceLabelsStyle = {}, bearingLabelsStyle = {}, bearingStringFn, distanceStringFn, labelsRenderFn, } = { lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {} }) {
        const rnb = this.polylineEditor.create({
            allowDrag: false,
            pointProps: {
                showVirtual: false,
                pixelSize: 8,
            },
            polylineProps: {
                width: 2,
            },
            ...this.lineEditOptions,
            ...lineEditOptions,
        });
        if (labelsRenderFn) {
            rnb.setLabelsRenderFn(labelsRenderFn);
        }
        else if (this.labelsRenderFn) {
            rnb.setLabelsRenderFn(this.labelsRenderFn);
        }
        else {
            rnb.setLabelsRenderFn(update => {
                const positions = update.positions;
                let totalDistance = 0;
                if (!positions || positions.length === 0) {
                    return [];
                }
                return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
                    ? [...positions, update.updatedPosition]
                    : positions).reduce((labels, position, index, array) => {
                    if (index !== 0) {
                        const previousPosition = array[index - 1];
                        const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
                        const distance = Cartesian3.distance(previousPosition, position) / 1000;
                        labels.push({
                            text: (bearingStringFn && bearingStringFn(bearing)) ||
                                (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                                `${bearing.toFixed(2)}°`,
                            scale: 0.2,
                            font: '80px Helvetica',
                            pixelOffset: new Cartesian2(-20, -8),
                            position: new Cartesian3((position.x + previousPosition.x) / 2, (position.y + previousPosition.y) / 2, (position.z + previousPosition.z) / 2),
                            fillColor: Color.WHITE,
                            outlineColor: Color.WHITE,
                            showBackground: true,
                            ...this.labelsStyle,
                            ...labelsStyle,
                            ...this.bearingLabelsStyle,
                            ...bearingLabelsStyle,
                        }, {
                            text: (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                                (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                                `${(totalDistance + distance).toFixed(2)} Km`,
                            scale: 0.2,
                            font: '80px Helvetica',
                            pixelOffset: new Cartesian2(-35, -8),
                            position: position,
                            fillColor: Color.WHITE,
                            outlineColor: Color.WHITE,
                            showBackground: true,
                            ...this.labelsStyle,
                            ...labelsStyle,
                            ...this.distanceLabelsStyle,
                            ...distanceLabelsStyle,
                        });
                        totalDistance += distance;
                    }
                    return labels;
                }, [
                    {
                        text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`,
                        scale: 0.2,
                        font: '80px Helvetica',
                        pixelOffset: new Cartesian2(-20, -8),
                        position: positions[0],
                        fillColor: Color.WHITE,
                        outlineColor: Color.WHITE,
                        showBackground: true,
                        ...this.labelsStyle,
                        ...labelsStyle,
                        ...this.distanceLabelsStyle,
                        ...distanceLabelsStyle,
                    },
                ]);
            });
        }
        return rnb;
    }
}
RangeAndBearingComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RangeAndBearingComponent, deps: [{ token: i1.PolylinesEditorService }, { token: i2.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
RangeAndBearingComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: RangeAndBearingComponent, selector: "range-and-bearing", inputs: { lineEditOptions: "lineEditOptions", labelsStyle: "labelsStyle", distanceLabelsStyle: "distanceLabelsStyle", bearingLabelsStyle: "bearingLabelsStyle", bearingStringFn: "bearingStringFn", distanceStringFn: "distanceStringFn", labelsRenderFn: "labelsRenderFn" }, providers: [PolylinesEditorService], ngImport: i0, template: `
    <polylines-editor></polylines-editor>
  `, isInline: true, components: [{ type: i3.PolylinesEditorComponent, selector: "polylines-editor" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: RangeAndBearingComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'range-and-bearing',
                    template: `
    <polylines-editor></polylines-editor>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [PolylinesEditorService],
                }]
        }], ctorParameters: function () { return [{ type: i1.PolylinesEditorService }, { type: i2.CoordinateConverter }]; }, propDecorators: { lineEditOptions: [{
                type: Input
            }], labelsStyle: [{
                type: Input
            }], distanceLabelsStyle: [{
                type: Input
            }], bearingLabelsStyle: [{
                type: Input
            }], bearingStringFn: [{
                type: Input
            }], distanceStringFn: [{
                type: Input
            }], labelsRenderFn: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvcmFuZ2UtYW5kLWJlYXJpbmcvcmFuZ2UtYW5kLWJlYXJpbmcuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQUUsS0FBSyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQzFFLE9BQU8sRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLFVBQVUsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUV2RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFLN0QsT0FBTyxFQUFFLFNBQVMsRUFBRSxNQUFNLDZCQUE2QixDQUFDO0FBQ3hELE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLHdFQUF3RSxDQUFDOzs7OztBQUVoSDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFTSCxNQUFNLE9BQU8sd0JBQXdCO0lBU25DLFlBQW9CLGNBQXNDLEVBQVUsbUJBQXdDO1FBQXhGLG1CQUFjLEdBQWQsY0FBYyxDQUF3QjtRQUFVLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFSbkcsb0JBQWUsR0FBeUIsRUFBRSxDQUFDO1FBQzNDLGdCQUFXLEdBQWdCLEVBQUUsQ0FBQztRQUM5Qix3QkFBbUIsR0FBZ0IsRUFBRSxDQUFDO1FBQ3RDLHVCQUFrQixHQUFnQixFQUFFLENBQUM7SUFNOUMsQ0FBQztJQUVELE1BQU0sQ0FDSixFQUNFLGVBQWUsR0FBRyxFQUFFLEVBQ3BCLFdBQVcsR0FBRyxFQUFFLEVBQ2hCLG1CQUFtQixHQUFHLEVBQUUsRUFDeEIsa0JBQWtCLEdBQUcsRUFBRSxFQUN2QixlQUFlLEVBQ2YsZ0JBQWdCLEVBQ2hCLGNBQWMsTUFDWSxFQUFDLGVBQWUsRUFBRSxF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RSxJQUFJLFVBQVUsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQzt3QkFDcEMsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ3RCLFNBQVMsRUFBRSxLQUFLLENBQUMsS0FBSzt3QkFDdEIsWUFBWSxFQUFFLEtBQUssQ0FBQyxLQUFLO3dCQUN6QixjQUFjLEVBQUUsSUFBSTt3QkFDcEIsR0FBSSxJQUFJLENBQUMsV0FBbUI7d0JBQzVCLEdBQUksV0FBbUI7d0JBQ3ZCLEdBQUksSUFBSSxDQUFDLG1CQUEyQjt3QkFDcEMsR0FBSSxtQkFBMkI7cUJBQ2hDO2lCQUNGLENBQ0YsQ0FBQztZQUNKLENBQUMsQ0FBQyxDQUFDO1NBQ0o7UUFFRCxPQUFPLEdBQUcsQ0FBQztJQUNiLENBQUM7O3FIQTNIVSx3QkFBd0I7eUdBQXhCLHdCQUF3QiwwVEFGeEIsQ0FBQyxzQkFBc0IsQ0FBQywwQkFKekI7O0dBRVQ7MkZBSVUsd0JBQXdCO2tCQVJwQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxtQkFBbUI7b0JBQzdCLFFBQVEsRUFBRTs7R0FFVDtvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsU0FBUyxFQUFFLENBQUMsc0JBQXNCLENBQUM7aUJBQ3BDOytJQUVVLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csV0FBVztzQkFBbkIsS0FBSztnQkFDRyxtQkFBbUI7c0JBQTNCLEtBQUs7Z0JBQ0csa0JBQWtCO3NCQUExQixLQUFLO2dCQUNHLGVBQWU7c0JBQXZCLEtBQUs7Z0JBQ0csZ0JBQWdCO3NCQUF4QixLQUFLO2dCQUNHLGNBQWM7c0JBQXRCLEtBQUsiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSwgQ29tcG9uZW50LCBJbnB1dCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBDb2xvciwgQ2FydGVzaWFuMiwgQ2FydGVzaWFuMyB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi8uLi9hbmd1bGFyLWNlc2l1bS9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRpdEFjdGlvbnMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1hY3Rpb25zLmVudW0nO1xyXG5pbXBvcnQgeyBQb2x5bGluZUVkaXRvck9ic2VydmFibGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdG9yLW9ic2VydmFibGUnO1xyXG5pbXBvcnQgeyBQb2x5bGluZUVkaXRPcHRpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL3BvbHlsaW5lLWVkaXQtb3B0aW9ucyc7XHJcbmltcG9ydCB7IExhYmVsUHJvcHMsIExhYmVsU3R5bGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvbGFiZWwtcHJvcHMnO1xyXG5pbXBvcnQgeyBQb2x5bGluZUVkaXRVcGRhdGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvcG9seWxpbmUtZWRpdC11cGRhdGUnO1xyXG5pbXBvcnQgeyBFZGl0TW9kZXMgfSBmcm9tICcuLi8uLi9tb2RlbHMvZWRpdC1tb2RlLmVudW0nO1xyXG5pbXBvcnQgeyBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvcG9seWxpbmUtZWRpdG9yL3BvbHlsaW5lcy1lZGl0b3Iuc2VydmljZSc7XHJcblxyXG4vKipcclxuICpcclxuICogUmFuZ2UgYW5kIGJlYXJpbmcgY29tcG9uZW50IHRoYXQgaXMgdXNlZCB0byBkcmF3IHJhbmdlIGFuZCBiZWFyaW5nIG9uIHRoZSBtYXAuXHJcbiAqIFRoZSBpbnB1dHMgYXJlIHVzZWQgdG8gY3VzdG9taXplIHRoZSByYW5nZSBhbmQgYmVhcmluZyBzdHlsZSBhbmQgYmVoYXZpb3IuXHJcbiAqIENyZWF0ZSBjb21wb25lbnQgcmVmZXJlbmNlIGFuZCB1c2UgdGhlIGBjcmVhdGUoKWAgZnVuY3Rpb24gdG8gc3RhcnQgY3JlYXRpbmcgUiZCIG9uIHRoZSBtYXAuXHJcbiAqIFRoZSBmdW5jdGlvbiByZWNlaXZlcyBhbiBvcHRpb25hbCBSYW5nZUFuZEJlYXJpbmdPcHRpb25zIG9iamVjdCB0aGF0IGRlZmluZXMgdGhlIGNyZWF0ZWQgcmFuZ2UgYW5kIGJlYXJpbmcgc3R5bGUgYW5kIGJlaGF2aW9yXHJcbiAqIChvbiB0b3Agb2YgdGhlIGRlZmF1bHQgYW5kIGdsb2JhbCBkZWZpbml0aW9ucykuXHJcbiAqXHJcbiAqIFVzYWdlOlxyXG4gKlxyXG4gKiBteS1jb21wb25lbnQudHM6XHJcbiAqXHJcbiAqIGBgYFxyXG4gKiBcXEBWaWV3Q2hpbGQoJ3JhbmdlQW5kQmVhcmluZycsIHtzdGF0aWM6IGZhbHNlfSkgcHJpdmF0ZSByYW5nZUFuZEJlYXJpbmc6IFJhbmdlQW5kQmVhcmluZ0NvbXBvbmVudDsgLy8gR2V0IFImQiByZWZlcmVuY2VcclxuICogIC8vIC4uLlxyXG4gKiB0aGlzLnJhbmdlQW5kQmVhcmluZy5jcmVhdGUoe3N0eWxlOiB7IHBvaW50UHJvcHM6IHsgcGl4ZWxTaXplOiAxMiB9IH0sIGJlYXJpbmdMYWJlbHNTdHlsZTogeyBmaWxsQ29sb3I6IENvbG9yLkdSRUVOIH0gfSk7XHJcbiAqIGBgYFxyXG4gKlxyXG4gKiBteS1jb21wb25lbnQuaHRtbFxyXG4gKiBgYGBcclxuICogPHJhbmdlLWFuZC1iZWFyaW5nICNyYW5nZUFuZEJlYXJpbmc+PC9yYW5nZS1hbmQtYmVhcmluZz4gLy8gT3B0aW9uYWwgaW5wdXRzIGRlZmluZXMgZ2xvYmFsIHN0eWxlIGFuZCBiZWhhdmlvci5cclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ3JhbmdlLWFuZC1iZWFyaW5nJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPHBvbHlsaW5lcy1lZGl0b3I+PC9wb2x5bGluZXMtZWRpdG9yPlxyXG4gIGAsXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgcHJvdmlkZXJzOiBbUG9seWxpbmVzRWRpdG9yU2VydmljZV0sXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBSYW5nZUFuZEJlYXJpbmdDb21wb25lbnQge1xyXG4gIEBJbnB1dCgpIGxpbmVFZGl0T3B0aW9ucz86IFBvbHlsaW5lRWRpdE9wdGlvbnMgPSB7fTtcclxuICBASW5wdXQoKSBsYWJlbHNTdHlsZT86IExhYmVsU3R5bGUgPSB7fTtcclxuICBASW5wdXQoKSBkaXN0YW5jZUxhYmVsc1N0eWxlPzogTGFiZWxTdHlsZSA9IHt9O1xyXG4gIEBJbnB1dCgpIGJlYXJpbmdMYWJlbHNTdHlsZT86IExhYmVsU3R5bGUgPSB7fTtcclxuICBASW5wdXQoKSBiZWFyaW5nU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGRpc3RhbmNlU3RyaW5nRm4/OiAodmFsdWU6IG51bWJlcikgPT4gc3RyaW5nO1xyXG4gIEBJbnB1dCgpIGxhYmVsc1JlbmRlckZuPzogKHVwZGF0ZTogUG9seWxpbmVFZGl0VXBkYXRlLCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdO1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBvbHlsaW5lRWRpdG9yOiBQb2x5bGluZXNFZGl0b3JTZXJ2aWNlLCBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIpIHtcclxuICB9XHJcblxyXG4gIGNyZWF0ZShcclxuICAgIHtcclxuICAgICAgbGluZUVkaXRPcHRpb25zID0ge30sXHJcbiAgICAgIGxhYmVsc1N0eWxlID0ge30sXHJcbiAgICAgIGRpc3RhbmNlTGFiZWxzU3R5bGUgPSB7fSxcclxuICAgICAgYmVhcmluZ0xhYmVsc1N0eWxlID0ge30sXHJcbiAgICAgIGJlYXJpbmdTdHJpbmdGbixcclxuICAgICAgZGlzdGFuY2VTdHJpbmdGbixcclxuICAgICAgbGFiZWxzUmVuZGVyRm4sXHJcbiAgICB9OiBSYW5nZUFuZEJlYXJpbmdPcHRpb25zID0ge2xpbmVFZGl0T3B0aW9uczoge30sIGxhYmVsc1N0eWxlOiB7fSwgZGlzdGFuY2VMYWJlbHNTdHlsZToge30sIGJlYXJpbmdMYWJlbHNTdHlsZToge319LFxyXG4gICk6IFBvbHlsaW5lRWRpdG9yT2JzZXJ2YWJsZSB7XHJcbiAgICBjb25zdCBybmIgPSB0aGlzLnBvbHlsaW5lRWRpdG9yLmNyZWF0ZSh7XHJcbiAgICAgIGFsbG93RHJhZzogZmFsc2UsXHJcbiAgICAgIHBvaW50UHJvcHM6IHtcclxuICAgICAgICBzaG93VmlydHVhbDogZmFsc2UsXHJcbiAgICAgICAgcGl4ZWxTaXplOiA4LFxyXG4gICAgICB9LFxyXG4gICAgICBwb2x5bGluZVByb3BzOiB7XHJcbiAgICAgICAgd2lkdGg6IDIsXHJcbiAgICAgIH0sXHJcbiAgICAgIC4uLnRoaXMubGluZUVkaXRPcHRpb25zLFxyXG4gICAgICAuLi5saW5lRWRpdE9wdGlvbnMsXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZiAobGFiZWxzUmVuZGVyRm4pIHtcclxuICAgICAgcm5iLnNldExhYmVsc1JlbmRlckZuKGxhYmVsc1JlbmRlckZuKTtcclxuICAgIH0gZWxzZSBpZiAodGhpcy5sYWJlbHNSZW5kZXJGbikge1xyXG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4odGhpcy5sYWJlbHNSZW5kZXJGbik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBybmIuc2V0TGFiZWxzUmVuZGVyRm4odXBkYXRlID0+IHtcclxuICAgICAgICBjb25zdCBwb3NpdGlvbnMgPSB1cGRhdGUucG9zaXRpb25zO1xyXG4gICAgICAgIGxldCB0b3RhbERpc3RhbmNlID0gMDtcclxuICAgICAgICBpZiAoIXBvc2l0aW9ucyB8fCBwb3NpdGlvbnMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICByZXR1cm4gW107XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFICYmIHVwZGF0ZS5lZGl0QWN0aW9uICE9PSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVFxyXG4gICAgICAgICAgICA/IFsuLi5wb3NpdGlvbnMsIHVwZGF0ZS51cGRhdGVkUG9zaXRpb25dXHJcbiAgICAgICAgICAgIDogcG9zaXRpb25zXHJcbiAgICAgICAgKS5yZWR1Y2UoXHJcbiAgICAgICAgICAobGFiZWxzLCBwb3NpdGlvbiwgaW5kZXgsIGFycmF5KSA9PiB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCAhPT0gMCkge1xyXG4gICAgICAgICAgICAgIGNvbnN0IHByZXZpb3VzUG9zaXRpb24gPSBhcnJheVtpbmRleCAtIDFdO1xyXG4gICAgICAgICAgICAgIGNvbnN0IGJlYXJpbmcgPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuYmVhcmluZ1RvQ2FydGVzaWFuKHByZXZpb3VzUG9zaXRpb24sIHBvc2l0aW9uKTtcclxuICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZSA9IENhcnRlc2lhbjMuZGlzdGFuY2UocHJldmlvdXNQb3NpdGlvbiwgcG9zaXRpb24pIC8gMTAwMDtcclxuICAgICAgICAgICAgICBsYWJlbHMucHVzaChcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgdGV4dDpcclxuICAgICAgICAgICAgICAgICAgICAoYmVhcmluZ1N0cmluZ0ZuICYmIGJlYXJpbmdTdHJpbmdGbihiZWFyaW5nKSkgfHxcclxuICAgICAgICAgICAgICAgICAgICAodGhpcy5iZWFyaW5nU3RyaW5nRm4gJiYgdGhpcy5iZWFyaW5nU3RyaW5nRm4oYmVhcmluZykpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgYCR7YmVhcmluZy50b0ZpeGVkKDIpfcKwYCxcclxuICAgICAgICAgICAgICAgICAgc2NhbGU6IDAuMixcclxuICAgICAgICAgICAgICAgICAgZm9udDogJzgwcHggSGVsdmV0aWNhJyxcclxuICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBDYXJ0ZXNpYW4yKC0yMCwgLTgpLFxyXG4gICAgICAgICAgICAgICAgICBwb3NpdGlvbjogbmV3IENhcnRlc2lhbjMoXHJcbiAgICAgICAgICAgICAgICAgICAgKHBvc2l0aW9uLnggKyBwcmV2aW91c1Bvc2l0aW9uLngpIC8gMixcclxuICAgICAgICAgICAgICAgICAgICAocG9zaXRpb24ueSArIHByZXZpb3VzUG9zaXRpb24ueSkgLyAyLFxyXG4gICAgICAgICAgICAgICAgICAgIChwb3NpdGlvbi56ICsgcHJldmlvdXNQb3NpdGlvbi56KSAvIDIsXHJcbiAgICAgICAgICAgICAgICAgICksXHJcbiAgICAgICAgICAgICAgICAgIGZpbGxDb2xvcjogQ29sb3IuV0hJVEUsXHJcbiAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogQ29sb3IuV0hJVEUsXHJcbiAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5sYWJlbHNTdHlsZSBhcyBhbnkpLFxyXG4gICAgICAgICAgICAgICAgICAuLi4obGFiZWxzU3R5bGUgYXMgYW55KSxcclxuICAgICAgICAgICAgICAgICAgLi4uKHRoaXMuYmVhcmluZ0xhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgICAgIC4uLihiZWFyaW5nTGFiZWxzU3R5bGUgYXMgYW55KSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgIHRleHQ6XHJcbiAgICAgICAgICAgICAgICAgICAgKGRpc3RhbmNlU3RyaW5nRm4gJiYgZGlzdGFuY2VTdHJpbmdGbih0b3RhbERpc3RhbmNlICsgZGlzdGFuY2UpKSB8fFxyXG4gICAgICAgICAgICAgICAgICAgICh0aGlzLmRpc3RhbmNlU3RyaW5nRm4gJiYgdGhpcy5kaXN0YW5jZVN0cmluZ0ZuKHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkpIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgYCR7KHRvdGFsRGlzdGFuY2UgKyBkaXN0YW5jZSkudG9GaXhlZCgyKX0gS21gLFxyXG4gICAgICAgICAgICAgICAgICBzY2FsZTogMC4yLFxyXG4gICAgICAgICAgICAgICAgICBmb250OiAnODBweCBIZWx2ZXRpY2EnLFxyXG4gICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldDogbmV3IENhcnRlc2lhbjIoLTM1LCAtOCksXHJcbiAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgZmlsbENvbG9yOiBDb2xvci5XSElURSxcclxuICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBDb2xvci5XSElURSxcclxuICAgICAgICAgICAgICAgICAgc2hvd0JhY2tncm91bmQ6IHRydWUsXHJcbiAgICAgICAgICAgICAgICAgIC4uLih0aGlzLmxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgICAgIC4uLihsYWJlbHNTdHlsZSBhcyBhbnkpLFxyXG4gICAgICAgICAgICAgICAgICAuLi4odGhpcy5kaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgICAgIC4uLihkaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICk7XHJcblxyXG4gICAgICAgICAgICAgIHRvdGFsRGlzdGFuY2UgKz0gZGlzdGFuY2U7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHJldHVybiBsYWJlbHM7XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgdGV4dDogKGRpc3RhbmNlU3RyaW5nRm4gJiYgZGlzdGFuY2VTdHJpbmdGbigwKSkgfHwgKHRoaXMuZGlzdGFuY2VTdHJpbmdGbiAmJiB0aGlzLmRpc3RhbmNlU3RyaW5nRm4oMCkpIHx8IGAwIEttYCxcclxuICAgICAgICAgICAgICBzY2FsZTogMC4yLFxyXG4gICAgICAgICAgICAgIGZvbnQ6ICc4MHB4IEhlbHZldGljYScsXHJcbiAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IG5ldyBDYXJ0ZXNpYW4yKC0yMCwgLTgpLFxyXG4gICAgICAgICAgICAgIHBvc2l0aW9uOiBwb3NpdGlvbnNbMF0sXHJcbiAgICAgICAgICAgICAgZmlsbENvbG9yOiBDb2xvci5XSElURSxcclxuICAgICAgICAgICAgICBvdXRsaW5lQ29sb3I6IENvbG9yLldISVRFLFxyXG4gICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiB0cnVlLFxyXG4gICAgICAgICAgICAgIC4uLih0aGlzLmxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgLi4uKGxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgICAgLi4uKHRoaXMuZGlzdGFuY2VMYWJlbHNTdHlsZSBhcyBhbnkpLFxyXG4gICAgICAgICAgICAgIC4uLihkaXN0YW5jZUxhYmVsc1N0eWxlIGFzIGFueSksXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICBdLFxyXG4gICAgICAgICk7XHJcbiAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiBybmI7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgaW50ZXJmYWNlIFJhbmdlQW5kQmVhcmluZ09wdGlvbnMge1xyXG4gIGxpbmVFZGl0T3B0aW9ucz86IFBvbHlsaW5lRWRpdE9wdGlvbnM7XHJcbiAgbGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlO1xyXG4gIGRpc3RhbmNlTGFiZWxzU3R5bGU/OiBMYWJlbFN0eWxlO1xyXG4gIGJlYXJpbmdMYWJlbHNTdHlsZT86IExhYmVsU3R5bGU7XHJcbiAgYmVhcmluZ1N0cmluZ0ZuPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcclxuICBkaXN0YW5jZVN0cmluZ0ZuPzogKHZhbHVlOiBudW1iZXIpID0+IHN0cmluZztcclxuICBsYWJlbHNSZW5kZXJGbj86ICh1cGRhdGU6IFBvbHlsaW5lRWRpdFVwZGF0ZSwgbGFiZWxzOiBMYWJlbFByb3BzW10pID0+IExhYmVsUHJvcHNbXTtcclxufVxyXG4iXX0=