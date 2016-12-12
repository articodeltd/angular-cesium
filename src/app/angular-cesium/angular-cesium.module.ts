import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularCesiumComponent} from './angular-cesium.component';
import {AcMapComponent} from "./components/ac-map/ac-map.component";
import { AcLayerComponent } from './components/ac-layer/ac-layer.component';
import { AcBillboardComponent } from './components/ac-billboard/ac-billboard.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [AngularCesiumComponent,
        AcMapComponent,
        AcLayerComponent,
        AcBillboardComponent],
    exports: [AcMapComponent, AcBillboardComponent]
})
export class AngularCesiumModule {
}
