import {Injectable} from "@angular/core";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";

@Injectable()
export class PolylineDynamicDrawerService extends SimpleDrawerService{
  constructor(cesiumService: CesiumService) {
    super(Cesium.PolylineCollection, cesiumService);
  }
}
