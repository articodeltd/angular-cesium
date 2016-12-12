import {CesiumService} from "../cesium/cesium.service";

export abstract class SimpleDrawerService {
    private cesiumCollection: any;
    private entitiesMap: Map<any, Object>;

    constructor(drawerType: any, cesiumService: CesiumService) {
        this.entitiesMap = new Map();
        this.cesiumCollection = new drawerType();
        cesiumService.getScene().primitives.add(this.cesiumCollection);
    }

    private _add(key:any, cesiumProps:Object) {
        //Todo: Take care of show = false

        let cesiumObject = this.cesiumCollection.add(cesiumProps);
        this.entitiesMap.set(key, cesiumObject);
    }

    private _update(key, cesiumProps: Object) {
        let cesiumObject = this.entitiesMap.get(key);
        Object.assign(cesiumObject, cesiumProps);
    }

    addOrUpdate(key: any, cesiumProps) {
        if (!this.entitiesMap.has(key)) {
            this._add(key, cesiumProps);
        }
        else {
            this._update(key, cesiumProps);
        }
    }

    remove(key) {
        let cesiumObject = this.entitiesMap.get(key);
        this.cesiumCollection.remove(cesiumObject);
        this.entitiesMap.delete(key);
    }

}
