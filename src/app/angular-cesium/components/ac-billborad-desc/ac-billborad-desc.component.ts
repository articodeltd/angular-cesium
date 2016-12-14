import { LayerService } from './../../services/layer-service/layer-service.service';
import {Component, OnInit, Input, OnChanges, SimpleChanges} from '@angular/core';
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";

@Component({
  selector: 'ac-billboard-desc',
  templateUrl: './ac-billborad-desc.component.html',
  styleUrls: ['./ac-billborad-desc.component.css']
})
export class AcBillboardDescComponent implements OnInit, OnChanges {
  @Input()
  props: any;

  counter : number = 0;



  constructor(private billboardDrawer : BillboardDrawerService, layer: LayerService) { }
  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges): void {
    const props = changes['props'];
    if(props.currentValue !== props.previousValue){
      // const notification = this.layerService.getCurrentNotification();
      // if(notification.action === 'ADD_OR_UPDATE'){
        this.billboardDrawer.addOrUpdate(++this.counter, props.currentValue);
      // }
    }
  }
}
