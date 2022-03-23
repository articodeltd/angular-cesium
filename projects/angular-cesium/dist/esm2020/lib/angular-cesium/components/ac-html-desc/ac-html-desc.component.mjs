import { Component, ContentChild, TemplateRef, ViewChild } from '@angular/core';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import { AcHtmlDirective } from '../../directives/ac-html/ac-html.directive';
import { AcHtmlManager } from '../../services/ac-html-manager/ac-html-manager.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/drawers/html-drawer/html-drawer.service";
import * as i2 from "../../services/layer-service/layer-service.service";
import * as i3 from "../../services/computation-cache/computation-cache.service";
import * as i4 from "../../services/cesium-properties/cesium-properties.service";
import * as i5 from "../../directives/ac-html/ac-html.directive";
import * as i6 from "../../directives/ac-html-container/ac-html-container.directive";
import * as i7 from "@angular/common";
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
export class AcHtmlDescComponent extends BasicDesc {
    constructor(htmlDrawer, layerService, computationCache, cesiumProperties) {
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
    draw(context, id) {
        const cesiumProps = this._propsEvaluator(context);
        if (!this._cesiumObjectsMap.has(id)) {
            const primitive = this._drawer.add(cesiumProps);
            this._cesiumObjectsMap.set(id, primitive);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
        else {
            const primitive = this._cesiumObjectsMap.get(id);
            this._drawer.update(primitive, cesiumProps);
            this.acHtmlCreator.addOrUpdate(id, primitive);
        }
    }
    remove(id) {
        const primitive = this._cesiumObjectsMap.get(id);
        this._drawer.remove(primitive);
        this._cesiumObjectsMap.delete(id);
        this.acHtmlCreator.remove(id, primitive);
    }
    removeAll() {
        this._cesiumObjectsMap.forEach(((primitive, id) => {
            this.acHtmlCreator.remove(id, primitive);
        }));
        this._cesiumObjectsMap.clear();
        this._drawer.removeAll();
    }
}
AcHtmlDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDescComponent, deps: [{ token: i1.HtmlDrawerService }, { token: i2.LayerService }, { token: i3.ComputationCache }, { token: i4.CesiumProperties }], target: i0.ɵɵFactoryTarget.Component });
AcHtmlDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlDescComponent, selector: "ac-html-desc", providers: [AcHtmlManager], queries: [{ propertyName: "acHtmlTemplate", first: true, predicate: TemplateRef, descendants: true, static: true }], viewQueries: [{ propertyName: "acHtmlCreator", first: true, predicate: AcHtmlDirective, descendants: true, static: true }], usesInheritance: true, ngImport: i0, template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`, isInline: true, directives: [{ type: i5.AcHtmlDirective, selector: "[acHtml]" }, { type: i6.AcHtmlContainerDirective, selector: "[acHtmlContainer]", inputs: ["acHtmlContainer"] }, { type: i7.NgTemplateOutlet, selector: "[ngTemplateOutlet]", inputs: ["ngTemplateOutletContext", "ngTemplateOutlet"] }] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-html-desc',
                    providers: [AcHtmlManager],
                    template: `
      <div *acHtml="let acHtmlEntityId = id; let acHtmlContext = context">
          <div [acHtmlContainer]="acHtmlEntityId">
              <ng-template [ngTemplateOutlet]="acHtmlTemplate"
                           [ngTemplateOutletContext]="acHtmlContext"></ng-template>
          </div>
      </div>`
                }]
        }], ctorParameters: function () { return [{ type: i1.HtmlDrawerService }, { type: i2.LayerService }, { type: i3.ComputationCache }, { type: i4.CesiumProperties }]; }, propDecorators: { acHtmlCreator: [{
                type: ViewChild,
                args: [AcHtmlDirective, { static: true }]
            }], acHtmlTemplate: [{
                type: ContentChild,
                args: [TemplateRef, { static: true }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC1kZXNjLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1odG1sLWRlc2MvYWMtaHRtbC1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLFlBQVksRUFBVSxXQUFXLEVBQUUsU0FBUyxFQUFFLE1BQU0sZUFBZSxDQUFDO0FBQ3hGLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQztBQUt6RSxPQUFPLEVBQUUsZUFBZSxFQUFFLE1BQU0sNENBQTRDLENBQUM7QUFDN0UsT0FBTyxFQUFFLGFBQWEsRUFBRSxNQUFNLHdEQUF3RCxDQUFDOzs7Ozs7Ozs7QUFFdkY7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQXFCRztBQVlILE1BQU0sT0FBTyxtQkFBb0IsU0FBUSxTQUFTO0lBS2hELFlBQVksVUFBNkIsRUFBRSxZQUEwQixFQUN6RCxnQkFBa0MsRUFBRSxnQkFBa0M7UUFDaEYsS0FBSyxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsZ0JBQWdCLENBQUMsQ0FBQztJQUN0RSxDQUFDO0lBRUQsUUFBUTtRQUNOLEtBQUssQ0FBQyxRQUFRLEVBQUUsQ0FBQztRQUVqQixJQUFJLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRTtZQUN2QixNQUFNLElBQUksS0FBSyxDQUFDLGlEQUFpRCxDQUFDLENBQUM7U0FDcEU7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUN4QixNQUFNLElBQUksS0FBSyxDQUFDLDZDQUE2QyxDQUFDLENBQUM7U0FDaEU7SUFDSCxDQUFDO0lBRUQsSUFBSSxDQUFDLE9BQVksRUFBRSxFQUFPO1FBQ3hCLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxlQUFlLENBQUMsT0FBTyxDQUFDLENBQUM7UUFDbEQsSUFBSSxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDbkMsTUFBTSxTQUFTLEdBQUcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDaEQsSUFBSSxDQUFDLGlCQUFpQixDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7WUFDMUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxXQUFXLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO1NBQy9DO2FBQU07WUFDTCxNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsRUFBRSxXQUFXLENBQUMsQ0FBQztZQUM1QyxJQUFJLENBQUMsYUFBYSxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsU0FBUyxDQUFDLENBQUM7U0FDL0M7SUFDSCxDQUFDO0lBRUQsTUFBTSxDQUFDLEVBQVU7UUFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ2pELElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFNBQVMsQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7UUFDbEMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLFNBQVMsQ0FBQyxDQUFDO0lBQzNDLENBQUM7SUFFRCxTQUFTO1FBQ1AsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsU0FBUyxFQUFFLEVBQUUsRUFBRSxFQUFFO1lBQ2hELElBQUksQ0FBQyxhQUFhLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxTQUFTLENBQUMsQ0FBQztRQUMzQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ0osSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDM0IsQ0FBQzs7Z0hBaERVLG1CQUFtQjtvR0FBbkIsbUJBQW1CLHVDQVRuQixDQUFDLGFBQWEsQ0FBQyxzRUFZWixXQUFXLDZHQURkLGVBQWUscUZBVmhCOzs7Ozs7YUFNQzsyRkFFQSxtQkFBbUI7a0JBWC9CLFNBQVM7bUJBQUM7b0JBQ1QsUUFBUSxFQUFFLGNBQWM7b0JBQ3hCLFNBQVMsRUFBRSxDQUFDLGFBQWEsQ0FBQztvQkFDMUIsUUFBUSxFQUFFOzs7Ozs7YUFNQztpQkFDWjtpTUFHNkMsYUFBYTtzQkFBeEQsU0FBUzt1QkFBQyxlQUFlLEVBQUUsRUFBQyxNQUFNLEVBQUUsSUFBSSxFQUFDO2dCQUNDLGNBQWM7c0JBQXhELFlBQVk7dUJBQUMsV0FBVyxFQUFFLEVBQUMsTUFBTSxFQUFFLElBQUksRUFBQyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgQ29udGVudENoaWxkLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q2hpbGQgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgQmFzaWNEZXNjIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvYmFzaWMtZGVzYy9iYXNpYy1kZXNjLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBMYXllclNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9sYXllci1zZXJ2aWNlL2xheWVyLXNlcnZpY2Uuc2VydmljZSc7XHJcbmltcG9ydCB7IENvbXB1dGF0aW9uQ2FjaGUgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jb21wdXRhdGlvbi1jYWNoZS9jb21wdXRhdGlvbi1jYWNoZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ2VzaXVtUHJvcGVydGllcyB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nlc2l1bS1wcm9wZXJ0aWVzL2Nlc2l1bS1wcm9wZXJ0aWVzLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBIdG1sRHJhd2VyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2RyYXdlcnMvaHRtbC1kcmF3ZXIvaHRtbC1kcmF3ZXIuc2VydmljZSc7XHJcbmltcG9ydCB7IEFjSHRtbERpcmVjdGl2ZSB9IGZyb20gJy4uLy4uL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZSc7XHJcbmltcG9ydCB7IEFjSHRtbE1hbmFnZXIgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9hYy1odG1sLW1hbmFnZXIvYWMtaHRtbC1tYW5hZ2VyLnNlcnZpY2UnO1xyXG5cclxuLyoqXHJcbiAqICBUaGlzIGlzIGFuIGh0bWwgaW1wbGVtZW50YXRpb24uXHJcbiAqICBUaGUgYWMtaHRtbCBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxyXG4gKiAgPGJyPlxyXG4gKiAgW3Byb3BzXSBhY2NlcHRzIHBvc2l0aW9uKENhcnRlc2lhbjMpIGFuZCBzaG93KGJvb2xlYW4pLlxyXG4gKlxyXG4gKiAgX19Vc2FnZTpfX1xyXG4gKiAgYGBgXHJcbiAqICA8YWMtbGF5ZXIgYWNGb3I9XCJsZXQgaHRtbCBvZiBodG1scyRcIiBbY29udGV4dF09XCJ0aGlzXCI+XHJcbiA8YWMtaHRtbC1kZXNjIHByb3BzPVwie3Bvc2l0aW9uOiBodG1sLnBvc2l0aW9uLCBzaG93OiBodG1sLnNob3d9XCI+XHJcbiA8bmctdGVtcGxhdGUgbGV0LWh0bWw+XHJcbiA8ZGl2PlxyXG4gPGgxPlRoaXMgaXMgYWMtaHRtbCB7e2h0bWwubmFtZX19PC9oMT5cclxuIDxidXR0b24gKGNsaWNrKT1cImNoYW5nZVRleHQoaHRtbCwgJ1Rlc3QnKVwiPmNoYW5nZSB0ZXh0PC9idXR0b24+XHJcbiA8L2Rpdj5cclxuIDwvbmctdGVtcGxhdGU+XHJcbiA8L2FjLWh0bWwtZGVzYz5cclxuICogIDxhYy1odG1sIFtwcm9wc109XCJ7cG9zaXRpb246IHBvc2l0aW9uLCBzaG93OiB0cnVlfVwiPjtcclxuICogICAgPHA+aHRtbCBlbGVtZW50PC9wPlxyXG4gKiAgPC9hYy1odG1sPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLWh0bWwtZGVzYycsXHJcbiAgcHJvdmlkZXJzOiBbQWNIdG1sTWFuYWdlcl0sXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgICAgPGRpdiAqYWNIdG1sPVwibGV0IGFjSHRtbEVudGl0eUlkID0gaWQ7IGxldCBhY0h0bWxDb250ZXh0ID0gY29udGV4dFwiPlxyXG4gICAgICAgICAgPGRpdiBbYWNIdG1sQ29udGFpbmVyXT1cImFjSHRtbEVudGl0eUlkXCI+XHJcbiAgICAgICAgICAgICAgPG5nLXRlbXBsYXRlIFtuZ1RlbXBsYXRlT3V0bGV0XT1cImFjSHRtbFRlbXBsYXRlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgW25nVGVtcGxhdGVPdXRsZXRDb250ZXh0XT1cImFjSHRtbENvbnRleHRcIj48L25nLXRlbXBsYXRlPlxyXG4gICAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZGl2PmBcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjSHRtbERlc2NDb21wb25lbnQgZXh0ZW5kcyBCYXNpY0Rlc2MgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBAVmlld0NoaWxkKEFjSHRtbERpcmVjdGl2ZSwge3N0YXRpYzogdHJ1ZX0pIGFjSHRtbENyZWF0b3I6IEFjSHRtbERpcmVjdGl2ZTtcclxuICBAQ29udGVudENoaWxkKFRlbXBsYXRlUmVmLCB7c3RhdGljOiB0cnVlfSkgYWNIdG1sVGVtcGxhdGU6IFRlbXBsYXRlUmVmPGFueT47XHJcblxyXG4gIGNvbnN0cnVjdG9yKGh0bWxEcmF3ZXI6IEh0bWxEcmF3ZXJTZXJ2aWNlLCBsYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgICAgICAgICAgICBjb21wdXRhdGlvbkNhY2hlOiBDb21wdXRhdGlvbkNhY2hlLCBjZXNpdW1Qcm9wZXJ0aWVzOiBDZXNpdW1Qcm9wZXJ0aWVzKSB7XHJcbiAgICBzdXBlcihodG1sRHJhd2VyLCBsYXllclNlcnZpY2UsIGNvbXB1dGF0aW9uQ2FjaGUsIGNlc2l1bVByb3BlcnRpZXMpO1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICBzdXBlci5uZ09uSW5pdCgpO1xyXG5cclxuICAgIGlmICghdGhpcy5hY0h0bWxDcmVhdG9yKSB7XHJcbiAgICAgIHRocm93IG5ldyBFcnJvcihgQWNIdG1sIGRlc2MgRVJST1I6IGFjIGh0bWwgZGlyZWN0aXZlIG5vdCBmb3VuZC5gKTtcclxuICAgIH1cclxuXHJcbiAgICBpZiAoIXRoaXMuYWNIdG1sVGVtcGxhdGUpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBBY0h0bWwgZGVzYyBFUlJPUjogaHRtbCB0ZW1wbGF0ZSBub3QgZm91bmQuYCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBkcmF3KGNvbnRleHQ6IGFueSwgaWQ6IGFueSk6IGFueSB7XHJcbiAgICBjb25zdCBjZXNpdW1Qcm9wcyA9IHRoaXMuX3Byb3BzRXZhbHVhdG9yKGNvbnRleHQpO1xyXG4gICAgaWYgKCF0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmhhcyhpZCkpIHtcclxuICAgICAgY29uc3QgcHJpbWl0aXZlID0gdGhpcy5fZHJhd2VyLmFkZChjZXNpdW1Qcm9wcyk7XHJcbiAgICAgIHRoaXMuX2Nlc2l1bU9iamVjdHNNYXAuc2V0KGlkLCBwcmltaXRpdmUpO1xyXG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IuYWRkT3JVcGRhdGUoaWQsIHByaW1pdGl2ZSk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XHJcbiAgICAgIHRoaXMuX2RyYXdlci51cGRhdGUocHJpbWl0aXZlLCBjZXNpdW1Qcm9wcyk7XHJcbiAgICAgIHRoaXMuYWNIdG1sQ3JlYXRvci5hZGRPclVwZGF0ZShpZCwgcHJpbWl0aXZlKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIHJlbW92ZShpZDogc3RyaW5nKTogdm9pZCB7XHJcbiAgICBjb25zdCBwcmltaXRpdmUgPSB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmdldChpZCk7XHJcbiAgICB0aGlzLl9kcmF3ZXIucmVtb3ZlKHByaW1pdGl2ZSk7XHJcbiAgICB0aGlzLl9jZXNpdW1PYmplY3RzTWFwLmRlbGV0ZShpZCk7XHJcbiAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQWxsKCk6IHZvaWQge1xyXG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5mb3JFYWNoKCgocHJpbWl0aXZlLCBpZCkgPT4ge1xyXG4gICAgICB0aGlzLmFjSHRtbENyZWF0b3IucmVtb3ZlKGlkLCBwcmltaXRpdmUpO1xyXG4gICAgfSkpO1xyXG4gICAgdGhpcy5fY2VzaXVtT2JqZWN0c01hcC5jbGVhcigpO1xyXG4gICAgdGhpcy5fZHJhd2VyLnJlbW92ZUFsbCgpO1xyXG4gIH1cclxufVxyXG4iXX0=