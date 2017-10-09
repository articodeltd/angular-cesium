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
		if (this.editing$){
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
		if (this.editing$){
			this.stopEdit();
		}
		const initialPos = [
			new Cesium.Cartesian3(4440904.571196385, 1811131.602927208, 4190519.2863029838),
			new Cesium.Cartesian3(3699985.433274284, 4736430.171250641, 2127548.480685681),
			new Cesium.Cartesian3(5721024.065677434, 1660550.1936609931, 2271194.3507190347)];
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
	
	
}
