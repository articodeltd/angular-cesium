import { Component, OnInit } from '@angular/core';
import { PolygonsEditorService } from '../../../../src/angular-cesium-entities-editor/services/entity-editors/polygons-editor/polygons-editor.service';
import { PolygonEditUpdate } from '../../../../src/angular-cesium-entities-editor/models/polygon-edit-update';
import { EditorObservable } from '../../../../src/angular-cesium-entities-editor/models/editor-observable';
import { EditActions } from '../../../../src/angular-cesium-entities-editor/models/edit-actions.enum';

@Component({
	selector : 'editor-layer',
	templateUrl : 'editor-layer.component.html',
	styleUrls : ['./editor-layer.component.css']
})
export class EditorLayerComponent implements OnInit {
	
	editing$: EditorObservable<PolygonEditUpdate>;
	enableEditing = true;
	
	constructor(private polygonsEditor: PolygonsEditorService) {
	}
	
	ngOnInit(): void {
		// this.startEdit();
	}
	
	startEdit() {
		if (this.editing$) {
			this.stopEdit();
		}
		this.editing$ = this.polygonsEditor.create();
		this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {
			
			if (editUpdate.editAction === EditActions.ADD_POINT) {
				console.log(editUpdate.points); // point = position with id
				console.log(editUpdate.positions); // or just position
				console.log(editUpdate.updatedPosition); // added position
			}
		});
	}
	
	stopEdit() {
		this.editing$.dispose();
	}
	
	
	editFromExisting() {
		if (this.editing$) {
			this.stopEdit();
		}
		const initialPos = [
			Cesium.Cartesian3.fromDegrees(20, 40),
			Cesium.Cartesian3.fromDegrees(45, 40),
			Cesium.Cartesian3.fromDegrees(30, 20)];
		this.editing$ = this.polygonsEditor.edit(initialPos);
		this.editing$.subscribe((editUpdate: PolygonEditUpdate) => {
			
			if (editUpdate.editAction === EditActions.DRAG_POINT_FINISH) {
				console.log(editUpdate.points); // point = position with id
				console.log(editUpdate.positions); // or just position
				console.log(editUpdate.updatedPosition); // added position
			}
		});
	}
	
	toggleEnableEditing() {
		// Only effects if in edit mode (all polygon points were created)
		this.enableEditing = !this.enableEditing;
		if (this.enableEditing) {
			this.editing$.enable();
		} else {
			this.editing$.disable();
		}
	}
	
	updatePointManually() {
		if (this.editing$) {
			// Only effects if in edit mode (all polygon points were created)
			const polygonPoints = this.editing$.getCurrentPoints();
			
			const firstPoint = polygonPoints[0];
			firstPoint.setPosition(Cesium.Cartesian3.fromDegrees(20, 20));
			this.editing$.setPointsManually(polygonPoints);
			
		}
	}
}
