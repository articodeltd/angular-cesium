import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { AcMapComponent } from './ac-map/ac-map.component';
import {CesiumService} from "./cesium/cesium.service";

@NgModule({
  declarations: [
    AppComponent,
    AcMapComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [CesiumService],
  bootstrap: [AppComponent]
})
export class AppModule { }
