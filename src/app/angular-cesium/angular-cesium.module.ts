import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularCesiumComponent} from './angular-cesium.component';
import {AcMapComponent} from "./components/ac-map/ac-map.component";
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import {AcBillboardDescComponent} from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcLayer2Directive } from './directives/ac-layer-2.directive';
import {Angular2ParseModule} from "../angular2-parse/src/angular2-parse.module";
import { PixelOffsetPipe } from './pipes/pixel-offset/pixel-offset.pipe';
import {JsonMapper} from "./services/json-mapper/json-mapper.service";
import {CesiumProperties} from "./services/cesium-properties/cesium-properties.service";

@NgModule({
    imports: [
        CommonModule,
        Angular2ParseModule
    ],
    declarations: [AngularCesiumComponent,
        AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcLayer2Directive,
        PixelOffsetPipe],
    providers: [JsonMapper, CesiumProperties],
    exports: [AcMapComponent, AcBillboardComponent, AcBillboardDescComponent, AcLayerComponent, AcLayer2Directive]
})
export class AngularCesiumModule {
}
