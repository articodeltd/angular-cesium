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
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';
import { HippodromeEditorService } from '../../services/entity-editors/hippodrome-editor/hippodrome-editor.service';
import { HippodromeEditUpdate } from '../../models/hippodrome-edit-update';
import { LabelProps } from '../../models/label-props';
import { EditableHippodrome } from '../../models/editable-hippodrome';

@Component({
  selector: 'hippodrome-editor',
  templateUrl: './hippodrome-editor.component.html',
  providers: [CoordinateConverter, HippodromeManagerService]
})
export class HippodromeEditorComponent implements OnDestroy {

  private editLabelsRenderFn: (update: HippodromeEditUpdate, labels: LabelProps[]) => LabelProps[];
  public Cesium = Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editHippodromes$ = new Subject<AcNotification>();

  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
  @ViewChild('editHippodromesLayer') private editHippodromesLayer: AcLayerComponent;

  constructor(private hippodromesEditor: HippodromeEditorService,
              private coordinateConverter: CoordinateConverter,
              private mapEventsManager: MapEventsManagerService,
              private cameraService: CameraService,
              private hippodromesManager: HippodromeManagerService) {
    this.hippodromesEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, hippodromesManager);
    this.startListeningToEditorUpdates();
  }

  private startListeningToEditorUpdates() {
    this.hippodromesEditor.onUpdate().subscribe((update: HippodromeEditUpdate) => {
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

  renderEditLabels(hippodrome: EditableHippodrome, update: HippodromeEditUpdate, labels?: LabelProps[]) {
    update.positions = hippodrome.getRealPositions();
    update.points = hippodrome.getRealPoints();

    if (labels) {
      hippodrome.labels = labels;
      this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
      return;
    }

    if (!this.editLabelsRenderFn) {
      return;
    }

    hippodrome.labels = this.editLabelsRenderFn(update, hippodrome.labels);
    this.editHippodromesLayer.update(hippodrome, hippodrome.getId());

  }

  removeEditLabels(hippodrome: EditableHippodrome) {
    hippodrome.labels = [];
    this.editHippodromesLayer.update(hippodrome, hippodrome.getId());
  }

  handleCreateUpdates(update: HippodromeEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.hippodromesManager.createEditableHippodrome(
          update.id,
          this.editPointsLayer,
          this.editHippodromesLayer,
          this.coordinateConverter,
          update.hippodromeOptions);
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (update.updatedPosition) {
          hippodrome.moveTempMovingPoint(update.updatedPosition);
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (update.updatedPosition) {
          hippodrome.addPoint(update.updatedPosition);
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.DISPOSE: {
        const hippodrome = this.hippodromesManager.get(update.id);
        hippodrome.dispose();
        this.removeEditLabels(hippodrome);
        break;
      }
      case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
        const hippodrome = this.hippodromesManager.get(update.id);
        this.editLabelsRenderFn = update.labelsRenderFn;
        this.renderEditLabels(hippodrome, update);
        break;
      }
      case EditActions.UPDATE_EDIT_LABELS: {
        const hippodrome = this.hippodromesManager.get(update.id);
        this.renderEditLabels(hippodrome, update, update.updateLabels);
        break;
      }
      case EditActions.SET_MANUALLY: {
        const hippodrome = this.hippodromesManager.get(update.id);
        this.renderEditLabels(hippodrome, update, update.updateLabels);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update: HippodromeEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.hippodromesManager.createEditableHippodrome(
          update.id,
          this.editPointsLayer,
          this.editHippodromesLayer,
          this.coordinateConverter,
          update.hippodromeOptions,
          update.positions
        );
        break;
      }
      case EditActions.DRAG_POINT: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome && hippodrome.enableEdit) {
          hippodrome.movePoint(update.updatedPosition, update.updatedPoint);
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.DRAG_POINT_FINISH: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome && hippodrome.enableEdit) {
          hippodrome.endMovePoint();
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.DISABLE: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome) {
          hippodrome.enableEdit = false;
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.ENABLE: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome) {
          hippodrome.enableEdit = true;
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      case EditActions.DRAG_SHAPE: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome && hippodrome.enableEdit) {
          hippodrome.moveShape(update.draggedPosition, update.updatedPosition);
        }
        break;
      }

      case EditActions.DRAG_SHAPE_FINISH: {
        const hippodrome = this.hippodromesManager.get(update.id);
        if (hippodrome && hippodrome.enableEdit) {
          hippodrome.endMoveShape();
          this.renderEditLabels(hippodrome, update);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.hippodromesManager.clear();
  }

  getPointSize(point: EditPoint) {
    return point.isVirtualEditPoint() ? 8 : 15;
  }
}
