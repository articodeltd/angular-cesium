import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { EditActions } from '../../models/edit-actions.enum';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { Subject } from 'rxjs';
import { EllipsesManagerService } from '../../services/entity-editors/ellipses-editor/ellipses-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/entity-editors/ellipses-editor/ellipses-editor.service";
import * as i2 from "../../../angular-cesium/services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../../../angular-cesium/services/map-events-mananger/map-events-manager";
import * as i4 from "../../../angular-cesium/services/camera/camera.service";
import * as i5 from "../../services/entity-editors/ellipses-editor/ellipses-manager.service";
import * as i6 from "../../../angular-cesium/services/cesium/cesium.service";
import * as i7 from "../../../angular-cesium/components/ac-layer/ac-layer.component";
import * as i8 from "../../../angular-cesium/components/ac-point-desc/ac-point-desc.component";
import * as i9 from "../../../angular-cesium/components/ac-ellipse-desc/ac-ellipse-desc.component";
import * as i10 from "../../../angular-cesium/components/ac-array-desc/ac-array-desc.component";
import * as i11 from "../../../angular-cesium/components/ac-label-primitive-desc/ac-label-primitive-desc.component";
export class EllipsesEditorComponent {
    constructor(ellipsesEditor, coordinateConverter, mapEventsManager, cameraService, ellipsesManager, cesiumService) {
        this.ellipsesEditor = ellipsesEditor;
        this.coordinateConverter = coordinateConverter;
        this.mapEventsManager = mapEventsManager;
        this.cameraService = cameraService;
        this.ellipsesManager = ellipsesManager;
        this.cesiumService = cesiumService;
        this.editPoints$ = new Subject();
        this.editEllipses$ = new Subject();
        this.ellipsesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.ellipsesManager, this.cesiumService);
        this.startListeningToEditorUpdates();
    }
    startListeningToEditorUpdates() {
        this.ellipsesEditor.onUpdate().subscribe(update => {
            if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
                this.handleCreateUpdates(update);
            }
            else if (update.editMode === EditModes.EDIT) {
                this.handleEditUpdates(update);
            }
        });
    }
    getLabelId(element, index) {
        return index.toString();
    }
    renderEditLabels(ellipse, update, labels) {
        update.center = ellipse.getCenter();
        update.majorRadius = ellipse.getMajorRadius();
        update.minorRadius = ellipse.getMinorRadius();
        update.rotation = ellipse.getRotation();
        if (labels) {
            ellipse.labels = labels;
            this.editEllipsesLayer.update(ellipse, ellipse.getId());
            return;
        }
        if (!this.editLabelsRenderFn) {
            return;
        }
        ellipse.labels = this.editLabelsRenderFn(update, ellipse.labels);
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    removeEditLabels(ellipse) {
        ellipse.labels = [];
        this.editEllipsesLayer.update(ellipse, ellipse.getId());
    }
    handleCreateUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                break;
            }
            case EditActions.MOUSE_MOVE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.movePoint(update.updatedPosition, ellipse.majorRadiusPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.center) {
                    ellipse.addPoint(update.center);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ADD_LAST_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (update.updatedPosition) {
                    ellipse.addLastPoint(update.updatedPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISPOSE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    this.removeEditLabels(ellipse);
                    this.ellipsesManager.dispose(update.id);
                }
                break;
            }
            case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.editLabelsRenderFn = update.labelsRenderFn;
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.UPDATE_EDIT_LABELS: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            case EditActions.SET_MANUALLY: {
                const ellipse = this.ellipsesManager.get(update.id);
                this.renderEditLabels(ellipse, update, update.updateLabels);
                break;
            }
            default: {
                return;
            }
        }
    }
    handleEditUpdates(update) {
        switch (update.editAction) {
            case EditActions.INIT: {
                const ellipse = this.ellipsesManager.createEditableEllipse(update.id, this.editEllipsesLayer, this.editPointsLayer, this.coordinateConverter, update.ellipseOptions);
                ellipse.setManually(update.center, update.majorRadius, update.rotation, update.minorRadius, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.pointProps) || undefined, (update.ellipseOptions && update.ellipseOptions.ellipseProps) || undefined);
                this.renderEditLabels(ellipse, update);
                break;
            }
            case EditActions.DRAG_POINT_FINISH:
            case EditActions.DRAG_POINT: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.movePoint(update.endDragPosition, update.updatedPoint);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.moveEllipse(update.startDragPosition, update.endDragPosition);
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DRAG_SHAPE_FINISH: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.endMoveEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.TRANSFORM: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse && ellipse.enableEdit) {
                    ellipse.transformToEllipse();
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.DISABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = false;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            case EditActions.ENABLE: {
                const ellipse = this.ellipsesManager.get(update.id);
                if (ellipse) {
                    ellipse.enableEdit = true;
                    this.renderEditLabels(ellipse, update);
                }
                break;
            }
            default: {
                return;
            }
        }
    }
    ngOnDestroy() {
        this.ellipsesManager.clear();
    }
    getPointSize(point) {
        return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
    }
    getPointShow(point) {
        return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
    }
}
EllipsesEditorComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorComponent, deps: [{ token: i1.EllipsesEditorService }, { token: i2.CoordinateConverter }, { token: i3.MapEventsManagerService }, { token: i4.CameraService }, { token: i5.EllipsesManagerService }, { token: i6.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
EllipsesEditorComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: EllipsesEditorComponent, selector: "ellipses-editor", providers: [CoordinateConverter, EllipsesManagerService], viewQueries: [{ propertyName: "editEllipsesLayer", first: true, predicate: ["editEllipsesLayer"], descendants: true }, { propertyName: "editPointsLayer", first: true, predicate: ["editPointsLayer"], descendants: true }], ngImport: i0, template: /*html*/ `
      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                    position: ellipse.getCenterCallbackProperty(),
                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
                    rotation: ellipse.getRotationCallbackProperty(),
                    material: ellipse.ellipseProps.material,
                    outline: ellipse.ellipseProps.outline,
                    outlineWidth: ellipse.ellipseProps.outlineWidth,
                    outlineColor: ellipse.ellipseProps.outlineColor,
                    height: 0,
                    fill: ellipse.ellipseProps.fill,
                    classificationType: ellipse.ellipseProps.classificationType,
                    zIndex: ellipse.ellipseProps.zIndex,
                    shadows: ellipse.ellipseProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
                        position: label.position,
                        text: label.text,
                        backgroundColor: label.backgroundColor,
                        backgroundPadding: label.backgroundPadding,
                        distanceDisplayCondition: label.distanceDisplayCondition,
                        eyeOffset: label.eyeOffset,
                        fillColor: label.fillColor,
                        font: label.font,
                        heightReference: label.heightReference,
                        horizontalOrigin: label.horizontalOrigin,
                        outlineColor: label.outlineColor,
                        outlineWidth: label.outlineWidth,
                        pixelOffset: label.pixelOffset,
                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
                        scale: label.scale,
                        scaleByDistance: label.scaleByDistance,
                        show: label.show,
                        showBackground: label.showBackground,
                        style: label.style,
                        translucencyByDistance: label.translucencyByDistance,
                        verticalOrigin: label.verticalOrigin,
                        disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `, isInline: true, components: [{ type: i7.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }, { type: i8.AcPointDescComponent, selector: "ac-point-desc" }, { type: i9.AcEllipseDescComponent, selector: "ac-ellipse-desc" }, { type: i10.AcArrayDescComponent, selector: "ac-array-desc", inputs: ["acFor", "idGetter", "show"] }, { type: i11.AcLabelPrimitiveDescComponent, selector: "ac-label-primitive-desc" }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: EllipsesEditorComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ellipses-editor',
                    template: /*html*/ `
      <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
          <ac-point-desc
                  props="{
                    position: point.getPositionCallbackProperty(),
                    pixelSize: getPointSize(point),
                    color: point.props.color,
                    outlineColor: point.props.outlineColor,
                    outlineWidth: point.props.outlineWidth,
                    show: getPointShow(point),
                    disableDepthTestDistance: point.props.disableDepthTestDistance,
                    heightReference: point.props.heightReference,
    }"
          >
          </ac-point-desc>
      </ac-layer>

      <ac-layer #editEllipsesLayer acFor="let ellipse of editEllipses$" [context]="this" [zIndex]="0">
          <ac-ellipse-desc
                  props="{
                    position: ellipse.getCenterCallbackProperty(),
                    semiMajorAxis: ellipse.getMajorRadiusCallbackProperty(),
                    semiMinorAxis: ellipse.getMinorRadiusCallbackProperty(),
                    rotation: ellipse.getRotationCallbackProperty(),
                    material: ellipse.ellipseProps.material,
                    outline: ellipse.ellipseProps.outline,
                    outlineWidth: ellipse.ellipseProps.outlineWidth,
                    outlineColor: ellipse.ellipseProps.outlineColor,
                    height: 0,
                    fill: ellipse.ellipseProps.fill,
                    classificationType: ellipse.ellipseProps.classificationType,
                    zIndex: ellipse.ellipseProps.zIndex,
                    shadows: ellipse.ellipseProps.shadows,
    }"
          >
          </ac-ellipse-desc>

          <ac-array-desc acFor="let label of ellipse.labels" [idGetter]="getLabelId">
              <ac-label-primitive-desc
                      props="{
                        position: label.position,
                        text: label.text,
                        backgroundColor: label.backgroundColor,
                        backgroundPadding: label.backgroundPadding,
                        distanceDisplayCondition: label.distanceDisplayCondition,
                        eyeOffset: label.eyeOffset,
                        fillColor: label.fillColor,
                        font: label.font,
                        heightReference: label.heightReference,
                        horizontalOrigin: label.horizontalOrigin,
                        outlineColor: label.outlineColor,
                        outlineWidth: label.outlineWidth,
                        pixelOffset: label.pixelOffset,
                        pixelOffsetScaleByDistance: label.pixelOffsetScaleByDistance,
                        scale: label.scale,
                        scaleByDistance: label.scaleByDistance,
                        show: label.show,
                        showBackground: label.showBackground,
                        style: label.style,
                        translucencyByDistance: label.translucencyByDistance,
                        verticalOrigin: label.verticalOrigin,
                        disableDepthTestDistance: label.disableDepthTestDistance,
        }"
              >
              </ac-label-primitive-desc>
          </ac-array-desc>
      </ac-layer>
  `,
                    providers: [CoordinateConverter, EllipsesManagerService],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.EllipsesEditorService }, { type: i2.CoordinateConverter }, { type: i3.MapEventsManagerService }, { type: i4.CameraService }, { type: i5.EllipsesManagerService }, { type: i6.CesiumService }]; }, propDecorators: { editEllipsesLayer: [{
                type: ViewChild,
                args: ['editEllipsesLayer']
            }], editPointsLayer: [{
                type: ViewChild,
                args: ['editPointsLayer']
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZWxsaXBzZXMtZWRpdG9yLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0td2lkZ2V0cy9jb21wb25lbnRzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3IuY29tcG9uZW50LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSx1QkFBdUIsRUFBRSxTQUFTLEVBQWEsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBRXpGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw2QkFBNkIsQ0FBQztBQUV4RCxPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sZ0NBQWdDLENBQUM7QUFFN0QsT0FBTyxFQUFFLG1CQUFtQixFQUFFLE1BQU0sb0ZBQW9GLENBQUM7QUFFekgsT0FBTyxFQUFFLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUcvQixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3RUFBd0UsQ0FBQzs7Ozs7Ozs7Ozs7OztBQStFaEgsTUFBTSxPQUFPLHVCQUF1QjtJQVFsQyxZQUNVLGNBQXFDLEVBQ3JDLG1CQUF3QyxFQUN4QyxnQkFBeUMsRUFDekMsYUFBNEIsRUFDNUIsZUFBdUMsRUFDdkMsYUFBNEI7UUFMNUIsbUJBQWMsR0FBZCxjQUFjLENBQXVCO1FBQ3JDLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBcUI7UUFDeEMscUJBQWdCLEdBQWhCLGdCQUFnQixDQUF5QjtRQUN6QyxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQUM1QixvQkFBZSxHQUFmLGVBQWUsQ0FBd0I7UUFDdkMsa0JBQWEsR0FBYixhQUFhLENBQWU7UUFaL0IsZ0JBQVcsR0FBRyxJQUFJLE9BQU8sRUFBa0IsQ0FBQztRQUM1QyxrQkFBYSxHQUFHLElBQUksT0FBTyxFQUFrQixDQUFDO1FBYW5ELElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxn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Ozs7Ozs7OztHQW1FbEI7MkZBSVUsdUJBQXVCO2tCQXpFbkMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsaUJBQWlCO29CQUMzQixRQUFRLEVBQUUsUUFBUSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBbUVsQjtvQkFDRCxTQUFTLEVBQUUsQ0FBQyxtQkFBbUIsRUFBRSxzQkFBc0IsQ0FBQztvQkFDeEQsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEO2lSQU15QyxpQkFBaUI7c0JBQXhELFNBQVM7dUJBQUMsbUJBQW1CO2dCQUNRLGVBQWU7c0JBQXBELFNBQVM7dUJBQUMsaUJBQWlCIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENvbXBvbmVudCwgT25EZXN0cm95LCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ2VzaXVtU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nlc2l1bS9jZXNpdW0uc2VydmljZSc7XHJcbmltcG9ydCB7IEVkaXRNb2RlcyB9IGZyb20gJy4uLy4uL21vZGVscy9lZGl0LW1vZGUuZW51bSc7XHJcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XHJcbmltcG9ydCB7IEVkaXRBY3Rpb25zIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtYWN0aW9ucy5lbnVtJztcclxuaW1wb3J0IHsgQWNMYXllckNvbXBvbmVudCB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uLy4uL2FuZ3VsYXItY2VzaXVtL3NlcnZpY2VzL21hcC1ldmVudHMtbWFuYW5nZXIvbWFwLWV2ZW50cy1tYW5hZ2VyJztcclxuaW1wb3J0IHsgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBDYW1lcmFTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2FtZXJhL2NhbWVyYS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWRpdFBvaW50IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXQtcG9pbnQnO1xyXG5pbXBvcnQgeyBFbGxpcHNlc01hbmFnZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZW50aXR5LWVkaXRvcnMvZWxsaXBzZXMtZWRpdG9yL2VsbGlwc2VzLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEVsbGlwc2VzRWRpdG9yU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2VudGl0eS1lZGl0b3JzL2VsbGlwc2VzLWVkaXRvci9lbGxpcHNlcy1lZGl0b3Iuc2VydmljZSc7XHJcbmltcG9ydCB7IEVsbGlwc2VFZGl0VXBkYXRlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VsbGlwc2UtZWRpdC11cGRhdGUnO1xyXG5pbXBvcnQgeyBMYWJlbFByb3BzIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2xhYmVsLXByb3BzJztcclxuaW1wb3J0IHsgRWRpdGFibGVFbGxpcHNlIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2VkaXRhYmxlLWVsbGlwc2UnO1xyXG5cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdlbGxpcHNlcy1lZGl0b3InLFxyXG4gIHRlbXBsYXRlOiAvKmh0bWwqLyBgXHJcbiAgICAgIDxhYy1sYXllciAjZWRpdFBvaW50c0xheWVyIGFjRm9yPVwibGV0IHBvaW50IG9mIGVkaXRQb2ludHMkXCIgW2NvbnRleHRdPVwidGhpc1wiPlxyXG4gICAgICAgICAgPGFjLXBvaW50LWRlc2NcclxuICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XHJcbiAgICAgICAgICAgICAgICAgICAgcG9zaXRpb246IHBvaW50LmdldFBvc2l0aW9uQ2FsbGJhY2tQcm9wZXJ0eSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHBpeGVsU2l6ZTogZ2V0UG9pbnRTaXplKHBvaW50KSxcclxuICAgICAgICAgICAgICAgICAgICBjb2xvcjogcG9pbnQucHJvcHMuY29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBwb2ludC5wcm9wcy5vdXRsaW5lQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBwb2ludC5wcm9wcy5vdXRsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hvdzogZ2V0UG9pbnRTaG93KHBvaW50KSxcclxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlRGVwdGhUZXN0RGlzdGFuY2U6IHBvaW50LnByb3BzLmRpc2FibGVEZXB0aFRlc3REaXN0YW5jZSxcclxuICAgICAgICAgICAgICAgICAgICBoZWlnaHRSZWZlcmVuY2U6IHBvaW50LnByb3BzLmhlaWdodFJlZmVyZW5jZSxcclxuICAgIH1cIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgPC9hYy1wb2ludC1kZXNjPlxyXG4gICAgICA8L2FjLWxheWVyPlxyXG5cclxuICAgICAgPGFjLWxheWVyICNlZGl0RWxsaXBzZXNMYXllciBhY0Zvcj1cImxldCBlbGxpcHNlIG9mIGVkaXRFbGxpcHNlcyRcIiBbY29udGV4dF09XCJ0aGlzXCIgW3pJbmRleF09XCIwXCI+XHJcbiAgICAgICAgICA8YWMtZWxsaXBzZS1kZXNjXHJcbiAgICAgICAgICAgICAgICAgIHByb3BzPVwie1xyXG4gICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBlbGxpcHNlLmdldENlbnRlckNhbGxiYWNrUHJvcGVydHkoKSxcclxuICAgICAgICAgICAgICAgICAgICBzZW1pTWFqb3JBeGlzOiBlbGxpcHNlLmdldE1ham9yUmFkaXVzQ2FsbGJhY2tQcm9wZXJ0eSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNlbWlNaW5vckF4aXM6IGVsbGlwc2UuZ2V0TWlub3JSYWRpdXNDYWxsYmFja1Byb3BlcnR5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgcm90YXRpb246IGVsbGlwc2UuZ2V0Um90YXRpb25DYWxsYmFja1Byb3BlcnR5KCksXHJcbiAgICAgICAgICAgICAgICAgICAgbWF0ZXJpYWw6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm1hdGVyaWFsLFxyXG4gICAgICAgICAgICAgICAgICAgIG91dGxpbmU6IGVsbGlwc2UuZWxsaXBzZVByb3BzLm91dGxpbmUsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZVdpZHRoOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5vdXRsaW5lV2lkdGgsXHJcbiAgICAgICAgICAgICAgICAgICAgb3V0bGluZUNvbG9yOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5vdXRsaW5lQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAwLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGw6IGVsbGlwc2UuZWxsaXBzZVByb3BzLmZpbGwsXHJcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NpZmljYXRpb25UeXBlOiBlbGxpcHNlLmVsbGlwc2VQcm9wcy5jbGFzc2lmaWNhdGlvblR5cGUsXHJcbiAgICAgICAgICAgICAgICAgICAgekluZGV4OiBlbGxpcHNlLmVsbGlwc2VQcm9wcy56SW5kZXgsXHJcbiAgICAgICAgICAgICAgICAgICAgc2hhZG93czogZWxsaXBzZS5lbGxpcHNlUHJvcHMuc2hhZG93cyxcclxuICAgIH1cIlxyXG4gICAgICAgICAgPlxyXG4gICAgICAgICAgPC9hYy1lbGxpcHNlLWRlc2M+XHJcblxyXG4gICAgICAgICAgPGFjLWFycmF5LWRlc2MgYWNGb3I9XCJsZXQgbGFiZWwgb2YgZWxsaXBzZS5sYWJlbHNcIiBbaWRHZXR0ZXJdPVwiZ2V0TGFiZWxJZFwiPlxyXG4gICAgICAgICAgICAgIDxhYy1sYWJlbC1wcmltaXRpdmUtZGVzY1xyXG4gICAgICAgICAgICAgICAgICAgICAgcHJvcHM9XCJ7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHBvc2l0aW9uOiBsYWJlbC5wb3NpdGlvbixcclxuICAgICAgICAgICAgICAgICAgICAgICAgdGV4dDogbGFiZWwudGV4dCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgYmFja2dyb3VuZENvbG9yOiBsYWJlbC5iYWNrZ3JvdW5kQ29sb3IsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRQYWRkaW5nOiBsYWJlbC5iYWNrZ3JvdW5kUGFkZGluZyxcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGlzdGFuY2VEaXNwbGF5Q29uZGl0aW9uOiBsYWJlbC5kaXN0YW5jZURpc3BsYXlDb25kaXRpb24sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGV5ZU9mZnNldDogbGFiZWwuZXllT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWxsQ29sb3I6IGxhYmVsLmZpbGxDb2xvcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgZm9udDogbGFiZWwuZm9udCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0UmVmZXJlbmNlOiBsYWJlbC5oZWlnaHRSZWZlcmVuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGhvcml6b250YWxPcmlnaW46IGxhYmVsLmhvcml6b250YWxPcmlnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dGxpbmVDb2xvcjogbGFiZWwub3V0bGluZUNvbG9yLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvdXRsaW5lV2lkdGg6IGxhYmVsLm91dGxpbmVXaWR0aCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgcGl4ZWxPZmZzZXQ6IGxhYmVsLnBpeGVsT2Zmc2V0LFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBwaXhlbE9mZnNldFNjYWxlQnlEaXN0YW5jZTogbGFiZWwucGl4ZWxPZmZzZXRTY2FsZUJ5RGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNjYWxlOiBsYWJlbC5zY2FsZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2NhbGVCeURpc3RhbmNlOiBsYWJlbC5zY2FsZUJ5RGlzdGFuY2UsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3c6IGxhYmVsLnNob3csXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dCYWNrZ3JvdW5kOiBsYWJlbC5zaG93QmFja2dyb3VuZCxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU6IGxhYmVsLnN0eWxlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0cmFuc2x1Y2VuY3lCeURpc3RhbmNlOiBsYWJlbC50cmFuc2x1Y2VuY3lCeURpc3RhbmNlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2ZXJ0aWNhbE9yaWdpbjogbGFiZWwudmVydGljYWxPcmlnaW4sXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGRpc2FibGVEZXB0aFRlc3REaXN0YW5jZTogbGFiZWwuZGlzYWJsZURlcHRoVGVzdERpc3RhbmNlLFxyXG4gICAgICAgIH1cIlxyXG4gICAgICAgICAgICAgID5cclxuICAgICAgICAgICAgICA8L2FjLWxhYmVsLXByaW1pdGl2ZS1kZXNjPlxyXG4gICAgICAgICAgPC9hYy1hcnJheS1kZXNjPlxyXG4gICAgICA8L2FjLWxheWVyPlxyXG4gIGAsXHJcbiAgcHJvdmlkZXJzOiBbQ29vcmRpbmF0ZUNvbnZlcnRlciwgRWxsaXBzZXNNYW5hZ2VyU2VydmljZV0sXHJcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbn0pXHJcbmV4cG9ydCBjbGFzcyBFbGxpcHNlc0VkaXRvckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XHJcbiAgcHJpdmF0ZSBlZGl0TGFiZWxzUmVuZGVyRm46ICh1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlLCBsYWJlbHM6IExhYmVsUHJvcHNbXSkgPT4gTGFiZWxQcm9wc1tdO1xyXG4gIHB1YmxpYyBlZGl0UG9pbnRzJCA9IG5ldyBTdWJqZWN0PEFjTm90aWZpY2F0aW9uPigpO1xyXG4gIHB1YmxpYyBlZGl0RWxsaXBzZXMkID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XHJcblxyXG4gIEBWaWV3Q2hpbGQoJ2VkaXRFbGxpcHNlc0xheWVyJykgcHJpdmF0ZSBlZGl0RWxsaXBzZXNMYXllcjogQWNMYXllckNvbXBvbmVudDtcclxuICBAVmlld0NoaWxkKCdlZGl0UG9pbnRzTGF5ZXInKSBwcml2YXRlIGVkaXRQb2ludHNMYXllcjogQWNMYXllckNvbXBvbmVudDtcclxuXHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwcml2YXRlIGVsbGlwc2VzRWRpdG9yOiBFbGxpcHNlc0VkaXRvclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNvb3JkaW5hdGVDb252ZXJ0ZXI6IENvb3JkaW5hdGVDb252ZXJ0ZXIsXHJcbiAgICBwcml2YXRlIG1hcEV2ZW50c01hbmFnZXI6IE1hcEV2ZW50c01hbmFnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBlbGxpcHNlc01hbmFnZXI6IEVsbGlwc2VzTWFuYWdlclNlcnZpY2UsXHJcbiAgICBwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXHJcbiAgKSB7XHJcbiAgICB0aGlzLmVsbGlwc2VzRWRpdG9yLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyLCB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsIHRoaXMuY2FtZXJhU2VydmljZSwgdGhpcy5lbGxpcHNlc01hbmFnZXIsIHRoaXMuY2VzaXVtU2VydmljZSk7XHJcbiAgICB0aGlzLnN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHN0YXJ0TGlzdGVuaW5nVG9FZGl0b3JVcGRhdGVzKCkge1xyXG4gICAgdGhpcy5lbGxpcHNlc0VkaXRvci5vblVwZGF0ZSgpLnN1YnNjcmliZSh1cGRhdGUgPT4ge1xyXG4gICAgICBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuQ1JFQVRFIHx8IHVwZGF0ZS5lZGl0TW9kZSA9PT0gRWRpdE1vZGVzLkNSRUFURV9PUl9FRElUKSB7XHJcbiAgICAgICAgdGhpcy5oYW5kbGVDcmVhdGVVcGRhdGVzKHVwZGF0ZSk7XHJcbiAgICAgIH0gZWxzZSBpZiAodXBkYXRlLmVkaXRNb2RlID09PSBFZGl0TW9kZXMuRURJVCkge1xyXG4gICAgICAgIHRoaXMuaGFuZGxlRWRpdFVwZGF0ZXModXBkYXRlKTtcclxuICAgICAgfVxyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRMYWJlbElkKGVsZW1lbnQ6IGFueSwgaW5kZXg6IG51bWJlcik6IHN0cmluZyB7XHJcbiAgICByZXR1cm4gaW5kZXgudG9TdHJpbmcoKTtcclxuICB9XHJcblxyXG4gIHJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZTogRWRpdGFibGVFbGxpcHNlLCB1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlLCBsYWJlbHM/OiBMYWJlbFByb3BzW10pIHtcclxuICAgIHVwZGF0ZS5jZW50ZXIgPSBlbGxpcHNlLmdldENlbnRlcigpO1xyXG4gICAgdXBkYXRlLm1ham9yUmFkaXVzID0gZWxsaXBzZS5nZXRNYWpvclJhZGl1cygpO1xyXG4gICAgdXBkYXRlLm1pbm9yUmFkaXVzID0gZWxsaXBzZS5nZXRNaW5vclJhZGl1cygpO1xyXG4gICAgdXBkYXRlLnJvdGF0aW9uID0gZWxsaXBzZS5nZXRSb3RhdGlvbigpO1xyXG5cclxuICAgIGlmIChsYWJlbHMpIHtcclxuICAgICAgZWxsaXBzZS5sYWJlbHMgPSBsYWJlbHM7XHJcbiAgICAgIHRoaXMuZWRpdEVsbGlwc2VzTGF5ZXIudXBkYXRlKGVsbGlwc2UsIGVsbGlwc2UuZ2V0SWQoKSk7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuZWRpdExhYmVsc1JlbmRlckZuKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBlbGxpcHNlLmxhYmVscyA9IHRoaXMuZWRpdExhYmVsc1JlbmRlckZuKHVwZGF0ZSwgZWxsaXBzZS5sYWJlbHMpO1xyXG4gICAgdGhpcy5lZGl0RWxsaXBzZXNMYXllci51cGRhdGUoZWxsaXBzZSwgZWxsaXBzZS5nZXRJZCgpKTtcclxuICB9XHJcblxyXG4gIHJlbW92ZUVkaXRMYWJlbHMoZWxsaXBzZTogRWRpdGFibGVFbGxpcHNlKSB7XHJcbiAgICBlbGxpcHNlLmxhYmVscyA9IFtdO1xyXG4gICAgdGhpcy5lZGl0RWxsaXBzZXNMYXllci51cGRhdGUoZWxsaXBzZSwgZWxsaXBzZS5nZXRJZCgpKTtcclxuICB9XHJcblxyXG4gIGhhbmRsZUNyZWF0ZVVwZGF0ZXModXBkYXRlOiBFbGxpcHNlRWRpdFVwZGF0ZSkge1xyXG4gICAgc3dpdGNoICh1cGRhdGUuZWRpdEFjdGlvbikge1xyXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLklOSVQ6IHtcclxuICAgICAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXHJcbiAgICAgICAgICB1cGRhdGUuaWQsXHJcbiAgICAgICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLFxyXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXHJcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXHJcbiAgICAgICAgICB1cGRhdGUuZWxsaXBzZU9wdGlvbnMsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLk1PVVNFX01PVkU6IHtcclxuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgaWYgKHVwZGF0ZS51cGRhdGVkUG9zaXRpb24pIHtcclxuICAgICAgICAgIGVsbGlwc2UubW92ZVBvaW50KHVwZGF0ZS51cGRhdGVkUG9zaXRpb24sIGVsbGlwc2UubWFqb3JSYWRpdXNQb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfUE9JTlQ6IHtcclxuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgaWYgKHVwZGF0ZS5jZW50ZXIpIHtcclxuICAgICAgICAgIGVsbGlwc2UuYWRkUG9pbnQodXBkYXRlLmNlbnRlcik7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5BRERfTEFTVF9QT0lOVDoge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcclxuICAgICAgICBpZiAodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbikge1xyXG4gICAgICAgICAgZWxsaXBzZS5hZGRMYXN0UG9pbnQodXBkYXRlLnVwZGF0ZWRQb3NpdGlvbik7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5ESVNQT1NFOiB7XHJcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xyXG4gICAgICAgIGlmIChlbGxpcHNlKSB7XHJcbiAgICAgICAgICB0aGlzLnJlbW92ZUVkaXRMYWJlbHMoZWxsaXBzZSk7XHJcbiAgICAgICAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5kaXNwb3NlKHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuU0VUX0VESVRfTEFCRUxTX1JFTkRFUl9DQUxMQkFDSzoge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcclxuICAgICAgICB0aGlzLmVkaXRMYWJlbHNSZW5kZXJGbiA9IHVwZGF0ZS5sYWJlbHNSZW5kZXJGbjtcclxuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlVQREFURV9FRElUX0xBQkVMUzoge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcclxuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBjYXNlIEVkaXRBY3Rpb25zLlNFVF9NQU5VQUxMWToge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcclxuICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlLCB1cGRhdGUudXBkYXRlTGFiZWxzKTtcclxuICAgICAgICBicmVhaztcclxuICAgICAgfVxyXG4gICAgICBkZWZhdWx0OiB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBoYW5kbGVFZGl0VXBkYXRlcyh1cGRhdGU6IEVsbGlwc2VFZGl0VXBkYXRlKSB7XHJcbiAgICBzd2l0Y2ggKHVwZGF0ZS5lZGl0QWN0aW9uKSB7XHJcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuSU5JVDoge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5jcmVhdGVFZGl0YWJsZUVsbGlwc2UoXHJcbiAgICAgICAgICB1cGRhdGUuaWQsXHJcbiAgICAgICAgICB0aGlzLmVkaXRFbGxpcHNlc0xheWVyLFxyXG4gICAgICAgICAgdGhpcy5lZGl0UG9pbnRzTGF5ZXIsXHJcbiAgICAgICAgICB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIsXHJcbiAgICAgICAgICB1cGRhdGUuZWxsaXBzZU9wdGlvbnMsXHJcbiAgICAgICAgKTtcclxuICAgICAgICBlbGxpcHNlLnNldE1hbnVhbGx5KFxyXG4gICAgICAgICAgdXBkYXRlLmNlbnRlcixcclxuICAgICAgICAgIHVwZGF0ZS5tYWpvclJhZGl1cyxcclxuICAgICAgICAgIHVwZGF0ZS5yb3RhdGlvbixcclxuICAgICAgICAgIHVwZGF0ZS5taW5vclJhZGl1cyxcclxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLnBvaW50UHJvcHMpIHx8IHVuZGVmaW5lZCxcclxuICAgICAgICAgICh1cGRhdGUuZWxsaXBzZU9wdGlvbnMgJiYgdXBkYXRlLmVsbGlwc2VPcHRpb25zLmVsbGlwc2VQcm9wcykgfHwgdW5kZWZpbmVkLFxyXG4gICAgICAgICk7XHJcbiAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UX0ZJTklTSDpcclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1BPSU5UOiB7XHJcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xyXG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xyXG4gICAgICAgICAgZWxsaXBzZS5tb3ZlUG9pbnQodXBkYXRlLmVuZERyYWdQb3NpdGlvbiwgdXBkYXRlLnVwZGF0ZWRQb2ludCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5EUkFHX1NIQVBFOiB7XHJcbiAgICAgICAgY29uc3QgZWxsaXBzZSA9IHRoaXMuZWxsaXBzZXNNYW5hZ2VyLmdldCh1cGRhdGUuaWQpO1xyXG4gICAgICAgIGlmIChlbGxpcHNlICYmIGVsbGlwc2UuZW5hYmxlRWRpdCkge1xyXG4gICAgICAgICAgZWxsaXBzZS5tb3ZlRWxsaXBzZSh1cGRhdGUuc3RhcnREcmFnUG9zaXRpb24sIHVwZGF0ZS5lbmREcmFnUG9zaXRpb24pO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRFJBR19TSEFQRV9GSU5JU0g6IHtcclxuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgaWYgKGVsbGlwc2UgJiYgZWxsaXBzZS5lbmFibGVFZGl0KSB7XHJcbiAgICAgICAgICBlbGxpcHNlLmVuZE1vdmVFbGxpcHNlKCk7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5UUkFOU0ZPUk06IHtcclxuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgaWYgKGVsbGlwc2UgJiYgZWxsaXBzZS5lbmFibGVFZGl0KSB7XHJcbiAgICAgICAgICBlbGxpcHNlLnRyYW5zZm9ybVRvRWxsaXBzZSgpO1xyXG4gICAgICAgICAgdGhpcy5yZW5kZXJFZGl0TGFiZWxzKGVsbGlwc2UsIHVwZGF0ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICB9XHJcbiAgICAgIGNhc2UgRWRpdEFjdGlvbnMuRElTQUJMRToge1xyXG4gICAgICAgIGNvbnN0IGVsbGlwc2UgPSB0aGlzLmVsbGlwc2VzTWFuYWdlci5nZXQodXBkYXRlLmlkKTtcclxuICAgICAgICBpZiAoZWxsaXBzZSkge1xyXG4gICAgICAgICAgZWxsaXBzZS5lbmFibGVFZGl0ID0gZmFsc2U7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgY2FzZSBFZGl0QWN0aW9ucy5FTkFCTEU6IHtcclxuICAgICAgICBjb25zdCBlbGxpcHNlID0gdGhpcy5lbGxpcHNlc01hbmFnZXIuZ2V0KHVwZGF0ZS5pZCk7XHJcbiAgICAgICAgaWYgKGVsbGlwc2UpIHtcclxuICAgICAgICAgIGVsbGlwc2UuZW5hYmxlRWRpdCA9IHRydWU7XHJcbiAgICAgICAgICB0aGlzLnJlbmRlckVkaXRMYWJlbHMoZWxsaXBzZSwgdXBkYXRlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgYnJlYWs7XHJcbiAgICAgIH1cclxuICAgICAgZGVmYXVsdDoge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLmVsbGlwc2VzTWFuYWdlci5jbGVhcigpO1xyXG4gIH1cclxuXHJcbiAgZ2V0UG9pbnRTaXplKHBvaW50OiBFZGl0UG9pbnQpIHtcclxuICAgIHJldHVybiBwb2ludC5pc1ZpcnR1YWxFZGl0UG9pbnQoKSA/IHBvaW50LnByb3BzLnZpcnR1YWxQb2ludFBpeGVsU2l6ZSA6IHBvaW50LnByb3BzLnBpeGVsU2l6ZTtcclxuICB9XHJcblxyXG4gIGdldFBvaW50U2hvdyhwb2ludDogRWRpdFBvaW50KSB7XHJcbiAgICByZXR1cm4gcG9pbnQuc2hvdyAmJiAocG9pbnQuaXNWaXJ0dWFsRWRpdFBvaW50KCkgPyBwb2ludC5wcm9wcy5zaG93VmlydHVhbCA6IHBvaW50LnByb3BzLnNob3cpO1xyXG4gIH1cclxufVxyXG4iXX0=