import { from as observableFrom, merge as observableMerge, Observable, Subject } from 'rxjs';

import { takeUntil } from 'rxjs/operators';
// tslint:disable
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { AfterContentInit, ChangeDetectionStrategy, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcNotification } from '../../models/ac-notification';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { AcEntity } from '../../models/ac-entity';
import { BasicDrawerService } from '../../services/drawers/basic-drawer/basic-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { LayerOptions } from '../../models/layer-options';
import { DynamicEllipseDrawerService } from '../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service';
import { DynamicPolylineDrawerService } from '../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service';
import { StaticCircleDrawerService } from '../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service';
import { StaticPolylineDrawerService } from '../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service';
import { StaticPolygonDrawerService } from '../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service';
import { StaticEllipseDrawerService } from '../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service';
import { ModelDrawerService } from '../../services/drawers/model-drawer/model-drawer.service';
import { BoxDrawerService } from '../../services/drawers/box-dawer/box-drawer.service';
import { CorridorDrawerService } from '../../services/drawers/corridor-dawer/corridor-drawer.service';
import { CylinderDrawerService } from '../../services/drawers/cylinder-dawer/cylinder-drawer.service';
import { EllipsoidDrawerService } from '../../services/drawers/ellipoid-drawer/ellipsoid-drawer.service';
import { PolylineVolumeDrawerService } from '../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service';
import { WallDrawerService } from '../../services/drawers/wall-dawer/wall-drawer.service';
import { RectangleDrawerService } from '../../services/drawers/rectangle-dawer/rectangle-drawer.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
import { LabelPrimitiveDrawerService } from '../../services/drawers/label-primitive-drawer/label-primitive-drawer.service';
import { BillboardPrimitiveDrawerService } from '../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';

// tslint:enable
/**
 *  This is a ac-layer implementation.
 *  The ac-layer element must be a child of ac-map element.
 *  + acFor `{string}` - get the tracked observable and entityName (see the example).
 *  + show `{boolean}` - show/hide layer's entities.
 *  + context `{any}` - get the context layer that will use the componnet (most of the time equal to "this").
 *  + options `{LayerOptions}` - sets the layer options for each drawer.
 *  + zIndex `{number}` - controls the zIndex (order) of the layer, layers with greater zIndex will be in front of layers with lower zIndex
 *    (Exception For `Billboard` and `Label`, should use `[eyeOffset]` prop instead)</br>
 *    zIndex won't work for pritimitve descs (like ac-primitive-polyline...)
 *
 *
 *  __Usage :__
 *  ```
 *  <ac-map>
 *    <ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [options]="options" [zIndex]="1">
 *      <ac-billboard-desc props="{
 *        image: track.image,
 *        position: track.position,
 *        scale: track.scale,
 *        color: track.color,
 *        name: track.name
 *      }">
 *      </ac-billboard-desc>
 *        <ac-label-desc props="{
 *          position: track.position,
 *          pixelOffset : [-15,20] | pixelOffset,
 *          text: track.name,
 *          font: '15px sans-serif'
 *        }">
 *      </ac-label-desc>
 *    </ac-layer>
 *  </ac-map>
 *  ```
 */
@Component({
  selector: 'ac-layer',
  template: '<ng-content></ng-content>',
  providers: [
    LayerService,
    ComputationCache,
    BillboardDrawerService,
    LabelDrawerService,
    EllipseDrawerService,
    PolylineDrawerService,
    ArcDrawerService,
    PointDrawerService,
    PolygonDrawerService,
    ModelDrawerService,
    BoxDrawerService,
    CorridorDrawerService,
    CylinderDrawerService,
    EllipsoidDrawerService,
    PolylineVolumeDrawerService,
    WallDrawerService,
    RectangleDrawerService,
    PolylinePrimitiveDrawerService,
    LabelPrimitiveDrawerService,
    BillboardPrimitiveDrawerService,
    PointPrimitiveDrawerService,
    HtmlDrawerService,
    CzmlDrawerService,

    DynamicEllipseDrawerService,
    DynamicPolylineDrawerService,
    StaticCircleDrawerService,
    StaticPolylineDrawerService,
    StaticPolygonDrawerService,
    StaticEllipseDrawerService,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AcLayerComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
  @Input()
  show = true;
  @Input()
  acFor: string;
  @Input()
  context: any;
  @Input()
  store = false;
  @Input()
  options: LayerOptions;
  @Input()
  zIndex = 0;

  private readonly acForRgx = /^let\s+.+\s+of\s+.+$/;
  private entityName: string;
  private stopObservable = new Subject<any>();
  private observable: Observable<AcNotification>;
  private _drawerList: Map<string, BasicDrawerService>;
  private _updateStream: Subject<AcNotification> = new Subject<AcNotification>();
  private entitiesStore = new Map<string, any>();
  private layerDrawerDataSources: any[] = [];

  constructor(private layerService: LayerService,
              private _computationCache: ComputationCache,
              private mapLayersService: MapLayersService,
              billboardDrawerService: BillboardDrawerService,
              labelDrawerService: LabelDrawerService,
              ellipseDrawerService: EllipseDrawerService,
              polylineDrawerService: PolylineDrawerService,
              polygonDrawerService: PolygonDrawerService,
              arcDrawerService: ArcDrawerService,
              pointDrawerService: PointDrawerService,
              modelDrawerService: ModelDrawerService,
              boxDrawerService: BoxDrawerService,
              corridorDrawerService: CorridorDrawerService,
              cylinderDrawerService: CylinderDrawerService,
              ellipsoidDrawerSerice: EllipsoidDrawerService,
              polylineVolumeDrawerService: PolylineVolumeDrawerService,
              wallDrawerService: WallDrawerService,
              rectangleDrawerService: RectangleDrawerService,
              dynamicEllipseDrawerService: DynamicEllipseDrawerService,
              dynamicPolylineDrawerService: DynamicPolylineDrawerService,
              staticCircleDrawerService: StaticCircleDrawerService,
              staticPolylineDrawerService: StaticPolylineDrawerService,
              staticPolygonDrawerService: StaticPolygonDrawerService,
              staticEllipseDrawerService: StaticEllipseDrawerService,
              polylinePrimitiveDrawerService: PolylinePrimitiveDrawerService,
              labelPrimitiveDrawerService: LabelPrimitiveDrawerService,
              billboardPrimitiveDrawerService: BillboardPrimitiveDrawerService,
              pointPrimitiveDrawerService: PointPrimitiveDrawerService,
              htmlDrawerService: HtmlDrawerService,
              czmlDrawerService: CzmlDrawerService
  ) {
    this._drawerList = new Map([
      ['billboard', billboardDrawerService],
      ['label', labelDrawerService],
      ['ellipse', ellipseDrawerService],
      ['polyline', polylineDrawerService],
      ['polygon', polygonDrawerService as BasicDrawerService],
      ['arc', arcDrawerService],
      ['point', pointDrawerService],
      ['model', modelDrawerService],
      ['box', boxDrawerService],
      ['corridor', corridorDrawerService],
      ['cylinder', cylinderDrawerService],
      ['ellipsoid', ellipsoidDrawerSerice],
      ['polylineVolume', polylineVolumeDrawerService],
      ['rectangle', rectangleDrawerService],
      ['wall', wallDrawerService],
      ['polylinePrimitive', polylinePrimitiveDrawerService],
      ['labelPrimitive', labelPrimitiveDrawerService],
      ['billboardPrimitive', billboardPrimitiveDrawerService],
      ['pointPrimitive', pointPrimitiveDrawerService],
      ['html', htmlDrawerService],
      ['czml', czmlDrawerService],

      ['dynamicEllipse', dynamicEllipseDrawerService],
      ['dynamicPolyline', dynamicPolylineDrawerService],
      ['staticCircle', staticCircleDrawerService],
      ['staticPolyline', staticPolylineDrawerService],
      ['staticPolygon', staticPolygonDrawerService],
      ['staticEllipse', staticEllipseDrawerService],
    ]);
  }

  init() {
    this.initValidParams();

    observableMerge(this._updateStream, this.observable).pipe<AcNotification>(takeUntil(this.stopObservable)).subscribe((notification) => {
      this._computationCache.clear();

      let contextEntity = notification.entity;
      if (this.store) {
        contextEntity = this.updateStore(notification);
      }

      this.context[this.entityName] = contextEntity;
      this.layerService.getDescriptions().forEach((descriptionComponent) => {
        switch (notification.actionType) {
          case ActionType.ADD_UPDATE:
            descriptionComponent.draw(this.context, notification.id, contextEntity);
            break;
          case ActionType.DELETE:
            descriptionComponent.remove(notification.id);
            break;
          default:
            console.error('[ac-layer] unknown AcNotification.actionType for notification: ' + notification);
        }
      });
    });
  }

  private updateStore(notification: AcNotification): any {
    if (notification.actionType === ActionType.DELETE) {
      this.entitiesStore.delete(notification.id);
      return undefined;
    } else {
      if (this.entitiesStore.has(notification.id)) {
        const entity = this.entitiesStore.get(notification.id);
        Object.assign(entity, notification.entity);
        return entity;
      } else {
        this.entitiesStore.set(notification.id, notification.entity);
        return notification.entity;
      }
    }
  }

  private initValidParams() {
    if (!this.context) {
      throw new Error('ac-layer: must initialize [context] ');
    }

    if (!this.acForRgx.test(this.acFor)) {
      throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${this.acFor}`);
    }
    const acForArr = this.acFor.split(' ');
    this.observable = this.context[acForArr[3]];
    this.entityName = acForArr[1];
    if (!this.isObservable(this.observable)) {
      throw new Error('ac-layer: must initailize [acFor] with rx observable, instead received: ' + this.observable);
    }

    this.layerService.context = this.context;
    this.layerService.setEntityName(this.entityName);
  }

  /** Test for a rxjs Observable */
  private isObservable(obj: any): boolean {
    /* check via duck-typing rather than instance of
     * to allow passing between window contexts */
    return obj && typeof obj.subscribe === 'function';
  }

  ngAfterContentInit(): void {
    this.init();
  }

  ngOnInit(): void {
    this.layerService.context = this.context;
    this.layerService.options = this.options;
    this.layerService.show = this.show;
    this.layerService.zIndex = this.zIndex;
    this._drawerList.forEach((drawer, drawerName) => {
      const initOptions = this.options ? this.options[drawerName] : undefined;
      const drawerDataSources = drawer.init(initOptions);
      // only entities drawers create data sources
      if (drawerDataSources) {
        // this.mapLayersService.registerLayerDataSources(drawerDataSources, this.zIndex);
        // TODO: Check if the following line causes Bad Performance
        this.layerDrawerDataSources.push(...drawerDataSources);
      }
      drawer.setShow(this.show);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.show && !changes.show.firstChange) {
      const showValue = changes['show'].currentValue;
      this.layerService.show = showValue;
      this._drawerList.forEach((drawer) => drawer.setShow(showValue));
    }

    if (changes.zIndex && !changes.zIndex.firstChange) {
      const zIndexValue = changes['zIndex'].currentValue;
      this.layerService.zIndex = zIndexValue;
      this.mapLayersService.updateAndRefresh(this.layerDrawerDataSources, zIndexValue);
    }
  }

  ngOnDestroy(): void {
    this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
    this.stopObservable.next(true);
    this.removeAll();
  }

  getLayerService(): LayerService {
    return this.layerService;
  }

  /**
   * Returns an array of DataSources registered by a drawer of this layer
   * @return Array of Cesium.DataSources
   */
  getLayerDrawerDataSources(): any[] {
    return this.layerDrawerDataSources;
  }

  /**
   * Returns an Array of DataSources of the drawer with the provided DataSource.name
   * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
   * @return Array of Cesium.DataSources
   */
  getDrawerDataSourcesByName(name: string): any[] {
    return this.layerDrawerDataSources.filter(d => d.name === name);
  }

  /**
   * Returns the store.
   */
  getStore(): Map<string, any> {
    return this.entitiesStore;
  }

  /**
   * Remove all the entities from the layer.
   */
  removeAll(): void {
    this.layerService.getDescriptions().forEach((description) => description.removeAll());
    this.entitiesStore.clear();
  }

  /**
   * remove entity from the layer
   */
  remove(entityId: string) {
    this._updateStream.next({id: entityId, actionType: ActionType.DELETE});
    this.entitiesStore.delete(entityId);
  }

  /**
   * add/update entity to/from the layer
   */
  updateNotification(notification: AcNotification): void {
    this._updateStream.next(notification);
  }

  /**
   * add/update entity to/from the layer
   */
  update(entity: AcEntity, id: string): void {
    this._updateStream.next({entity, id, actionType: ActionType.ADD_UPDATE});
  }

  refreshAll(collection: AcNotification[]): void {
    // TODO make entity interface: collection of type entity not notification
    observableFrom(collection).subscribe((entity) => this._updateStream.next(entity));
  }
}
