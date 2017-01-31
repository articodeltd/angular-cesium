import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AngularCesiumComponent } from './angular-cesium.component';
import { AcMapComponent } from './components/ac-map/ac-map.component';
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import { AcBillboardDescComponent } from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcEllipseStaticDescComponent } from './components/ac-ellipse-static/ac-ellipse-static-desc.component';
import { AcDynamicEllipseDescComponent } from './components/ac-dynamic-ellipse-desc/ac-dynamic-ellipse-desc.component';
import { AcDynamicPolylineDescComponent } from './components/ac-dynamic-polyline-desc/ac-dynamic-polyline-desc.component';
import { AcStaticCircleDescComponent } from "./components/ac-static-circle-desc/ac-static-circle-desc.component";
import { AcLayer2Directive } from './directives/ac-layer-2.directive';
import { Angular2ParseModule } from '../angular2-parse/src/angular2-parse.module';
import { PixelOffsetPipe } from './pipes/pixel-offset/pixel-offset.pipe';
import { JsonMapper } from './services/json-mapper/json-mapper.service';
import { CesiumProperties } from './services/cesium-properties/cesium-properties.service';
import { AcLabelDescComponent } from './components/ac-label-desc/ac-label-desc.component';
import { UtilsModule } from '../utils/utils.module';
import { AcStaticPolylineDescComponent } from "./components/ac-static-polyline-desc/ac-static-polyline-desc.component";
import {GeoUtilsService} from "./services/geo-utils/geo-utils.service";

@NgModule({
	imports: [
		CommonModule,
		Angular2ParseModule,
		UtilsModule
	],
	declarations: [
		AngularCesiumComponent,
		AcMapComponent,
		AcLayerComponent,
		AcBillboardComponent,
		AcBillboardDescComponent,
		AcLabelDescComponent,
		AcEllipseStaticDescComponent,
		AcDynamicEllipseDescComponent,
		AcDynamicPolylineDescComponent,
		AcLayer2Directive,
		PixelOffsetPipe,
		AcStaticCircleDescComponent,
		AcStaticPolylineDescComponent
	],
	exports: [
		AcMapComponent,
		AcBillboardComponent,
		AcBillboardDescComponent,
		AcLabelDescComponent,
		AcEllipseStaticDescComponent,
		AcDynamicEllipseDescComponent,
		AcDynamicPolylineDescComponent,
		AcLayerComponent,
		AcLayer2Directive,
		AcStaticCircleDescComponent,
		AcStaticPolylineDescComponent
	],
	providers: [JsonMapper, CesiumProperties, GeoUtilsService],
})
export class AngularCesiumModule {
}
