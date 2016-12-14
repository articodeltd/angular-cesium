import { Observable } from 'rxjs';
import { LayerService } from './../services/layer-service/layer-service.service';
import { Directive, TemplateRef, ViewContainerRef, OnInit, ChangeDetectorRef, Input, OnChanges, SimpleChanges } from '@angular/core';

export class LayerContext {
  constructor(
    public entity: Object,
    public $implicit: any
  ) { }
}

@Directive({
  selector: '[acLayer2]',
  providers: []
})
export class AcLayer2Directive {

  private _observable: Observable<any>
  @Input()
  set acLayer2Of(observable: Observable<any>) {
    if (this._observable) {
      return;
    }
    
    this._observable = observable;
    const contex = new LayerContext(null, null);
    let view = null;

    observable.subscribe((data) => {
      if (!view) {
        view = this.viewContainerRef.createEmbeddedView(this.templateRef, contex);
      }
      contex.$implicit = data;
      contex.entity = data.entity;
      this.changeDetector.detectChanges();
      //this.layerService.change.detectChanges();
    });
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainerRef: ViewContainerRef,
    private changeDetector: ChangeDetectorRef,
    private layerService: LayerService
  ) { }
}
