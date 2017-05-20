import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AcNotification } from '../../../../src/models/ac-notification';
import { ActionType } from '../../../../src/models/action-type.enum';
import { AcLayerComponent } from '../../../../src/components/ac-layer/ac-layer.component';

@Component({
	selector: 'base-layer',
	templateUrl: 'base-layer.component.html',
	styleUrls: ['base-layer.component.css']
})
export class BaseLayerComponent implements OnInit, AfterViewInit {
	@ViewChild(AcLayerComponent) layer: AcLayerComponent;

	bases$: Observable<AcNotification>;
	show = true;

	constructor() {
		const base1: AcNotification = {
			id: 0,
			actionType: ActionType.ADD_UPDATE,
			entity: {name: 'base haifa', position: Cesium.Cartesian3.fromRadians(1.5, 1.5), show: true}
		};
		const base2 = {
			id: 1,
			actionType: ActionType.ADD_UPDATE,
			entity: {name: 'base yafo', position: Cesium.Cartesian3.fromRadians(1.9, 1.9), show: true}
		};
		const baseArray = [base1, base2];
		this.bases$ = Observable.from(baseArray);

		setTimeout(() => {
			base2.entity.name = 'base tel aviv';
			this.layer.updateNotification(base2);
		}, 5000);
		setTimeout(() => {
			this.layer.refreshAll(baseArray);
		}, 10000);
	}

	ngOnInit() {
	}

	ngAfterViewInit() {

	}

	removeAll() {
		this.layer.removeAll();
	}

	setShow($event) {
		this.show = $event;
	}

}
