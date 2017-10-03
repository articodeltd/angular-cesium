import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polygons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditablePolygon } from '../../models/editable-polygon';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';

@Component({
  selector: 'polygons-editor',
  templateUrl: './polygons-editor.component.html',
  providers: [CoordinateConverter]
})
export class PolygonsEditorComponent implements OnDestroy {
  private polygons = new Map<string, EditablePolygon>();
  public Cesium = Cesium;
  public editPoints$ = new Subject<AcNotification>();
  public editPolylines$ = new Subject<AcNotification>();
  public editPolygons$ = new Subject<AcNotification>();

  public appearance = new Cesium.PerInstanceColorAppearance({ flat: true });
  public attributes = { color: Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.2, 0.2, 0.5, 0.5)) };
  public polygonColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);
  public lineColor = new Cesium.Color(0, 0, 0, 0.6);

  @ViewChild('editPolygonsLayer') private editPolygonsLayer: AcLayerComponent;
  @ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
  @ViewChild('editPolylinesLayer') private editPolylinesLayer: AcLayerComponent;

  constructor(private polygonsEditor: PolygonsEditorService,
              private coordinateConverter: CoordinateConverter,
              private mapEventsManager: MapEventsManagerService,
              private cameraService: CameraService) {
    this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService);
		this.startListeningToEditorUpdates();
  }
	
	private startListeningToEditorUpdates() {
		this.polygonsEditor.onUpdate().subscribe((update: PolygonEditUpdate) => {
			if (update.editMode === EditModes.CREATE || update.editMode === EditModes.CREATE_OR_EDIT) {
				this.handleCreateUpdates(update);
			}
			else if (update.editMode === EditModes.EDIT) {
				this.handleEditUpdates(update);
			}
		});
	}

  handleCreateUpdates(update: PolygonEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.polygons.set(update.id,
          new EditablePolygon(update.id,
            this.editPolygonsLayer,
            this.editPointsLayer,
            this.editPolylinesLayer)
        );
        break;
      }
      case EditActions.MOUSE_MOVE: {
        const polygon = this.polygons.get(update.id);
        if (update.updatedPosition) {
          polygon.movePoint(update.updatedPosition);
        }
        break;
      }
      case EditActions.ADD_POINT: {
        const polygon = this.polygons.get(update.id);
        if (update.updatedPosition) {
          polygon.addPoint(update.updatedPosition);
        }
        break;
      }
      case EditActions.ADD_LAST_POINT: {
        const polygon = this.polygons.get(update.id);
        if (update.updatedPosition) {
          polygon.addLastPoint(update.updatedPosition);
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

  handleEditUpdates(update: PolygonEditUpdate) {
    switch (update.editAction) {
      case EditActions.INIT: {
        this.polygons.set(update.id,
          new EditablePolygon(update.id,
            this.editPolygonsLayer,
            this.editPointsLayer,
            this.editPolylinesLayer,
            update.positions)
        );
        break;
      }
      case EditActions.DRAG_POINT: {
        const polygon = this.polygons.get(update.id);
        if (polygon) {
          polygon.movePoint(update.updatedPosition, update.updatedEntity);
        }
        break;
      }
      case EditActions.REMOVE_POINT: {
        const polygon = this.polygons.get(update.id);
        if (polygon) {
          polygon.removePoint(update.updatedEntity);
        }
        break;
      }
      default: {
        return;
      }
    }
  }

  ngOnDestroy(): void {
    this.polygons.forEach(polygon => polygon.dispose());
    this.polygons.clear();
  }
}
