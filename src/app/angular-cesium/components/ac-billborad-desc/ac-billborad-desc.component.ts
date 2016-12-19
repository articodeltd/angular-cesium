import { LayerService } from './../../services/layer-service/layer-service.service';
import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {A2Parse} from "../../services/a2-parse/a2-parse.service";

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
                private parser: A2Parse
    ) {}

    draw(context, id): any{
        let cesiumObject = this.propsEvaluator(context);
        return this.billboardDrawer.addOrUpdate(id, cesiumObject);
    }

    ngOnInit(): void {
        this.layerService.registerDescription(this);
        this.propsEvaluator  = this.parser.$parse(this.props);
    }
}
