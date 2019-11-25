import { Component, ViewEncapsulation } from "@angular/core";
import { MapsManagerService } from "angular-cesium";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  multiMap = false;

  constructor() {}

  setMultiMaps() {
    this.multiMap = !this.multiMap;
  }
}
