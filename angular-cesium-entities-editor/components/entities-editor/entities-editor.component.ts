import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polgons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../src/models/ac-notification';
import { ActionType } from '../../../src/models/action-type.enum';
import { EditPolygon } from '../../models/edit-polygon';

@Component({
  selector: 'entities-editor',
  templateUrl: 'entities-editor.component.html',
})
export class EntitiesEditorComponent implements OnInit, OnChanges, OnDestroy {
  public editPoints = new Subject<AcNotification>();
  public editLines = new Subject<AcNotification>();
  public editedPolygons = new Subject<AcNotification>();
  private polygonsEditGraphics = new Map<string, >();

  constructor(private polygonsEditor: PolygonsEditorService) {
  }

  ngOnInit(): void {
    this.polygonsEditor.onUpdate().subscribe((update: PolygonEditUpdate) => {
      if (update.editMode === EditModes.EDIT) {
        this.editedPolygons.next({
          id: update.id,
          entity: { positions: update.positions },
          actionType: ActionType.ADD_UPDATE,
        });
      }
      else {
        this.editPoints.next({
          id: update.updatedPosition.id,
          entity: { positions: update.updatedPosition },
          actionType: ActionType.ADD_UPDATE,
        });
        this.editLines.next({
          id: update.id,
          entity: update.updatedPosition,
          actionType: update.actionType
        });
      }
    });
  }

  handleCreateUpdates(update: PolygonEditUpdate) {
    if (update.positions.length >= 3) {
      this.editedPolygons.next({
        id: update.id,
        entity: new EditPolygon({ id: update.id, positions: update.positions }),
        actionType: ActionType.ADD_UPDATE,
      });
    }
    this.editPoints.next({
      id:
    })
  }

  handleEditUpdates(update) {

  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  ngOnDestroy(): void {
  }
}
