import { LayerService } from './../../services/layer-service/layer-service.service';
import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";

@Component({
    selector: 'ac-billboard-desc',
    templateUrl: './ac-billborad-desc.component.html',
    styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnChanges {

    @Input()
    props:any;

    constructor(
        private layerService :LayerService,
        private billboardDrawer:BillboardDrawerService
    ) {}

    ngOnChanges(changes:SimpleChanges):void {
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            const notification = this.layerService.getCurrentNotification();
            if (notification.action === 'ADD_OR_UPDATE') {
                this.billboardDrawer.addOrUpdate(notification.id, props.currentValue);
            }
        }
    }
}
