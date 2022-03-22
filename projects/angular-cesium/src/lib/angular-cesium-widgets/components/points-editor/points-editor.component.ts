import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import * as Cesium from 'cesium';
import { CesiumService } from '../../../angular-cesium/services/cesium/cesium.service';
import { EditModes } from '../../models/edit-mode.enum';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { PointsEditorService } from '../../services/entity-editors/points-editor/points-editor.service';
import { PointsManagerService } from '../../services/entity-editors/points-editor/points-manager.service';
import { PointEditUpdate } from '../../models/point-edit-update';
import { EditablePoint } from '../../models/editable-point';
import { LabelProps } from '../../models/label-props';

@Component({
  selector: 'points-editor',
  template: /*html*/ `
    <ac-layer #editPointLayer acFor="let point of editPoint$" [context]="this">
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
      ></ac-point-desc>
    </ac-layer>

    <ac-layer #pointLabelsLayer acFor="let pointLabels of pointLabels$" [context]="this">
      <ac-array-desc acFor="let label of pointLabels.labels" [idGetter]="getLabelId">
        <ac-label-primitive-desc
          props="{
            position: label.position,
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
            text: label.text,
            translucencyByDistance: label.translucencyByDistance,
            verticalOrigin: label.verticalOrigin,
            disableDepthTestDistance: label.disableDepthTestDistance,
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
  providers: [CoordinateConverter, PointsManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PointsEditorComponent implements OnDestroy {
  private editLabelsRenderFn: (update: PointEditUpdate, labels: LabelProps[]) => LabelProps[];
  public editPoint$ = new Subject<AcNotification>();
  public pointLabels$ = new Subject<AcNotification>();

  @ViewChild('editPointLayer') private editPointLayer: AcLayerComponent;
  @ViewChild('pointLabelsLayer') private pointLabelsLayer: AcLayerComponent;

  constructor(
    private pointsEditor: PointsEditorService,
    private coordinateConverter: CoordinateConverter,
    private mapEventsManager: MapEventsManagerService,
    private cameraService: CameraService,
    private pointsManager: PointsManagerService,
    private cesiumService: CesiumService,
  ) {
    this.pointsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, pointsManager, this.cesiumService);
    this.startListeningToEditorUpdates();
  }

  private startListeningToEditorUpdates() {
    this.pointsEditor.onUpdate().subscribe((update: PointEditUpdate) => {
      if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
        this.handleCreateUpdates(update);
      } else if (update.editMode === EditModes.EDIT) {
        this.handleEditUpdates(update);
      }
    });
  }

  getLabelId(element: any, index: number): string {
    return index.toString();
  }

  renderEditLabels(point: EditablePoint, update: PointEditUpdate, labels?: LabelProps[]) {
    if (labels) {
      point.labels = labels;
      this.pointLabelsLayer.update(point, point.getId());
      return;
    }

    if (!this.editLabelsRenderFn) {
      return;
    }

    update.position = point.getPosition();
    update.point = point.getCurrentPoint();
    point.labels = this.editLabelsRenderFn(update, point.labels);
    this.pointLabelsLayer.update(point, point.getId());
  }

  removeEditLabels(point: EditablePoint) {
    point.labels = [];
    this.pointLabelsLayer.remove(point.getId());
  }

  handleCreateUpdates(update: PointEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.pointsManager.createEditablePoint(
          update.id,
          this.editPointLayer,
          this.coordinateConverter,
          update.pointOptions,
          update.position
        );
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const point = this.pointsManager.get(update.id);
        if (update.updatedPosition) {
          point.addLastPoint(update.updatedPosition);
          this.renderEditLabels(point, update);
        }
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const point = this.pointsManager.get(update.id);
        if (update.updatedPosition) {
          point.movePoint(update.updatedPosition);
          this.renderEditLabels(point, update);
        }
        break;
      }
      case EditActions.DISPOSE: {
        const point = this.pointsManager.get(update.id);
        if (point && point.getCurrentPoint()) {
          this.removeEditLabels(point);
        }
        this.pointsManager.dispose(update.id);
        this.editLabelsRenderFn = undefined;
        break;
      }
      case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
        const point = this.pointsManager.get(update.id);
        this.editLabelsRenderFn = update.labelsRenderFn;
        this.renderEditLabels(point, update);
        break;
      }
      case EditActions.UPDATE_EDIT_LABELS: {
        const point = this.pointsManager.get(update.id);
        this.renderEditLabels(point, update, update.updateLabels);
        break;
      }
      case EditActions.SET_MANUALLY: {
        const point = this.pointsManager.get(update.id);
        this.renderEditLabels(point, update, update.updateLabels);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update: PointEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.pointsManager.createEditablePoint(
          update.id,
          this.editPointLayer,
          this.coordinateConverter,
          update.pointOptions,
          update.position,
        );
        break;
      }
      case EditActions.DRAG_POINT: {
        const point = this.pointsManager.get(update.id);
        if (point && point.enableEdit) {
          point.movePoint(update.updatedPosition);
          this.renderEditLabels(point, update);
        }
        break;
      }
      case EditActions.DRAG_POINT_FINISH: {
        const point = this.pointsManager.get(update.id);
        if (point && point.enableEdit) {
          point.movePoint(update.updatedPosition);
          this.renderEditLabels(point, update);
        }
        break;
      }
      case EditActions.DISABLE: {
        const point = this.pointsManager.get(update.id);
        if (point) {
          point.enableEdit = false;
          this.renderEditLabels(point, update);
        }
        break;
      }
      case EditActions.ENABLE: {
        const point = this.pointsManager.get(update.id);
        if (point) {
          point.enableEdit = true;
          this.renderEditLabels(point, update);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.pointsManager.clear();
  }

  getPointSize(point: EditPoint) {
    return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
  }

  getPointShow(point: EditPoint) {
    return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
  }
}
