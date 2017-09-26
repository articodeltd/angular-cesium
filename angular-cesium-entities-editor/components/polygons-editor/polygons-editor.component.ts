import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polgons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../src/models/ac-notification';
import { ActionType } from '../../../src/models/action-type.enum';
import { EditPolygon } from '../../models/edit-polygon';
import { EditActions } from '../../models/edit-actions.enum';
import { EditPoint } from '../../models/edit-point';
import { EditPolyline } from '../../models/edit-polyline';
import { AcLayerComponent } from '../../../src/components/ac-layer/ac-layer.component';

@Component({
  selector: 'polygons-editor',
  templateUrl: 'polygons-editor.component.html',
})
export class PolygonsEditorComponent implements OnInit, OnChanges, OnDestroy {
  public Cesium;
  public editPoints = new Subject<AcNotification>();
  public editLines = new Subject<AcNotification>();
  public editedPolygons = new Subject<AcNotification>();
  private polygonsLastPoint = new Map<string, EditPoint>();
  private polygonsLastPolyline = new Map<string, EditPolyline>();
  private polygonsEditPoints = new Map<string, Map<EditPoint, EditPoint>>();
  private polygonsEditLines = new Map<string, EditPolyline[]>();
  private editPointsPolylines = new Map<string, { startingLine: string, endingLine: string }>();
  private counter = 0;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;

  constructor(private polygonsEditor: PolygonsEditorService) {
  }

  ngOnInit(): void {
    this.polygonsEditor.onUpdate().subscribe((update: PolygonEditUpdate) => {
      if (update.editMode === EditModes.CREATE) {
        this.handleCreateUpdates(update);
      }
    });
  }

  handleCreateUpdates(update: PolygonEditUpdate) {
    const polygonId = update.id;

    switch (update.editAction) {
      case EditActions.INIT: {
        this.editedPolygons
        this.polygonsLastPoint.get(polygonId);
        this.
      }
    }

    if (update.editAction === EditActions.INIT) {

    }

    if (update.editAction === EditActions.MOUSE_MOVE) {
      let point = this.polygonsLastPoint.get(polygonId);
      if (point) {
        point.setPosition(update.updatedPosition);
        this.editPointsLayer.update(point, point.getId());
      }
      else {
        point = new EditPoint(polygonId, update.updatedPosition);
        this.polygonsLastPoint.set(update.id, point);
        this.pol
      }
    }

    if (update.editAction === EditActions.ADD_POINT) {
      const point = new EditPoint(polygonId, update.updatedPosition);
      if (!this.polygonsEditPoints.has(polygonId)) {
        this.polygonsEditPoints.set(polygonId, new Map());
      }
      this.polygonsEditPoints.get(update.id).set(point, point);
      this.editPoints.next({
        id: update.id,
        entity:
      })
    }

    if (update.positions.length >= 3) {
      this.editedPolygons.next({
        id: update.id,
        entity: new EditPolygon({ id: update.id, positions: update.positions }),
        actionType: ActionType.ADD_UPDATE,
      });
    }
  }

  handleEditUpdates(update) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }

  generateId() {
    return 'edit-polygon-sub-entity-' + this.counter++;
  }
}
