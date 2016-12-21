import { BillboardDrawerService } from './../../services/billboard-drawer/billboard-drawer.service';
import {Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef} from '@angular/core';
import {Observable} from "rxjs";
import {LayerContextService} from "../../services/layer-context/layer-context.service";
import {AcBillboardDescComponent} from "../ac-billborad-desc/ac-billborad-desc.component";
import {LayerService} from "../../services/layer-service/layer-service.service";

@Component({
  selector: 'ac-layer',
  templateUrl: './ac-layer.component.html',
  styleUrls: ['./ac-layer.component.css'],
  providers: [ LayerService,BillboardDrawerService]    
})
export class AcLayerComponent implements OnInit, AfterContentInit{
  @Input()
  acFor: string;
  entityName: string;
  observable: Observable<any>;
  layerContext: any;

  constructor(private changeDetector : ChangeDetectorRef,
              private billboardDrawerService : BillboardDrawerService) {
    this.changeDetector.detach();
  constructor(private layerContextService: LayerContextService, private layerService: LayerService) {
    this.layerContext = layerContextService.getContext();
  }

  ngOnInit(): void {
    const acForArr = this.acFor.split(' ');
    this.observable = this.layerContext[acForArr[3]];
    this.entityName = acForArr[1];
  }

  ngAfterContentInit(): void {
    this.observable.subscribe((data) => {
      this.layerContext[this.entityName] = data.entity;
      this.layerService.getDescriptions().forEach((descriptionComponent) => {
        descriptionComponent.draw(this.layerContext, data.id);
      })
    })
  }

  removeAll(){
    this.billboardDrawerService.removeAll();
  }
}
