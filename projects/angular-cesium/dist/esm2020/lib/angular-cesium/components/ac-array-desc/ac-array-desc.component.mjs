import { ChangeDetectionStrategy, Component, ContentChildren, Input, ViewChild } from '@angular/core';
import { Subject } from 'rxjs';
import { get } from 'lodash';
import { BasicDesc } from '../../services/basic-desc/basic-desc.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/layer-service/layer-service.service";
import * as i2 from "../ac-layer/ac-layer.component";
/**
 *  This is component represents an array under `ac-layer`.
 *  The element must be a child of ac-layer element.
 *  + acFor `{string}` - get the tracked array and entityName (see the example).
 *  + idGetter `{Function}` - a function that gets the id for a given element in the array -should be defined for maximum performance.
 *  + show `{boolean}` - show/hide array's entities.
 *
 *  __Usage :__
 *  ```
 *<ac-layer acFor="let track of tracks$" [show]="show" [context]="this" [store]="true">
 *  <ac-array-desc acFor="let arrayItem of track.array" [idGetter]="trackArrayIdGetter">
 *    <ac-array-desc acFor="let innerArrayItem of arrayItem.innerArray" [idGetter]="trackArrayIdGetter">
 *      <ac-point-desc props="{
 *        position: innerArrayItem.pos,
 *        pixelSize: 10,
 *        color: getTrackColor(track),
 *        outlineColor: Color.BLUE,
 *        outlineWidth: 1
 *      }">
 *      </ac-point-desc>
 *    </ac-array-desc>
 *  </ac-array-desc>
 *</ac-layer>
 *  ```
 */
export class AcArrayDescComponent {
    constructor(layerService, cd) {
        this.layerService = layerService;
        this.cd = cd;
        this.show = true;
        this.entitiesMap = new Map();
        this.id = 0;
        this.acForRgx = /^let\s+.+\s+of\s+.+$/;
        this.arrayObservable$ = new Subject();
    }
    ngOnChanges(changes) {
        if (changes['acFor'].firstChange) {
            const acForString = changes['acFor'].currentValue;
            if (!this.acForRgx.test(acForString)) {
                throw new Error(`ac-layer: Invalid [acFor] syntax. Expected: [acFor]="let item of observable" .Instead received: ${acForString}`);
            }
            const acForArr = changes['acFor'].currentValue.split(' ');
            this.arrayPath = acForArr[3];
            this.entityName = acForArr[1];
        }
    }
    ngOnInit() {
        if (this.layer) {
            this.layer.getLayerService().cache = false;
        }
        this.layerServiceSubscription = this.layerService.layerUpdates().subscribe(() => {
            this.cd.detectChanges();
        });
    }
    ngAfterContentInit() {
        this.layerService.context['arrayObservable$'] = this.arrayObservable$;
        this.layerService.registerDescription(this);
        this.basicDescs._results.forEach((component) => {
            component.setLayerService(this.layer.getLayerService());
        });
        this.arrayDescs._results.splice(0, 1);
        this.arrayDescs._results.forEach((component) => {
            this.layerService.unregisterDescription(component);
            this.layer.getLayerService().registerDescription(component);
            component.layerService = this.layer.getLayerService();
            component.setLayerService(this.layer.getLayerService());
        });
    }
    ngOnDestroy() {
        if (this.layerServiceSubscription) {
            this.layerServiceSubscription.unsubscribe();
        }
    }
    setLayerService(layerService) {
        this.layerService = layerService;
    }
    draw(context, id, contextEntity) {
        const entitiesArray = get(context, this.arrayPath);
        if (!entitiesArray) {
            return;
        }
        const previousEntitiesIdArray = this.entitiesMap.get(id);
        const entitiesIdArray = [];
        this.entitiesMap.set(id, entitiesIdArray);
        entitiesArray.forEach((item, index) => {
            this.layerService.context[this.entityName] = item;
            const arrayItemId = this.generateCombinedId(id, item, index);
            entitiesIdArray.push(arrayItemId);
            this.layer.update(contextEntity, arrayItemId);
        });
        if (previousEntitiesIdArray) {
            const entitiesToRemove = this.idGetter ?
                previousEntitiesIdArray.filter((entityId) => entitiesIdArray.indexOf(entityId) < 0) :
                previousEntitiesIdArray;
            if (entitiesToRemove) {
                entitiesToRemove.forEach((entityId) => this.layer.remove(entityId));
            }
        }
    }
    remove(id) {
        const entitiesIdArray = this.entitiesMap.get(id);
        if (entitiesIdArray) {
            entitiesIdArray.forEach((entityId) => this.layer.remove(entityId));
        }
        this.entitiesMap.delete(id);
    }
    removeAll() {
        this.layer.removeAll();
        this.entitiesMap.clear();
    }
    getAcForString() {
        return `let ${this.entityName + '___temp'} of arrayObservable$`;
    }
    generateCombinedId(entityId, arrayItem, index) {
        let arrayItemId;
        if (this.idGetter) {
            arrayItemId = this.idGetter(arrayItem, index);
        }
        else {
            arrayItemId = (this.id++) % Number.MAX_SAFE_INTEGER;
        }
        return entityId + arrayItemId;
    }
}
AcArrayDescComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArrayDescComponent, deps: [{ token: i1.LayerService }, { token: i0.ChangeDetectorRef }], target: i0.ɵɵFactoryTarget.Component });
AcArrayDescComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcArrayDescComponent, selector: "ac-array-desc", inputs: { acFor: "acFor", idGetter: "idGetter", show: "show" }, queries: [{ propertyName: "basicDescs", predicate: BasicDesc }, { propertyName: "arrayDescs", predicate: AcArrayDescComponent }], viewQueries: [{ propertyName: "layer", first: true, predicate: ["layer"], descendants: true, static: true }], usesOnChanges: true, ngImport: i0, template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `, isInline: true, components: [{ type: i2.AcLayerComponent, selector: "ac-layer", inputs: ["show", "acFor", "context", "store", "options", "zIndex", "debug"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcArrayDescComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-array-desc',
                    template: `
    <ac-layer #layer [acFor]="getAcForString()"
              [context]="layerService.context"
              [options]="layerService.options"
              [show]="layerService.show && show"
              [zIndex]="layerService.zIndex">
      <ng-content #content></ng-content>
    </ac-layer>
  `,
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.LayerService }, { type: i0.ChangeDetectorRef }]; }, propDecorators: { acFor: [{
                type: Input
            }], idGetter: [{
                type: Input
            }], show: [{
                type: Input
            }], layer: [{
                type: ViewChild,
                args: ['layer', { static: true }]
            }], basicDescs: [{
                type: ContentChildren,
                args: [BasicDesc, { descendants: false }]
            }], arrayDescs: [{
                type: ContentChildren,
                args: [AcArrayDescComponent, { descendants: false }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtYXJyYXktZGVzYy5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtYXJyYXktZGVzYy9hYy1hcnJheS1kZXNjLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBRUwsdUJBQXVCLEVBRXZCLFNBQVMsRUFDVCxlQUFlLEVBQ2YsS0FBSyxFQUtMLFNBQVMsRUFDVixNQUFNLGVBQWUsQ0FBQztBQUV2QixPQUFPLEVBQUUsT0FBTyxFQUFnQixNQUFNLE1BQU0sQ0FBQztBQUU3QyxPQUFPLEVBQUUsR0FBRyxFQUFFLE1BQU0sUUFBUSxDQUFDO0FBRzdCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSw4Q0FBOEMsQ0FBQzs7OztBQUV6RTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBd0JHO0FBZUgsTUFBTSxPQUFPLG9CQUFvQjtJQWtCL0IsWUFBbUIsWUFBMEIsRUFBVSxFQUFxQjtRQUF6RCxpQkFBWSxHQUFaLFlBQVksQ0FBYztRQUFVLE9BQUUsR0FBRixFQUFFLENBQW1CO1FBWm5FLFNBQUksR0FBRyxJQUFJLENBQUM7UUFJYixnQkFBVyxHQUFHLElBQUksR0FBRyxFQUFvQixDQUFDO1FBRTFDLE9BQUUsR0FBRyxDQUFDLENBQUM7UUFDRSxhQUFRLEdBQUcsc0JBQXNCLENBQUM7UUFHbkQscUJBQWdCLEdBQUcsSUFBSSxPQUFPLEVBQWtCLENBQUM7SUFHakQsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxXQUFXLEVBQUU7WUFDaEMsTUFBTSxXQUFXLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUNsRCxJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLEVBQUU7Z0JB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biAgQWZ0ZXJDb250ZW50SW5pdCxcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDaGFuZ2VEZXRlY3RvclJlZixcclxuICBDb21wb25lbnQsXHJcbiAgQ29udGVudENoaWxkcmVuLFxyXG4gIElucHV0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIFNpbXBsZUNoYW5nZXMsXHJcbiAgVmlld0NoaWxkXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IEFjTm90aWZpY2F0aW9uIH0gZnJvbSAnLi4vLi4vbW9kZWxzL2FjLW5vdGlmaWNhdGlvbic7XHJcbmltcG9ydCB7IFN1YmplY3QsIFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBJRGVzY3JpcHRpb24gfSBmcm9tICcuLi8uLi9tb2RlbHMvZGVzY3JpcHRpb24nO1xyXG5pbXBvcnQgeyBnZXQgfSBmcm9tICdsb2Rhc2gnO1xyXG5pbXBvcnQgeyBBY0xheWVyQ29tcG9uZW50IH0gZnJvbSAnLi4vYWMtbGF5ZXIvYWMtbGF5ZXIuY29tcG9uZW50JztcclxuaW1wb3J0IHsgTGF5ZXJTZXJ2aWNlIH0gZnJvbSAnLi4vLi4vc2VydmljZXMvbGF5ZXItc2VydmljZS9sYXllci1zZXJ2aWNlLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBCYXNpY0Rlc2MgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9iYXNpYy1kZXNjL2Jhc2ljLWRlc2Muc2VydmljZSc7XHJcblxyXG4vKipcclxuICogIFRoaXMgaXMgY29tcG9uZW50IHJlcHJlc2VudHMgYW4gYXJyYXkgdW5kZXIgYGFjLWxheWVyYC5cclxuICogIFRoZSBlbGVtZW50IG11c3QgYmUgYSBjaGlsZCBvZiBhYy1sYXllciBlbGVtZW50LlxyXG4gKiAgKyBhY0ZvciBge3N0cmluZ31gIC0gZ2V0IHRoZSB0cmFja2VkIGFycmF5IGFuZCBlbnRpdHlOYW1lIChzZWUgdGhlIGV4YW1wbGUpLlxyXG4gKiAgKyBpZEdldHRlciBge0Z1bmN0aW9ufWAgLSBhIGZ1bmN0aW9uIHRoYXQgZ2V0cyB0aGUgaWQgZm9yIGEgZ2l2ZW4gZWxlbWVudCBpbiB0aGUgYXJyYXkgLXNob3VsZCBiZSBkZWZpbmVkIGZvciBtYXhpbXVtIHBlcmZvcm1hbmNlLlxyXG4gKiAgKyBzaG93IGB7Ym9vbGVhbn1gIC0gc2hvdy9oaWRlIGFycmF5J3MgZW50aXRpZXMuXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqPGFjLWxheWVyIGFjRm9yPVwibGV0IHRyYWNrIG9mIHRyYWNrcyRcIiBbc2hvd109XCJzaG93XCIgW2NvbnRleHRdPVwidGhpc1wiIFtzdG9yZV09XCJ0cnVlXCI+XHJcbiAqICA8YWMtYXJyYXktZGVzYyBhY0Zvcj1cImxldCBhcnJheUl0ZW0gb2YgdHJhY2suYXJyYXlcIiBbaWRHZXR0ZXJdPVwidHJhY2tBcnJheUlkR2V0dGVyXCI+XHJcbiAqICAgIDxhYy1hcnJheS1kZXNjIGFjRm9yPVwibGV0IGlubmVyQXJyYXlJdGVtIG9mIGFycmF5SXRlbS5pbm5lckFycmF5XCIgW2lkR2V0dGVyXT1cInRyYWNrQXJyYXlJZEdldHRlclwiPlxyXG4gKiAgICAgIDxhYy1wb2ludC1kZXNjIHByb3BzPVwie1xyXG4gKiAgICAgICAgcG9zaXRpb246IGlubmVyQXJyYXlJdGVtLnBvcyxcclxuICogICAgICAgIHBpeGVsU2l6ZTogMTAsXHJcbiAqICAgICAgICBjb2xvcjogZ2V0VHJhY2tDb2xvcih0cmFjayksXHJcbiAqICAgICAgICBvdXRsaW5lQ29sb3I6IENvbG9yLkJMVUUsXHJcbiAqICAgICAgICBvdXRsaW5lV2lkdGg6IDFcclxuICogICAgICB9XCI+XHJcbiAqICAgICAgPC9hYy1wb2ludC1kZXNjPlxyXG4gKiAgICA8L2FjLWFycmF5LWRlc2M+XHJcbiAqICA8L2FjLWFycmF5LWRlc2M+XHJcbiAqPC9hYy1sYXllcj5cclxuICogIGBgYFxyXG4gKi9cclxuXHJcbkBDb21wb25lbnQoe1xyXG4gIHNlbGVjdG9yOiAnYWMtYXJyYXktZGVzYycsXHJcbiAgdGVtcGxhdGU6IGBcclxuICAgIDxhYy1sYXllciAjbGF5ZXIgW2FjRm9yXT1cImdldEFjRm9yU3RyaW5nKClcIlxyXG4gICAgICAgICAgICAgIFtjb250ZXh0XT1cImxheWVyU2VydmljZS5jb250ZXh0XCJcclxuICAgICAgICAgICAgICBbb3B0aW9uc109XCJsYXllclNlcnZpY2Uub3B0aW9uc1wiXHJcbiAgICAgICAgICAgICAgW3Nob3ddPVwibGF5ZXJTZXJ2aWNlLnNob3cgJiYgc2hvd1wiXHJcbiAgICAgICAgICAgICAgW3pJbmRleF09XCJsYXllclNlcnZpY2UuekluZGV4XCI+XHJcbiAgICAgIDxuZy1jb250ZW50ICNjb250ZW50PjwvbmctY29udGVudD5cclxuICAgIDwvYWMtbGF5ZXI+XHJcbiAgYCxcclxuICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjQXJyYXlEZXNjQ29tcG9uZW50IGltcGxlbWVudHMgT25DaGFuZ2VzLCBPbkluaXQsIEFmdGVyQ29udGVudEluaXQsIE9uRGVzdHJveSwgSURlc2NyaXB0aW9uIHtcclxuXHJcbiAgQElucHV0KCkgYWNGb3I6IHN0cmluZztcclxuXHJcbiAgQElucHV0KCkgaWRHZXR0ZXI6IChpdGVtOiBhbnksIGluZGV4OiBudW1iZXIpID0+IHN0cmluZztcclxuXHJcbiAgQElucHV0KCkgc2hvdyA9IHRydWU7XHJcbiAgQFZpZXdDaGlsZCgnbGF5ZXInLCB7c3RhdGljOiB0cnVlfSkgcHJpdmF0ZSBsYXllcjogQWNMYXllckNvbXBvbmVudDtcclxuICBAQ29udGVudENoaWxkcmVuKEJhc2ljRGVzYywge2Rlc2NlbmRhbnRzOiBmYWxzZX0pIHByaXZhdGUgYmFzaWNEZXNjczogYW55O1xyXG4gIEBDb250ZW50Q2hpbGRyZW4oQWNBcnJheURlc2NDb21wb25lbnQsIHtkZXNjZW5kYW50czogZmFsc2V9KSBwcml2YXRlIGFycmF5RGVzY3M6IGFueTtcclxuICBwcml2YXRlIGVudGl0aWVzTWFwID0gbmV3IE1hcDxzdHJpbmcsIHN0cmluZ1tdPigpO1xyXG4gIHByaXZhdGUgbGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcbiAgcHJpdmF0ZSBpZCA9IDA7XHJcbiAgcHJpdmF0ZSByZWFkb25seSBhY0ZvclJneCA9IC9ebGV0XFxzKy4rXFxzK29mXFxzKy4rJC87XHJcbiAgZW50aXR5TmFtZTogc3RyaW5nO1xyXG4gIGFycmF5UGF0aDogc3RyaW5nO1xyXG4gIGFycmF5T2JzZXJ2YWJsZSQgPSBuZXcgU3ViamVjdDxBY05vdGlmaWNhdGlvbj4oKTtcclxuXHJcbiAgY29uc3RydWN0b3IocHVibGljIGxheWVyU2VydmljZTogTGF5ZXJTZXJ2aWNlLCBwcml2YXRlIGNkOiBDaGFuZ2VEZXRlY3RvclJlZikge1xyXG4gIH1cclxuXHJcbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcyk6IHZvaWQge1xyXG4gICAgaWYgKGNoYW5nZXNbJ2FjRm9yJ10uZmlyc3RDaGFuZ2UpIHtcclxuICAgICAgY29uc3QgYWNGb3JTdHJpbmcgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgaWYgKCF0aGlzLmFjRm9yUmd4LnRlc3QoYWNGb3JTdHJpbmcpKSB7XHJcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBhYy1sYXllcjogSW52YWxpZCBbYWNGb3JdIHN5bnRheC4gRXhwZWN0ZWQ6IFthY0Zvcl09XCJsZXQgaXRlbSBvZiBvYnNlcnZhYmxlXCIgLkluc3RlYWQgcmVjZWl2ZWQ6ICR7YWNGb3JTdHJpbmd9YCk7XHJcbiAgICAgIH1cclxuICAgICAgY29uc3QgYWNGb3JBcnIgPSBjaGFuZ2VzWydhY0ZvciddLmN1cnJlbnRWYWx1ZS5zcGxpdCgnICcpO1xyXG4gICAgICB0aGlzLmFycmF5UGF0aCA9IGFjRm9yQXJyWzNdO1xyXG4gICAgICB0aGlzLmVudGl0eU5hbWUgPSBhY0ZvckFyclsxXTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubGF5ZXIpIHtcclxuICAgICAgdGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKS5jYWNoZSA9IGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uID0gdGhpcy5sYXllclNlcnZpY2UubGF5ZXJVcGRhdGVzKCkuc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nQWZ0ZXJDb250ZW50SW5pdCgpOiB2b2lkIHtcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLmNvbnRleHRbJ2FycmF5T2JzZXJ2YWJsZSQnXSA9IHRoaXMuYXJyYXlPYnNlcnZhYmxlJDtcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnJlZ2lzdGVyRGVzY3JpcHRpb24odGhpcyk7XHJcbiAgICB0aGlzLmJhc2ljRGVzY3MuX3Jlc3VsdHMuZm9yRWFjaCgoY29tcG9uZW50OiBCYXNpY0Rlc2MpID0+IHtcclxuICAgICAgY29tcG9uZW50LnNldExheWVyU2VydmljZSh0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpKTtcclxuICAgIH0pO1xyXG4gICAgdGhpcy5hcnJheURlc2NzLl9yZXN1bHRzLnNwbGljZSgwLCAxKTtcclxuICAgIHRoaXMuYXJyYXlEZXNjcy5fcmVzdWx0cy5mb3JFYWNoKChjb21wb25lbnQ6IEFjQXJyYXlEZXNjQ29tcG9uZW50KSA9PiB7XHJcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlLnVucmVnaXN0ZXJEZXNjcmlwdGlvbihjb21wb25lbnQpO1xyXG4gICAgICB0aGlzLmxheWVyLmdldExheWVyU2VydmljZSgpLnJlZ2lzdGVyRGVzY3JpcHRpb24oY29tcG9uZW50KTtcclxuICAgICAgY29tcG9uZW50LmxheWVyU2VydmljZSA9IHRoaXMubGF5ZXIuZ2V0TGF5ZXJTZXJ2aWNlKCk7XHJcbiAgICAgIGNvbXBvbmVudC5zZXRMYXllclNlcnZpY2UodGhpcy5sYXllci5nZXRMYXllclNlcnZpY2UoKSk7XHJcbiAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uKSB7XHJcbiAgICAgIHRoaXMubGF5ZXJTZXJ2aWNlU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBzZXRMYXllclNlcnZpY2UobGF5ZXJTZXJ2aWNlOiBMYXllclNlcnZpY2UpIHtcclxuICAgIHRoaXMubGF5ZXJTZXJ2aWNlID0gbGF5ZXJTZXJ2aWNlO1xyXG4gIH1cclxuXHJcbiAgZHJhdyhjb250ZXh0OiBhbnksIGlkOiBzdHJpbmcsIGNvbnRleHRFbnRpdHk6IGFueSkge1xyXG4gICAgY29uc3QgZW50aXRpZXNBcnJheTogYW55W10gPSBnZXQoY29udGV4dCwgdGhpcy5hcnJheVBhdGgpO1xyXG4gICAgaWYgKCFlbnRpdGllc0FycmF5KSB7XHJcbiAgICAgIHJldHVybjtcclxuICAgIH1cclxuICAgIGNvbnN0IHByZXZpb3VzRW50aXRpZXNJZEFycmF5ID0gdGhpcy5lbnRpdGllc01hcC5nZXQoaWQpO1xyXG4gICAgY29uc3QgZW50aXRpZXNJZEFycmF5OiBhbnlbXSA9IFtdO1xyXG4gICAgdGhpcy5lbnRpdGllc01hcC5zZXQoaWQsIGVudGl0aWVzSWRBcnJheSk7XHJcblxyXG4gICAgZW50aXRpZXNBcnJheS5mb3JFYWNoKChpdGVtLCBpbmRleCkgPT4ge1xyXG4gICAgICB0aGlzLmxheWVyU2VydmljZS5jb250ZXh0W3RoaXMuZW50aXR5TmFtZV0gPSBpdGVtO1xyXG4gICAgICBjb25zdCBhcnJheUl0ZW1JZCA9IHRoaXMuZ2VuZXJhdGVDb21iaW5lZElkKGlkLCBpdGVtLCBpbmRleCk7XHJcbiAgICAgIGVudGl0aWVzSWRBcnJheS5wdXNoKGFycmF5SXRlbUlkKTtcclxuICAgICAgdGhpcy5sYXllci51cGRhdGUoY29udGV4dEVudGl0eSwgYXJyYXlJdGVtSWQpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgaWYgKHByZXZpb3VzRW50aXRpZXNJZEFycmF5KSB7XHJcbiAgICAgIGNvbnN0IGVudGl0aWVzVG9SZW1vdmUgPSB0aGlzLmlkR2V0dGVyID9cclxuICAgICAgICBwcmV2aW91c0VudGl0aWVzSWRBcnJheS5maWx0ZXIoKGVudGl0eUlkKSA9PiBlbnRpdGllc0lkQXJyYXkuaW5kZXhPZihlbnRpdHlJZCkgPCAwKSA6XHJcbiAgICAgICAgcHJldmlvdXNFbnRpdGllc0lkQXJyYXk7XHJcbiAgICAgIGlmIChlbnRpdGllc1RvUmVtb3ZlKSB7XHJcbiAgICAgICAgZW50aXRpZXNUb1JlbW92ZS5mb3JFYWNoKChlbnRpdHlJZCkgPT4gdGhpcy5sYXllci5yZW1vdmUoZW50aXR5SWQpKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgcmVtb3ZlKGlkOiBzdHJpbmcpIHtcclxuICAgIGNvbnN0IGVudGl0aWVzSWRBcnJheSA9IHRoaXMuZW50aXRpZXNNYXAuZ2V0KGlkKTtcclxuICAgIGlmIChlbnRpdGllc0lkQXJyYXkpIHtcclxuICAgICAgZW50aXRpZXNJZEFycmF5LmZvckVhY2goKGVudGl0eUlkKSA9PiB0aGlzLmxheWVyLnJlbW92ZShlbnRpdHlJZCkpO1xyXG4gICAgfVxyXG4gICAgdGhpcy5lbnRpdGllc01hcC5kZWxldGUoaWQpO1xyXG4gIH1cclxuXHJcbiAgcmVtb3ZlQWxsKCkge1xyXG4gICAgdGhpcy5sYXllci5yZW1vdmVBbGwoKTtcclxuICAgIHRoaXMuZW50aXRpZXNNYXAuY2xlYXIoKTtcclxuICB9XHJcblxyXG4gIGdldEFjRm9yU3RyaW5nKCkge1xyXG4gICAgcmV0dXJuIGBsZXQgJHt0aGlzLmVudGl0eU5hbWUgKyAnX19fdGVtcCd9IG9mIGFycmF5T2JzZXJ2YWJsZSRgO1xyXG4gIH1cclxuXHJcbiAgcHJpdmF0ZSBnZW5lcmF0ZUNvbWJpbmVkSWQoZW50aXR5SWQ6IHN0cmluZywgYXJyYXlJdGVtOiBhbnksIGluZGV4OiBudW1iZXIpOiBzdHJpbmcge1xyXG4gICAgbGV0IGFycmF5SXRlbUlkO1xyXG4gICAgaWYgKHRoaXMuaWRHZXR0ZXIpIHtcclxuICAgICAgYXJyYXlJdGVtSWQgPSB0aGlzLmlkR2V0dGVyKGFycmF5SXRlbSwgaW5kZXgpO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgYXJyYXlJdGVtSWQgPSAodGhpcy5pZCsrKSAlIE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIGVudGl0eUlkICsgYXJyYXlJdGVtSWQ7XHJcbiAgfVxyXG59XHJcbiJdfQ==