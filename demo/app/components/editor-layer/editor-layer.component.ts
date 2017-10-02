import { Component, OnInit } from '@angular/core';
import { PolygonsEditorService } from '../../../../src/angular-cesium-entities-editor/services/entity-editors/polygons-editor/polygons-editor.service';
import { EditActions } from '../../../../src/angular-cesium-entities-editor/models/edit-actions.enum';
import { PolygonEditUpdate } from '../../../../src/angular-cesium-entities-editor/models/polygon-edit-update';
import { EditorObservable } from '../../../../src/angular-cesium-entities-editor/models/editor-observable';

@Component({
	selector : 'editor-layer',
	templateUrl : 'editor-layer.component.html',
	styleUrls: ['./editor-layer.component.css']
})
export class EditorLayerComponent implements OnInit {
	
	editing$: EditorObservable<PolygonEditUpdate>;
	
	constructor(private polygonsEditor: PolygonsEditorService) {
	}
	
	ngOnInit(): void {
		this.startEdit();
	}
	
	startEdit() {
		this.editing$ = this.polygonsEditor.create();
		this.editing$.subscribe(x => {
			if (x.editAction === EditActions.ADD_LAST_POINT) {
				console.log(x.positions);
			}
		})
		
	}
	
	stopEdit() {
		this.editing$.dispose();
	}
	
	
}
