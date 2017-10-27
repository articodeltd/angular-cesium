import { Component, OnDestroy, ViewChild } from '@angular/core';
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
import { PolygonsEditorService } from '../../services/entity-editors/polygons-editor/polygons-editor.service';

@Component({
	selector : 'polygons-editor',
	templateUrl : './polygons-editor.component.html',
	providers : [CoordinateConverter, PolygonsManagerService]
})
export class PolygonsEditorComponent implements OnDestroy {
	
	public Cesium = Cesium;
	public editPoints$ = new Subject<AcNotification>();
	public editPolylines$ = new Subject<AcNotification>();
	public editPolygons$ = new Subject<AcNotification>();
	
	public appearance = new Cesium.PerInstanceColorAppearance({flat : true});
	public attributes = {color : Cesium.ColorGeometryInstanceAttribute.fromColor(new Cesium.Color(0.2, 0.2, 0.5, 0.5))};
	public polygonColor = new Cesium.Color(0.1, 0.5, 0.2, 0.4);
	public lineColor = new Cesium.Color(0, 0, 0, 0.6);
	
	@ViewChild('editPolygonsLayer') private editPolygonsLayer: AcLayerComponent;
	@ViewChild('editPointsLayer') private editPointsLayer: AcLayerComponent;
	@ViewChild('editPolylinesLayer') private editPolylinesLayer: AcLayerComponent;
	
	constructor(private polygonsEditor: PolygonsEditorService,
							private coordinateConverter: CoordinateConverter,
							private mapEventsManager: MapEventsManagerService,
							private cameraService: CameraService,
							private polygonsManager: PolygonsManagerService) {
		this.polygonsEditor.init(this.mapEventsManager, this.coordinateConverter, this.cameraService, polygonsManager);
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
				this.polygonsManager.createEditablePolygon(
					update.id,
					this.editPolygonsLayer,
					this.editPointsLayer,
					this.editPolylinesLayer,
					this.coordinateConverter);
				break;
			}
			case EditActions.MOUSE_MOVE: {
				const polygon = this.polygonsManager.get(update.id);
				if (update.updatedPosition) {
					polygon.moveTempMovingPoint(update.updatedPosition);
				}
				break;
			}
			case EditActions.ADD_POINT: {
				const polygon = this.polygonsManager.get(update.id);
				if (update.updatedPosition) {
					polygon.addPoint(update.updatedPosition);
				}
				break;
			}
			case EditActions.ADD_LAST_POINT: {
				const polygon = this.polygonsManager.get(update.id);
				if (update.updatedPosition) {
					polygon.addLastPoint(update.updatedPosition);
				}
				break;
			}
			case EditActions.DISPOSE: {
				const polygon = this.polygonsManager.get(update.id);
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
				this.polygonsManager.createEditablePolygon(
					update.id,
					this.editPolygonsLayer,
					this.editPointsLayer,
					this.editPolylinesLayer,
					this.coordinateConverter,
					update.positions
				);
				break;
			}
			case EditActions.DRAG_POINT: {
				const polygon = this.polygonsManager.get(update.id);
				if (polygon && polygon.enableEdit) {
					polygon.movePoint(update.updatedPosition, update.updatedPoint);
				}
				break;
			}
			case EditActions.DRAG_POINT_FINISH: {
				const polygon = this.polygonsManager.get(update.id);
				if (polygon && polygon.enableEdit && update.updatedPoint.isVirtualEditPoint()) {
					polygon.addVirtualEditPoint(update.updatedPoint);
				}
				break;
			}
			case EditActions.REMOVE_POINT: {
				const polygon = this.polygonsManager.get(update.id);
				if (polygon && polygon.enableEdit) {
					polygon.removePoint(update.updatedPoint);
				}
				break;
			}
			case EditActions.DISABLE: {
				const polygon = this.polygonsManager.get(update.id);
				if (polygon) {
					polygon.enableEdit = false;
				}
				break;
			}
			case EditActions.ENABLE: {
				const polygon = this.polygonsManager.get(update.id);
				if (polygon) {
					polygon.enableEdit = true;
				}
				break;
			}
			case EditActions.SET_MANUALLY: {
				const polygon = this.polygonsManager.get(update.id);
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
		this.polygonsManager.clear();
	}
	
	getPointSize(point: EditPoint) {
		return point.isVirtualEditPoint() ? 8 : 15;
	}
}
