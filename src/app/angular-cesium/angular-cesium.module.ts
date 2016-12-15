import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularCesiumComponent} from './angular-cesium.component';
import {AcMapComponent} from "./components/ac-map/ac-map.component";
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import {AcBillboardDescComponent} from './components/ac-billborad-desc/ac-billborad-desc.component';
import { AcLayer2Directive } from './directives/ac-layer-2.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [AngularCesiumComponent,
        AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent,
        AcBillboardDescComponent,
        AcLayer2Directive],
    exports: [AcMapComponent, AcBillboardComponent, AcBillboardDescComponent, AcLayerComponent, AcLayer2Directive]
})
export class AngularCesiumModule {
}
