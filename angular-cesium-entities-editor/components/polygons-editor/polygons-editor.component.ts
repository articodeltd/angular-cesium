import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polgons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../src/models/ac-notification';
import { EditPolygon } from '../../models/edit-polygon';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../src/components/ac-layer/ac-layer.component';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'polygons-editor',
  templateUrl: 'polygons-editor.component.html',
})
export class PolygonsEditorComponent implements OnInit, OnChanges, OnDestroy {
  public Cesium;
  public editPoints = new Observable<AcNotification>();
  public editLines = new Observable<AcNotification>();
  public editPolygons = new Observable<AcNotification>();
  private polygons = new Map<string, EditPolygon>();
  private counter = 0;
  @ViewChild('editPolygonsLayer') private editPolygonsLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
  @ViewChild('editPolylinesLayer') private editPolylinesLayer: AcLayerComponent;

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
    switch (update.editAction) {
      case EditActions.INIT: {
        this.polygons.set(update.id, new EditPolygon(update.id, this.editPolygonsLayer, this.editPointsLayer, this.editPolylinesLayer));
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const polygon = this.polygons.get(update.id);
        polygon.movePoint(update.updatedPosition);
        break;
      }
      case EditActions.ADD_POINT:
      case EditActions.DONE: {
        const polygon = this.polygons.get(update.id);
        polygon.addPoint(update.updatedPosition);
        break;
      }
      case EditActions.DISPOSE: {
        const polygon = this.polygons.get(update.id);
        polygon.dispose();
        break;
      }
      default: {
        return;
      }
    }
  }

  handleEditUpdates(update) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }
}
