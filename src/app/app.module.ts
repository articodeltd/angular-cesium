import {BrowserModule} from "@angular/platform-browser";
import {NgModule} from "@angular/core";
import {FormsModule} from "@angular/forms";
import {HttpModule} from "@angular/http";
import {AppComponent} from "./app.component";
import {AngularCesiumModule} from "../angular-cesium/angular-cesium.module";
import {PerformanceFormComponent} from "./performence-test/performance-form/performance-form.component";
import {TracksLayerComponent} from "./tracks-layer/tracks-layer.component";
import { AcLabelDescComponent } from '../angular-cesium/components/ac-label-desc/ac-label-desc.component';
import { PolyLayerComponent } from './static-polyline-layer/static-polyline-layer.component';
import { BaseLayerComponent } from './base-layer/base-layer.component';

@NgModule({
    declarations: [
        AppComponent,PerformanceFormComponent,TracksLayerComponent, BaseLayerComponent, PolyLayerComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        AngularCesiumModule

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
