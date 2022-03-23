import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcMapComponent } from './components/ac-map/ac-map.component';
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import { AcBillboardDescComponent } from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcEllipseDescComponent } from './components/ac-ellipse-desc/ac-ellipse-desc.component';
import { AcPolylineDescComponent } from './components/ac-polyline-desc/ac-polyline-desc.component';
import { Angular2ParseModule, PIPES_CONFIG } from '@auscope/angular2parse';
import { PixelOffsetPipe } from './pipes/pixel-offset/pixel-offset.pipe';
import { RadiansToDegreesPipe } from './pipes/radians-to-degrees/radians-to-degrees.pipe';
import { JsonMapper } from './services/json-mapper/json-mapper.service';
import { CesiumProperties } from './services/cesium-properties/cesium-properties.service';
import { AcLabelDescComponent } from './components/ac-label-desc/ac-label-desc.component';
import { UtilsModule } from './utils/utils.module';
import { ViewerFactory } from './services/viewer-factory/viewer-factory.service';
import { GeoUtilsService } from './services/geo-utils/geo-utils.service';
import { AcCircleDescComponent } from './components/ac-circle-desc/ac-circle-desc.component';
import { AcArcDescComponent } from './components/ac-arc-desc/ac-arc-desc.component';
import { AcMapLayerProviderComponent } from './components/ac-map-layer-provider/ac-map-layer-provider.component';
import { AcMapTerrainProviderComponent } from './components/ac-map-terrain-provider/ac-map-terrain-provider.component';
import { AcPointDescComponent } from './components/ac-point-desc/ac-point-desc.component';
import { AcLabelComponent } from './components/ac-label/ac-label.component';
import { AcPolylineComponent } from './components/ac-polyline/ac-polyline.component';
import { AcEllipseComponent } from './components/ac-ellipse/ac-ellipse.component';
import { AcPointComponent } from './components/ac-point/ac-point.component';
import { AcHtmlComponent } from './components/ac-html/ac-html.component';
import { AcCircleComponent } from './components/ac-circle/ac-circle.component';
import { AcArcComponent } from './components/ac-arc/ac-arc.component';
import { AcPolygonDescComponent } from './components/ac-polygon-desc/ac-polygon-desc.component';
import { AcDefaultPlonterComponent } from './components/ac-default-plonter/ac-default-plonter.component';
import { AcPolygonComponent } from './components/ac-polygon/ac-polygon.component';
import { MapsManagerService } from './services/maps-manager/maps-manager.service';
import { AcStaticEllipseDescComponent } from './components/static-dynamic/ac-static-ellipse-desc/ac-static-ellipse-desc.component';
import { AcDynamicEllipseDescComponent } from './components/static-dynamic/ac-dynamic-ellipse-desc/ac-dynamic-ellipse-desc.component';
import { AcDynamicPolylineDescComponent } from './components/static-dynamic/ac-dynamic-polyline-desc/ac-dynamic-polyline-desc.component';
import { AcStaticPolygonDescComponent } from './components/static-dynamic/ac-static-polygon-desc/ac-static-polygon-desc.component';
import { AcStaticCircleDescComponent } from './components/static-dynamic/ac-static-circle-desc/ac-static-circle-desc.component';
import { AcDynamicCircleDescComponent } from './components/static-dynamic/ac-dynamic-circle-desc/ac-dynamic-circle-desc.component';
import { AcStaticPolylineDescComponent } from './components/static-dynamic/ac-static-polyline-desc/ac-static-polyline-desc.component';
import { AcModelDescComponent } from './components/ac-model-desc/ac-model-desc.component';
import { AcTileset3dComponent } from './components/ac-3d-tileset/ac-tileset-3d.component';
import { AcBoxDescComponent } from './components/ac-box-desc/ac-box-desc.component';
import { AcCylinderDescComponent } from './components/ac-cylinder-desc/ac-cylinder-desc.component';
import { AcCorridorDescComponent } from './components/ac-corridor-desc/ac-corridor-desc.component';
import { AcEllipsoidDescComponent } from './components/ac-ellipsoid-desc/ac-ellipsoid-desc.component';
import { AcPolylineVolumeDescComponent } from './components/ac-polyline-volume-desc/ac-polyline-volume-desc.component';
import { AcWallDescComponent } from './components/ac-wall-desc/ac-wall-desc.component';
import { AcRectangleDescComponent } from './components/ac-rectangle-desc/ac-rectangle-desc.component';
import { AcBillboardPrimitiveDescComponent } from './components/ac-billboard-primitive-desc/ac-billboard-primitive-desc.component';
import { AcLabelPrimitiveDescComponent } from './components/ac-label-primitive-desc/ac-label-primitive-desc.component';
import { AcPolylinePrimitiveDescComponent } from './components/ac-polyline-primitive-desc/ac-polyline-primitive-desc.component';
import { ANGULAR_CESIUM_CONFIG, ConfigurationService } from './cesium-enhancements/ConfigurationService';
import { CesiumExtender } from '../cesium-extender/extender';
import { AcHtmlDescComponent } from './components/ac-html-desc/ac-html-desc.component';
import { AcHtmlDirective } from './directives/ac-html/ac-html.directive';
import { AcHtmlContainerDirective } from './directives/ac-html-container/ac-html-container.directive';
import { AcContextMenuWrapperComponent } from './components/ac-context-menu-wrapper/ac-context-menu-wrapper.component';
import { AcArrayDescComponent } from './components/ac-array-desc/ac-array-desc.component';
import { AcPointPrimitiveDescComponent } from './components/ac-point-primitive-desc/ac-point-primitive-desc.component';
import { AcPrimitivePolylineComponent } from './components/ac-primitive-polyline/ac-primitive-polyline.component';
import PARSE_PIPES_CONFIG_MAP from './pipes/pipe-config-map';
import { AcCzmlDescComponent } from './components/ac-czml-desc/ac-czml-desc.component';
import { AcRectangleComponent } from './components/ac-rectangle/ac-rectangle.component';
import * as i0 from "@angular/core";
export class AngularCesiumModule {
    constructor() {
        CesiumExtender.extend();
    }
    static forRoot(config) {
        return {
            ngModule: AngularCesiumModule,
            providers: [
                JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService,
                { provide: ANGULAR_CESIUM_CONFIG, useValue: config },
                { provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || [] },
                { provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP },
            ],
        };
    }
}
AngularCesiumModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
AngularCesiumModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, declarations: [AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcBillboardPrimitiveDescComponent,
        AcLabelDescComponent,
        AcLabelPrimitiveDescComponent,
        AcEllipseDescComponent,
        AcPolylineDescComponent,
        AcPolylinePrimitiveDescComponent,
        PixelOffsetPipe,
        RadiansToDegreesPipe,
        AcCircleDescComponent,
        AcArcDescComponent,
        AcMapLayerProviderComponent,
        AcMapTerrainProviderComponent,
        AcPointDescComponent,
        AcLabelComponent,
        AcPolylineComponent,
        AcPrimitivePolylineComponent,
        AcEllipseComponent,
        AcPointComponent,
        AcBillboardComponent,
        AcHtmlComponent,
        AcCircleComponent,
        AcArcComponent,
        AcPolygonDescComponent,
        AcPolygonComponent,
        AcDefaultPlonterComponent,
        AcModelDescComponent,
        AcTileset3dComponent,
        AcBoxDescComponent,
        AcCylinderDescComponent,
        AcCorridorDescComponent,
        AcEllipsoidDescComponent,
        AcPolylineVolumeDescComponent,
        AcWallDescComponent,
        AcRectangleDescComponent,
        AcContextMenuWrapperComponent,
        AcPointPrimitiveDescComponent,
        AcHtmlDescComponent,
        AcHtmlDirective,
        AcHtmlContainerDirective,
        AcArrayDescComponent,
        AcCzmlDescComponent,
        AcStaticEllipseDescComponent,
        AcDynamicEllipseDescComponent,
        AcDynamicPolylineDescComponent,
        AcStaticPolylineDescComponent,
        AcDynamicCircleDescComponent,
        AcStaticCircleDescComponent,
        AcStaticPolygonDescComponent,
        AcRectangleComponent], imports: [CommonModule,
        Angular2ParseModule,
        UtilsModule], exports: [AcMapComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcBillboardPrimitiveDescComponent,
        AcLabelDescComponent,
        AcLabelPrimitiveDescComponent,
        AcEllipseDescComponent,
        AcPolylineDescComponent,
        AcPolylinePrimitiveDescComponent,
        AcLayerComponent,
        AcCircleDescComponent,
        AcArcDescComponent,
        AcMapLayerProviderComponent,
        AcMapTerrainProviderComponent,
        AcPointDescComponent,
        AcLabelComponent,
        AcPolylineComponent,
        AcPrimitivePolylineComponent,
        AcEllipseComponent,
        AcPointComponent,
        AcBillboardComponent,
        AcHtmlComponent,
        AcCircleComponent,
        AcArcComponent,
        AcPolygonDescComponent,
        AcPolygonComponent,
        AcDefaultPlonterComponent,
        AcModelDescComponent,
        AcTileset3dComponent,
        AcBoxDescComponent,
        AcCylinderDescComponent,
        AcCorridorDescComponent,
        AcEllipsoidDescComponent,
        AcPolylineVolumeDescComponent,
        AcWallDescComponent,
        AcRectangleDescComponent,
        AcPointPrimitiveDescComponent,
        AcHtmlDescComponent,
        AcArrayDescComponent,
        AcCzmlDescComponent,
        AcRectangleComponent,
        AcStaticEllipseDescComponent,
        AcDynamicEllipseDescComponent,
        AcDynamicPolylineDescComponent,
        AcStaticPolylineDescComponent,
        AcDynamicCircleDescComponent,
        AcStaticCircleDescComponent,
        AcStaticPolygonDescComponent] });
AngularCesiumModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, imports: [[
            CommonModule,
            Angular2ParseModule,
            UtilsModule,
        ]] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AngularCesiumModule, decorators: [{
            type: NgModule,
            args: [{
                    imports: [
                        CommonModule,
                        Angular2ParseModule,
                        UtilsModule,
                    ],
                    declarations: [
                        AcMapComponent,
                        AcLayerComponent,
                        AcBillboardComponent,
                        AcBillboardDescComponent,
                        AcBillboardPrimitiveDescComponent,
                        AcLabelDescComponent,
                        AcLabelPrimitiveDescComponent,
                        AcEllipseDescComponent,
                        AcPolylineDescComponent,
                        AcPolylinePrimitiveDescComponent,
                        PixelOffsetPipe,
                        RadiansToDegreesPipe,
                        AcCircleDescComponent,
                        AcArcDescComponent,
                        AcMapLayerProviderComponent,
                        AcMapTerrainProviderComponent,
                        AcPointDescComponent,
                        AcLabelComponent,
                        AcPolylineComponent,
                        AcPrimitivePolylineComponent,
                        AcEllipseComponent,
                        AcPointComponent,
                        AcBillboardComponent,
                        AcHtmlComponent,
                        AcCircleComponent,
                        AcArcComponent,
                        AcPolygonDescComponent,
                        AcPolygonComponent,
                        AcDefaultPlonterComponent,
                        AcModelDescComponent,
                        AcTileset3dComponent,
                        AcBoxDescComponent,
                        AcCylinderDescComponent,
                        AcCorridorDescComponent,
                        AcEllipsoidDescComponent,
                        AcPolylineVolumeDescComponent,
                        AcWallDescComponent,
                        AcRectangleDescComponent,
                        AcContextMenuWrapperComponent,
                        AcPointPrimitiveDescComponent,
                        AcHtmlDescComponent,
                        AcHtmlDirective,
                        AcHtmlContainerDirective,
                        AcArrayDescComponent,
                        AcCzmlDescComponent,
                        AcStaticEllipseDescComponent,
                        AcDynamicEllipseDescComponent,
                        AcDynamicPolylineDescComponent,
                        AcStaticPolylineDescComponent,
                        AcDynamicCircleDescComponent,
                        AcStaticCircleDescComponent,
                        AcStaticPolygonDescComponent,
                        AcRectangleComponent
                    ],
                    exports: [
                        AcMapComponent,
                        AcBillboardComponent,
                        AcBillboardDescComponent,
                        AcBillboardPrimitiveDescComponent,
                        AcLabelDescComponent,
                        AcLabelPrimitiveDescComponent,
                        AcEllipseDescComponent,
                        AcPolylineDescComponent,
                        AcPolylinePrimitiveDescComponent,
                        AcLayerComponent,
                        AcCircleDescComponent,
                        AcArcDescComponent,
                        AcMapLayerProviderComponent,
                        AcMapTerrainProviderComponent,
                        AcPointDescComponent,
                        AcLabelComponent,
                        AcPolylineComponent,
                        AcPrimitivePolylineComponent,
                        AcEllipseComponent,
                        AcPointComponent,
                        AcBillboardComponent,
                        AcHtmlComponent,
                        AcCircleComponent,
                        AcArcComponent,
                        AcPolygonDescComponent,
                        AcPolygonComponent,
                        AcDefaultPlonterComponent,
                        AcModelDescComponent,
                        AcTileset3dComponent,
                        AcBoxDescComponent,
                        AcCylinderDescComponent,
                        AcCorridorDescComponent,
                        AcEllipsoidDescComponent,
                        AcPolylineVolumeDescComponent,
                        AcWallDescComponent,
                        AcRectangleDescComponent,
                        AcPointPrimitiveDescComponent,
                        AcHtmlDescComponent,
                        AcArrayDescComponent,
                        AcCzmlDescComponent,
                        AcRectangleComponent,
                        AcStaticEllipseDescComponent,
                        AcDynamicEllipseDescComponent,
                        AcDynamicPolylineDescComponent,
                        AcStaticPolylineDescComponent,
                        AcDynamicCircleDescComponent,
                        AcStaticCircleDescComponent,
                        AcStaticPolygonDescComponent,
                    ],
                }]
        }], ctorParameters: function () { return []; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYW5ndWxhci1jZXNpdW0ubW9kdWxlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9hbmd1bGFyLWNlc2l1bS5tb2R1bGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUF1QixRQUFRLEVBQUUsTUFBTSxlQUFlLENBQUM7QUFDOUQsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGlCQUFpQixDQUFDO0FBQy9DLE9BQU8sRUFBRSxjQUFjLEVBQUUsTUFBTSxzQ0FBc0MsQ0FBQztBQUN0RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSwwQ0FBMEMsQ0FBQztBQUM1RSxPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxrREFBa0QsQ0FBQztBQUN4RixPQUFPLEVBQUUsd0JBQXdCLEVBQUUsTUFBTSw0REFBNEQsQ0FBQztBQUN0RyxPQUFPLEVBQUUsc0JBQXNCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUNoRyxPQUFPLEVBQUUsdUJBQXVCLEVBQUUsTUFBTSwwREFBMEQsQ0FBQztBQUNuRyxPQUFPLEVBQUUsbUJBQW1CLEVBQUUsWUFBWSxFQUFFLE1BQU0sd0JBQXdCLENBQUM7QUFDM0UsT0FBTyxFQUFFLGVBQWUsRUFBRSxNQUFNLHdDQUF3QyxDQUFDO0FBQ3pFLE9BQU8sRUFBRSxvQkFBb0IsRUFBRSxNQUFNLG9EQUFvRCxDQUFDO0FBQzFGLE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSw0Q0FBNEMsQ0FBQztBQUN4RSxPQUFPLEVBQUUsZ0JBQWdCLEVBQUUsTUFBTSx3REFBd0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsb0JBQW9CLEVBQUUsTUFBTSxvREFBb0QsQ0FBQztBQUMxRixPQUFPLEVBQUUsV0FBVyxFQUFFLE1BQU0sc0JBQXNCLENBQUM7QUFDbkQsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLGtEQUFrRCxDQUFDO0FBQ2pGLE9BQU8sRUFBRSxlQUFlLEVBQUUs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QkFBb0I7d0JBQ3BCLG1CQUFtQjt3QkFDbkIsb0JBQW9CO3dCQUNwQiw0QkFBNEI7d0JBQzVCLDZCQUE2Qjt3QkFDN0IsOEJBQThCO3dCQUM5Qiw2QkFBNkI7d0JBQzdCLDRCQUE0Qjt3QkFDNUIsMkJBQTJCO3dCQUMzQiw0QkFBNEI7cUJBQzdCO2lCQUNGIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgTW9kdWxlV2l0aFByb3ZpZGVycywgTmdNb2R1bGUgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQ29tbW9uTW9kdWxlIH0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcclxuaW1wb3J0IHsgQWNNYXBDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtbWFwL2FjLW1hcC5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWxheWVyL2FjLWxheWVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjQmlsbGJvYXJkQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJpbGxib2FyZC9hYy1iaWxsYm9hcmQuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNCaWxsYm9hcmREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJpbGxib3JhZC1kZXNjL2FjLWJpbGxib3JhZC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjRWxsaXBzZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtZWxsaXBzZS1kZXNjL2FjLWVsbGlwc2UtZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1BvbHlsaW5lRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2x5bGluZS1kZXNjL2FjLXBvbHlsaW5lLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQW5ndWxhcjJQYXJzZU1vZHVsZSwgUElQRVNfQ09ORklHIH0gZnJvbSAnQGF1c2NvcGUvYW5ndWxhcjJwYXJzZSc7XHJcbmltcG9ydCB7IFBpeGVsT2Zmc2V0UGlwZSB9IGZyb20gJy4vcGlwZXMvcGl4ZWwtb2Zmc2V0L3BpeGVsLW9mZnNldC5waXBlJztcclxuaW1wb3J0IHsgUmFkaWFuc1RvRGVncmVlc1BpcGUgfSBmcm9tICcuL3BpcGVzL3JhZGlhbnMtdG8tZGVncmVlcy9yYWRpYW5zLXRvLWRlZ3JlZXMucGlwZSc7XHJcbmltcG9ydCB7IEpzb25NYXBwZXIgfSBmcm9tICcuL3NlcnZpY2VzL2pzb24tbWFwcGVyL2pzb24tbWFwcGVyLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDZXNpdW1Qcm9wZXJ0aWVzIH0gZnJvbSAnLi9zZXJ2aWNlcy9jZXNpdW0tcHJvcGVydGllcy9jZXNpdW0tcHJvcGVydGllcy5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNMYWJlbERlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtbGFiZWwtZGVzYy9hYy1sYWJlbC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IFV0aWxzTW9kdWxlIH0gZnJvbSAnLi91dGlscy91dGlscy5tb2R1bGUnO1xyXG5pbXBvcnQgeyBWaWV3ZXJGYWN0b3J5IH0gZnJvbSAnLi9zZXJ2aWNlcy92aWV3ZXItZmFjdG9yeS92aWV3ZXItZmFjdG9yeS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgR2VvVXRpbHNTZXJ2aWNlIH0gZnJvbSAnLi9zZXJ2aWNlcy9nZW8tdXRpbHMvZ2VvLXV0aWxzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBBY0NpcmNsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtY2lyY2xlLWRlc2MvYWMtY2lyY2xlLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNBcmNEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWFyYy1kZXNjL2FjLWFyYy1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjTWFwTGF5ZXJQcm92aWRlckNvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1tYXAtbGF5ZXItcHJvdmlkZXIvYWMtbWFwLWxheWVyLXByb3ZpZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjTWFwVGVycmFpblByb3ZpZGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyL2FjLW1hcC10ZXJyYWluLXByb3ZpZGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjUG9pbnREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvaW50LWRlc2MvYWMtcG9pbnQtZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY0xhYmVsQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWxhYmVsL2FjLWxhYmVsLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjUG9seWxpbmVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcG9seWxpbmUvYWMtcG9seWxpbmUuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNFbGxpcHNlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWVsbGlwc2UvYWMtZWxsaXBzZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1BvaW50Q29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvaW50L2FjLXBvaW50LmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjSHRtbENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1odG1sL2FjLWh0bWwuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNDaXJjbGVDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtY2lyY2xlL2FjLWNpcmNsZS5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY0FyY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1hcmMvYWMtYXJjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjUG9seWdvbkRlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcG9seWdvbi1kZXNjL2FjLXBvbHlnb24tZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY0RlZmF1bHRQbG9udGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWRlZmF1bHQtcGxvbnRlci9hYy1kZWZhdWx0LXBsb250ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNQb2x5Z29uQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvbHlnb24vYWMtcG9seWdvbi5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBNYXBzTWFuYWdlclNlcnZpY2UgfSBmcm9tICcuL3NlcnZpY2VzL21hcHMtbWFuYWdlci9tYXBzLW1hbmFnZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEFjU3RhdGljRWxsaXBzZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLWVsbGlwc2UtZGVzYy9hYy1zdGF0aWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjRHluYW1pY0VsbGlwc2VEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjL2FjLWR5bmFtaWMtZWxsaXBzZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjRHluYW1pY1BvbHlsaW5lRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1keW5hbWljLXBvbHlsaW5lLWRlc2MvYWMtZHluYW1pYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjU3RhdGljUG9seWdvbkRlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtc3RhdGljLXBvbHlnb24tZGVzYy9hYy1zdGF0aWMtcG9seWdvbi1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjU3RhdGljQ2lyY2xlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9zdGF0aWMtZHluYW1pYy9hYy1zdGF0aWMtY2lyY2xlLWRlc2MvYWMtc3RhdGljLWNpcmNsZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjRHluYW1pY0NpcmNsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGljLWR5bmFtaWMvYWMtZHluYW1pYy1jaXJjbGUtZGVzYy9hYy1keW5hbWljLWNpcmNsZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjU3RhdGljUG9seWxpbmVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL3N0YXRpYy1keW5hbWljL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjL2FjLXN0YXRpYy1wb2x5bGluZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjTW9kZWxEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLW1vZGVsLWRlc2MvYWMtbW9kZWwtZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1RpbGVzZXQzZENvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy0zZC10aWxlc2V0L2FjLXRpbGVzZXQtM2QuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNCb3hEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJveC1kZXNjL2FjLWJveC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjQ3lsaW5kZXJEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWN5bGluZGVyLWRlc2MvYWMtY3lsaW5kZXItZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY0NvcnJpZG9yRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1jb3JyaWRvci1kZXNjL2FjLWNvcnJpZG9yLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNFbGxpcHNvaWREZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWVsbGlwc29pZC1kZXNjL2FjLWVsbGlwc29pZC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjUG9seWxpbmVWb2x1bWVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjL2FjLXBvbHlsaW5lLXZvbHVtZS1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjV2FsbERlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtd2FsbC1kZXNjL2FjLXdhbGwtZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1JlY3RhbmdsZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcmVjdGFuZ2xlLWRlc2MvYWMtcmVjdGFuZ2xlLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNCaWxsYm9hcmRQcmltaXRpdmVEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWJpbGxib2FyZC1wcmltaXRpdmUtZGVzYy9hYy1iaWxsYm9hcmQtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNMYWJlbFByaW1pdGl2ZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MvYWMtbGFiZWwtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgQWNQb2x5bGluZVByaW1pdGl2ZURlc2NDb21wb25lbnQgfSBmcm9tICcuL2NvbXBvbmVudHMvYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MvYWMtcG9seWxpbmUtcHJpbWl0aXZlLWRlc2MuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTW9kdWxlQ29uZmlndXJhdGlvbiB9IGZyb20gJy4vbW9kZWxzL21vZHVsZS1vcHRpb25zJztcclxuaW1wb3J0IHsgQU5HVUxBUl9DRVNJVU1fQ09ORklHLCBDb25maWd1cmF0aW9uU2VydmljZSB9IGZyb20gJy4vY2VzaXVtLWVuaGFuY2VtZW50cy9Db25maWd1cmF0aW9uU2VydmljZSc7XHJcbmltcG9ydCB7IENlc2l1bUV4dGVuZGVyIH0gZnJvbSAnLi4vY2VzaXVtLWV4dGVuZGVyL2V4dGVuZGVyJztcclxuaW1wb3J0IHsgQWNIdG1sRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1odG1sLWRlc2MvYWMtaHRtbC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjSHRtbERpcmVjdGl2ZSB9IGZyb20gJy4vZGlyZWN0aXZlcy9hYy1odG1sL2FjLWh0bWwuZGlyZWN0aXZlJztcclxuaW1wb3J0IHsgQWNIdG1sQ29udGFpbmVyRGlyZWN0aXZlIH0gZnJvbSAnLi9kaXJlY3RpdmVzL2FjLWh0bWwtY29udGFpbmVyL2FjLWh0bWwtY29udGFpbmVyLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEFjQ29udGV4dE1lbnVXcmFwcGVyQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWNvbnRleHQtbWVudS13cmFwcGVyL2FjLWNvbnRleHQtbWVudS13cmFwcGVyLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjQXJyYXlEZXNjQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLWFycmF5LWRlc2MvYWMtYXJyYXktZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1BvaW50UHJpbWl0aXZlRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1wb2ludC1wcmltaXRpdmUtZGVzYy9hYy1wb2ludC1wcmltaXRpdmUtZGVzYy5jb21wb25lbnQnO1xyXG5pbXBvcnQgeyBBY1ByaW1pdGl2ZVBvbHlsaW5lQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXByaW1pdGl2ZS1wb2x5bGluZS9hYy1wcmltaXRpdmUtcG9seWxpbmUuY29tcG9uZW50JztcclxuaW1wb3J0IFBBUlNFX1BJUEVTX0NPTkZJR19NQVAgZnJvbSAnLi9waXBlcy9waXBlLWNvbmZpZy1tYXAnO1xyXG5cclxuaW1wb3J0IHsgQWNDem1sRGVzY0NvbXBvbmVudCB9IGZyb20gJy4vY29tcG9uZW50cy9hYy1jem1sLWRlc2MvYWMtY3ptbC1kZXNjLmNvbXBvbmVudCc7XHJcbmltcG9ydCB7IEFjUmVjdGFuZ2xlQ29tcG9uZW50IH0gZnJvbSAnLi9jb21wb25lbnRzL2FjLXJlY3RhbmdsZS9hYy1yZWN0YW5nbGUuY29tcG9uZW50JztcclxuXHJcbkBOZ01vZHVsZSh7XHJcbiAgaW1wb3J0czogW1xyXG4gICAgQ29tbW9uTW9kdWxlLFxyXG4gICAgQW5ndWxhcjJQYXJzZU1vZHVsZSxcclxuICAgIFV0aWxzTW9kdWxlLFxyXG4gIF0sXHJcbiAgZGVjbGFyYXRpb25zOiBbXHJcbiAgICBBY01hcENvbXBvbmVudCxcclxuICAgIEFjTGF5ZXJDb21wb25lbnQsXHJcbiAgICBBY0JpbGxib2FyZENvbXBvbmVudCxcclxuICAgIEFjQmlsbGJvYXJkRGVzY0NvbXBvbmVudCxcclxuICAgIEFjQmlsbGJvYXJkUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjTGFiZWxEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNMYWJlbFByaW1pdGl2ZURlc2NDb21wb25lbnQsXHJcbiAgICBBY0VsbGlwc2VEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNQb2x5bGluZURlc2NDb21wb25lbnQsXHJcbiAgICBBY1BvbHlsaW5lUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcclxuICAgIFBpeGVsT2Zmc2V0UGlwZSxcclxuICAgIFJhZGlhbnNUb0RlZ3JlZXNQaXBlLFxyXG4gICAgQWNDaXJjbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNBcmNEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNNYXBMYXllclByb3ZpZGVyQ29tcG9uZW50LFxyXG4gICAgQWNNYXBUZXJyYWluUHJvdmlkZXJDb21wb25lbnQsXHJcbiAgICBBY1BvaW50RGVzY0NvbXBvbmVudCxcclxuICAgIEFjTGFiZWxDb21wb25lbnQsXHJcbiAgICBBY1BvbHlsaW5lQ29tcG9uZW50LFxyXG4gICAgQWNQcmltaXRpdmVQb2x5bGluZUNvbXBvbmVudCxcclxuICAgIEFjRWxsaXBzZUNvbXBvbmVudCxcclxuICAgIEFjUG9pbnRDb21wb25lbnQsXHJcbiAgICBBY0JpbGxib2FyZENvbXBvbmVudCxcclxuICAgIEFjSHRtbENvbXBvbmVudCxcclxuICAgIEFjQ2lyY2xlQ29tcG9uZW50LFxyXG4gICAgQWNBcmNDb21wb25lbnQsXHJcbiAgICBBY1BvbHlnb25EZXNjQ29tcG9uZW50LFxyXG4gICAgQWNQb2x5Z29uQ29tcG9uZW50LFxyXG4gICAgQWNEZWZhdWx0UGxvbnRlckNvbXBvbmVudCxcclxuICAgIEFjTW9kZWxEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNUaWxlc2V0M2RDb21wb25lbnQsXHJcbiAgICBBY0JveERlc2NDb21wb25lbnQsXHJcbiAgICBBY0N5bGluZGVyRGVzY0NvbXBvbmVudCxcclxuICAgIEFjQ29ycmlkb3JEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNFbGxpcHNvaWREZXNjQ29tcG9uZW50LFxyXG4gICAgQWNQb2x5bGluZVZvbHVtZURlc2NDb21wb25lbnQsXHJcbiAgICBBY1dhbGxEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNSZWN0YW5nbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNDb250ZXh0TWVudVdyYXBwZXJDb21wb25lbnQsXHJcbiAgICBBY1BvaW50UHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjSHRtbERlc2NDb21wb25lbnQsXHJcbiAgICBBY0h0bWxEaXJlY3RpdmUsXHJcbiAgICBBY0h0bWxDb250YWluZXJEaXJlY3RpdmUsXHJcbiAgICBBY0FycmF5RGVzY0NvbXBvbmVudCxcclxuICAgIEFjQ3ptbERlc2NDb21wb25lbnQsXHJcblxyXG4gICAgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjRHluYW1pY0VsbGlwc2VEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNEeW5hbWljUG9seWxpbmVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNQb2x5bGluZURlc2NDb21wb25lbnQsXHJcbiAgICBBY0R5bmFtaWNDaXJjbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNDaXJjbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUmVjdGFuZ2xlQ29tcG9uZW50XHJcbiAgXSxcclxuICBleHBvcnRzOiBbXHJcbiAgICBBY01hcENvbXBvbmVudCxcclxuICAgIEFjQmlsbGJvYXJkQ29tcG9uZW50LFxyXG4gICAgQWNCaWxsYm9hcmREZXNjQ29tcG9uZW50LFxyXG4gICAgQWNCaWxsYm9hcmRQcmltaXRpdmVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNMYWJlbERlc2NDb21wb25lbnQsXHJcbiAgICBBY0xhYmVsUHJpbWl0aXZlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjRWxsaXBzZURlc2NDb21wb25lbnQsXHJcbiAgICBBY1BvbHlsaW5lRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUG9seWxpbmVQcmltaXRpdmVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNMYXllckNvbXBvbmVudCxcclxuICAgIEFjQ2lyY2xlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjQXJjRGVzY0NvbXBvbmVudCxcclxuICAgIEFjTWFwTGF5ZXJQcm92aWRlckNvbXBvbmVudCxcclxuICAgIEFjTWFwVGVycmFpblByb3ZpZGVyQ29tcG9uZW50LFxyXG4gICAgQWNQb2ludERlc2NDb21wb25lbnQsXHJcbiAgICBBY0xhYmVsQ29tcG9uZW50LFxyXG4gICAgQWNQb2x5bGluZUNvbXBvbmVudCxcclxuICAgIEFjUHJpbWl0aXZlUG9seWxpbmVDb21wb25lbnQsXHJcbiAgICBBY0VsbGlwc2VDb21wb25lbnQsXHJcbiAgICBBY1BvaW50Q29tcG9uZW50LFxyXG4gICAgQWNCaWxsYm9hcmRDb21wb25lbnQsXHJcbiAgICBBY0h0bWxDb21wb25lbnQsXHJcbiAgICBBY0NpcmNsZUNvbXBvbmVudCxcclxuICAgIEFjQXJjQ29tcG9uZW50LFxyXG4gICAgQWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUG9seWdvbkNvbXBvbmVudCxcclxuICAgIEFjRGVmYXVsdFBsb250ZXJDb21wb25lbnQsXHJcbiAgICBBY01vZGVsRGVzY0NvbXBvbmVudCxcclxuICAgIEFjVGlsZXNldDNkQ29tcG9uZW50LFxyXG4gICAgQWNCb3hEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNDeWxpbmRlckRlc2NDb21wb25lbnQsXHJcbiAgICBBY0NvcnJpZG9yRGVzY0NvbXBvbmVudCxcclxuICAgIEFjRWxsaXBzb2lkRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUG9seWxpbmVWb2x1bWVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNXYWxsRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUmVjdGFuZ2xlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUG9pbnRQcmltaXRpdmVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNIdG1sRGVzY0NvbXBvbmVudCxcclxuICAgIEFjQXJyYXlEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNDem1sRGVzY0NvbXBvbmVudCxcclxuICAgIEFjUmVjdGFuZ2xlQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNFbGxpcHNlRGVzY0NvbXBvbmVudCxcclxuICAgIEFjRHluYW1pY0VsbGlwc2VEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNEeW5hbWljUG9seWxpbmVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNQb2x5bGluZURlc2NDb21wb25lbnQsXHJcbiAgICBBY0R5bmFtaWNDaXJjbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNDaXJjbGVEZXNjQ29tcG9uZW50LFxyXG4gICAgQWNTdGF0aWNQb2x5Z29uRGVzY0NvbXBvbmVudCxcclxuICBdLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQW5ndWxhckNlc2l1bU1vZHVsZSB7XHJcbiAgc3RhdGljIGZvclJvb3QoY29uZmlnPzogTW9kdWxlQ29uZmlndXJhdGlvbik6IE1vZHVsZVdpdGhQcm92aWRlcnM8QW5ndWxhckNlc2l1bU1vZHVsZT4ge1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgbmdNb2R1bGU6IEFuZ3VsYXJDZXNpdW1Nb2R1bGUsXHJcbiAgICAgIHByb3ZpZGVyczogW1xyXG4gICAgICAgIEpzb25NYXBwZXIsIENlc2l1bVByb3BlcnRpZXMsIEdlb1V0aWxzU2VydmljZSwgVmlld2VyRmFjdG9yeSwgTWFwc01hbmFnZXJTZXJ2aWNlLCBDb25maWd1cmF0aW9uU2VydmljZSxcclxuICAgICAgICB7cHJvdmlkZTogQU5HVUxBUl9DRVNJVU1fQ09ORklHLCB1c2VWYWx1ZTogY29uZmlnfSxcclxuICAgICAgICB7cHJvdmlkZTogUElQRVNfQ09ORklHLCBtdWx0aTogdHJ1ZSwgdXNlVmFsdWU6IGNvbmZpZyAmJiBjb25maWcuY3VzdG9tUGlwZXMgfHwgW119LFxyXG4gICAgICAgIHtwcm92aWRlOiBQSVBFU19DT05GSUcsIG11bHRpOiB0cnVlLCB1c2VWYWx1ZTogUEFSU0VfUElQRVNfQ09ORklHX01BUH0sXHJcbiAgICAgIF0sXHJcbiAgICB9O1xyXG4gIH1cclxuXHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICBDZXNpdW1FeHRlbmRlci5leHRlbmQoKTtcclxuICB9XHJcbn1cclxuIl19