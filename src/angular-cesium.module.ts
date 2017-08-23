import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcMapComponent } from './components/ac-map/ac-map.component';
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import { AcBillboardDescComponent } from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcEllipseDescComponent } from './components/ac-ellipse-desc/ac-ellipse-desc.component';
import { AcPolylineDescComponent } from './components/ac-polyline-desc/ac-polyline-desc.component';
import { Angular2ParseModule } from 'angular2parse';
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
import { ViewersManagerService } from './services/viewers-service/viewers-manager.service';
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
		AcLabelDescComponent,
		AcEllipseDescComponent,
		AcPolylineDescComponent,
		PixelOffsetPipe,
		RadiansToDegreesPipe,
		AcCircleDescComponent,
		AcArcDescComponent,
		AcMapLayerProviderComponent,
		AcPointDescComponent,
		AcLabelComponent,
		AcPolylineComponent,
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
    
    AcStaticEllipseDescComponent,
  	AcDynamicEllipseDescComponent,
  	AcDynamicPolylineDescComponent,
		AcStaticPolylineDescComponent,
		AcDynamicCircleDescComponent,
    AcStaticCircleDescComponent,
  	AcStaticPolygonDescComponent,
	],
	exports: [
		AcMapComponent,
		AcBillboardComponent,
		AcBillboardDescComponent,
		AcLabelDescComponent,
		AcEllipseDescComponent,
		AcPolylineDescComponent,
		AcLayerComponent,
		AcCircleDescComponent,
		AcArcDescComponent,
		AcMapLayerProviderComponent,
		AcPointDescComponent,
		AcLabelComponent,
		AcPolylineComponent,
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
		
		AcStaticEllipseDescComponent,
    AcDynamicEllipseDescComponent,
    AcDynamicPolylineDescComponent,
    AcStaticPolylineDescComponent,
    AcDynamicCircleDescComponent,
    AcStaticCircleDescComponent,
    AcStaticPolygonDescComponent,
	],
	providers: [JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory, ViewersManagerService],
})
export class AngularCesiumModule {
}
