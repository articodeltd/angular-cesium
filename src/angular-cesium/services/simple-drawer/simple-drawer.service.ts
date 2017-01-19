import {CesiumService} from "../cesium/cesium.service";

export abstract class SimpleDrawerService {
    protected cesiumCollection: any;
    private _propsAssigner: Function;
    private _showAll;

    constructor(drawerType: any, cesiumService: CesiumService) {
        this.cesiumCollection = new drawerType();
        cesiumService.getScene().primitives.add(this.cesiumCollection);
    }

    setPropsAssigner(assigner: Function) {
        this._propsAssigner = assigner;
    }

    add(cesiumProps: any): any {
        //Todo: Take care of show = false
        cesiumProps.show = this._showAll;
        return this.cesiumCollection.add(cesiumProps);
    }

    update(primitive: any, cesiumProps: Object): any {
        if (this._propsAssigner) {
            this._propsAssigner(primitive, cesiumProps);
        }
        else {
            Object.assign(primitive, cesiumProps);
        }

        return primitive;
    }

    remove(primitive: any) {
        this.cesiumCollection.remove(primitive);
    }

    removeAll() {
        this.cesiumCollection.removeAll();
    }

    setShow(showValue: boolean) {
        this._showAll = showValue;
        for (let i = 0; i < this.cesiumCollection.length; i++) {
            const primitive = this.cesiumCollection.get(i);
            primitive.show = showValue;
        }
    }
}
