import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { Component, OnInit, Input, OnChanges, SimpleChanges, AfterContentInit, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcNotification } from '../../models/ac-notification';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { SimpleDrawerService } from '../../services/drawers/simple-drawer/simple-drawer.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-circle-drawer/static-circle-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { DynamicEllipseDrawerService } from '../../services/drawers/ellipse-drawer/dynamic-ellipse-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { StaticPolylineDrawerService } from '../../services/drawers/static-polyline-drawer/static-polyline-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { AcEntity } from '../../models/ac-entity';

/**
 *  This is a ac-layer implementation.
 *  The ac-layer element must be a child of ac-map element.
 *  __param:__ {string} acfor - get the track observable and entityName (see the example)
 *  __param:__ {boolean} show - show/hide layer's entities
 *  __param:__ {any} context - get the context layer that will use the componnet (most of the time equal to "this")
 *
 *  __Usage :__
 *  ```
 *  &lt;ac-map&gt;
 *      &lt;ac-layer acFor="let track of tracks$" [show]="showTracks" [context]="this"&gt;
 *          &lt;ac-billboard-desc props="{
 *               image: track.image,
 *               position: track.position,
 *               scale: track.scale,
 *               color: track.color,
 *               name: track.name
 *          }"&gt;
 *      &lt;/ac-billboard-desc>
 *          &lt;ac-label-desc props="{
 *               position: track.position,
 *               pixelOffset : [-15,20] | pixelOffset,
 *               text: track.name,
 *               font: '15px sans-serif'
 *          }"&gt;
 *          &lt;/ac-label-desc&gt;
 *      &lt;/ac-layer&gt;
 *  &lt;/ac-map&gt;
 *  ```
 */
@Component({
	selector: 'ac-layer',
	template: '',
	providers: [
		LayerService, ComputationCache, BillboardDrawerService, LabelDrawerService, EllipseDrawerService,
		DynamicEllipseDrawerService, DynamicPolylineDrawerService, StaticCircleDrawerService,
		StaticPolylineDrawerService, PolygonDrawerService, ArcDrawerService, PointDrawerService
	]
})
export class AcLayerComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
	private static readonly acForRgx = /^let\s+.+\s+of\s+.+$/;

	@Input()
	show = true;
	@Input()
	acFor: string;
	@Input()
	context: any;
	@Input()
	store = false;

	private entityName: string;
	private stopObservable = new Subject();
	private observable: Observable<AcNotification>;
	private _drawerList: SimpleDrawerService[] = [];
	private _updateStream: Subject<AcNotification> = new Subject<AcNotification>();
	private entitiesStore = new Map<number, any>();

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
							arcDrawerService: ArcDrawerService,
							pointDraweeSrvice: PointDrawerService) {
		this._drawerList = Array.of(
			billboardDrawerService,
			labelDrawerService,
			ellipseDrawerService,
			dynamicEllipseDrawerService,
			dynamicPolylineDrawerService,
			staticCircleDrawerService,
			staticPolylineDrawerService,
			polygonDrawerService,
			arcDrawerService,
			pointDraweeSrvice
		);
	}

	init() {
		this.initValidParams();

		this.observable.merge(this._updateStream).takeUntil(this.stopObservable).subscribe((notification) => {
			this._computationCache.clear();

			let contextEntity = notification.entity;
			if (this.store) {
				contextEntity = this.updateStore(notification);
			}

			this.context[this.entityName] = contextEntity;
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

	private updateStore(notification: AcNotification): any {
		if (this.entitiesStore.has(notification.id)) {
			const entity = this.entitiesStore.get(notification.id);
			Object.assign(entity, notification.entity);
			return entity;
		}
		else {
			this.entitiesStore.set(notification.id, notification.entity);
			return notification.entity;
		}
	}

	private initValidParams() {
		if (!this.context) {
			throw new Error('ac-layer: must initialize [context] ');
		}

		if (!AcLayerComponent.acForRgx.test(this.acFor)) {
			throw new Error('ac-layer: must initialize [acFor] with a valid syntax \' [acFor]=\"let item of observer$\" \' '
				+ 'instead received: ' + this.acFor);
		}
		const acForArr = this.acFor.split(' ');
		this.observable = this.context[acForArr[3]];
		this.entityName = acForArr[1];
		if (!this.observable || !(this.observable instanceof Observable)) {
			throw  new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
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

	ngOnDestroy(): void {
		this.stopObservable.next(true);
		this.removeAll();
	}

	/**
	 * Returns the store.
	 */
	getStore(): Map<number, any> {
		return this.entitiesStore;
	};

	/**
	 * Remove all the entities from the layer.
	 */
	removeAll(): void {
		this.layerService.getDescriptions().forEach((description) => description.removeAll());
	}

	/**
	 * remove entity from the layer
	 * @param {number} entityId
	 */
	remove(entityId: number) {
		this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
	}

	/**
	 * add/update entity to/from the layer
	 * @param {AcNotification} notification
	 */
	updateNotification(notification: AcNotification): void {
		this._updateStream.next(notification);
	}

	/**
	 * add/update entity to/from the layer
	 * @param {AcEntity} entity
	 * @param {number} id
	 */
	update(entity: AcEntity, id: number): void {
		this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
	}

	refreshAll(collection: AcNotification[]): void {
		// TODO make entity interface: collection of type entity not notification
		Observable.from(collection).subscribe((entity) => this._updateStream.next(entity));
	}
}
