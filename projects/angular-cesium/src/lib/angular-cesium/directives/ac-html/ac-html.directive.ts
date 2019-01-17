import { ChangeDetectorRef, Directive, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';

export class AcHtmlContext {
  constructor(
    public id: any,
    public context: any
  ) {
  }
}

@Directive({
  selector: '[acHtml]',
})
export class AcHtmlDirective implements OnInit {

  private _views = new Map<any, { viewRef: any, context: any }>();

  constructor(
    private _templateRef: TemplateRef<AcHtmlContext>,
    private _viewContainerRef: ViewContainerRef,
    private _changeDetector: ChangeDetectorRef,
    private _layerService: LayerService,
    private _acHtmlManager: AcHtmlManager
  ) {
  }

  ngOnInit() {

  }

  private _handleView(id: any, primitive: any, entity: any) {
    if (!this._views.has(id) && primitive.show) {
      const context = new AcHtmlContext(id, {$implicit: entity});
      const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
      this._views.set(id, {viewRef, context});
      this._changeDetector.detectChanges();
    } else if (this._views.has(id) && !primitive.show) {
      this.remove(id, primitive);
    } else if (this._views.has(id) && primitive.show) {
      this._changeDetector.detectChanges();
    }
  }

  addOrUpdate(id: any, primitive: any) {
    const context = this._layerService.context;
    const entity = context[this._layerService.getEntityName()];

    if (this._views.has(id)) {
      this._views.get(id).context.context.$implicit = entity;
    }

    this._acHtmlManager.addOrUpdate(id, {entity, primitive});
    this._handleView(id, primitive, entity);
  }

  remove(id: any, primitive: any) {
    if (!this._views.has(id)) {
      return;
    }

    const {viewRef} = this._views.get(id);
    this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
    this._views.delete(id);
    this._acHtmlManager.remove(id);
    primitive.element = null;
  }
}
