import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AcMapComponent } from './components/ac-map/ac-map.component';
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import { AcBillboardDescComponent } from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcStaticEllipseDescComponent } from './components/ac-static-ellipse/ac-static-ellipse-desc.component';
import { AcDynamicEllipseDescComponent } from './components/ac-dynamic-ellipse-desc/ac-dynamic-ellipse-desc.component';
import { AcDynamicPolylineDescComponent } from './components/ac-dynamic-polyline-desc/ac-dynamic-polyline-desc.component';
import { AcStaticCircleDescComponent } from './components/ac-static-circle-desc/ac-static-circle-desc.component';
import { AcStaticPolygonDescComponent } from './components/ac-static-polygon-desc/ac-static-polygon-desc.component';
import { Angular2ParseModule } from 'angular2parse';
import { PixelOffsetPipe } from './pipes/pixel-offset/pixel-offset.pipe';
import { JsonMapper } from './services/json-mapper/json-mapper.service';
import { CesiumProperties } from './services/cesium-properties/cesium-properties.service';
import { AcLabelDescComponent } from './components/ac-label-desc/ac-label-desc.component';
import { UtilsModule } from './utils/utils.module';
import { AcStaticPolylineDescComponent } from './components/ac-static-polyline-desc/ac-static-polyline-desc.component';
import { ViewerFactory } from './services/viewer-factory/viewer-factory.service';
import { GeoUtilsService } from './services/geo-utils/geo-utils.service';
import { AcDynamicCircleDescComponent } from './components/ac-dynamic-circle-desc/ac-dynamic-circle-desc.component';
import { AcArcDescComponent } from './components/ac-arc-desc/ac-arc-desc.component';
import { AcMapLayerProviderComponent } from './components/ac-map-layer-provider/ac-map-layer-provider.component';
import { AcPointDescComponent } from './components/ac-point-desc/ac-point-desc.component';
import { AcLabelComponent } from './components/ac-label/ac-label.component';
import { AcPolylineComponent } from './components/ac-polyline/ac-polyline.component';
import { AcEllipseComponent } from './components/ac-ellipse/ac-ellipse.component';
import { AcPointComponent } from './components/ac-point/ac-point.component';
import { AcHtmlComponent } from './components/ac-html/ac-html.component';
import { AcCircleComponent } from './components/ac-circle/ac-circle.component';

@NgModule({
	imports: [
		CommonModule,
		Angular2ParseModule,
		UtilsModule
	],
	declarations: [
		AcMapComponent,
		AcLayerComponent,
		AcBillboardComponent,
		AcBillboardDescComponent,
		AcLabelDescComponent,
		AcStaticEllipseDescComponent,
		AcDynamicEllipseDescComponent,
		AcDynamicPolylineDescComponent,
		AcStaticPolygonDescComponent,
		PixelOffsetPipe,
		AcStaticCircleDescComponent,
		AcDynamicCircleDescComponent,
		AcStaticPolylineDescComponent,
		AcArcDescComponent,
		AcMapLayerProviderComponent,
		AcPointDescComponent,
		AcLabelComponent,
		AcPolylineComponent,
		AcEllipseComponent,
		AcPointComponent,
		AcBillboardComponent,
		AcHtmlComponent,
		AcCircleComponent
	],
	exports: [
		AcMapComponent,
		AcBillboardComponent,
		AcBillboardDescComponent,
		AcLabelDescComponent,
		AcStaticEllipseDescComponent,
		AcDynamicEllipseDescComponent,
		AcDynamicPolylineDescComponent,
		AcStaticPolygonDescComponent,
		AcLayerComponent,
		AcStaticCircleDescComponent,
		AcDynamicCircleDescComponent,
		AcStaticPolylineDescComponent,
		AcArcDescComponent,
		AcMapLayerProviderComponent,
		AcPointDescComponent,
		AcLabelComponent,
		AcPolylineComponent,
		AcEllipseComponent,
		AcPointComponent,
		AcBillboardComponent,
		AcHtmlComponent,
		AcCircleComponent
	],
	providers: [JsonMapper, CesiumProperties, GeoUtilsService, ViewerFactory],
})
export class AngularCesiumModule {
}
