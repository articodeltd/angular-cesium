import { Component, ViewChild, ViewEncapsulation } from "@angular/core";
import { MainMapComponent } from "./map-section/main-map/main-map.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  multiMap = false; // Change to true to enable multiple maps

  constructor() {}

  setMultiMaps() {
    this.multiMap = !this.multiMap;
  }
}
