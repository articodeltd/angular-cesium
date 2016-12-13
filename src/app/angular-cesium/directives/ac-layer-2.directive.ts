import { Observable } from 'rxjs';
import { LayerService } from './../services/layer-service/layer-service.service';
import {
  Directive, TemplateRef, ViewContainerRef, OnInit, ChangeDetectorRef, Input, OnChanges,
  SimpleChanges
} from '@angular/core';

export class LayerContext {
  constructor(private data: Object) {
  }

  setData(val) {
    this.data = val;
  }
}

@Directive({
  selector: '[acLayer2]',
  providers: [LayerService]
})
export class AcLayer2Directive implements OnInit {

  /*@Input()
  acLayer2Of : Observable<any>;
*/
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private changeDetector : ChangeDetectorRef ,
    private layerService: LayerService
  ) { }

  ngOnInit() {
    this.viewContainerRef.createEmbeddedView(
          this.templateRef,
          new LayerContext({
          getImage: () => "/assets/bear-tongue_1558824i.jpg",
          getPosition: () => Cesium.Cartesian3.fromDegrees(-25.59777, 80.03883)
        })
        );
  }
}
