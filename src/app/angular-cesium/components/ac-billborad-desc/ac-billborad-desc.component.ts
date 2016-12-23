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

    private primitiveMap = new Map();

    private propsMap: Map<string, CesiumProperty>;

    constructor(private billboardDrawer: BillboardDrawerService,
                private layerService: LayerService,
                private _computationCache: ComputationCache,
                private _cesiumProperties: CesiumProperties,
    ) {}

    _propsEvaluator(context) {
        return this._cesiumProperties.createCesiumProps(this.propsMap, this._computationCache, context);
    }

    ngOnInit(): void {
        this.layerService.registerDescription(this);
        this.propsMap = this._cesiumProperties.createPropsMap(this.props);
    }

    draw(context, id): any {
        const cesiumProps = this._propsEvaluator(context);

        if (!this.primitiveMap.has(id)) {
            const primitive = this.billboardDrawer.add(cesiumProps);
            this.primitiveMap.set(id, primitive);
        } else {
            const primitive = this.primitiveMap.get(id);
            this.billboardDrawer.update(primitive, cesiumProps);
        }
    }

    remove(id){
        const primitive = this.primitiveMap.get(id);
        this.billboardDrawer.remove(primitive);
    }
}
