import { BillboardDrawerService } from '../../services/billboard-drawer/billboard-drawer.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcNotification } from '../../models/ac-notification';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/label-drawer/label-drawer.service';
import { SimpleDrawerService } from '../../services/simple-drawer/simple-drawer.service';
import { StaticCircleDrawerService } from '../../services/static-circle-drawer/static-circle-drawer.service';
import { EllipseDrawerService } from '../../services/ellipse-drawer/ellipse-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/ellipse-drawer/dynamic-ellipse-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { StaticPolylineDrawerService } from '../../services/static-polyline-drawer/static-polyline-drawer.service';
import { PolygonDrawerService } from '../../services/polygon-drawer/polygon-drawer.service';
import { ArcDrawerService } from '../../services/arc-drawer/arc-drawer.service';

@Component({
	selector: 'ac-layer',
	template: '',
	providers: [
		LayerService, ComputationCache, BillboardDrawerService, LabelDrawerService, EllipseDrawerService,
		DynamicEllipseDrawerService, DynamicPolylineDrawerService, StaticCircleDrawerService,
		StaticPolylineDrawerService, PolygonDrawerService, ArcDrawerService
	]
})
export class AcLayerComponent implements OnInit, OnChanges, AfterContentInit {
	private static readonly acForRgx = /^let\s+.+\s+of\s+.+$/;

	@Input()
	show = true;
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
	            staticCircleDrawerService: StaticCircleDrawerService,
	            staticPolylineDrawerService: StaticPolylineDrawerService,
	            polygonDrawerService: PolygonDrawerService,
	            arcDrawerService: ArcDrawerService) {
		this._drawerList = Array.of(
			billboardDrawerService,
			labelDrawerService,
			ellipseDrawerService,
			dynamicEllipseDrawerService,
			dynamicPolylineDrawerService,
			staticCircleDrawerService,
			staticPolylineDrawerService,
			polygonDrawerService,
			arcDrawerService
		);
	}

	init() {
		this.initValidParams();

		this.observable.merge(this._updateStream).subscribe((notification) => {
			this._computationCache.clear();
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
						console.error('unknown action type: ' + notification.actionType);
				}
			});
		});
	}

	private initValidParams() {
		if (!this.context) {
			throw 'ac-layer: must initialize [context] ';
		}

		if (!AcLayerComponent.acForRgx.test(this.acFor)) {
			throw 'ac-layer: must initialize [acFor] with a valid syntax \' [acFor]=\"let item of observer$\" \' '
			+ 'instead received: ' + this.acFor;
		}
		const acForArr = this.acFor.split(' ');
		this.observable = this.context[acForArr[3]];
		this.entityName = acForArr[1];
		if (!this.observable || !(this.observable instanceof Observable)) {
			throw  'ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable;
		}
	}

	ngAfterContentInit(): void {
		this.init();
	}

	ngOnInit(): void {
	}

	ngOnChanges(changes: SimpleChanges): void {
		if (changes['show']) {
			const showValue = changes['show'].currentValue;
			this._drawerList.forEach((drawer) => drawer.setShow(showValue));
		}
	}

	removeAll(): void {
		this.layerService.getDescriptions().forEach((description) => description.removeAll());
	}

	remove(entityId: number) {
		this._updateStream.next({id: entityId, actionType: ActionType.DELETE});
	}

	update(notification: AcNotification): void {
		this._updateStream.next(notification);
	}

	refreshAll(collection: AcNotification[]): void {
		// TODO make entity interface: collection of type entity not notification
		Observable.from(collection).subscribe((entity) => this._updateStream.next(entity));
	}
}
