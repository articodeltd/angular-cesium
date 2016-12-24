import {OnInit, Input} from "@angular/core";
import {LayerService} from "../layer-service/layer-service.service";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {ComputationCache} from "../computation-cache/computation-cache.service";
import {CesiumProperty, CesiumProperties} from "../cesium-properties/cesium-properties.service";

export class BasicDesc implements OnInit {
    @Input()
    props: any;

    private _primitiveMap = new Map();
    private _propsMap: Map<string, CesiumProperty>;
    private _propsArr: CesiumProperty[];
    private _propsGetter: Function;

    constructor(private _drawer: SimpleDrawerService,
                private _layerService: LayerService,
                private _computationCache: ComputationCache,
                private _cesiumProperties: CesiumProperties,
    ) {}

    _propsEvaluator(context) {
        //return this._cesiumProperties.createCesiumPropsFromMap(this._propsMap, this._computationCache, context);
        return this._cesiumProperties.createCesiumPropsFromArry(this._propsArr, this._computationCache, context);
        //return this._propsGetter(this._computationCache, context);
    }

    ngOnInit(): void {
        this._layerService.registerDescription(this);
        this._propsMap = this._cesiumProperties.createPropsMap(this.props);
        this._propsArr = this._cesiumProperties.createPropsArray(this.props);
        this._propsGetter = this._cesiumProperties.compileCesiumProps(this._propsMap);
    }

    draw(context, id): any {
        const cesiumProps = this._propsEvaluator(context);

        if (!this._primitiveMap.has(id)) {
            const primitive = this._drawer.add(cesiumProps);
            this._primitiveMap.set(id, primitive);
        } else {
            const primitive = this._primitiveMap.get(id);
            this._drawer.update(primitive, cesiumProps);
        }
    }

    remove(id){
        const primitive = this._primitiveMap.get(id);
        this._drawer.remove(primitive);
    }
}
