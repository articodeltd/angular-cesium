import { ChangeDetectionStrategy, Component, OnDestroy, ViewChild } from '@angular/core';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { PolygonsManagerService } from '../../services/entity-editors/polygons-editor/polygons-manager.service';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polygons-editor.service';
import { LabelProps } from '../../models/label-props';
import { EditablePolygon } from '../../models/editable-polygon';

@Component({
  selector: 'polygons-editor',
  template: /*html*/ `
    <ac-layer #editPolylinesLayer acFor="let polyline of editPolylines$" [context]="this">
      <ac-polyline-primitive-desc
        props="{
        positions: polyline.getPositions(),
        width: polyline.props.width,
        material: polyline.props.material()
    }"
      >
      </ac-polyline-primitive-desc>
    </ac-layer>

    <ac-layer #editPointsLayer acFor="let point of editPoints$" [context]="this">
      <ac-point-desc
        props="{
        position: point.getPosition(),
        pixelSize: getPointSize(point),
        color: point.props.color,
        outlineColor: point.props.outlineColor,
        outlineWidth: point.props.outlineWidth,
        show: getPointShow(point)
    }"
      >
      </ac-point-desc>
    </ac-layer>

    <ac-layer #editPolygonsLayer acFor="let polygon of editPolygons$" [context]="this">
      <ac-polygon-desc
        props="{
        hierarchy: polygon.getPositionsHierarchyCallbackProperty(),
        material: polygon.polygonProps.material
    }"
      >
      </ac-polygon-desc>
      <!-- <ac-static-polygon-desc -->
      <!-- geometryProps="{ -->
      <!-- polygonHierarchy: polygon.getHierarchy(), -->
      <!-- height: 1 -->
      <!-- }" -->
      <!-- instanceProps="{ -->
      <!-- attributes: attributes -->
      <!-- }" -->
      <!-- primitiveProps="{ -->
      <!-- appearance: appearance -->
      <!-- }"> -->
      <!-- </ac-static-polygon-desc -->
      <ac-array-desc acFor="let label of polygon.labels" [idGetter]="getLabelId">
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
            verticalOrigin: label.verticalOrigin
        }"
        >
        </ac-label-primitive-desc>
      </ac-array-desc>
    </ac-layer>
  `,
  providers: [CoordinateConverter, PolygonsManagerService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PolygonsEditorComponent implements OnDestroy {
  private editLabelsRenderFn: (update: PolygonEditUpdate, labels: LabelProps[]) => LabelProps[];
  public Cesium = Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editPolylines$ = new Subject<AcNotification>();
  public editPolygons$ = new Subject<AcNotification>();

  public appearance = new Cesium.PerInstanceColorAppearance({flat: true});
  public attributes = {color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.2, 0.2, 0.5, 0.5))};
  public polygonColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);
  public lineColor = new Cesium.Color(0, 0, 0, 0.6);

  @ViewChild('editPolygonsLayer') private editPolygonsLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
  @ViewChild('editPolylinesLayer') private editPolylinesLayer: AcLayerComponent;

  constructor(
    private polygonsEditor: PolygonsEditorService,
    private coordinateConverter: CoordinateConverter,
    private mapEventsManager: MapEventsManagerService,
    private cameraService: CameraService,
    private polygonsManager: PolygonsManagerService,
  ) {
    this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polygonsManager);
    this.startListeningToEditorUpdates();
  }

  private startListeningToEditorUpdates() {
    this.polygonsEditor.onUpdate().subscribe((update: PolygonEditUpdate) => {
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

  renderEditLabels(polygon: EditablePolygon, update: PolygonEditUpdate, labels?: LabelProps[]) {
    update.positions = polygon.getRealPositions();
    update.points = polygon.getRealPoints();

    if (labels) {
      polygon.labels = labels;
      this.editPolygonsLayer.update(polygon, polygon.getId());
      return;
    }

    if (!this.editLabelsRenderFn) {
      return;
    }

    polygon.labels = this.editLabelsRenderFn(update, polygon.labels);
    this.editPolygonsLayer.update(polygon, polygon.getId());
  }

  removeEditLabels(polygon: EditablePolygon) {
    polygon.labels = [];
    this.editPolygonsLayer.update(polygon, polygon.getId());
  }

  handleCreateUpdates(update: PolygonEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.polygonsManager.createEditablePolygon(
          update.id,
          this.editPolygonsLayer,
          this.editPointsLayer,
          this.editPolylinesLayer,
          this.coordinateConverter,
          update.polygonOptions,
        );
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const polygon = this.polygonsManager.get(update.id);
        if (update.updatedPosition) {
          polygon.moveTempMovingPoint(update.updatedPosition);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const polygon = this.polygonsManager.get(update.id);
        if (update.updatedPosition) {
          polygon.addPoint(update.updatedPosition);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const polygon = this.polygonsManager.get(update.id);
        if (update.updatedPosition) {
          polygon.addLastPoint(update.updatedPosition);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.DISPOSE: {
        const polygon = this.polygonsManager.get(update.id);
        polygon.dispose();
        this.removeEditLabels(polygon);
        this.editLabelsRenderFn = undefined;
        break;
      }
      case EditActions.SET_EDIT_LABELS_RENDER_CALLBACK: {
        const polygon = this.polygonsManager.get(update.id);
        this.editLabelsRenderFn = update.labelsRenderFn;
        this.renderEditLabels(polygon, update);
        break;
      }
      case EditActions.UPDATE_EDIT_LABELS: {
        const polygon = this.polygonsManager.get(update.id);
        this.renderEditLabels(polygon, update, update.updateLabels);
        break;
      }
      case EditActions.SET_MANUALLY: {
        const polygon = this.polygonsManager.get(update.id);
        this.renderEditLabels(polygon, update, update.updateLabels);
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update: PolygonEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.polygonsManager.createEditablePolygon(
          update.id,
          this.editPolygonsLayer,
          this.editPointsLayer,
          this.editPolylinesLayer,
          this.coordinateConverter,
          update.polygonOptions,
          update.positions,
        );
        break;
      }
      case EditActions.DRAG_POINT: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon && polygon.enableEdit) {
          polygon.movePoint(update.updatedPosition, update.updatedPoint);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.DRAG_POINT_FINISH: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon && polygon.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
          polygon.changeVirtualPointToRealPoint(update.updatedPoint);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.REMOVE_POINT: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon && polygon.enableEdit) {
          polygon.removePoint(update.updatedPoint);
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.DISABLE: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon) {
          polygon.enableEdit = false;
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.DRAG_SHAPE: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon && polygon.enableEdit) {
          polygon.movePolygon(update.draggedPosition, update.updatedPosition);
          this.renderEditLabels(polygon, update);
        }
        break;
      }

      case EditActions.DRAG_SHAPE_FINISH: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon && polygon.enableEdit) {
          polygon.endMovePolygon();
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      case EditActions.ENABLE: {
        const polygon = this.polygonsManager.get(update.id);
        if (polygon) {
          polygon.enableEdit = true;
          this.renderEditLabels(polygon, update);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.polygonsManager.clear();
  }

  getPointSize(point: EditPoint) {
    return point.isVirtualEditPoint() ? point.props.virtualPointPixelSize : point.props.pixelSize;
  }

  getPointShow(point: EditPoint) {
    return point.show && (point.isVirtualEditPoint() ? point.props.showVirtual : point.props.show);
  }
}
