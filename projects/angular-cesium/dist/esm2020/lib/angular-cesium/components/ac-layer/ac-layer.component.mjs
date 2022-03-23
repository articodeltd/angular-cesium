import { from as observableFrom, merge as observableMerge, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
// tslint:disable
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ActionType } from '../../models/action-type.enum';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
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
import { PointPrimitiveDrawerService } from '../../services/drawers/point-primitive-drawer/point-primitive-drawer.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../../services/computation-cache/computation-cache.service";
import * as i3 from "../../services/map-layers/map-layers.service";
import * as i4 from "../../services/drawers/billboard-drawer/billboard-drawer.service";
import * as i5 from "../../services/drawers/label-drawer/label-drawer.service";
import * as i6 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i7 from "../../services/drawers/polyline-drawer/polyline-drawer.service";
import * as i8 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i9 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i10 from "../../services/drawers/point-drawer/point-drawer.service";
import * as i11 from "../../services/drawers/model-drawer/model-drawer.service";
import * as i12 from "../../services/drawers/box-dawer/box-drawer.service";
import * as i13 from "../../services/drawers/corridor-dawer/corridor-drawer.service";
import * as i14 from "../../services/drawers/cylinder-dawer/cylinder-drawer.service";
import * as i15 from "../../services/drawers/ellipoid-drawer/ellipsoid-drawer.service";
import * as i16 from "../../services/drawers/polyline-volume-dawer/polyline-volume-drawer.service";
import * as i17 from "../../services/drawers/wall-dawer/wall-drawer.service";
import * as i18 from "../../services/drawers/rectangle-dawer/rectangle-drawer.service";
import * as i19 from "../../services/drawers/static-dynamic/ellipse-drawer/dynamic-ellipse-drawer.service";
import * as i20 from "../../services/drawers/static-dynamic/dynamic-polyline-drawer/dynamic-polyline-drawer.service";
import * as i21 from "../../services/drawers/static-dynamic/static-circle-drawer/static-circle-drawer.service";
import * as i22 from "../../services/drawers/static-dynamic/static-polyline-drawer/static-polyline-drawer.service";
import * as i23 from "../../services/drawers/static-dynamic/static-polygon-drawer/polygon-drawer.service";
import * as i24 from "../../services/drawers/static-dynamic/ellipse-drawer/ellipse-drawer.service";
import * as i25 from "../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service";
import * as i26 from "../../services/drawers/label-primitive-drawer/label-primitive-drawer.service";
import * as i27 from "../../services/drawers/billboard-primitive-drawer/billboard-primitive-drawer.service";
import * as i28 from "../../services/drawers/point-primitive-drawer/point-primitive-drawer.service";
import * as i29 from "../../services/drawers/html-drawer/html-drawer.service";
import * as i30 from "../../services/drawers/czml-drawer/czml-drawer.service";
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
 *  + debug `{boolean}` - prints every acNotification
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
export class AcLayerComponent {
    constructor(layerService, _computationCache, mapLayersService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, modelDrawerService, boxDrawerService, corridorDrawerService, cylinderDrawerService, ellipsoidDrawerSerice, polylineVolumeDrawerService, wallDrawerService, rectangleDrawerService, dynamicEllipseDrawerService, dynamicPolylineDrawerService, staticCircleDrawerService, staticPolylineDrawerService, staticPolygonDrawerService, staticEllipseDrawerService, polylinePrimitiveDrawerService, labelPrimitiveDrawerService, billboardPrimitiveDrawerService, pointPrimitiveDrawerService, htmlDrawerService, czmlDrawerService) {
        this.layerService = layerService;
        this._computationCache = _computationCache;
        this.mapLayersService = mapLayersService;
        this.show = true;
        this.store = false;
        this.zIndex = 0;
        this.debug = false;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.stopObservable = new Subject();
        this._updateStream = new Subject();
        this.entitiesStore = new Map();
        this.layerDrawerDataSources = [];
        this._drawerList = new Map([
            ['billboard', billboardDrawerService],
            ['label', labelDrawerService],
            ['ellipse', ellipseDrawerService],
            ['polyline', polylineDrawerService],
            ['polygon', polygonDrawerService],
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
        observableMerge(this._updateStream, this.observable).pipe(takeUntil(this.stopObservable)).subscribe((notification) => {
            this._computationCache.clear();
            if (this.debug) {
                console.log('AcLayer received notification:', notification);
            }
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
    updateStore(notification) {
        if (notification.actionType === ActionType.DELETE) {
            this.entitiesStore.delete(notification.id);
            return undefined;
        }
        else {
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
    }
    initValidParams() {
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
    isObservable(obj) {
        /* check via duck-typing rather than instance of
         * to allow passing between window contexts */
        return obj && typeof obj.subscribe === 'function';
    }
    ngAfterContentInit() {
        this.init();
    }
    ngOnInit() {
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
    ngOnChanges(changes) {
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
    ngOnDestroy() {
        this.mapLayersService.removeDataSources(this.layerDrawerDataSources);
        this.stopObservable.next(true);
        this.removeAll();
    }
    getLayerService() {
        return this.layerService;
    }
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    getLayerDrawerDataSources() {
        return this.layerDrawerDataSources;
    }
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name) {
        return this.layerDrawerDataSources.filter(d => d.name === name);
    }
    /**
     * Returns the store.
     */
    getStore() {
        return this.entitiesStore;
    }
    /**
     * Remove all the entities from the layer.
     */
    removeAll() {
        this.layerService.getDescriptions().forEach((description) => description.removeAll());
        this.entitiesStore.clear();
    }
    /**
     * remove entity from the layer
     */
    remove(entityId) {
        this._updateStream.next({ id: entityId, actionType: ActionType.DELETE });
        this.entitiesStore.delete(entityId);
    }
    /**
     * add/update entity to/from the layer
     */
    updateNotification(notification) {
        this._updateStream.next(notification);
    }
    /**
     * add/update entity to/from the layer
     */
    update(entity, id) {
        this._updateStream.next({ entity, id, actionType: ActionType.ADD_UPDATE });
    }
    refreshAll(collection) {
        // TODO make entity interface: collection of type entity not notification
        observableFrom(collection).subscribe((entity) => this._updateStream.next(entity));
    }
}
AcLayerComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLayerComponent, deps: [{ token: i1.LayerService }, { token: i2.ComputationCache }, { token: i3.MapLayersService }, { token: i4.BillboardDrawerService }, { token: i5.LabelDrawerService }, { token: i6.EllipseDrawerService }, { token: i7.PolylineDrawerService }, { token: i8.PolygonDrawerService }, { token: i9.ArcDrawerService }, { token: i10.PointDrawerService }, { token: i11.ModelDrawerService }, { token: i12.BoxDrawerService }, { token: i13.CorridorDrawerService }, { token: i14.CylinderDrawerService }, { token: i15.EllipsoidDrawerService }, { token: i16.PolylineVolumeDrawerService }, { token: i17.WallDrawerService }, { token: i18.RectangleDrawerService }, { token: i19.DynamicEllipseDrawerService }, { token: i20.DynamicPolylineDrawerService }, { token: i21.StaticCircleDrawerService }, { token: i22.StaticPolylineDrawerService }, { token: i23.StaticPolygonDrawerService }, { token: i24.StaticEllipseDrawerService }, { token: i25.PolylinePrimitiveDrawerService }, { token: i26.LabelPrimitiveDrawerService }, { token: i27.BillboardPrimitiveDrawerService }, { token: i28.PointPrimitiveDrawerService }, { token: i29.HtmlDrawerService }, { token: i30.CzmlDrawerService }], target: i0.ɵɵFactoryTarget.Component });
AcLayerComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcLayerComponent, selector: "ac-layer", inputs: { show: "show", acFor: "acFor", context: "context", store: "store", options: "options", zIndex: "zIndex", debug: "debug" }, providers: [
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
    ], usesOnChanges: true, ngImport: i0, template: '<ng-content></ng-content>', isInline: true, changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcLayerComponent, decorators: [{
            type: Component,
            args: [{
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
                }]
        }], ctorParameters: function () { return [{ type: i1.LayerService }, { type: i2.ComputationCache }, { type: i3.MapLayersService }, { type: i4.BillboardDrawerService }, { type: i5.LabelDrawerService }, { type: i6.EllipseDrawerService }, { type: i7.PolylineDrawerService }, { type: i8.PolygonDrawerService }, { type: i9.ArcDrawerService }, { type: i10.PointDrawerService }, { type: i11.ModelDrawerService }, { type: i12.BoxDrawerService }, { type: i13.CorridorDrawerService }, { type: i14.CylinderDrawerService }, { type: i15.EllipsoidDrawerService }, { type: i16.PolylineVolumeDrawerService }, { type: i17.WallDrawerService }, { type: i18.RectangleDrawerService }, { type: i19.DynamicEllipseDrawerService }, { type: i20.DynamicPolylineDrawerService }, { type: i21.StaticCircleDrawerService }, { type: i22.StaticPolylineDrawerService }, { type: i23.StaticPolygonDrawerService }, { type: i24.StaticEllipseDrawerService }, { type: i25.PolylinePrimitiveDrawerService }, { type: i26.LabelPrimitiveDrawerService }, { type: i27.BillboardPrimitiveDrawerService }, { type: i28.PointPrimitiveDrawerService }, { type: i29.HtmlDrawerService }, { type: i30.CzmlDrawerService }]; }, propDecorators: { show: [{
                type: Input
            }], acFor: [{
                type: Input
            }], context: [{
                type: Input
            }], store: [{
                type: Input
            }], options: [{
                type: Input
            }], zIndex: [{
                type: Input
            }], debug: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbGF5ZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsSUFBSSxJQUFJLGNBQWMsRUFBRSxLQUFLLElBQUksZUFBZSxFQUFjLE9BQU8sRUFBRSxNQUFNLE1BQU0sQ0FBQztBQUU3RixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7QUFDM0MsaUJBQWlCO0FBQ2pCLE9BQU8sRUFBRSxzQkFBc0IsRUFBRSxNQUFNLGtFQUFrRSxDQUFDO0FBQzFHLE9BQU8sRUFBb0IsdUJBQXVCLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDekksT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBRWxGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSwrQkFBK0IsQ0FBQztBQUMzRCxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUc5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUVwRyxPQUFPLEVBQUUsMkJBQTJCLEVBQUUsTUFBTSxxRkFBcUYsQ0FBQztBQUNsSSxPQUFPLEVBQUUsNEJBQTRCLEVBQUUs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QUNwQixxQkFBcUI7d0JBQ3JCLGdCQUFnQjt3QkFDaEIsa0JBQWtCO3dCQUNsQixvQkFBb0I7d0JBQ3BCLGtCQUFrQjt3QkFDbEIsZ0JBQWdCO3dCQUNoQixxQkFBcUI7d0JBQ3JCLHFCQUFxQjt3QkFDckIsc0JBQXNCO3dCQUN0QiwyQkFBMkI7d0JBQzNCLGlCQUFpQjt3QkFDakIsc0JBQXNCO3dCQUN0Qiw4QkFBOEI7d0JBQzlCLDJCQUEyQjt3QkFDM0IsK0JBQStCO3dCQUMvQiwyQkFBMkI7d0JBQzNCLGlCQUFpQjt3QkFDakIsaUJBQWlCO3dCQUVqQiwyQkFBMkI7d0JBQzNCLDRCQUE0Qjt3QkFDNUIseUJBQXlCO3dCQUN6QiwyQkFBMkI7d0JBQzNCLDBCQUEwQjt3QkFDMUIsMEJBQTBCO3FCQUMzQjtvQkFDRCxlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7MHFDQUdDLElBQUk7c0JBREgsS0FBSztnQkFHTixLQUFLO3NCQURKLEtBQUs7Z0JBR04sT0FBTztzQkFETixLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSztnQkFHTixPQUFPO3NCQUROLEtBQUs7Z0JBR04sTUFBTTtzQkFETCxLQUFLO2dCQUdOLEtBQUs7c0JBREosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IGZyb20gYXMgb2JzZXJ2YWJsZUZyb20sIG1lcmdlIGFzIG9ic2VydmFibGVNZXJnZSwgT2JzZXJ2YWJsZSwgU3ViamVjdCB9IGZyb20gJ3J4anMnO1xyXG5cclxuaW1wb3J0IHsgdGFrZVVudGlsIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG4vLyB0c2xpbnQ6ZGlzYWJsZVxyXG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEFmdGVyQ29udGVudEluaXQsIENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNOb3RpZmljYXRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtbm90aWZpY2F0aW9uJztcclxuaW1wb3J0IHsgQWN0aW9uVHlwZSB9IGZyb20gJy4uLy4uL21vZGVscy9hY3Rpb24tdHlwZS5lbnVtJztcclxuaW1wb3J0IHsgQ29tcHV0YXRpb25DYWNoZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbXB1dGF0aW9uLWNhY2hlL2NvbXB1dGF0aW9uLWNhY2hlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9lbGxpcHNlLWRyYXdlci9lbGxpcHNlLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1kcmF3ZXIvcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBcmNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9hcmMtZHJhd2VyL2FyYy1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNFbnRpdHkgfSBmcm9tICcuLi8uLi9tb2RlbHMvYWMtZW50aXR5JztcclxuaW1wb3J0IHsgQmFzaWNEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iYXNpYy1kcmF3ZXIvYmFzaWMtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWdvbi1kcmF3ZXIvcG9seWdvbi1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExheWVyT3B0aW9ucyB9IGZyb20gJy4uLy4uL21vZGVscy9sYXllci1vcHRpb25zJztcclxuaW1wb3J0IHsgRHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9lbGxpcHNlLWRyYXdlci9keW5hbWljLWVsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBEeW5hbWljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9zdGF0aWMtZHluYW1pYy9keW5hbWljLXBvbHlsaW5lLWRyYXdlci9keW5hbWljLXBvbHlsaW5lLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgU3RhdGljQ2lyY2xlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLWNpcmNsZS1kcmF3ZXIvc3RhdGljLWNpcmNsZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlsaW5lLWRyYXdlci9zdGF0aWMtcG9seWxpbmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvc3RhdGljLXBvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvc3RhdGljLWR5bmFtaWMvZWxsaXBzZS1kcmF3ZXIvZWxsaXBzZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IE1vZGVsRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbW9kZWwtZHJhd2VyL21vZGVsLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQm94RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYm94LWRhd2VyL2JveC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IENvcnJpZG9yRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvY29ycmlkb3ItZGF3ZXIvY29ycmlkb3ItZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDeWxpbmRlckRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N5bGluZGVyLWRhd2VyL2N5bGluZGVyLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWxsaXBzb2lkRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvZWxsaXBvaWQtZHJhd2VyL2VsbGlwc29pZC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtdm9sdW1lLWRhd2VyL3BvbHlsaW5lLXZvbHVtZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFdhbGxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy93YWxsLWRhd2VyL3dhbGwtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBSZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9yZWN0YW5nbGUtZGF3ZXIvcmVjdGFuZ2xlLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyL3BvbHlsaW5lLXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvbGFiZWwtcHJpbWl0aXZlLWRyYXdlci9sYWJlbC1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCaWxsYm9hcmRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci9iaWxsYm9hcmQtcHJpbWl0aXZlLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgTWFwTGF5ZXJzU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcC1sYXllcnMvbWFwLWxheWVycy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9pbnRQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9wb2ludC1wcmltaXRpdmUtZHJhd2VyL3BvaW50LXByaW1pdGl2ZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEh0bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9odG1sLWRyYXdlci9odG1sLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ3ptbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2N6bWwtZHJhd2VyL2N6bWwtZHJhd2VyLnNlcnZpY2UnO1xyXG5cclxuLy8gdHNsaW50OmVuYWJsZVxyXG4vKipcclxuICogIFRoaXMgaXMgYSBhYy1sYXllciBpbXBsZW1lbnRhdGlvbi5cclxuICogIFRoZSBhYy1sYXllciBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1tYXAgZWxlbWVudC5cclxuICogICsgYWNGb3IgYHtzdHJpbmd9YCAtIGdldCB0aGUgdHJhY2tlZCBvYnNlcnZhYmxlIGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxyXG4gKiAgKyBzaG93IGB7Ym9vbGVhbn1gIC0gc2hvdy9oaWRlIGxheWVyJ3MgZW50aXRpZXMuXHJcbiAqICArIGNvbnRleHQgYHthbnl9YCAtIGdldCB0aGUgY29udGV4dCBsYXllciB0aGF0IHdpbGwgdXNlIHRoZSBjb21wb25uZXQgKG1vc3Qgb2YgdGhlIHRpbWUgZXF1YWwgdG8gXCJ0aGlzXCIpLlxyXG4gKiAgKyBvcHRpb25zIGB7TGF5ZXJPcHRpb25zfWAgLSBzZXRzIHRoZSBsYXllciBvcHRpb25zIGZvciBlYWNoIGRyYXdlci5cclxuICogICsgekluZGV4IGB7bnVtYmVyfWAgLSBjb250cm9scyB0aGUgekluZGV4IChvcmRlcikgb2YgdGhlIGxheWVyLCBsYXllcnMgd2l0aCBncmVhdGVyIHpJbmRleCB3aWxsIGJlIGluIGZyb250IG9mIGxheWVycyB3aXRoIGxvd2VyIHpJbmRleFxyXG4gKiAgICAoRXhjZXB0aW9uIEZvciBgQmlsbGJvYXJkYCBhbmQgYExhYmVsYCwgc2hvdWxkIHVzZSBgW2V5ZU9mZnNldF1gIHByb3AgaW5zdGVhZCk8L2JyPlxyXG4gKiAgICB6SW5kZXggd29uJ3Qgd29yayBmb3IgcHJpdGltaXR2ZSBkZXNjcyAobGlrZSBhYy1wcmltaXRpdmUtcG9seWxpbmUuLi4pXHJcbiAqICArIGRlYnVnIGB7Ym9vbGVhbn1gIC0gcHJpbnRzIGV2ZXJ5IGFjTm90aWZpY2F0aW9uXHJcbiAqXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqICA8YWMtbWFwPlxyXG4gKiAgICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgdHJhY2sgb2YgdHJhY2tzJFwiIFtzaG93XT1cInNob3dcIiBbY29udGV4dF09XCJ0aGlzXCIgW29wdGlvbnNdPVwib3B0aW9uc1wiIFt6SW5kZXhdPVwiMVwiPlxyXG4gKiAgICAgIDxhYy1iaWxsYm9hcmQtZGVzYyBwcm9wcz1cIntcclxuICogICAgICAgIGltYWdlOiB0cmFjay5pbWFnZSxcclxuICogICAgICAgIHBvc2l0aW9uOiB0cmFjay5wb3NpdGlvbixcclxuICogICAgICAgIHNjYWxlOiB0cmFjay5zY2FsZSxcclxuICogICAgICAgIGNvbG9yOiB0cmFjay5jb2xvcixcclxuICogICAgICAgIG5hbWU6IHRyYWNrLm5hbWVcclxuICogICAgICB9XCI+XHJcbiAqICAgICAgPC9hYy1iaWxsYm9hcmQtZGVzYz5cclxuICogICAgICAgIDxhYy1sYWJlbC1kZXNjIHByb3BzPVwie1xyXG4gKiAgICAgICAgICBwb3NpdGlvbjogdHJhY2sucG9zaXRpb24sXHJcbiAqICAgICAgICAgIHBpeGVsT2Zmc2V0IDogWy0xNSwyMF0gfCBwaXhlbE9mZnNldCxcclxuICogICAgICAgICAgdGV4dDogdHJhY2submFtZSxcclxuICogICAgICAgICAgZm9udDogJzE1cHggc2Fucy1zZXJpZidcclxuICogICAgICAgIH1cIj5cclxuICogICAgICA8L2FjLWxhYmVsLWRlc2M+XHJcbiAqICAgIDwvYWMtbGF5ZXI+XHJcbiAqICA8L2FjLW1hcD5cclxuICogIGBgYFxyXG4gKi9cclxuQENvbXBvbmVudCh7XHJcbiAgc2VsZWN0b3I6ICdhYy1sYXllcicsXHJcbiAgdGVtcGxhdGU6ICc8bmctY29udGVudD48L25nLWNvbnRlbnQ+JyxcclxuICBwcm92aWRlcnM6IFtcclxuICAgIExheWVyU2VydmljZSxcclxuICAgIENvbXB1dGF0aW9uQ2FjaGUsXHJcbiAgICBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxyXG4gICAgTGFiZWxEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgRWxsaXBzZURyYXdlclNlcnZpY2UsXHJcbiAgICBQb2x5bGluZURyYXdlclNlcnZpY2UsXHJcbiAgICBBcmNEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgUG9pbnREcmF3ZXJTZXJ2aWNlLFxyXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXHJcbiAgICBNb2RlbERyYXdlclNlcnZpY2UsXHJcbiAgICBCb3hEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgQ29ycmlkb3JEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgQ3lsaW5kZXJEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgRWxsaXBzb2lkRHJhd2VyU2VydmljZSxcclxuICAgIFBvbHlsaW5lVm9sdW1lRHJhd2VyU2VydmljZSxcclxuICAgIFdhbGxEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgUmVjdGFuZ2xlRHJhd2VyU2VydmljZSxcclxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcclxuICAgIExhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcclxuICAgIEJpbGxib2FyZFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXHJcbiAgICBQb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXHJcbiAgICBIdG1sRHJhd2VyU2VydmljZSxcclxuICAgIEN6bWxEcmF3ZXJTZXJ2aWNlLFxyXG5cclxuICAgIER5bmFtaWNFbGxpcHNlRHJhd2VyU2VydmljZSxcclxuICAgIER5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2UsXHJcbiAgICBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgU3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2UsXHJcbiAgICBTdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZSxcclxuICBdLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNMYXllckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBBZnRlckNvbnRlbnRJbml0LCBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpXHJcbiAgc2hvdyA9IHRydWU7XHJcbiAgQElucHV0KClcclxuICBhY0Zvcjogc3RyaW5nO1xyXG4gIEBJbnB1dCgpXHJcbiAgY29udGV4dDogYW55O1xyXG4gIEBJbnB1dCgpXHJcbiAgc3RvcmUgPSBmYWxzZTtcclxuICBASW5wdXQoKVxyXG4gIG9wdGlvbnM6IExheWVyT3B0aW9ucztcclxuICBASW5wdXQoKVxyXG4gIHpJbmRleCA9IDA7XHJcbiAgQElucHV0KClcclxuICBkZWJ1ZyA9IGZhbHNlO1xyXG5cclxuICBwcml2YXRlIHJlYWRvbmx5IGFjRm9yUmd4ID0gL15sZXRcXHMrLitcXHMrb2ZcXHMrLiskLztcclxuICBwcml2YXRlIGVudGl0eU5hbWU6IHN0cmluZztcclxuICBwcml2YXRlIHN0b3BPYnNlcnZhYmxlID0gbmV3IFN1YmplY3Q8YW55PigpO1xyXG4gIHByaXZhdGUgb2JzZXJ2YWJsZTogT2JzZXJ2YWJsZTxBY05vdGlmaWNhdGlvbj47XHJcbiAgcHJpdmF0ZSBfZHJhd2VyTGlzdDogTWFwPHN0cmluZywgQmFzaWNEcmF3ZXJTZXJ2aWNlPjtcclxuICBwcml2YXRlIF91cGRhdGVTdHJlYW06IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+ID0gbmV3IFN1YmplY3Q8QWNOb3RpZmljYXRpb24+KCk7XHJcbiAgcHJpdmF0ZSBlbnRpdGllc1N0b3JlID0gbmV3IE1hcDxzdHJpbmcsIGFueT4oKTtcclxuICBwcml2YXRlIGxheWVyRHJhd2VyRGF0YVNvdXJjZXM6IGFueVtdID0gW107XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgbGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBfY29tcHV0YXRpb25DYWNoZTogQ29tcHV0YXRpb25DYWNoZSxcclxuICAgICAgICAgICAgICBwcml2YXRlIG1hcExheWVyc1NlcnZpY2U6IE1hcExheWVyc1NlcnZpY2UsXHJcbiAgICAgICAgICAgICAgYmlsbGJvYXJkRHJhd2VyU2VydmljZTogQmlsbGJvYXJkRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBlbGxpcHNlRHJhd2VyU2VydmljZTogRWxsaXBzZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcG9seWxpbmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIGFyY0RyYXdlclNlcnZpY2U6IEFyY0RyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcG9pbnREcmF3ZXJTZXJ2aWNlOiBQb2ludERyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgbW9kZWxEcmF3ZXJTZXJ2aWNlOiBNb2RlbERyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgYm94RHJhd2VyU2VydmljZTogQm94RHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb3JyaWRvckRyYXdlclNlcnZpY2U6IENvcnJpZG9yRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBjeWxpbmRlckRyYXdlclNlcnZpY2U6IEN5bGluZGVyRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBlbGxpcHNvaWREcmF3ZXJTZXJpY2U6IEVsbGlwc29pZERyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZVZvbHVtZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgd2FsbERyYXdlclNlcnZpY2U6IFdhbGxEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHJlY3RhbmdsZURyYXdlclNlcnZpY2U6IFJlY3RhbmdsZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgZHluYW1pY0VsbGlwc2VEcmF3ZXJTZXJ2aWNlOiBEeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgZHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZTogRHluYW1pY1BvbHlsaW5lRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBzdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlOiBTdGF0aWNDaXJjbGVEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHN0YXRpY1BvbHlsaW5lRHJhd2VyU2VydmljZTogU3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHN0YXRpY1BvbHlnb25EcmF3ZXJTZXJ2aWNlOiBTdGF0aWNQb2x5Z29uRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZTogU3RhdGljRWxsaXBzZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBQb2x5bGluZVByaW1pdGl2ZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgbGFiZWxQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlOiBMYWJlbFByaW1pdGl2ZURyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZTogQmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2U6IFBvaW50UHJpbWl0aXZlRHJhd2VyU2VydmljZSxcclxuICAgICAgICAgICAgICBodG1sRHJhd2VyU2VydmljZTogSHRtbERyYXdlclNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlXHJcbiAgKSB7XHJcbiAgICB0aGlzLl9kcmF3ZXJMaXN0ID0gbmV3IE1hcChbXHJcbiAgICAgIFsnYmlsbGJvYXJkJywgYmlsbGJvYXJkRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsnbGFiZWwnLCBsYWJlbERyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ2VsbGlwc2UnLCBlbGxpcHNlRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsncG9seWxpbmUnLCBwb2x5bGluZURyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3BvbHlnb24nLCBwb2x5Z29uRHJhd2VyU2VydmljZSBhcyBCYXNpY0RyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ2FyYycsIGFyY0RyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3BvaW50JywgcG9pbnREcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWydtb2RlbCcsIG1vZGVsRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsnYm94JywgYm94RHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsnY29ycmlkb3InLCBjb3JyaWRvckRyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ2N5bGluZGVyJywgY3lsaW5kZXJEcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWydlbGxpcHNvaWQnLCBlbGxpcHNvaWREcmF3ZXJTZXJpY2VdLFxyXG4gICAgICBbJ3BvbHlsaW5lVm9sdW1lJywgcG9seWxpbmVWb2x1bWVEcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWydyZWN0YW5nbGUnLCByZWN0YW5nbGVEcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWyd3YWxsJywgd2FsbERyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3BvbHlsaW5lUHJpbWl0aXZlJywgcG9seWxpbmVQcmltaXRpdmVEcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWydsYWJlbFByaW1pdGl2ZScsIGxhYmVsUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsnYmlsbGJvYXJkUHJpbWl0aXZlJywgYmlsbGJvYXJkUHJpbWl0aXZlRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsncG9pbnRQcmltaXRpdmUnLCBwb2ludFByaW1pdGl2ZURyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ2h0bWwnLCBodG1sRHJhd2VyU2VydmljZV0sXHJcbiAgICAgIFsnY3ptbCcsIGN6bWxEcmF3ZXJTZXJ2aWNlXSxcclxuXHJcbiAgICAgIFsnZHluYW1pY0VsbGlwc2UnLCBkeW5hbWljRWxsaXBzZURyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ2R5bmFtaWNQb2x5bGluZScsIGR5bmFtaWNQb2x5bGluZURyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3N0YXRpY0NpcmNsZScsIHN0YXRpY0NpcmNsZURyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3N0YXRpY1BvbHlsaW5lJywgc3RhdGljUG9seWxpbmVEcmF3ZXJTZXJ2aWNlXSxcclxuICAgICAgWydzdGF0aWNQb2x5Z29uJywgc3RhdGljUG9seWdvbkRyYXdlclNlcnZpY2VdLFxyXG4gICAgICBbJ3N0YXRpY0VsbGlwc2UnLCBzdGF0aWNFbGxpcHNlRHJhd2VyU2VydmljZV0sXHJcbiAgICBdKTtcclxuICB9XHJcblxyXG4gIGluaXQoKSB7XHJcbiAgICB0aGlzLmluaXRWYWxpZFBhcmFtcygpO1xyXG5cclxuICAgIG9ic2VydmFibGVNZXJnZSh0aGlzLl91cGRhdGVTdHJlYW0sIHRoaXMub2JzZXJ2YWJsZSkucGlwZTxBY05vdGlmaWNhdGlvbj4odGFrZVVudGlsKHRoaXMuc3RvcE9ic2VydmFibGUpKS5zdWJzY3JpYmUoKG5vdGlmaWNhdGlvbikgPT4ge1xyXG4gICAgICB0aGlzLl9jb21wdXRhdGlvbkNhY2hlLmNsZWFyKCk7XHJcblxyXG4gICAgICBpZiAodGhpcy5kZWJ1Zykge1xyXG4gICAgICAgIGNvbnNvbGUubG9nKCdBY0xheWVyIHJlY2VpdmVkIG5vdGlmaWNhdGlvbjonLCBub3RpZmljYXRpb24pO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBsZXQgY29udGV4dEVudGl0eSA9IG5vdGlmaWNhdGlvbi5lbnRpdHk7XHJcbiAgICAgIGlmICh0aGlzLnN0b3JlKSB7XHJcbiAgICAgICAgY29udGV4dEVudGl0eSA9IHRoaXMudXBkYXRlU3RvcmUobm90aWZpY2F0aW9uKTtcclxuICAgICAgfVxyXG5cclxuICAgICAgdGhpcy5jb250ZXh0W3RoaXMuZW50aXR5TmFtZV0gPSBjb250ZXh0RW50aXR5O1xyXG4gICAgICB0aGlzLmxheWVyU2VydmljZS5nZXREZXNjcmlwdGlvbnMoKS5mb3JFYWNoKChkZXNjcmlwdGlvbkNvbXBvbmVudCkgPT4ge1xyXG4gICAgICAgIHN3aXRjaCAobm90aWZpY2F0aW9uLmFjdGlvblR5cGUpIHtcclxuICAgICAgICAgIGNhc2UgQWN0aW9uVHlwZS5BRERfVVBEQVRFOlxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbkNvbXBvbmVudC5kcmF3KHRoaXMuY29udGV4dCwgbm90aWZpY2F0aW9uLmlkLCBjb250ZXh0RW50aXR5KTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBjYXNlIEFjdGlvblR5cGUuREVMRVRFOlxyXG4gICAgICAgICAgICBkZXNjcmlwdGlvbkNvbXBvbmVudC5yZW1vdmUobm90aWZpY2F0aW9uLmlkKTtcclxuICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICBkZWZhdWx0OlxyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKCdbYWMtbGF5ZXJdIHVua25vd24gQWNOb3RpZmljYXRpb24uYWN0aW9uVHlwZSBmb3Igbm90aWZpY2F0aW9uOiAnICsgbm90aWZpY2F0aW9uKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIHVwZGF0ZVN0b3JlKG5vdGlmaWNhdGlvbjogQWNOb3RpZmljYXRpb24pOiBhbnkge1xyXG4gICAgaWYgKG5vdGlmaWNhdGlvbi5hY3Rpb25UeXBlID09PSBBY3Rpb25UeXBlLkRFTEVURSkge1xyXG4gICAgICB0aGlzLmVudGl0aWVzU3RvcmUuZGVsZXRlKG5vdGlmaWNhdGlvbi5pZCk7XHJcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBpZiAodGhpcy5lbnRpdGllc1N0b3JlLmhhcyhub3RpZmljYXRpb24uaWQpKSB7XHJcbiAgICAgICAgY29uc3QgZW50aXR5ID0gdGhpcy5lbnRpdGllc1N0b3JlLmdldChub3RpZmljYXRpb24uaWQpO1xyXG4gICAgICAgIE9iamVjdC5hc3NpZ24oZW50aXR5LCBub3RpZmljYXRpb24uZW50aXR5KTtcclxuICAgICAgICByZXR1cm4gZW50aXR5O1xyXG4gICAgICB9IGVsc2Uge1xyXG4gICAgICAgIHRoaXMuZW50aXRpZXNTdG9yZS5zZXQobm90aWZpY2F0aW9uLmlkLCBub3RpZmljYXRpb24uZW50aXR5KTtcclxuICAgICAgICByZXR1cm4gbm90aWZpY2F0aW9uLmVudGl0eTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBpbml0VmFsaWRQYXJhbXMoKSB7XHJcbiAgICBpZiAoIXRoaXMuY29udGV4dCkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRpYWxpemUgW2NvbnRleHRdICcpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICghdGhpcy5hY0ZvclJneC50ZXN0KHRoaXMuYWNGb3IpKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgYWMtbGF5ZXI6IEludmFsaWQgW2FjRm9yXSBzeW50YXguIEV4cGVjdGVkOiBbYWNGb3JdPVwibGV0IGl0ZW0gb2Ygb2JzZXJ2YWJsZVwiIC5JbnN0ZWFkIHJlY2VpdmVkOiAke3RoaXMuYWNGb3J9YCk7XHJcbiAgICB9XHJcbiAgICBjb25zdCBhY0ZvckFyciA9IHRoaXMuYWNGb3Iuc3BsaXQoJyAnKTtcclxuICAgIHRoaXMub2JzZXJ2YWJsZSA9IHRoaXMuY29udGV4dFthY0ZvckFyclszXV07XHJcbiAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcclxuICAgIGlmICghdGhpcy5pc09ic2VydmFibGUodGhpcy5vYnNlcnZhYmxlKSkge1xyXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2FjLWxheWVyOiBtdXN0IGluaXRhaWxpemUgW2FjRm9yXSB3aXRoIHJ4IG9ic2VydmFibGUsIGluc3RlYWQgcmVjZWl2ZWQ6ICcgKyB0aGlzLm9ic2VydmFibGUpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICB0aGlzLmxheWVyU2VydmljZS5zZXRFbnRpdHlOYW1lKHRoaXMuZW50aXR5TmFtZSk7XHJcbiAgfVxyXG5cclxuICAvKiogVGVzdCBmb3IgYSByeGpzIE9ic2VydmFibGUgKi9cclxuICBwcml2YXRlIGlzT2JzZXJ2YWJsZShvYmo6IGFueSk6IGJvb2xlYW4ge1xyXG4gICAgLyogY2hlY2sgdmlhIGR1Y2stdHlwaW5nIHJhdGhlciB0aGFuIGluc3RhbmNlIG9mXHJcbiAgICAgKiB0byBhbGxvdyBwYXNzaW5nIGJldHdlZW4gd2luZG93IGNvbnRleHRzICovXHJcbiAgICByZXR1cm4gb2JqICYmIHR5cGVvZiBvYmouc3Vic2NyaWJlID09PSAnZnVuY3Rpb24nO1xyXG4gIH1cclxuXHJcbiAgbmdBZnRlckNvbnRlbnRJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5pbml0KCk7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHQgPSB0aGlzLmNvbnRleHQ7XHJcbiAgICB0aGlzLmxheWVyU2VydmljZS5vcHRpb25zID0gdGhpcy5vcHRpb25zO1xyXG4gICAgdGhpcy5sYXllclNlcnZpY2Uuc2hvdyA9IHRoaXMuc2hvdztcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnpJbmRleCA9IHRoaXMuekluZGV4O1xyXG4gICAgdGhpcy5fZHJhd2VyTGlzdC5mb3JFYWNoKChkcmF3ZXIsIGRyYXdlck5hbWUpID0+IHtcclxuICAgICAgY29uc3QgaW5pdE9wdGlvbnMgPSB0aGlzLm9wdGlvbnMgPyB0aGlzLm9wdGlvbnNbZHJhd2VyTmFtZV0gOiB1bmRlZmluZWQ7XHJcbiAgICAgIGNvbnN0IGRyYXdlckRhdGFTb3VyY2VzID0gZHJhd2VyLmluaXQoaW5pdE9wdGlvbnMpO1xyXG4gICAgICAvLyBvbmx5IGVudGl0aWVzIGRyYXdlcnMgY3JlYXRlIGRhdGEgc291cmNlc1xyXG4gICAgICBpZiAoZHJhd2VyRGF0YVNvdXJjZXMpIHtcclxuICAgICAgICAvLyB0aGlzLm1hcExheWVyc1NlcnZpY2UucmVnaXN0ZXJMYXllckRhdGFTb3VyY2VzKGRyYXdlckRhdGFTb3VyY2VzLCB0aGlzLnpJbmRleCk7XHJcbiAgICAgICAgLy8gVE9ETzogQ2hlY2sgaWYgdGhlIGZvbGxvd2luZyBsaW5lIGNhdXNlcyBCYWQgUGVyZm9ybWFuY2VcclxuICAgICAgICB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMucHVzaCguLi5kcmF3ZXJEYXRhU291cmNlcyk7XHJcbiAgICAgIH1cclxuICAgICAgZHJhd2VyLnNldFNob3codGhpcy5zaG93KTtcclxuICAgIH0pO1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYgKGNoYW5nZXMuc2hvdyAmJiAhY2hhbmdlcy5zaG93LmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgIGNvbnN0IHNob3dWYWx1ZSA9IGNoYW5nZXNbJ3Nob3cnXS5jdXJyZW50VmFsdWU7XHJcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnNob3cgPSBzaG93VmFsdWU7XHJcbiAgICAgIHRoaXMuX2RyYXdlckxpc3QuZm9yRWFjaCgoZHJhd2VyKSA9PiBkcmF3ZXIuc2V0U2hvdyhzaG93VmFsdWUpKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoY2hhbmdlcy56SW5kZXggJiYgIWNoYW5nZXMuekluZGV4LmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgIGNvbnN0IHpJbmRleFZhbHVlID0gY2hhbmdlc1snekluZGV4J10uY3VycmVudFZhbHVlO1xyXG4gICAgICB0aGlzLmxheWVyU2VydmljZS56SW5kZXggPSB6SW5kZXhWYWx1ZTtcclxuICAgICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLnVwZGF0ZUFuZFJlZnJlc2godGhpcy5sYXllckRyYXdlckRhdGFTb3VyY2VzLCB6SW5kZXhWYWx1ZSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIHRoaXMubWFwTGF5ZXJzU2VydmljZS5yZW1vdmVEYXRhU291cmNlcyh0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMpO1xyXG4gICAgdGhpcy5zdG9wT2JzZXJ2YWJsZS5uZXh0KHRydWUpO1xyXG4gICAgdGhpcy5yZW1vdmVBbGwoKTtcclxuICB9XHJcblxyXG4gIGdldExheWVyU2VydmljZSgpOiBMYXllclNlcnZpY2Uge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogUmV0dXJucyBhbiBhcnJheSBvZiBEYXRhU291cmNlcyByZWdpc3RlcmVkIGJ5IGEgZHJhd2VyIG9mIHRoaXMgbGF5ZXJcclxuICAgKiBAcmV0dXJuIEFycmF5IG9mIENlc2l1bS5EYXRhU291cmNlc1xyXG4gICAqL1xyXG4gIGdldExheWVyRHJhd2VyRGF0YVNvdXJjZXMoKTogYW55W10ge1xyXG4gICAgcmV0dXJuIHRoaXMubGF5ZXJEcmF3ZXJEYXRhU291cmNlcztcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgYW4gQXJyYXkgb2YgRGF0YVNvdXJjZXMgb2YgdGhlIGRyYXdlciB3aXRoIHRoZSBwcm92aWRlZCBEYXRhU291cmNlLm5hbWVcclxuICAgKiBFeGFtcGxlOiBnZXREYXRhU291cmNlT2ZEcmF3ZXIoJ3BvbHlsaW5lJykgcmV0dXJucyB0aGUgZGF0YVNvdXJjZSBvZiBwb2x5bGluZSBkcmF3ZXJcclxuICAgKiBAcmV0dXJuIEFycmF5IG9mIENlc2l1bS5EYXRhU291cmNlc1xyXG4gICAqL1xyXG4gIGdldERyYXdlckRhdGFTb3VyY2VzQnlOYW1lKG5hbWU6IHN0cmluZyk6IGFueVtdIHtcclxuICAgIHJldHVybiB0aGlzLmxheWVyRHJhd2VyRGF0YVNvdXJjZXMuZmlsdGVyKGQgPT4gZC5uYW1lID09PSBuYW1lKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJldHVybnMgdGhlIHN0b3JlLlxyXG4gICAqL1xyXG4gIGdldFN0b3JlKCk6IE1hcDxzdHJpbmcsIGFueT4ge1xyXG4gICAgcmV0dXJuIHRoaXMuZW50aXRpZXNTdG9yZTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIFJlbW92ZSBhbGwgdGhlIGVudGl0aWVzIGZyb20gdGhlIGxheWVyLlxyXG4gICAqL1xyXG4gIHJlbW92ZUFsbCgpOiB2b2lkIHtcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmdldERlc2NyaXB0aW9ucygpLmZvckVhY2goKGRlc2NyaXB0aW9uKSA9PiBkZXNjcmlwdGlvbi5yZW1vdmVBbGwoKSk7XHJcbiAgICB0aGlzLmVudGl0aWVzU3RvcmUuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIHJlbW92ZSBlbnRpdHkgZnJvbSB0aGUgbGF5ZXJcclxuICAgKi9cclxuICByZW1vdmUoZW50aXR5SWQ6IHN0cmluZykge1xyXG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQoe2lkOiBlbnRpdHlJZCwgYWN0aW9uVHlwZTogQWN0aW9uVHlwZS5ERUxFVEV9KTtcclxuICAgIHRoaXMuZW50aXRpZXNTdG9yZS5kZWxldGUoZW50aXR5SWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogYWRkL3VwZGF0ZSBlbnRpdHkgdG8vZnJvbSB0aGUgbGF5ZXJcclxuICAgKi9cclxuICB1cGRhdGVOb3RpZmljYXRpb24obm90aWZpY2F0aW9uOiBBY05vdGlmaWNhdGlvbik6IHZvaWQge1xyXG4gICAgdGhpcy5fdXBkYXRlU3RyZWFtLm5leHQobm90aWZpY2F0aW9uKTtcclxuICB9XHJcblxyXG4gIC8qKlxyXG4gICAqIGFkZC91cGRhdGUgZW50aXR5IHRvL2Zyb20gdGhlIGxheWVyXHJcbiAgICovXHJcbiAgdXBkYXRlKGVudGl0eTogQWNFbnRpdHksIGlkOiBzdHJpbmcpOiB2b2lkIHtcclxuICAgIHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KHtlbnRpdHksIGlkLCBhY3Rpb25UeXBlOiBBY3Rpb25UeXBlLkFERF9VUERBVEV9KTtcclxuICB9XHJcblxyXG4gIHJlZnJlc2hBbGwoY29sbGVjdGlvbjogQWNOb3RpZmljYXRpb25bXSk6IHZvaWQge1xyXG4gICAgLy8gVE9ETyBtYWtlIGVudGl0eSBpbnRlcmZhY2U6IGNvbGxlY3Rpb24gb2YgdHlwZSBlbnRpdHkgbm90IG5vdGlmaWNhdGlvblxyXG4gICAgb2JzZXJ2YWJsZUZyb20oY29sbGVjdGlvbikuc3Vic2NyaWJlKChlbnRpdHkpID0+IHRoaXMuX3VwZGF0ZVN0cmVhbS5uZXh0KGVudGl0eSkpO1xyXG4gIH1cclxufVxyXG4iXX0=