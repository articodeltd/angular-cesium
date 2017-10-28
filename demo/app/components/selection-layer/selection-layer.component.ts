import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { AcEntity } from '../../../../src/angular-cesium/models/ac-entity';
import { Cartesian3 } from '../../../../src/angular-cesium/models/cartesian3';
import { SelectionManagerService } from '../../../../src/angular-cesium/services/selection-manager/selection-manager.service';
import { CesiumEventModifier } from '../../../../src/angular-cesium/services/map-events-mananger/consts/cesium-event-modifier.enum';
import { CesiumEvent } from '../../../../src/angular-cesium/services/map-events-mananger/consts/cesium-event.enum';
import { AcLayerComponent } from '../../../../src/angular-cesium/components/ac-layer/ac-layer.component';
import { MdSnackBar } from '@angular/material';

class MyEntity extends AcEntity {
	selected = false;
	image = '/assets/fighter-jet.png';
	
	constructor(public position: Cartesian3,
							public id: string) {
		super();
	}
}

@Component({
	selector : 'selection-layer',
	templateUrl : 'selection-layer.component.html',
	styleUrls : [],
	providers : [SelectionManagerService]
})
export class SelectionLayerComponent implements OnInit {
	
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;
	
	selectionImage = '/assets/selected.png';
	entities$: Observable<AcNotification>;
	Cesium = Cesium;
	show = true;
	
	constructor(private selectionManager: SelectionManagerService, private snakBar: MdSnackBar) {
		const entities = [
			new MyEntity(Cesium.Cartesian3.fromDegrees(10.0, 30.0), '1'),
			new MyEntity(Cesium.Cartesian3.fromDegrees(33.0, 33.0), '2')
		];
		const entitiesNotifications = entities.map((entity, index) => ({
			id : entity.id,
			actionType : ActionType.ADD_UPDATE,
			entity
		}));
		this.entities$ = Observable.from(entitiesNotifications);
		this.snakBar.open('Click + ALT to selected the plane', 'ok');
	}
	
	ngOnInit() {
		this.selectionManager.initSelection({
			event : CesiumEvent.LEFT_CLICK,
			modifier : CesiumEventModifier.ALT
		});
		
		this.selectionManager.selectedEntity$().subscribe(selectedEntity => {
			const myEntity = selectedEntity as MyEntity;
			this.layer.update(myEntity, myEntity.id);
			
			console.log('all selected entities:', this.selectionManager.selectedEntities());
		});
	}
	
	setShow($event) {
		this.show = $event
	}
	
}
