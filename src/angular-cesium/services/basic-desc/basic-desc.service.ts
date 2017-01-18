import {OnInit, Input} from "@angular/core";
import {LayerService} from "../layer-service/layer-service.service";
import {SimpleDrawerService} from "../simple-drawer/simple-drawer.service";
import {ComputationCache} from "../computation-cache/computation-cache.service";
import {CesiumProperties} from "../cesium-properties/cesium-properties.service";

export class BasicDesc implements OnInit {
    @Input()
    props: any;

    private static idSequence :number = 0;

    private _propsEvaluateFn: Function;
    private id :string;

    constructor(private _drawer: SimpleDrawerService,
                private _layerService: LayerService,
                private _computationCache: ComputationCache,
                private _cesiumProperties: CesiumProperties,
    ) {
        this.id = this.generateId();
    }

    _propsEvaluator(context: Object): any {
        return this._propsEvaluateFn(this._computationCache, context);
    }

    ngOnInit(): void {
        this._layerService.registerDescription(this);
        this._propsEvaluateFn = this._cesiumProperties.createEvaluator(this.props);
        this._drawer.setPropsAssigner(this._cesiumProperties.createAssigner(this.props));
    }

    draw(context, id): any {
        id = `${this.id}.${id}`;

        const cesiumProps = this._propsEvaluator(context);
        if (!this._drawer.contains(id)) {
            this._drawer.add(id, cesiumProps);
        } else {
            this._drawer.update(id, cesiumProps);
        }
    }

    remove(id){
        id = `${this.id}.${id}`;

        this._drawer.remove(id);
    }

    removeAll(){
        this._drawer.removeAll();
    }

    protected generateId() : string{
        return `${this.constructor.name}.${BasicDesc.idSequence++}`;
    }
}
