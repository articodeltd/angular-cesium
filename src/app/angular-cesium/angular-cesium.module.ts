import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularCesiumComponent} from './angular-cesium.component';
import {AcMapComponent} from "./components/ac-map/ac-map.component";
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';
import {AcBillboardDescComponent} from './components/ac-billborad-desc/ac-billborad-desc.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [AngularCesiumComponent,
        AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent,
        AcBillboardDescComponent],
    exports: [AcMapComponent, AcBillboardComponent, AcBillboardDescComponent, AcLayerComponent]
})
export class AngularCesiumModule {
}
