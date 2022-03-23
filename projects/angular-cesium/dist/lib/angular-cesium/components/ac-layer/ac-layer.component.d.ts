import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { AfterContentInit, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcNotification } from '../../models/ac-notification';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { AcEntity } from '../../models/ac-entity';
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
import * as i0 from "@angular/core";
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
export declare class AcLayerComponent implements OnInit, OnChanges, AfterContentInit, OnDestroy {
    private layerService;
    private _computationCache;
    private mapLayersService;
    show: boolean;
    acFor: string;
    context: any;
    store: boolean;
    options: LayerOptions;
    zIndex: number;
    debug: boolean;
    private readonly acForRgx;
    private entityName;
    private stopObservable;
    private observable;
    private _drawerList;
    private _updateStream;
    private entitiesStore;
    private layerDrawerDataSources;
    constructor(layerService: LayerService, _computationCache: ComputationCache, mapLayersService: MapLayersService, billboardDrawerService: BillboardDrawerService, labelDrawerService: LabelDrawerService, ellipseDrawerService: EllipseDrawerService, polylineDrawerService: PolylineDrawerService, polygonDrawerService: PolygonDrawerService, arcDrawerService: ArcDrawerService, pointDrawerService: PointDrawerService, modelDrawerService: ModelDrawerService, boxDrawerService: BoxDrawerService, corridorDrawerService: CorridorDrawerService, cylinderDrawerService: CylinderDrawerService, ellipsoidDrawerSerice: EllipsoidDrawerService, polylineVolumeDrawerService: PolylineVolumeDrawerService, wallDrawerService: WallDrawerService, rectangleDrawerService: RectangleDrawerService, dynamicEllipseDrawerService: DynamicEllipseDrawerService, dynamicPolylineDrawerService: DynamicPolylineDrawerService, staticCircleDrawerService: StaticCircleDrawerService, staticPolylineDrawerService: StaticPolylineDrawerService, staticPolygonDrawerService: StaticPolygonDrawerService, staticEllipseDrawerService: StaticEllipseDrawerService, polylinePrimitiveDrawerService: PolylinePrimitiveDrawerService, labelPrimitiveDrawerService: LabelPrimitiveDrawerService, billboardPrimitiveDrawerService: BillboardPrimitiveDrawerService, pointPrimitiveDrawerService: PointPrimitiveDrawerService, htmlDrawerService: HtmlDrawerService, czmlDrawerService: CzmlDrawerService);
    init(): void;
    private updateStore;
    private initValidParams;
    /** Test for a rxjs Observable */
    private isObservable;
    ngAfterContentInit(): void;
    ngOnInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    ngOnDestroy(): void;
    getLayerService(): LayerService;
    /**
     * Returns an array of DataSources registered by a drawer of this layer
     * @return Array of Cesium.DataSources
     */
    getLayerDrawerDataSources(): any[];
    /**
     * Returns an Array of DataSources of the drawer with the provided DataSource.name
     * Example: getDataSourceOfDrawer('polyline') returns the dataSource of polyline drawer
     * @return Array of Cesium.DataSources
     */
    getDrawerDataSourcesByName(name: string): any[];
    /**
     * Returns the store.
     */
    getStore(): Map<string, any>;
    /**
     * Remove all the entities from the layer.
     */
    removeAll(): void;
    /**
     * remove entity from the layer
     */
    remove(entityId: string): void;
    /**
     * add/update entity to/from the layer
     */
    updateNotification(notification: AcNotification): void;
    /**
     * add/update entity to/from the layer
     */
    update(entity: AcEntity, id: string): void;
    refreshAll(collection: AcNotification[]): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcLayerComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcLayerComponent, "ac-layer", never, { "show": "show"; "acFor": "acFor"; "context": "context"; "store": "store"; "options": "options"; "zIndex": "zIndex"; "debug": "debug"; }, {}, never, ["*"]>;
}
