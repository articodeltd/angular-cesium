import {CesiumService} from "../cesium/cesium.service";

export abstract class SimpleDrawerService {
    private cesiumCollection: any;

    constructor(drawerType: any, cesiumService: CesiumService) {
        this.cesiumCollection = new drawerType();
        cesiumService.getScene().primitives.add(this.cesiumCollection);
    }

    add(cesiumProps:Object): any {
        //Todo: Take care of show = false

        return this.cesiumCollection.add(cesiumProps);
    }

    update(primitive: any, cesiumProps: Object) {
        Object.assign(primitive, cesiumProps);
    }

    remove(primitive: any) {
        this.cesiumCollection.remove(primitive);
    }

    removeAll(){
        this.cesiumCollection.removeAll();
    }

}
