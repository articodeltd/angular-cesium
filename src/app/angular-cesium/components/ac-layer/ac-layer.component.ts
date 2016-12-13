import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";
import {BillboardDrawerService} from "../../services/billboard-drawer/billboard-drawer.service";
import {LayerService} from "../../services/layer-service/layer-service.service";

@Component({
  selector: 'ac-layer',
  templateUrl: './ac-layer.component.html',
  styleUrls: ['./ac-layer.component.css'],
  providers: [BillboardDrawerService, LayerService],
  changeDetection: ChangeDetectionStrategy.OnPush 
    
})
export class AcLayerComponent implements OnInit {

  constructor(private changeDetector : ChangeDetectorRef , private layerService: LayerService) { }

  @Input()
  observable : Observable<any>;

  @Input()
  entity: string;

  ngOnInit() {
    this.observable.subscribe((notification) => {
      this[this.entity] = notification.entity;
      this.changeDetector.detectChanges();
      this.layerService.setCurrentNotification(notification);
    });
  }
}
