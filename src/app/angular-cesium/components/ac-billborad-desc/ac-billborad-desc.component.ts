import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {LayerService} from "../../services/layer-service/layer-service.service";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";

@Component({
  selector: 'ac-billboard-desc',
  templateUrl: './ac-billborad-desc.component.html',
  styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnInit, OnChanges {
  @Input()
  props: any;



  constructor(private billboardDrawer : BillboardDrawerService) { }
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const props = changes['props'];
    if(props.currentValue !== props.previousValue){
      // const notification = this.layerService.getCurrentNotification();
      // if(notification.action === 'ADD_OR_UPDATE'){
        this.billboardDrawer.addOrUpdate(1, props.currentValue);
      // }
    }
  }


}
