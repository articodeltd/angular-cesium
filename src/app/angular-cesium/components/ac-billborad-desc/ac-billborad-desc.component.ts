import {LayerService} from "../../services/layer-service/layer-service.service";
import {Component, OnInit, Input} from "@angular/core";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {Parse} from "../../../angular2-parse/src/services/parse/parse.service";
import {JsonMapper} from "../../services/json-mapper/json-mapper.service";

@Component({
    selector: 'ac-billboard-desc',
    templateUrl: './ac-billborad-desc.component.html',
    styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnInit {
    @Input()
    props: any;

    private primitiveMap = new Map();

    private propsEvaluator: Function;

    constructor(private billboardDrawer: BillboardDrawerService,
                private layerService: LayerService,
                private jsonMapper: JsonMapper,
                private parser: Parse
    ) {}

    ngOnInit(): void {
        this.layerService.registerDescription(this);
        this.propsEvaluator = this.parser.$evalParse(this.props);
    }

    draw(context, id): any {
        let cesiumProps = this.propsEvaluator(context);
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
