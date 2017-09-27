import { Component, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polgons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../src/models/ac-notification';
import { EditPolygon } from '../../models/edit-polygon';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../src/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../src/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../src/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'polygons-editor',
  templateUrl: 'polygons-editor.component.html',
  providers: [CoordinateConverter]
})
export class PolygonsEditorComponent implements OnInit, OnChanges, OnDestroy {
  private polygons = new Map<string, EditPolygon>();
  public Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editPolylines$ = new Subject<AcNotification>();
  public editPolygons$ = new Subject<AcNotification>();

  @ViewChild('editPolygonsLayer') private editPolygonsLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
  @ViewChild('editPolylinesLayer') private editPolylinesLayer: AcLayerComponent;

  constructor(private polygonsEditor: PolygonsEditorService,
              private coordinateConverter: CoordinateConverter,
              private mapEventsManager: MapEventsManagerService) {
    this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter);
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
        if (update.updatedPosition) {
          polygon.movePoint(update.updatedPosition);
        }
        break;
      }
      case EditActions.ADD_POINT:
      case EditActions.DONE: {
        const polygon = this.polygons.get(update.id);
        if (update.updatedPosition) {
          polygon.addPoint(update.updatedPosition);
        }
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
