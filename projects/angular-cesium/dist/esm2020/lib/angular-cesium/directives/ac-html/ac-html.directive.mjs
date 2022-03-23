import { Directive } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../../services/ac-html-manager/ac-html-manager.service";
export class AcHtmlContext {
    constructor(id, context) {
        this.id = id;
        this.context = context;
    }
}
export class AcHtmlDirective {
    constructor(_templateRef, _viewContainerRef, _changeDetector, _layerService, _acHtmlManager) {
        this._templateRef = _templateRef;
        this._viewContainerRef = _viewContainerRef;
        this._changeDetector = _changeDetector;
        this._layerService = _layerService;
        this._acHtmlManager = _acHtmlManager;
        this._views = new Map();
    }
    ngOnInit() {
    }
    _handleView(id, primitive, entity) {
        if (!this._views.has(id) && primitive.show) {
            const context = new AcHtmlContext(id, { $implicit: entity });
            const viewRef = this._viewContainerRef.createEmbeddedView(this._templateRef, context);
            this._views.set(id, { viewRef, context });
            this._changeDetector.detectChanges();
        }
        else if (this._views.has(id) && primitive.show) {
            this._changeDetector.detectChanges();
        }
    }
    addOrUpdate(id, primitive) {
        const context = this._layerService.context;
        const entity = context[this._layerService.getEntityName()];
        if (this._views.has(id)) {
            this._views.get(id).context.context.$implicit = entity;
        }
        this._acHtmlManager.addOrUpdate(id, { entity, primitive });
        this._handleView(id, primitive, entity);
    }
    remove(id, primitive) {
        if (!this._views.has(id)) {
            return;
        }
        const { viewRef } = this._views.get(id);
        this._viewContainerRef.remove(this._viewContainerRef.indexOf(viewRef));
        this._views.delete(id);
        this._acHtmlManager.remove(id);
        primitive.element = null;
    }
}
AcHtmlDirective.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDirective, deps: [{ token: i0.TemplateRef }, { token: i0.ViewContainerRef }, { token: i0.ChangeDetectorRef }, { token: i1.LayerService }, { token: i2.AcHtmlManager }], target: i0.ɵɵFactoryTarget.Directive });
AcHtmlDirective.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "12.0.0", version: "13.3.0", type: AcHtmlDirective, selector: "[acHtml]", ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcHtmlDirective, decorators: [{
            type: Directive,
            args: [{
                    selector: '[acHtml]',
                }]
        }], ctorParameters: function () { return [{ type: i0.TemplateRef }, { type: i0.ViewContainerRef }, { type: i0.ChangeDetectorRef }, { type: i1.LayerService }, { type: i2.AcHtmlManager }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtaHRtbC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2RpcmVjdGl2ZXMvYWMtaHRtbC9hYy1odG1sLmRpcmVjdGl2ZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQXFCLFNBQVMsRUFBeUMsTUFBTSxlQUFlLENBQUM7Ozs7QUFJcEcsTUFBTSxPQUFPLGFBQWE7SUFDeEIsWUFDUyxFQUFPLEVBQ1AsT0FBWTtRQURaLE9BQUUsR0FBRixFQUFFLENBQUs7UUFDUCxZQUFPLEdBQVAsT0FBTyxDQUFLO0lBRXJCLENBQUM7Q0FDRjtBQUtELE1BQU0sT0FBTyxlQUFlO0lBSTFCLFlBQ1UsWUFBd0MsRUFDeEMsaUJBQW1DLEVBQ25DLGVBQWtDLEVBQ2xDLGFBQTJCLEVBQzNCLGNBQTZCO1FBSjdCLGlCQUFZLEdBQVosWUFBWSxDQUE0QjtRQUN4QyxzQkFBaUIsR0FBakIsaUJBQWlCLENBQWtCO1FBQ25DLG9CQUFlLEdBQWYsZUFBZSxDQUFtQjtRQUNsQyxrQkFBYSxHQUFiLGFBQWEsQ0FBYztRQUMzQixtQkFBYyxHQUFkLGNBQWMsQ0FBZTtRQVAvQixXQUFNLEdBQUcsSUFBSSxHQUFHLEVBQXVDLENBQUM7SUFTaEUsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDO0lBRU8sV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjLEVBQUUsTUFBVztRQUN0RCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksU0FBUyxDQUFDLElBQUksRUFBRTtZQUMxQyxNQUFNLE9BQU8sR0FBRyxJQUFJLGFBQWEsQ0FBQyxFQUFFLEVBQUUsRUFBQyxTQUFTLEVBQUUsTUFBTSxFQUFDLENBQUMsQ0FBQztZQUMzRCxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsaUJBQWlCLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVksRUFBRSxPQUFPLENBQUMsQ0FBQztZQUN0RixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxPQUFPLEVBQUUsT0FBTyxFQUFDLENBQUMsQ0FBQztZQUN4QyxJQUFJLENBQUMsZUFBZSxDQUFDLGFBQWEsRUFBRSxDQUFDO1NBQ3RDO2FBQU8sSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSSxTQUFTLENBQUMsSUFBSSxFQUFFO1lBQ2pELElBQUksQ0FBQyxlQUFlLENBQUMsYUFBYSxFQUFFLENBQUM7U0FDdEM7SUFDSCxDQUFDO0lBRUQsV0FBVyxDQUFDLEVBQU8sRUFBRSxTQUFjO1FBQ2pDLE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxDQUFDO1FBQzNDLE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsYUFBYSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7UUFFM0QsSUFBSSxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRTtZQUN2QixJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLFNBQVMsR0FBRyxNQUFNLENBQUM7U0FDeEQ7UUFFRCxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxFQUFFLEVBQUUsRUFBQyxNQUFNLEVBQUUsU0FBUyxFQUFDLENBQUMsQ0FBQztRQUN6RCxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUUsRUFBRSxTQUFTLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDMUMsQ0FBQztJQUVELE1BQU0sQ0FBQyxFQUFPLEVBQUUsU0FBYztRQUM1QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUU7WUFDeEIsT0FBTztTQUNSO1FBRUQsTUFBTSxFQUFDLE9BQU8sRUFBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3RDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGlCQUFpQixDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBQ3ZFLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQ3ZCLElBQUksQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQy9CLFNBQVMsQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0lBQzNCLENBQUM7OzRHQWxEVSxlQUFlO2dHQUFmLGVBQWU7MkZBQWYsZUFBZTtrQkFIM0IsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUsVUFBVTtpQkFDckIiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBDaGFuZ2VEZXRlY3RvclJlZiwgRGlyZWN0aXZlLCBPbkluaXQsIFRlbXBsYXRlUmVmLCBWaWV3Q29udGFpbmVyUmVmIH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IExheWVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2xheWVyLXNlcnZpY2UvbGF5ZXItc2VydmljZS5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQWNIdG1sTWFuYWdlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2FjLWh0bWwtbWFuYWdlci9hYy1odG1sLW1hbmFnZXIuc2VydmljZSc7XHJcblxyXG5leHBvcnQgY2xhc3MgQWNIdG1sQ29udGV4dCB7XHJcbiAgY29uc3RydWN0b3IoXHJcbiAgICBwdWJsaWMgaWQ6IGFueSxcclxuICAgIHB1YmxpYyBjb250ZXh0OiBhbnlcclxuICApIHtcclxuICB9XHJcbn1cclxuXHJcbkBEaXJlY3RpdmUoe1xyXG4gIHNlbGVjdG9yOiAnW2FjSHRtbF0nLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNIdG1sRGlyZWN0aXZlIGltcGxlbWVudHMgT25Jbml0IHtcclxuXHJcbiAgcHJpdmF0ZSBfdmlld3MgPSBuZXcgTWFwPGFueSwgeyB2aWV3UmVmOiBhbnksIGNvbnRleHQ6IGFueSB9PigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcihcclxuICAgIHByaXZhdGUgX3RlbXBsYXRlUmVmOiBUZW1wbGF0ZVJlZjxBY0h0bWxDb250ZXh0PixcclxuICAgIHByaXZhdGUgX3ZpZXdDb250YWluZXJSZWY6IFZpZXdDb250YWluZXJSZWYsXHJcbiAgICBwcml2YXRlIF9jaGFuZ2VEZXRlY3RvcjogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICBwcml2YXRlIF9sYXllclNlcnZpY2U6IExheWVyU2VydmljZSxcclxuICAgIHByaXZhdGUgX2FjSHRtbE1hbmFnZXI6IEFjSHRtbE1hbmFnZXJcclxuICApIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICB9XHJcblxyXG4gIHByaXZhdGUgX2hhbmRsZVZpZXcoaWQ6IGFueSwgcHJpbWl0aXZlOiBhbnksIGVudGl0eTogYW55KSB7XHJcbiAgICBpZiAoIXRoaXMuX3ZpZXdzLmhhcyhpZCkgJiYgcHJpbWl0aXZlLnNob3cpIHtcclxuICAgICAgY29uc3QgY29udGV4dCA9IG5ldyBBY0h0bWxDb250ZXh0KGlkLCB7JGltcGxpY2l0OiBlbnRpdHl9KTtcclxuICAgICAgY29uc3Qgdmlld1JlZiA9IHRoaXMuX3ZpZXdDb250YWluZXJSZWYuY3JlYXRlRW1iZWRkZWRWaWV3KHRoaXMuX3RlbXBsYXRlUmVmLCBjb250ZXh0KTtcclxuICAgICAgdGhpcy5fdmlld3Muc2V0KGlkLCB7dmlld1JlZiwgY29udGV4dH0pO1xyXG4gICAgICB0aGlzLl9jaGFuZ2VEZXRlY3Rvci5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9ICBlbHNlIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpICYmIHByaW1pdGl2ZS5zaG93KSB7XHJcbiAgICAgIHRoaXMuX2NoYW5nZURldGVjdG9yLmRldGVjdENoYW5nZXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGFkZE9yVXBkYXRlKGlkOiBhbnksIHByaW1pdGl2ZTogYW55KSB7XHJcbiAgICBjb25zdCBjb250ZXh0ID0gdGhpcy5fbGF5ZXJTZXJ2aWNlLmNvbnRleHQ7XHJcbiAgICBjb25zdCBlbnRpdHkgPSBjb250ZXh0W3RoaXMuX2xheWVyU2VydmljZS5nZXRFbnRpdHlOYW1lKCldO1xyXG5cclxuICAgIGlmICh0aGlzLl92aWV3cy5oYXMoaWQpKSB7XHJcbiAgICAgIHRoaXMuX3ZpZXdzLmdldChpZCkuY29udGV4dC5jb250ZXh0LiRpbXBsaWNpdCA9IGVudGl0eTtcclxuICAgIH1cclxuXHJcbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLmFkZE9yVXBkYXRlKGlkLCB7ZW50aXR5LCBwcmltaXRpdmV9KTtcclxuICAgIHRoaXMuX2hhbmRsZVZpZXcoaWQsIHByaW1pdGl2ZSwgZW50aXR5KTtcclxuICB9XHJcblxyXG4gIHJlbW92ZShpZDogYW55LCBwcmltaXRpdmU6IGFueSkge1xyXG4gICAgaWYgKCF0aGlzLl92aWV3cy5oYXMoaWQpKSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCB7dmlld1JlZn0gPSB0aGlzLl92aWV3cy5nZXQoaWQpO1xyXG4gICAgdGhpcy5fdmlld0NvbnRhaW5lclJlZi5yZW1vdmUodGhpcy5fdmlld0NvbnRhaW5lclJlZi5pbmRleE9mKHZpZXdSZWYpKTtcclxuICAgIHRoaXMuX3ZpZXdzLmRlbGV0ZShpZCk7XHJcbiAgICB0aGlzLl9hY0h0bWxNYW5hZ2VyLnJlbW92ZShpZCk7XHJcbiAgICBwcmltaXRpdmUuZWxlbWVudCA9IG51bGw7XHJcbiAgfVxyXG59XHJcbiJdfQ==