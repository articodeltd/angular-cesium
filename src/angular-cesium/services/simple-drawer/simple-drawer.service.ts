import {CesiumService} from "../cesium/cesium.service";

export abstract class SimpleDrawerService {
    private cesiumCollection: any;
    private _propsAssigner: Function;
    private _showAll;

    constructor(drawerType: any, cesiumService: CesiumService) {
        this.cesiumCollection = new drawerType();
        cesiumService.getScene().primitives.add(this.cesiumCollection);
    }

    setPropsAssigner(assigner: Function) {
        this._propsAssigner = assigner;
    }

    add(id:number, cesiumProps:any): any {
        //Todo: Take care of show = false
        cesiumProps.show = this._showAll;
        let primitive = this.cesiumCollection.add(cesiumProps);
        primitive.id = id;

        return primitive;
    }

    update(id: number, cesiumProps: Object) {
        let primitive = this.getPrimitiveById(id);

        if (this._propsAssigner) {
            this._propsAssigner(primitive, cesiumProps);
        }
        else {
            Object.assign(primitive, cesiumProps);
        }
    }

    remove(primitive: any) {
        this.cesiumCollection.remove(primitive);
    }

    removeAll(){
        this.cesiumCollection.removeAll();
    }

    setShow(showValue : boolean){
        this._showAll = showValue;
        for (let i = 0; i < this.cesiumCollection.length; i++){
            const primitive = this.cesiumCollection.get(i);
            primitive.show = showValue;
        }
    }

    contains(id:number){
        let primitive = this.getPrimitiveById(id);

        return primitive !== undefined && primitive !== null;
    }

    private getPrimitiveById(id:number){
        let primitive = null;
        let index = this.cesiumCollection.length;

        while (primitive === null && index-- > 0){
            let currPrimitive = this.cesiumCollection.get(index);

            if (currPrimitive.id === id){
                primitive = currPrimitive;
            }
        }

        return primitive;
    }
}
