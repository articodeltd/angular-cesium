import { DOCUMENT } from '@angular/common';
import { Component, Inject, Input } from '@angular/core';
import { CesiumService } from '../../services/cesium/cesium.service';
import { CameraService } from '../../services/camera/camera.service';
import { ContextMenuService } from '../../services/context-menu/context-menu.service';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import { ArcDrawerService } from '../../services/drawers/arc-drawer/arc-drawer.service';
import { BillboardDrawerService } from '../../services/drawers/billboard-drawer/billboard-drawer.service';
import { CzmlDrawerService } from '../../services/drawers/czml-drawer/czml-drawer.service';
import { EllipseDrawerService } from '../../services/drawers/ellipse-drawer/ellipse-drawer.service';
import { LabelDrawerService } from '../../services/drawers/label-drawer/label-drawer.service';
import { PointDrawerService } from '../../services/drawers/point-drawer/point-drawer.service';
import { PolygonDrawerService } from '../../services/drawers/polygon-drawer/polygon-drawer.service';
import { PolylineDrawerService } from '../../services/drawers/polyline-drawer/polyline-drawer.service';
import { PolylinePrimitiveDrawerService } from '../../services/drawers/polyline-primitive-drawer/polyline-primitive-drawer.service';
import { KeyboardControlService } from '../../services/keyboard-control/keyboard-control.service';
import { CesiumEventBuilder } from '../../services/map-events-mananger/cesium-event-builder';
import { MapEventsManagerService } from '../../services/map-events-mananger/map-events-manager';
import { MapLayersService } from '../../services/map-layers/map-layers.service';
import { PlonterService } from '../../services/plonter/plonter.service';
import { ScreenshotService } from '../../services/screenshot/screenshot.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
import * as i2 from "../../services/camera/camera.service";
import * as i3 from "../../services/maps-manager/maps-manager.service";
import * as i4 from "../../services/drawers/billboard-drawer/billboard-drawer.service";
import * as i5 from "../../services/drawers/label-drawer/label-drawer.service";
import * as i6 from "../../services/drawers/ellipse-drawer/ellipse-drawer.service";
import * as i7 from "../../services/drawers/polyline-drawer/polyline-drawer.service";
import * as i8 from "../../services/drawers/polygon-drawer/polygon-drawer.service";
import * as i9 from "../../services/drawers/arc-drawer/arc-drawer.service";
import * as i10 from "../../services/drawers/point-drawer/point-drawer.service";
import * as i11 from "../../services/drawers/czml-drawer/czml-drawer.service";
import * as i12 from "../../services/map-events-mananger/map-events-manager";
import * as i13 from "../../services/keyboard-control/keyboard-control.service";
import * as i14 from "../../services/map-layers/map-layers.service";
import * as i15 from "../../services/screenshot/screenshot.service";
import * as i16 from "../../services/context-menu/context-menu.service";
import * as i17 from "../../services/coordinate-converter/coordinate-converter.service";
import * as i18 from "../ac-default-plonter/ac-default-plonter.component";
import * as i19 from "../ac-context-menu-wrapper/ac-context-menu-wrapper.component";
import * as i20 from "@angular/common";
/**
 * This is a map implementation, creates the cesium map.
 * Every layer should be tag inside ac-map tag
 *
 * Accessing cesium viewer:
 * 1. acMapComponent.getCesiumViewer()
 * 2. Use MapManagerService.getMap().getCesiumViewer() or if more then one map: MapManagerService.getMap(mapId).getCesiumViewer()
 *
 *
 * @example
 * <ac-map>
 *     <ac-map-layer-provider></ac-map-layer-provider>
 *     <dynamic-ellipse-layer #layer></dynamic-ellipse-layer>
 * </ac-map>
 */
export class AcMapComponent {
    constructor(_cesiumService, _cameraService, _elemRef, document, mapsManagerService, billboardDrawerService, labelDrawerService, ellipseDrawerService, polylineDrawerService, polygonDrawerService, arcDrawerService, pointDrawerService, czmlDrawerService, mapEventsManager, keyboardControlService, mapLayersService, screenshotService, contextMenuService, coordinateConverter) {
        this._cesiumService = _cesiumService;
        this._cameraService = _cameraService;
        this._elemRef = _elemRef;
        this.document = document;
        this.mapsManagerService = mapsManagerService;
        this.billboardDrawerService = billboardDrawerService;
        this.labelDrawerService = labelDrawerService;
        this.ellipseDrawerService = ellipseDrawerService;
        this.polylineDrawerService = polylineDrawerService;
        this.polygonDrawerService = polygonDrawerService;
        this.arcDrawerService = arcDrawerService;
        this.pointDrawerService = pointDrawerService;
        this.czmlDrawerService = czmlDrawerService;
        this.mapEventsManager = mapEventsManager;
        this.keyboardControlService = keyboardControlService;
        this.mapLayersService = mapLayersService;
        this.screenshotService = screenshotService;
        this.contextMenuService = contextMenuService;
        this.coordinateConverter = coordinateConverter;
        /**
         * Disable default plonter context menu
         */
        this.disableDefaultPlonter = false;
        this.mapContainer = this.document.createElement('div');
        this.mapContainer.style.width = '100%';
        this.mapContainer.style.height = '100%';
        this.mapContainer.className = 'map-container';
        this._cesiumService.init(this.mapContainer);
        this._cameraService.init(this._cesiumService);
        this.mapEventsManager.init();
        this.billboardDrawerService.init();
        this.labelDrawerService.init();
        this.ellipseDrawerService.init();
        this.polylineDrawerService.init();
        this.polygonDrawerService.init();
        this.arcDrawerService.init();
        this.pointDrawerService.init();
        this.czmlDrawerService.init();
        this.keyboardControlService.init();
        this.contextMenuService.init(this.mapEventsManager);
    }
    ngOnInit() {
        this.mapId = this.mapsManagerService._registerMap(this.mapId, this);
        if (!this.containerId) {
            this._elemRef.nativeElement.appendChild(this.mapContainer);
        }
    }
    ngOnChanges(changes) {
        if (changes['sceneMode']) {
            this._cameraService.setSceneMode(changes['sceneMode'].currentValue);
        }
        if (changes['flyTo']) {
            this._cameraService.cameraFlyTo(changes['flyTo'].currentValue);
        }
        if (changes['containerId'] && !changes['containerId'].firstChange) {
            const element = this.document.getElementById(changes['containerId'].currentValue);
            if (element) {
                element.appendChild(this.mapContainer);
            }
            else {
                throw new Error(`No element found with id: ${changes['containerId'].currentValue}`);
            }
        }
    }
    ngAfterViewInit() {
        this.mapLayersService.drawAllLayers();
        if (this.containerId) {
            setTimeout(() => {
                const element = this.document.getElementById(this.containerId);
                if (element) {
                    element.appendChild(this.mapContainer);
                }
                else {
                    throw new Error(`No element found with id: ${this.containerId}`);
                }
            }, 0);
        }
    }
    ngOnDestroy() {
        this.mapContainer.remove();
        this.mapsManagerService._removeMapById(this.mapId);
    }
    /**
     * @returns ac-map's cesium service
     */
    getCesiumService() {
        return this._cesiumService;
    }
    /**
     * @returns map's cesium viewer
     */
    getCesiumViewer() {
        return this._cesiumService.getViewer();
    }
    getCameraService() {
        return this._cameraService;
    }
    getId() {
        return this.mapId;
    }
    getMapContainer() {
        return this.mapContainer;
    }
    getMapEventsManager() {
        return this.mapEventsManager;
    }
    getContextMenuService() {
        return this.contextMenuService;
    }
    getScreenshotService() {
        return this.screenshotService;
    }
    getKeyboardControlService() {
        return this.keyboardControlService;
    }
    getCoordinateConverter() {
        return this.coordinateConverter;
    }
}
AcMapComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapComponent, deps: [{ token: i1.CesiumService }, { token: i2.CameraService }, { token: i0.ElementRef }, { token: DOCUMENT }, { token: i3.MapsManagerService }, { token: i4.BillboardDrawerService }, { token: i5.LabelDrawerService }, { token: i6.EllipseDrawerService }, { token: i7.PolylineDrawerService }, { token: i8.PolygonDrawerService }, { token: i9.ArcDrawerService }, { token: i10.PointDrawerService }, { token: i11.CzmlDrawerService }, { token: i12.MapEventsManagerService }, { token: i13.KeyboardControlService }, { token: i14.MapLayersService }, { token: i15.ScreenshotService }, { token: i16.ContextMenuService }, { token: i17.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
AcMapComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcMapComponent, selector: "ac-map", inputs: { disableDefaultPlonter: "disableDefaultPlonter", mapId: "mapId", flyTo: "flyTo", sceneMode: "sceneMode", containerId: "containerId" }, providers: [
        CesiumService,
        BillboardDrawerService,
        CesiumEventBuilder,
        KeyboardControlService,
        MapEventsManagerService,
        PlonterService,
        LabelDrawerService,
        PolylineDrawerService,
        PolylinePrimitiveDrawerService,
        EllipseDrawerService,
        PointDrawerService,
        ArcDrawerService,
        CzmlDrawerService,
        PolygonDrawerService,
        MapLayersService,
        CameraService,
        ScreenshotService,
        ContextMenuService,
        CoordinateConverter,
    ], usesOnChanges: true, ngImport: i0, template: `
    <ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `, isInline: true, components: [{ type: i18.AcDefaultPlonterComponent, selector: "ac-default-plonter" }, { type: i19.AcContextMenuWrapperComponent, selector: "ac-context-menu-wrapper" }], directives: [{ type: i20.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcMapComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-map',
                    template: `
    <ac-default-plonter *ngIf="!disableDefaultPlonter"></ac-default-plonter>
    <ac-context-menu-wrapper></ac-context-menu-wrapper>
    <ng-content></ng-content>
  `,
                    providers: [
                        CesiumService,
                        BillboardDrawerService,
                        CesiumEventBuilder,
                        KeyboardControlService,
                        MapEventsManagerService,
                        PlonterService,
                        LabelDrawerService,
                        PolylineDrawerService,
                        PolylinePrimitiveDrawerService,
                        EllipseDrawerService,
                        PointDrawerService,
                        ArcDrawerService,
                        CzmlDrawerService,
                        PolygonDrawerService,
                        MapLayersService,
                        CameraService,
                        ScreenshotService,
                        ContextMenuService,
                        CoordinateConverter,
                    ],
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }, { type: i2.CameraService }, { type: i0.ElementRef }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [DOCUMENT]
                }] }, { type: i3.MapsManagerService }, { type: i4.BillboardDrawerService }, { type: i5.LabelDrawerService }, { type: i6.EllipseDrawerService }, { type: i7.PolylineDrawerService }, { type: i8.PolygonDrawerService }, { type: i9.ArcDrawerService }, { type: i10.PointDrawerService }, { type: i11.CzmlDrawerService }, { type: i12.MapEventsManagerService }, { type: i13.KeyboardControlService }, { type: i14.MapLayersService }, { type: i15.ScreenshotService }, { type: i16.ContextMenuService }, { type: i17.CoordinateConverter }]; }, propDecorators: { disableDefaultPlonter: [{
                type: Input
            }], mapId: [{
                type: Input
            }], flyTo: [{
                type: Input
            }], sceneMode: [{
                type: Input
            }], containerId: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtbWFwLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1tYXAvYWMtbWFwLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsUUFBUSxFQUFFLE1BQU0saUJBQWlCLENBQUM7QUFDM0MsT0FBTyxFQUFpQixTQUFTLEVBQWMsTUFBTSxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDakksT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHNDQUFzQyxDQUFDO0FBRXJFLE9BQU8sRUFBRSxhQUFhLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUNyRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN0RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSxzREFBc0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQztBQUMxRyxPQUFPLEVBQUUsaUJBQWlCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUMzRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsa0JBQWtCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUM5RixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSw4REFBOEQsQ0FBQztBQUNwRyxPQUFPLEVBQUUscUJBQXFCLEVBQUUsTUFBTSxnRUFBZ0UsQ0FBQztBQUN2RyxPQUFPLEVBQUUsOEJBQThCLEVBQUUsTUFBTSxvRkFBb0YsQ0FBQztBQUNwSSxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSwwREFBMEQs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Q2hCLGlCQUFpQjt3QkFDakIsb0JBQW9CO3dCQUNwQixnQkFBZ0I7d0JBQ2hCLGFBQWE7d0JBQ2IsaUJBQWlCO3dCQUNqQixrQkFBa0I7d0JBQ2xCLG1CQUFtQjtxQkFDcEI7aUJBQ0Y7OzBCQXdDSSxNQUFNOzJCQUFDLFFBQVE7a2pCQWxDbEIscUJBQXFCO3NCQURwQixLQUFLO2dCQVFOLEtBQUs7c0JBREosS0FBSztnQkFPTixLQUFLO3NCQURKLEtBQUs7Z0JBT04sU0FBUztzQkFEUixLQUFLO2dCQVFOLFdBQVc7c0JBRFYsS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IERPQ1VNRU5UIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQWZ0ZXJWaWV3SW5pdCwgQ29tcG9uZW50LCBFbGVtZW50UmVmLCBJbmplY3QsIElucHV0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSwgT25Jbml0LCBTaW1wbGVDaGFuZ2VzIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTY2VuZU1vZGUgfSBmcm9tICcuLi8uLi9tb2RlbHMvc2NlbmUtbW9kZS5lbnVtJztcclxuaW1wb3J0IHsgQ2FtZXJhU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NhbWVyYS9jYW1lcmEuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XHJcbmltcG9ydCB7IENvb3JkaW5hdGVDb252ZXJ0ZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb29yZGluYXRlLWNvbnZlcnRlci9jb29yZGluYXRlLWNvbnZlcnRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQXJjRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvYXJjLWRyYXdlci9hcmMtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9iaWxsYm9hcmQtZHJhd2VyL2JpbGxib2FyZC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEN6bWxEcmF3ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvZHJhd2Vycy9jem1sLWRyYXdlci9jem1sLWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgRWxsaXBzZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2VsbGlwc2UtZHJhd2VyL2VsbGlwc2UtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYWJlbERyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL2xhYmVsLWRyYXdlci9sYWJlbC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvaW50RHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9pbnQtZHJhd2VyL3BvaW50LWRyYXdlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgUG9seWdvbkRyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlnb24tZHJhd2VyL3BvbHlnb24tZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBQb2x5bGluZURyYXdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9kcmF3ZXJzL3BvbHlsaW5lLWRyYXdlci9wb2x5bGluZS1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvcG9seWxpbmUtcHJpbWl0aXZlLWRyYXdlci9wb2x5bGluZS1wcmltaXRpdmUtZHJhd2VyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBLZXlib2FyZENvbnRyb2xTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMva2V5Ym9hcmQtY29udHJvbC9rZXlib2FyZC1jb250cm9sLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1FdmVudEJ1aWxkZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL2Nlc2l1bS1ldmVudC1idWlsZGVyJztcclxuaW1wb3J0IHsgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtZXZlbnRzLW1hbmFuZ2VyL21hcC1ldmVudHMtbWFuYWdlcic7XHJcbmltcG9ydCB7IE1hcExheWVyc1NlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9tYXAtbGF5ZXJzL21hcC1sYXllcnMuc2VydmljZSc7XHJcbmltcG9ydCB7IE1hcHNNYW5hZ2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IFBsb250ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvcGxvbnRlci9wbG9udGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBTY3JlZW5zaG90U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3NjcmVlbnNob3Qvc2NyZWVuc2hvdC5zZXJ2aWNlJztcclxuXHJcbi8qKlxyXG4gKiBUaGlzIGlzIGEgbWFwIGltcGxlbWVudGF0aW9uLCBjcmVhdGVzIHRoZSBjZXNpdW0gbWFwLlxyXG4gKiBFdmVyeSBsYXllciBzaG91bGQgYmUgdGFnIGluc2lkZSBhYy1tYXAgdGFnXHJcbiAqXHJcbiAqIEFjY2Vzc2luZyBjZXNpdW0gdmlld2VyOlxyXG4gKiAxLiBhY01hcENvbXBvbmVudC5nZXRDZXNpdW1WaWV3ZXIoKVxyXG4gKiAyLiBVc2UgTWFwTWFuYWdlclNlcnZpY2UuZ2V0TWFwKCkuZ2V0Q2VzaXVtVmlld2VyKCkgb3IgaWYgbW9yZSB0aGVuIG9uZSBtYXA6IE1hcE1hbmFnZXJTZXJ2aWNlLmdldE1hcChtYXBJZCkuZ2V0Q2VzaXVtVmlld2VyKClcclxuICpcclxuICpcclxuICogQGV4YW1wbGVcclxuICogPGFjLW1hcD5cclxuICogICAgIDxhYy1tYXAtbGF5ZXItcHJvdmlkZXI+PC9hYy1tYXAtbGF5ZXItcHJvdmlkZXI+XHJcbiAqICAgICA8ZHluYW1pYy1lbGxpcHNlLWxheWVyICNsYXllcj48L2R5bmFtaWMtZWxsaXBzZS1sYXllcj5cclxuICogPC9hYy1tYXA+XHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLW1hcCcsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxhYy1kZWZhdWx0LXBsb250ZXIgKm5nSWY9XCIhZGlzYWJsZURlZmF1bHRQbG9udGVyXCI+PC9hYy1kZWZhdWx0LXBsb250ZXI+XHJcbiAgICA8YWMtY29udGV4dC1tZW51LXdyYXBwZXI+PC9hYy1jb250ZXh0LW1lbnUtd3JhcHBlcj5cclxuICAgIDxuZy1jb250ZW50PjwvbmctY29udGVudD5cclxuICBgLFxyXG4gIHByb3ZpZGVyczogW1xyXG4gICAgQ2VzaXVtU2VydmljZSxcclxuICAgIEJpbGxib2FyZERyYXdlclNlcnZpY2UsXHJcbiAgICBDZXNpdW1FdmVudEJ1aWxkZXIsXHJcbiAgICBLZXlib2FyZENvbnRyb2xTZXJ2aWNlLFxyXG4gICAgTWFwRXZlbnRzTWFuYWdlclNlcnZpY2UsXHJcbiAgICBQbG9udGVyU2VydmljZSxcclxuICAgIExhYmVsRHJhd2VyU2VydmljZSxcclxuICAgIFBvbHlsaW5lRHJhd2VyU2VydmljZSxcclxuICAgIFBvbHlsaW5lUHJpbWl0aXZlRHJhd2VyU2VydmljZSxcclxuICAgIEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgUG9pbnREcmF3ZXJTZXJ2aWNlLFxyXG4gICAgQXJjRHJhd2VyU2VydmljZSxcclxuICAgIEN6bWxEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgUG9seWdvbkRyYXdlclNlcnZpY2UsXHJcbiAgICBNYXBMYXllcnNTZXJ2aWNlLFxyXG4gICAgQ2FtZXJhU2VydmljZSxcclxuICAgIFNjcmVlbnNob3RTZXJ2aWNlLFxyXG4gICAgQ29udGV4dE1lbnVTZXJ2aWNlLFxyXG4gICAgQ29vcmRpbmF0ZUNvbnZlcnRlcixcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNNYXBDb21wb25lbnQgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgQWZ0ZXJWaWV3SW5pdCwgT25EZXN0cm95IHtcclxuICAvKipcclxuICAgKiBEaXNhYmxlIGRlZmF1bHQgcGxvbnRlciBjb250ZXh0IG1lbnVcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIGRpc2FibGVEZWZhdWx0UGxvbnRlciA9IGZhbHNlO1xyXG5cclxuICAvKipcclxuICAgKiBTZXQgdGhlIGlkIG5hbWUgb2YgdGhlIG1hcFxyXG4gICAqIGRlZmF1bHQ6ICdkZWZhdWx0LW1hcC1pZC1baW5kZXhdJ1xyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgbWFwSWQ6IHN0cmluZztcclxuXHJcbiAgLyoqXHJcbiAgICogZmx5VG8gb3B0aW9ucyBhY2NvcmRpbmcgdG8gaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2FtZXJhLmh0bWw/Y2xhc3NGaWx0ZXI9Y2FtI2ZseVRvXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBmbHlUbzogYW55O1xyXG5cclxuICAvKipcclxuICAgKiBTZXRzIHRoZSBtYXAncyBTY2VuZU1vZGVcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIHNjZW5lTW9kZTogU2NlbmVNb2RlO1xyXG5cclxuICAvKipcclxuICAgKiBPcHRpb25hbCAtIHRoZSBjb250YWluZXIgZWxlbWVudCdzIGlkIGluIHdoaWNoIHRoZSBtYXAncyBjYW52YXMgd2lsbCBiZSBhcHBlbmRlZCB0by5cclxuICAgKiBJZiBub3Qgc3VwcGxpZWQgLSB0aGUgY29udGFpbmVyIGVsZW1lbnQgd2lsbCBiZSB0aGUgcGFyZW50IGVsZW1lbnQgb2YgYWMtbWFwO1xyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgY29udGFpbmVySWQ6IHN0cmluZztcclxuXHJcbiAgcHJpdmF0ZSBtYXBDb250YWluZXI6IEhUTUxFbGVtZW50O1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgX2Nlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UsXHJcbiAgICBwcml2YXRlIF9jYW1lcmFTZXJ2aWNlOiBDYW1lcmFTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBfZWxlbVJlZjogRWxlbWVudFJlZixcclxuICAgIEBJbmplY3QoRE9DVU1FTlQpIHByaXZhdGUgZG9jdW1lbnQsXHJcbiAgICBwcml2YXRlIG1hcHNNYW5hZ2VyU2VydmljZTogTWFwc01hbmFnZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBiaWxsYm9hcmREcmF3ZXJTZXJ2aWNlOiBCaWxsYm9hcmREcmF3ZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBsYWJlbERyYXdlclNlcnZpY2U6IExhYmVsRHJhd2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgZWxsaXBzZURyYXdlclNlcnZpY2U6IEVsbGlwc2VEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwb2x5bGluZURyYXdlclNlcnZpY2U6IFBvbHlsaW5lRHJhd2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgcG9seWdvbkRyYXdlclNlcnZpY2U6IFBvbHlnb25EcmF3ZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBhcmNEcmF3ZXJTZXJ2aWNlOiBBcmNEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBwb2ludERyYXdlclNlcnZpY2U6IFBvaW50RHJhd2VyU2VydmljZSxcclxuICAgIHByaXZhdGUgY3ptbERyYXdlclNlcnZpY2U6IEN6bWxEcmF3ZXJTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBtYXBFdmVudHNNYW5hZ2VyOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSxcclxuICAgIHByaXZhdGUga2V5Ym9hcmRDb250cm9sU2VydmljZTogS2V5Ym9hcmRDb250cm9sU2VydmljZSxcclxuICAgIHByaXZhdGUgbWFwTGF5ZXJzU2VydmljZTogTWFwTGF5ZXJzU2VydmljZSxcclxuICAgIHByaXZhdGUgc2NyZWVuc2hvdFNlcnZpY2U6IFNjcmVlbnNob3RTZXJ2aWNlLFxyXG4gICAgcHVibGljIGNvbnRleHRNZW51U2VydmljZTogQ29udGV4dE1lbnVTZXJ2aWNlLFxyXG4gICAgcHJpdmF0ZSBjb29yZGluYXRlQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyLFxyXG4gICkge1xyXG4gICAgdGhpcy5tYXBDb250YWluZXIgPSB0aGlzLmRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xyXG4gICAgdGhpcy5tYXBDb250YWluZXIuc3R5bGUud2lkdGggPSAnMTAwJSc7XHJcbiAgICB0aGlzLm1hcENvbnRhaW5lci5zdHlsZS5oZWlnaHQgPSAnMTAwJSc7XHJcbiAgICB0aGlzLm1hcENvbnRhaW5lci5jbGFzc05hbWUgPSAnbWFwLWNvbnRhaW5lcic7XHJcbiAgICB0aGlzLl9jZXNpdW1TZXJ2aWNlLmluaXQodGhpcy5tYXBDb250YWluZXIpO1xyXG4gICAgdGhpcy5fY2FtZXJhU2VydmljZS5pbml0KHRoaXMuX2Nlc2l1bVNlcnZpY2UpO1xyXG4gICAgdGhpcy5tYXBFdmVudHNNYW5hZ2VyLmluaXQoKTtcclxuICAgIHRoaXMuYmlsbGJvYXJkRHJhd2VyU2VydmljZS5pbml0KCk7XHJcbiAgICB0aGlzLmxhYmVsRHJhd2VyU2VydmljZS5pbml0KCk7XHJcbiAgICB0aGlzLmVsbGlwc2VEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcclxuICAgIHRoaXMucG9seWxpbmVEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcclxuICAgIHRoaXMucG9seWdvbkRyYXdlclNlcnZpY2UuaW5pdCgpO1xyXG4gICAgdGhpcy5hcmNEcmF3ZXJTZXJ2aWNlLmluaXQoKTtcclxuICAgIHRoaXMucG9pbnREcmF3ZXJTZXJ2aWNlLmluaXQoKTtcclxuICAgIHRoaXMuY3ptbERyYXdlclNlcnZpY2UuaW5pdCgpO1xyXG4gICAgdGhpcy5rZXlib2FyZENvbnRyb2xTZXJ2aWNlLmluaXQoKTtcclxuICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLmluaXQodGhpcy5tYXBFdmVudHNNYW5hZ2VyKTtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgdGhpcy5tYXBJZCA9IHRoaXMubWFwc01hbmFnZXJTZXJ2aWNlLl9yZWdpc3Rlck1hcCh0aGlzLm1hcElkLCB0aGlzKTtcclxuICAgIGlmICghdGhpcy5jb250YWluZXJJZCkge1xyXG4gICAgICB0aGlzLl9lbGVtUmVmLm5hdGl2ZUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5tYXBDb250YWluZXIpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYgKGNoYW5nZXNbJ3NjZW5lTW9kZSddKSB7XHJcbiAgICAgIHRoaXMuX2NhbWVyYVNlcnZpY2Uuc2V0U2NlbmVNb2RlKGNoYW5nZXNbJ3NjZW5lTW9kZSddLmN1cnJlbnRWYWx1ZSk7XHJcbiAgICB9XHJcbiAgICBpZiAoY2hhbmdlc1snZmx5VG8nXSkge1xyXG4gICAgICB0aGlzLl9jYW1lcmFTZXJ2aWNlLmNhbWVyYUZseVRvKGNoYW5nZXNbJ2ZseVRvJ10uY3VycmVudFZhbHVlKTtcclxuICAgIH1cclxuICAgIGlmIChjaGFuZ2VzWydjb250YWluZXJJZCddICYmICFjaGFuZ2VzWydjb250YWluZXJJZCddLmZpcnN0Q2hhbmdlKSB7XHJcbiAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGNoYW5nZXNbJ2NvbnRhaW5lcklkJ10uY3VycmVudFZhbHVlKTtcclxuICAgICAgaWYgKGVsZW1lbnQpIHtcclxuICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcclxuICAgICAgfSBlbHNlIHtcclxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYE5vIGVsZW1lbnQgZm91bmQgd2l0aCBpZDogJHtjaGFuZ2VzWydjb250YWluZXJJZCddLmN1cnJlbnRWYWx1ZX1gKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdBZnRlclZpZXdJbml0KCk6IHZvaWQge1xyXG4gICAgdGhpcy5tYXBMYXllcnNTZXJ2aWNlLmRyYXdBbGxMYXllcnMoKTtcclxuICAgIGlmICh0aGlzLmNvbnRhaW5lcklkKSB7XHJcbiAgICAgIHNldFRpbWVvdXQoKCkgPT4ge1xyXG4gICAgICAgIGNvbnN0IGVsZW1lbnQgPSB0aGlzLmRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRoaXMuY29udGFpbmVySWQpO1xyXG4gICAgICAgIGlmIChlbGVtZW50KSB7XHJcbiAgICAgICAgICBlbGVtZW50LmFwcGVuZENoaWxkKHRoaXMubWFwQ29udGFpbmVyKTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBObyBlbGVtZW50IGZvdW5kIHdpdGggaWQ6ICR7dGhpcy5jb250YWluZXJJZH1gKTtcclxuICAgICAgICB9XHJcbiAgICAgIH0sIDApO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XHJcbiAgICB0aGlzLm1hcENvbnRhaW5lci5yZW1vdmUoKTtcclxuICAgIHRoaXMubWFwc01hbmFnZXJTZXJ2aWNlLl9yZW1vdmVNYXBCeUlkKHRoaXMubWFwSWQpO1xyXG4gIH1cclxuXHJcbiAgLyoqXHJcbiAgICogQHJldHVybnMgYWMtbWFwJ3MgY2VzaXVtIHNlcnZpY2VcclxuICAgKi9cclxuICBnZXRDZXNpdW1TZXJ2aWNlKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2U7XHJcbiAgfVxyXG5cclxuICAvKipcclxuICAgKiBAcmV0dXJucyBtYXAncyBjZXNpdW0gdmlld2VyXHJcbiAgICovXHJcbiAgZ2V0Q2VzaXVtVmlld2VyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuX2Nlc2l1bVNlcnZpY2UuZ2V0Vmlld2VyKCk7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0Q2FtZXJhU2VydmljZSgpOiBDYW1lcmFTZXJ2aWNlIHtcclxuICAgIHJldHVybiB0aGlzLl9jYW1lcmFTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0SWQoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBJZDtcclxuICB9XHJcblxyXG5cclxuICBnZXRNYXBDb250YWluZXIoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBDb250YWluZXI7XHJcbiAgfVxyXG5cclxuXHJcbiAgZ2V0TWFwRXZlbnRzTWFuYWdlcigpOiBNYXBFdmVudHNNYW5hZ2VyU2VydmljZSB7XHJcbiAgICByZXR1cm4gdGhpcy5tYXBFdmVudHNNYW5hZ2VyO1xyXG4gIH1cclxuXHJcbiAgZ2V0Q29udGV4dE1lbnVTZXJ2aWNlKCk6IENvbnRleHRNZW51U2VydmljZSB7XHJcbiAgICByZXR1cm4gdGhpcy5jb250ZXh0TWVudVNlcnZpY2U7XHJcbiAgfVxyXG5cclxuICBnZXRTY3JlZW5zaG90U2VydmljZSgpIHtcclxuICAgIHJldHVybiB0aGlzLnNjcmVlbnNob3RTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgZ2V0S2V5Ym9hcmRDb250cm9sU2VydmljZSgpIHtcclxuICAgIHJldHVybiB0aGlzLmtleWJvYXJkQ29udHJvbFNlcnZpY2U7XHJcbiAgfVxyXG5cclxuICBnZXRDb29yZGluYXRlQ29udmVydGVyKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY29vcmRpbmF0ZUNvbnZlcnRlcjtcclxuICB9XHJcbn1cclxuIl19