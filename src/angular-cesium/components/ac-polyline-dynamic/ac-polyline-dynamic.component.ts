import {Component, Input, OnChanges, SimpleChanges, OnInit} from "@angular/core";
import {PolylineDynamicDrawerService} from "../../services/polyline-dynamic-drawer/polyline-dynamic-drawer.service";

@Component({
    selector: 'ac-polyline-dynamic',
    templateUrl: './ac-polyline-dynamic.component.html',
    styleUrls: ['./ac-polyline-dynamic.component.css'],
    providers: [PolylineDynamicDrawerService]
})
export class AcPolylineDynamicComponent implements OnChanges, OnInit {

    @Input()
    props:any;

    private key:any = Symbol();

    constructor(private polylineDynamicDrawer:PolylineDynamicDrawerService) {
    }

    ngOnChanges(changes:SimpleChanges) {
        const props = changes['props'];
        if (props.currentValue !== props.previousValue) {
            if (props.currentValue['position'] !== props.currentValue['position']) {
                //change the position of the polyline
            }
            else {
                this.polylineDynamicDrawer.update(this.key, props.currentValue);
            }
        }
    }

    ngOnInit():void {
        const props = this.props;
        this.polylineDynamicDrawer.add(props);
    }
}
