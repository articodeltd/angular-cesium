import { Component } from '@angular/core';
import {CesiumService} from "./cesium/cesium.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'app works!';

  constructor(cesiumService : CesiumService){
    let c = cesiumService;
  }
}
