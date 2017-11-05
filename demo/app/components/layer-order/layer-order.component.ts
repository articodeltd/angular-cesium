import { Component, OnInit } from '@angular/core';
import { AcNotification } from '../../../../src/angular-cesium/models/ac-notification';
import { TracksDataProvider } from '../../../utils/services/dataProvider/tracksDataProvider.service';
import { ActionType } from '../../../../src/angular-cesium/models/action-type.enum';
import { WebSocketSupplier } from '../../../utils/services/webSocketSupplier/webSocketSupplier';
import { AcEntity } from '../../../../src/angular-cesium/models/ac-entity';
import { Observable } from 'rxjs/Observable';

@Component({
	selector : 'layer-order-example',
	template : `
      <ac-layer acFor="let track of simTracks1$" [context]="this" [zIndex]="firstZIndex">
          <ac-ellipse-desc props="{
														position: track.position,
														semiMajorAxis:450000.0,
														semiMinorAxis:280000.0,
														granularity:0.03,
														material: Cesium.Color.GREEN
					}"></ac-ellipse-desc>
      </ac-layer>
      <ac-layer acFor="let track of simTracks2$" [context]="this" [zIndex]="secondZIndex">
          <ac-ellipse-desc props="{
														position: track.position,
														semiMajorAxis:400000.0,
														semiMinorAxis:250000.0,
														granularity:0.03,
														material: Cesium.Color.RED
					}"></ac-ellipse-desc>
      </ac-layer>
      <button md-raised-button style="position: fixed; top: 200px;left: 200px" (click)="changeZIndex()">
          change order
      </button>
	`,
	providers : [TracksDataProvider]
})
export class LayerOrderComponent implements OnInit {
	
	Cesium = Cesium;
	simTracks1$: Observable<AcNotification> = Observable.of({
		id : '1',
		actionType : ActionType.ADD_UPDATE,
		entity : new AcEntity({
			position : Cesium.Cartesian3.fromDegrees(-90, 40),
		})
	});
	simTracks2$: Observable<AcNotification> = Observable.of({
		id : '2',
		actionType : ActionType.ADD_UPDATE,
		entity : new AcEntity({
			position : Cesium.Cartesian3.fromDegrees(-90, 40),
		})
	});
	
	show = true;
	firstZIndex = 0;
	secondZIndex = 1;
	
	constructor(webSocketSupllier: WebSocketSupplier) {
	}
	
	ngOnInit() {
	}
	
	changeZIndex() {
		if (this.firstZIndex === 0) {
			this.firstZIndex = 1;
			this.secondZIndex = 0;
		} else {
			this.secondZIndex = 1;
			this.firstZIndex = 0;
		}
	}
	
	
}
