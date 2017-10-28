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

@Component({
  selector : 'circles-editor',
  templateUrl : './circles-editor.component.html',
  providers : [CoordinateConverter, CirclesManagerService]
})
export class CirclesEditorComponent implements OnDestroy {

  public Cesium = Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editCircles$ = new Subject<AcNotification>();
  public editArcs$ = new Subject<AcNotification>();

  public circleColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);

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

  handleCreateUpdates(update: CircleEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.circlesManager.createEditableCircle(
          update.id,
          this.editCirclesLayer,
          this.editPointsLayer,
          this.editArcsLayer);
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const circle = this.circlesManager.get(update.id);
        if (update.radiusPoint) {
          circle.movePoint(update.radiusPoint);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (update.center) {
          circle.addPoint(update.center);
        }
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (update.radiusPoint) {
          circle.addLastPoint(update.radiusPoint);
        }
        break;
      }
      case EditActions.DISPOSE: {
        this.circlesManager.dispose(update.id);
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
          this.editArcsLayer
        );
        circle.setCircleManually(update.center, update.radiusPoint);
        break;
      }
      case EditActions.DRAG_POINT_FINISH:
      case EditActions.DRAG_POINT: {
        const circle = this.circlesManager.get(update.id);
        if (circle && circle.enableEdit) {
          circle.movePoint(update.dragPosition);
        }
        break;
      }
      case EditActions.DRAG_SHAPE_FINISH:
      case EditActions.DRAG_SHAPE: {
        const circle = this.circlesManager.get(update.id);
        if (circle && circle.enableEdit) {
          circle.moveCircle(update.dragPosition);
        }
        break;
      }
      case EditActions.DISABLE: {
        const circle = this.circlesManager.get(update.id);
        if (circle) {
          circle.enableEdit = false;
        }
        break;
      }
      case EditActions.ENABLE: {
        const circle = this.circlesManager.get(update.id);
        if (circle) {
          circle.enableEdit = true;
        }
        break;
      }
      case EditActions.SET_MANUALLY: {
        const circle = this.circlesManager.get(update.id);
        if (circle) {
          circle.setCircleManually(update.center, update.radiusPoint);
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
    return point.isVirtualEditPoint() ? 8 : 15;
  }
}
