import { ModuleWithProviders, NgModule } from '@angular/core';
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
import { ModuleConfiguration } from './models/module-options';
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

@NgModule({
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
})
export class AngularCesiumModule {
  static forRoot(config?: ModuleConfiguration): ModuleWithProviders<AngularCesiumModule> {
    return {
      ngModule: AngularCesiumModule,
      providers: [
        JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, MapsManagerService, ConfigurationService,
        {provide: ANGULAR_CESIUM_CONFIG, useValue: config},
        {provide: PIPES_CONFIG, multi: true, useValue: config && config.customPipes || []},
        {provide: PIPES_CONFIG, multi: true, useValue: PARSE_PIPES_CONFIG_MAP},
      ],
    };
  }

  constructor() {
    CesiumExtender.extend();
  }
}
