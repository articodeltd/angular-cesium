import {OnInit, Input} from "@angular/core";
import {LayerService} from "../layer-service/layer-service.service";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {ComputationCache} from "../computation-cache/computation-cache.service";
import {CesiumProperties} from "../cesium-properties/cesium-properties.service";

export class BasicDesc implements OnInit {
    @Input()
    props: any;

    private _propsEvaluateFn: Function;

    constructor(private _drawer: SimpleDrawerService,
                private _layerService: LayerService,
                private _computationCache: ComputationCache,
                private _cesiumProperties: CesiumProperties,
    ) {}

    _propsEvaluator(context: Object): any {
        return this._propsEvaluateFn(this._computationCache, context);
    }

    ngOnInit(): void {
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
        this._drawer.setPropsAssigner(this._cesiumProperties.createAssigner(this.props));
    }

    draw(context, id): any {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._drawer.contains(id)) {
            const primitive = this._drawer.add(id, cesiumProps);
        } else {
            this._drawer.update(id, cesiumProps);
        }
    }

    remove(id){
        this._drawer.remove(id);
    }

    removeAll(){
        this._drawer.removeAll();
    }
}
