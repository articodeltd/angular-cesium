import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {LayerService} from "../../services/layer-service/layer-service.service";

@Component({
  selector: 'ac-layer',
  templateUrl: './ac-layer.component.html',
  styleUrls: ['./ac-layer.component.css'],
  providers: [ LayerService],    
})
export class AcLayerComponent  {

  constructor(private changeDetector : ChangeDetectorRef) {
    this.changeDetector.detach();
  }
}
