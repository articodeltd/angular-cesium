
import {Injectable} from "@angular/core";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {CesiumService} from "../cesium/cesium.service";

@Injectable()
export class ArcDrawerService extends SimpleDrawerService{
    constructor(cesiumService: CesiumService){
        super(Cesium.PolylineCollection, cesiumService);
    }

    add(cesiumProps:any){
        this._cesiumCollection.add();
    }

    update(cesiumProps:any){
        this._cesiumCollection.add();
    }
}