import {LayerService} from "../../services/layer-service/layer-service.service";
import {Component, OnInit, Input} from "@angular/core";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {ComputationCache} from "../../services/computation-cache/computation-cache.service";
import {CesiumProperty, CesiumProperties} from "../../services/cesium-properties/cesium-properties.service";

@Component({
    selector: 'ac-billboard-desc',
    templateUrl: './ac-billborad-desc.component.html',
    styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnInit {
    @Input()
    props: any;

    private _primitiveMap = new Map();

    private _propsMap: Map<string, CesiumProperty>;

    constructor(private _billboardDrawer: BillboardDrawerService,
                private _layerService: LayerService,
                private _computationCache: ComputationCache,
                private _cesiumProperties: CesiumProperties,
    ) {}

    _propsEvaluator(context) {
        return this._cesiumProperties.createCesiumProps(this._propsMap, this._computationCache, context);
    }

    ngOnInit(): void {
        this._layerService.registerDescription(this);
        this._propsMap = this._cesiumProperties.createPropsMap(this.props);
    }

    draw(context, id): any {
        const cesiumProps = this._propsEvaluator(context);

        if (!this._primitiveMap.has(id)) {
            const primitive = this._billboardDrawer.add(cesiumProps);
            this._primitiveMap.set(id, primitive);
        } else {
            const primitive = this._primitiveMap.get(id);
            this._billboardDrawer.update(primitive, cesiumProps);
        }
    }

    remove(id){
        const primitive = this._primitiveMap.get(id);
        this._billboardDrawer.remove(primitive);
    }
}
