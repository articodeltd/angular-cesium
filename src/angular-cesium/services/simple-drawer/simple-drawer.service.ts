import {CesiumService} from "../cesium/cesium.service";

export abstract class SimpleDrawerService {
    protected cesiumCollection: any;
    private primitivesMap : Map<string, any> = new Map();
    private _propsAssigner: Function;
    private _showAll;

    constructor(drawerType: any, cesiumService: CesiumService) {
        this.cesiumCollection = new drawerType();
        cesiumService.getScene().primitives.add(this.cesiumCollection);
    }

    setPropsAssigner(assigner: Function) {
        this._propsAssigner = assigner;
    }

    add(id:string, cesiumProps:any): any {
        //Todo: Take care of show = false
        cesiumProps.show = true;
        let primitive = this.cesiumCollection.add(cesiumProps);
        this.primitivesMap.set(id, primitive);

        return primitive;
    }

    update(id: string, cesiumProps: Object) {
        let primitive = this.getPrimitiveById(id);

        if (this._propsAssigner) {
            this._propsAssigner(primitive, cesiumProps);
        }
        else {
            Object.assign(primitive, cesiumProps);
        }
    }

    remove(id: string) {
        let primitive = this.primitivesMap.get(id);

        this.primitivesMap.delete(id);
        this.cesiumCollection.remove(primitive);
    }

    removeAll(){
        this.cesiumCollection.removeAll();
        this.primitivesMap.clear();
    }

    setShow(showValue : boolean){
        this._showAll = showValue;
        for (let i = 0; i < this.cesiumCollection.length; i++){
            const primitive = this.cesiumCollection.get(i);
            primitive.show = showValue;
        }
    }

    contains(id:string){
        return this.primitivesMap.has(id);
    }

    protected getPrimitiveById(id:string){
        return this.primitivesMap.get(id);
    }
}
