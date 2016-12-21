import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {AngularCesiumModule} from "./angular-cesium/angular-cesium.module";
import {Angular2ParseModule} from "./angular2-parse/src/angular2-parse.module";

@NgModule({
    declarations: [
        AppComponent,
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
