import { BillboardDrawerService } from './../../services/billboard-drawer/billboard-drawer.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcNotification } from '../../models/ac-notification';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/label-drawer/label-drawer.service';
import { SimpleDrawerService } from '../../services/simple-drawer/simple-drawer.service';
import { StaticCircleDrawerService } from "../../services/static-circle-drawer/static-circle-drawer.service";
import { EllipseDrawerService } from '../../services/ellipse-drawer/ellipse-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { StaticPolylineDrawerService } from "../../services/static-polyline-drawer/static-polyline-drawer.service";
import {ArcDrawerService} from "../../services/arc-drawer/arc-drawer.service";

@Component({
	selector: 'ac-layer',
	templateUrl: './ac-layer.component.html',
	styleUrls: ['./ac-layer.component.css'],
	providers: [LayerService, ComputationCache, BillboardDrawerService, LabelDrawerService, EllipseDrawerService, DynamicEllipseDrawerService, DynamicPolylineDrawerService, StaticCircleDrawerService, StaticPolylineDrawerService, ArcDrawerService]
})
export class AcLayerComponent implements OnInit, OnChanges, AfterContentInit {
	@Input()
	show: boolean = true;
	@Input()
	acFor: string;
	@Input()
	context: any;

	private entityName: string;
	private observable: Observable<AcNotification>;
	private _drawerList: SimpleDrawerService[] = [];
	private _updateStream: Subject<AcNotification> = new Subject<AcNotification>();

	constructor(private  layerService: LayerService,
	            private _computationCache: ComputationCache,
	            billboardDrawerService: BillboardDrawerService,
	            labelDrawerService: LabelDrawerService,
	            ellipseDrawerService: EllipseDrawerService,
	            dynamicEllipseDrawerService: DynamicEllipseDrawerService,
	            dynamicPolylineDrawerService: DynamicPolylineDrawerService,
	            staticCircleDrawerService : StaticCircleDrawerService,
	            staticPolylineDrawerService: StaticPolylineDrawerService) {
		this._drawerList = Array.of(
			billboardDrawerService,
			labelDrawerService,
			ellipseDrawerService,
			dynamicEllipseDrawerService,
			dynamicPolylineDrawerService,
			staticCircleDrawerService,
			staticPolylineDrawerService
		);
	}

	init() {
		const acForArr = this.acFor.split(' ');
		this.observable = this.context[acForArr[3]];
		this.entityName = acForArr[1];

		this.observable.merge(this._updateStream).subscribe((notification) => {
			this._computationCache.clear()
			this.context[this.entityName] = notification.entity;
			this.layerService.getDescriptions().forEach((descriptionComponent) => {
				switch (notification.actionType) {
					case ActionType.ADD_UPDATE:
						descriptionComponent.draw(this.context, notification.id, notification.entity);
						break;
					case ActionType.DELETE:
						descriptionComponent.remove(notification.id);
						break;
					default:
						console.error('unknown action type: ' + notification.actionType)
				}
			})
		});
	}

	ngAfterContentInit(): void {
		this.init();
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['show']) {
			const showValue = changes['show'].currentValue;
			this._drawerList.forEach((drawer)=>drawer.setShow(showValue));
		}
	}

	removeAll(): void {
		this.layerService.getDescriptions().forEach((description)=>description.removeAll());
	}

	remove(entityId: number) {
		this._updateStream.next({id: entityId, actionType: ActionType.DELETE})
	}

	update(notification: AcNotification): void {
		this._updateStream.next(notification);
	}

	refreshAll(collection: AcNotification[]): void {
		// TODO make entity interface: collection of type entity not notification
		Observable.from(collection).subscribe((entity)=>this._updateStream.next(entity));
	}
}
