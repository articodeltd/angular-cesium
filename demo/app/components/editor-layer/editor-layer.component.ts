import { AfterViewInit, Component, OnInit } from '@angular/core';
import { PolygonsEditorService } from '../../../../src/angular-cesium-entities-editor/services/entity-editors/polygons-editor/polygons-editor.service';
import { EditActions } from '../../../../src/angular-cesium-entities-editor/models/edit-actions.enum';

@Component({
	selector : 'editor-layer',
	templateUrl : 'editor-layer.component.html',
})
export class EditorLayerComponent implements AfterViewInit, OnInit {
	ngOnInit(): void {
		const editor$ = this.polygonsEditor.create();
		editor$.subscribe(x => {
			if (x.editAction === EditActions.ADD_LAST_POINT) {
				console.log(x.positions);
			}
		})
	}
	
	ngAfterViewInit(): void {
		// const editor$ = this.polygonsEditor.create();
		// editor$.subscribe(x => {
		// 	if (x.editAction === EditActions.ADD_LAST_POINT) {
		// 		console.log(x.positions);
		// 	}
		// })
	}
	
	constructor(private polygonsEditor: PolygonsEditorService) {
	}
	
	
}
