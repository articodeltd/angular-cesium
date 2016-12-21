import { BillboardDrawerService } from './../../services/billboard-drawer/billboard-drawer.service';
import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {LayerService} from "../../services/layer-service/layer-service.service";

@Component({
  selector: 'ac-layer',
  templateUrl: './ac-layer.component.html',
  styleUrls: ['./ac-layer.component.css'],
  providers: [ LayerService,BillboardDrawerService],    
})
export class AcLayerComponent  {

  constructor(private changeDetector : ChangeDetectorRef,
              private billboardDrawerService : BillboardDrawerService) {
    this.changeDetector.detach();
  }

  removeAll(){
    this.billboardDrawerService.removeAll();
  }
}
