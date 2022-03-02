import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Color, Cartesian2, Cartesian3 } from 'cesium';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { EditActions } from '../../models/edit-actions.enum';
import { PolylineEditorObservable } from '../../models/polyline-editor-observable';
import { PolylineEditOptions } from '../../models/polyline-edit-options';
import { LabelProps, LabelStyle } from '../../models/label-props';
import { PolylineEditUpdate } from '../../models/polyline-edit-update';
import { EditModes } from '../../models/edit-mode.enum';
import { PolylinesEditorService } from '../../services/entity-editors/polyline-editor/polylines-editor.service';

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
@Component({
  selector: 'range-and-bearing',
  template: `
    <polylines-editor></polylines-editor>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [PolylinesEditorService],
})
export class RangeAndBearingComponent {
  @Input() lineEditOptions?: PolylineEditOptions = {};
  @Input() labelsStyle?: LabelStyle = {};
  @Input() distanceLabelsStyle?: LabelStyle = {};
  @Input() bearingLabelsStyle?: LabelStyle = {};
  @Input() bearingStringFn?: (value: number) => string;
  @Input() distanceStringFn?: (value: number) => string;
  @Input() labelsRenderFn?: (update: PolylineEditUpdate, labels: LabelProps[]) => LabelProps[];

  constructor(private polylineEditor: PolylinesEditorService, private coordinateConverter: CoordinateConverter) {
  }

  create(
    {
      lineEditOptions = {},
      labelsStyle = {},
      distanceLabelsStyle = {},
      bearingLabelsStyle = {},
      bearingStringFn,
      distanceStringFn,
      labelsRenderFn,
    }: RangeAndBearingOptions = {lineEditOptions: {}, labelsStyle: {}, distanceLabelsStyle: {}, bearingLabelsStyle: {}},
  ): PolylineEditorObservable {
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
    } else if (this.labelsRenderFn) {
      rnb.setLabelsRenderFn(this.labelsRenderFn);
    } else {
      rnb.setLabelsRenderFn(update => {
        const positions = update.positions;
        let totalDistance = 0;
        if (!positions || positions.length === 0) {
          return [];
        }
        return (update.editMode === EditModes.CREATE && update.editAction !== EditActions.ADD_LAST_POINT
            ? [...positions, update.updatedPosition]
            : positions
        ).reduce(
          (labels, position, index, array) => {
            if (index !== 0) {
              const previousPosition = array[index - 1];
              const bearing = this.coordinateConverter.bearingToCartesian(previousPosition, position);
              const distance = Cartesian3.distance(previousPosition, position) / 1000;
              labels.push(
                {
                  text:
                    (bearingStringFn && bearingStringFn(bearing)) ||
                    (this.bearingStringFn && this.bearingStringFn(bearing)) ||
                    `${bearing.toFixed(2)}°`,
                  scale: 0.2,
                  font: '80px Helvetica',
                  pixelOffset: new Cartesian2(-20, -8),
                  position: new Cartesian3(
                    (position.x + previousPosition.x) / 2,
                    (position.y + previousPosition.y) / 2,
                    (position.z + previousPosition.z) / 2,
                  ),
                  fillColor: Color.WHITE,
                  outlineColor: Color.WHITE,
                  showBackground: true,
                  ...(this.labelsStyle as any),
                  ...(labelsStyle as any),
                  ...(this.bearingLabelsStyle as any),
                  ...(bearingLabelsStyle as any),
                },
                {
                  text:
                    (distanceStringFn && distanceStringFn(totalDistance + distance)) ||
                    (this.distanceStringFn && this.distanceStringFn(totalDistance + distance)) ||
                    `${(totalDistance + distance).toFixed(2)} Km`,
                  scale: 0.2,
                  font: '80px Helvetica',
                  pixelOffset: new Cartesian2(-35, -8),
                  position: position,
                  fillColor: Color.WHITE,
                  outlineColor: Color.WHITE,
                  showBackground: true,
                  ...(this.labelsStyle as any),
                  ...(labelsStyle as any),
                  ...(this.distanceLabelsStyle as any),
                  ...(distanceLabelsStyle as any),
                },
              );

              totalDistance += distance;
            }

            return labels;
          },
          [
            {
              text: (distanceStringFn && distanceStringFn(0)) || (this.distanceStringFn && this.distanceStringFn(0)) || `0 Km`,
              scale: 0.2,
              font: '80px Helvetica',
              pixelOffset: new Cartesian2(-20, -8),
              position: positions[0],
              fillColor: Color.WHITE,
              outlineColor: Color.WHITE,
              showBackground: true,
              ...(this.labelsStyle as any),
              ...(labelsStyle as any),
              ...(this.distanceLabelsStyle as any),
              ...(distanceLabelsStyle as any),
            },
          ],
        );
      });
    }

    return rnb;
  }
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
