import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { CesiumService } from '../../../angular-cesium/services/cesium/cesium.service';
import { EditModes } from '../../models/edit-mode.enum';
import { RectangleEditUpdate } from '../../models/rectangle-edit-update';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { RectanglesManagerService } from '../../services/entity-editors/rectangles-editor/rectangles-manager.service';
import { RectanglesEditorService } from '../../services/entity-editors/rectangles-editor/rectangles-editor.service';
import { LabelProps } from '../../models/label-props';
import { EditableRectangle } from '../../models/editable-rectangle';

@Component({
  selector: 'rectangles-editor',
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

    <ac-layer #editRectanglesLayer acFor="let rectangle of editRectangles$" [context]="this">
      <ac-rectangle-desc
        props="{
          coordinates: rectangle.getRectangleCallbackProperty(),
          material: rectangle.rectangleProps.material,
          fill: rectangle.rectangleProps.fill,
          classificationType: rectangle.rectangleProps.classificationType,
          zIndex: rectangle.rectangleProps.zIndex,
          outline: rectangle.rectangleProps.outline,
          outlineColor: rectangle.rectangleProps.outlineColor,
          height: rectangle.rectangleProps.height,
          extrudedHeight: rectangle.rectangleProps.extrudedHeight
        }"
      >
      </ac-rectangle-desc>
      <ac-array-desc acFor="let label of rectangle.labels" [idGetter]="getLabelId">
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
  providers: [CoordinateConverter, RectanglesManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RectanglesEditorComponent implements OnDestroy {
  private editLabelsRenderFn: (update: RectangleEditUpdate, labels: LabelProps[]) => LabelProps[];
  public editPoints$ = new Subject<AcNotification>();
  public editRectangles$ = new Subject<AcNotification>();

  @ViewChild('editRectanglesLayer') private editRectanglesLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;

  constructor(
    private rectanglesEditor: RectanglesEditorService,
    private coordinateConverter: CoordinateConverter,
    private mapEventsManager: MapEventsManagerService,
    private cameraService: CameraService,
    private rectanglesManager: RectanglesManagerService,
    private cesiumService: CesiumService
  ) {
    this.rectanglesEditor.init(
      this.mapEventsManager,
      this.coordinateConverter,
      this.cameraService,
      this.rectanglesManager,
      this.cesiumService
    );
    this.startListeningToEditorUpdates();
  }

  private startListeningToEditorUpdates() {
    this.rectanglesEditor.onUpdate().subscribe((update: RectangleEditUpdate) => {
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

  renderEditLabels(rectangle: EditableRectangle, update: RectangleEditUpdate, labels?: LabelProps[]) {
    update.positions = rectangle.getRealPositions();
    update.points = rectangle.getRealPoints();

    if (labels) {
      rectangle.labels = labels;
      this.editRectanglesLayer.update(rectangle, rectangle.getId());
      return;
    }

    if (!this.editLabelsRenderFn) {
      return;
    }

    rectangle.labels = this.editLabelsRenderFn(update, rectangle.labels);
    this.editRectanglesLayer.update(rectangle, rectangle.getId());
  }

  removeEditLabels(rectangle: EditableRectangle) {
    rectangle.labels = [];
    this.editRectanglesLayer.update(rectangle, rectangle.getId());
  }

  handleCreateUpdates(update: RectangleEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.rectanglesManager.createEditableRectangle(
          update.id,
          this.editRectanglesLayer,
          this.editPointsLayer,
          this.coordinateConverter,
          update.rectangleOptions,
        );
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (update.updatedPosition) {
          rectangle.moveTempMovingPoint(update.updatedPosition);
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (update.updatedPosition) {
          rectangle.moveTempMovingPoint(update.updatedPosition);
          rectangle.addPoint(update.updatedPosition);
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (update.updatedPosition) {
          rectangle.addLastPoint(update.updatedPosition);
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.DISPOSE: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle) {
          this.removeEditLabels(rectangle);
          rectangle.dispose();
        }
        this.editLabelsRenderFn = undefined;
        break;
      }
      case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
        const rectangle = this.rectanglesManager.get(update.id);
        this.editLabelsRenderFn = update.labelsRenderFn;
        this.renderEditLabels(rectangle, update);
        break;
      }
      case EditActions.UPDATE_EDIT_LABELS: {
        const rectangle = this.rectanglesManager.get(update.id);
        this.renderEditLabels(rectangle, update, update.updateLabels);
        break;
      }
      case EditActions.SET_MANUALLY: {
        const rectangle = this.rectanglesManager.get(update.id);
        this.renderEditLabels(rectangle, update, update.updateLabels);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update: RectangleEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.rectanglesManager.createEditableRectangle(
          update.id,
          this.editRectanglesLayer,
          this.editPointsLayer,
          this.coordinateConverter,
          update.rectangleOptions,
          update.positions,
        );
        break;
      }
      case EditActions.DRAG_POINT: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle && rectangle.enableEdit) {
          rectangle.movePoint(update.updatedPosition, update.updatedPoint);
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.DRAG_POINT_FINISH: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle && rectangle.enableEdit) {
          rectangle.endMovePoint();
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.DISABLE: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle) {
          rectangle.enableEdit = false;
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.ENABLE: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle) {
          rectangle.enableEdit = true;
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      case EditActions.DRAG_SHAPE: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle && rectangle.enableEdit) {
          rectangle.moveShape(update.draggedPosition, update.updatedPosition);
          this.renderEditLabels(rectangle, update);
        }
        break;
      }

      case EditActions.DRAG_SHAPE_FINISH: {
        const rectangle = this.rectanglesManager.get(update.id);
        if (rectangle && rectangle.enableEdit) {
          rectangle.endMoveShape();
          this.renderEditLabels(rectangle, update);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.rectanglesManager.clear();
  }

  getPointSize(point: EditPoint) {
    return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
  }

  getPointShow(point: EditPoint) {
    return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
  }
}

