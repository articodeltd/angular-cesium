import { Component, OnDestroy, ViewChild } from '@angular/core';
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polygons-editor.service';
import { EditModes } from '../../models/edit-mode.enum';
import { PolygonEditUpdate } from '../../models/polygon-edit-update';
import { AcNotification } from '../../../angular-cesium/models/ac-notification';
import { EditActions } from '../../models/edit-actions.enum';
import { AcLayerComponent } from '../../../angular-cesium/components/ac-layer/ac-layer.component';
import { CoordinateConverter } from '../../../angular-cesium/services/coordinate-converter/coordinate-converter.service';
import { MapEventsManagerService } from '../../../angular-cesium/services/map-events-mananger/map-events-manager';
import { Subject } from 'rxjs/Subject';
import { CameraService } from '../../../angular-cesium/services/camera/camera.service';
import { EditPoint } from '../../models/edit-point';
import { PolygonsManagerService } from '../../services/entity-editors/polygons-editor/polygons-manager.service';
import { HippodromeManagerService } from '../../services/entity-editors/hippodrome-editor/hippodrome-manager.service';

@Component({
	selector : 'hippodrome-editor',
	templateUrl : './hippodrome-editor.component.html',
	providers : [CoordinateConverter, PolygonsManagerService]
})
export class HippodromeEditorComponent implements OnDestroy {
	
	public Cesium = Cesium;
	public editPoints$ = new Subject<AcNotification>();
	public editHippodromes$ = new Subject<AcNotification>();
	
	@ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
	@ViewChild('editHippodromesLayer') private editHippodromes: AcLayerComponent;
	
	constructor(private polygonsEditor: PolygonsEditorService,
							private coordinateConverter: CoordinateConverter,
							private mapEventsManager: MapEventsManagerService,
							private cameraService: CameraService,
							private hippodromesManager: HippodromeManagerService) {
		this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, hippodromesManager);
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
				this.hippodromesManager.createEditableHippodrome(
					update.id,
					this.editPointsLayer,
					this.editHippodromes,
					this.coordinateConverter,
					update.polygonOptions);
				break;
			}
			case EditActions.MOUSE_MOVE: {
				const polygon = this.hippodromesManager.get(update.id);
				if (update.updatedPosition) {
					polygon.moveTempMovingPoint(update.updatedPosition);
				}
				break;
			}
			case EditActions.ADD_POINT: {
				const polygon = this.hippodromesManager.get(update.id);
				if (update.updatedPosition) {
					polygon.addPoint(update.updatedPosition);
				}
				break;
			}
			case EditActions.DISPOSE: {
				const polygon = this.hippodromesManager.get(update.id);
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
				this.hippodromesManager.createEditableHippodrome(
					update.id,
					this.editPointsLayer,
					this.editHippodromes,
					this.coordinateConverter,
					update.polygonOptions,
					update.positions
				);
				break;
			}
			case EditActions.DRAG_POINT: {
				const polygon = this.hippodromesManager.get(update.id);
				if (polygon && polygon.enableEdit) {
					polygon.movePoint(update.updatedPosition, update.updatedPoint);
				}
				break;
			}
			case EditActions.DRAG_POINT_FINISH: {
				break;
			}
			case EditActions.DISABLE: {
				const polygon = this.hippodromesManager.get(update.id);
				if (polygon) {
					polygon.enableEdit = false;
				}
				break;
			}
			case EditActions.ENABLE: {
				const polygon = this.hippodromesManager.get(update.id);
				if (polygon) {
					polygon.enableEdit = true;
				}
				break;
			}
			case EditActions.SET_MANUALLY: {
				const polygon = this.hippodromesManager.get(update.id);
				if (polygon) {
					polygon.setPointsManually(update.points);
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
