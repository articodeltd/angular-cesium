import {LayerService} from "../../services/layer-service/layer-service.service";
import {Component, OnInit, Input} from "@angular/core";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {Parse} from "../../../angular2-parse/src/services/parse/parse.service";

@Component({
    selector: 'ac-billboard-desc',
    templateUrl: './ac-billborad-desc.component.html',
    styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnInit {
    @Input()
    props:any;

    private propsEvaluator: Function;

    constructor(private billboardDrawer:BillboardDrawerService,
                private layerService: LayerService,
                private parser: Parse
    ) {}

    draw(context, id): any{
        let cesiumObject = this.propsEvaluator(context);
        return this.billboardDrawer.addOrUpdate(id, cesiumObject);
    }

    ngOnInit(): void {
        this.layerService.registerDescription(this);
        this.propsEvaluator  = this.parser.$evalParse(this.props);
    }
}
