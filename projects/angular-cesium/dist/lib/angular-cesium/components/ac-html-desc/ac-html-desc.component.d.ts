import { OnInit, TemplateRef } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { LayerService } from '../../services/layer-service/layer-service.service';
import { ComputationCache } from '../../services/computation-cache/computation-cache.service';
import { CesiumProperties } from '../../services/cesium-properties/cesium-properties.service';
import { HtmlDrawerService } from '../../services/drawers/html-drawer/html-drawer.service';
import { AcHtmlDirective } from '../../directives/ac-html/ac-html.directive';
import * as i0 from "@angular/core";
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
export declare class AcHtmlDescComponent extends BasicDesc implements OnInit {
    acHtmlCreator: AcHtmlDirective;
    acHtmlTemplate: TemplateRef<any>;
    constructor(htmlDrawer: HtmlDrawerService, layerService: LayerService, computationCache: ComputationCache, cesiumProperties: CesiumProperties);
    ngOnInit(): void;
    draw(context: any, id: any): any;
    remove(id: string): void;
    removeAll(): void;
    static ɵfac: i0.ɵɵFactoryDeclaration<AcHtmlDescComponent, never>;
    static ɵcmp: i0.ɵɵComponentDeclaration<AcHtmlDescComponent, "ac-html-desc", never, {}, {}, ["acHtmlTemplate"], never>;
}
