import { Component, OnDestroy, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { CirclesManagerService } from '../../services/entity-editors/circles-editor/circles-manager.service';
import { CirclesEditorService } from '../../services/entity-editors/circles-editor/circles-editor.service';
import { CircleEditUpdate } from '../../models/circle-edit-update';
import { LabelProps } from '../../models/label-props';
import { EditableCircle } from '../../models/editable-circle';

@Component({
  selector: 'circles-editor',
  templateUrl: './circles-editor.component.html',
  providers: [CoordinateConverter, CirclesManagerService]
})
export class CirclesEditorComponent implements OnDestroy {

  private editLabelsRenderFn: (update: CircleEditUpdate, labels: LabelProps[]) => LabelProps[];
  public Cesium = Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editCircles$ = new Subject<AcNotification>();
  public editArcs$ = new Subject<AcNotification>();

  @ViewChild('editCirclesLayer') private editCirclesLayer: AcLayerComponent;
  @ViewChild('editArcsLayer') private editArcsLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;

  constructor(private circlesEditor: CirclesEditorService,
              private coordinateConverter: CoordinateConverter,
              private mapEventsManager: MapEventsManagerService,
              private cameraService: CameraService,
              private circlesManager: CirclesManagerService) {
    this.circlesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, this.circlesManager);
    this.startListeningToEditorUpdates();
  }

  private startListeningToEditorUpdates() {
    this.circlesEditor.onUpdate().subscribe((update) => {
      if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
        this.handleCreateUpdates(update);
      }
      else if (update.editMode === EditModes.EDIT) {
        this.handleEditUpdates(update);
      }
    });
  }

  getLabelId(element, index: number): string {
    return index.toString();
  }

  renderEditLabels(circle: EditableCircle, update: CircleEditUpdate, labels?: LabelProps[]) {
    update.center = circle.getCenter();
    update.radiusPoint = circle.getRadiusPoint();
    update.radius = circle.getRadius();

    if (labels) {
      circle.labels = labels;
      this.editCirclesLayer.update(circle, circle.getId());
      return;
    }

    if (!this.editLabelsRenderFn) {
      return;
    }

    circle.labels = this.editLabelsRenderFn(update, circle.labels);
    this.editCirclesLayer.update(circle, circle.getId());

  }

  removeEditLabels(circle: EditableCircle) {
    circle.labels = [];
    this.editCirclesLayer.update(circle, circle.getId());
  }

  handleCreateUpdates(update: CircleEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.circlesManager.createEditableCircle(
          update.id,
          this.editCirclesLayer,
          this.editPointsLayer,
          this.editArcsLayer,
          update.circleOptions
        );
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const circle = this.circlesManager.get(update.id);
        if (update.radiusPoint) {
          circle.movePoint(update.radiusPoint);
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (update.center) {
          circle.addPoint(update.center);
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (update.radiusPoint) {
          circle.addLastPoint(update.radiusPoint);
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.DISPOSE: {
        const circle = this.circlesManager.get(update.id);
        this.removeEditLabels(circle);
        this.circlesManager.dispose(update.id);
        break;
      }
      case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
        const circle = this.circlesManager.get(update.id);
        this.editLabelsRenderFn = update.labelsRenderFn;
        this.renderEditLabels(circle, update);
        break;
      }
      case EditActions.UPDATE_EDIT_LABELS: {
        const circle = this.circlesManager.get(update.id);
        this.renderEditLabels(circle, update, update.updateLabels);
        break;
      }
      case EditActions.SET_MANUALLY: {
        const circle = this.circlesManager.get(update.id);
        this.renderEditLabels(circle, update, update.updateLabels);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update: CircleEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        const circle = this.circlesManager.createEditableCircle(
          update.id,
          this.editCirclesLayer,
          this.editPointsLayer,
          this.editArcsLayer,
          update.circleOptions
        );
        circle.setManually(update.center, update.radiusPoint);
        break;
      }
      case EditActions.DRAG_POINT_FINISH:
      case EditActions.DRAG_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (circle && circle.enableEdit) {
          circle.movePoint(update.endDragPosition);
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.DRAG_SHAPE: {
        const circle = this.circlesManager.get(update.id);
        if (circle && circle.enableEdit) {
          circle.moveCircle(update.startDragPosition, update.endDragPosition);
        }
        break;
      }
      case EditActions.DRAG_SHAPE_FINISH: {
        const circle = this.circlesManager.get(update.id);
        if (circle && circle.enableEdit) {
          circle.endMovePolygon();
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.DISABLE: {
        const circle = this.circlesManager.get(update.id);
        if (circle) {
          circle.enableEdit = false;
          this.renderEditLabels(circle, update);
        }
        break;
      }
      case EditActions.ENABLE: {
        const circle = this.circlesManager.get(update.id);
        if (circle) {
          circle.enableEdit = true;
          this.renderEditLabels(circle, update);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.circlesManager.clear();
  }

  getPointSize(point: EditPoint) {
    return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
  }

  getPointShow(point: EditPoint) {
    return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
  }
}
