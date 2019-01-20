import { Component, ContentChild, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { AcHtmlDirective } from '../../directives/ac-html/ac-html.directive';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';

/**
 *  This is an html implementation.
 *  The ac-html element must be a child of ac-layer element.
 *  <br>
 *  [props] accepts position(Cartesian3) and show(boolean).
 *
 *  __Usage:__
 *  ```
 *  <ac-layer acFor="let html of htmls$" [context]="this">
 <ac-html-desc props="{position: html.position, show: html.show}">
 <ng-template let-html>
 <div>
 <h1>This is ac-html {{html.name}}</h1>
 <button (click)="changeText(html, 'Test')">change text</button>
 </div>
 </ng-template>
 </ac-html-desc>
 *  <ac-html [props]="{position: position, show: true}">;
 *    <p>html element</p>
 *  </ac-html>
 *  ```
 */
@Component({
  selector: 'ac-html-desc',
  providers: [AcHtmlManager],
  template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
})
export class AcHtmlDescComponent extends BasicDesc implements OnInit {

  @ViewChild(AcHtmlDirective) acHtmlCreator: AcHtmlDirective;
  @ContentChild(TemplateRef) acHtmlTemplate: TemplateRef<any>;

  constructor(htmlDrawer: HtmlDrawerService, layerService: LayerService,
              computationCache: ComputationCache, cesiumProperties: CesiumProperties) {
    super(htmlDrawer, layerService, computationCache, cesiumProperties);
  }

  ngOnInit() {
    super.ngOnInit();

    if (!this.acHtmlCreator) {
      throw new Error(`AcHtml desc ERROR: ac html directive not found.`);
    }

    if (!this.acHtmlTemplate) {
      throw new Error(`AcHtml desc ERROR: html template not found.`);
    }
  }

  draw(context: any, id: any): any {
    const cesiumProps = this._propsEvaluator(context);
    if (!this._cesiumObjectsMap.has(id)) {
      const primitive = this._drawer.add(cesiumProps);
      this._cesiumObjectsMap.set(id, primitive);
      this.acHtmlCreator.addOrUpdate(id, primitive);
    } else {
      const primitive = this._cesiumObjectsMap.get(id);
      this._drawer.update(primitive, cesiumProps);
      this.acHtmlCreator.addOrUpdate(id, primitive);
    }
  }

  remove(id: string): void {
    const primitive = this._cesiumObjectsMap.get(id);
    this._drawer.remove(primitive);
    this._cesiumObjectsMap.delete(id);
    this.acHtmlCreator.remove(id, primitive);
  }

  removeAll(): void {
    this._cesiumObjectsMap.forEach(((primitive, id) => {
      this.acHtmlCreator.remove(id, primitive);
    }));
    this._cesiumObjectsMap.clear();
    this._drawer.removeAll();
  }
}
