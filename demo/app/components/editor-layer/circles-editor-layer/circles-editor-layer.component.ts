import { Component, OnInit } from '@angular/core';
import { CircleEditorObservable } from '../../../../../src/angular-cesium-entities-editor/models/circle-editor-observable';
import { CircleEditUpdate } from '../../../../../src/angular-cesium-entities-editor/models/circle-edit-update';
import { CirclesEditorService } from '../../../../../src/angular-cesium-entities-editor/services/entity-editors/circles-editor/circles-editor.service';

@Component({
	selector : 'circles-editor-layer',
	templateUrl : 'circles-editor-layer.component.html',
	styleUrls : ['./circles-editor-layer.component.css']
})
export class CirclesEditorLayerComponent implements OnInit {
	
	editing$: CircleEditorObservable;
	enableEditing = true;
	
	constructor(private circlesEditor: CirclesEditorService) {
	}
	
	ngOnInit(): void {
	}
	
	startEdit() {
		if (this.editing$) {
			this.stopEdit();
		}
		this.editing$ = this.circlesEditor.create({allowDrag: true});
		this.editing$.subscribe((editUpdate: CircleEditUpdate) => {
      console.log(editUpdate);
		});
	}
	
	stopEdit() {
    if (this.editing$) {
      this.editing$.dispose();
      this.editing$ = undefined;
    }
	}

	editFromExisting() {
		if (this.editing$) {
			this.stopEdit();
		}
		this.editing$ = this.circlesEditor.edit(Cesium.Cartesian3.fromDegrees(-70, 0), 800000);
	}

	toggleEnableEditing() {
		// Only effects if in edit mode (all polygon points were created)
    if (!this.editing$) {
      return;
    }
		this.enableEditing = !this.enableEditing;
		if (this.enableEditing) {
			this.editing$.enable();
		} else {
			this.editing$.disable();
		}
	}
	
	updateCircleManually() {
		if (this.editing$) {
			this.editing$.setManually(Cesium.Cartesian3.fromDegrees(-80, 0), 500000);
		}
	}
}
