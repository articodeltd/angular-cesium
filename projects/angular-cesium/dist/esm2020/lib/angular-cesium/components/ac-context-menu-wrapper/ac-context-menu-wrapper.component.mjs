import { ChangeDetectionStrategy, Component, ViewChild, ViewContainerRef } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "../../services/context-menu/context-menu.service";
import * as i2 from "../ac-html/ac-html.component";
import * as i3 from "@angular/common";
/**
 * This component is used to inject the component that is passed to the ContextMenuService when opening a context menu.
 * It shouldn't be used directly.
 *
 * usage:
 * ```typescript
 * // We want to open the context menu on mouse right click.
 * // Register to mouse right click with the MapEventsManager
 * this.mapEventsManager.register({ event: CesiumEvent.RIGHT_CLICK, pick: PickOptions.NO_PICK })
 *    .subscribe(event => {
 *       const position = this.coordinateConverter.screenToCartesian3(event.movement.endPosition, true);
 *       if (!position) {
 *         return;
 *       }
 *       // Open the context menu on the position that was clicked and pass some data to MyCustomContextMenuComponent.
 *       this.contextMenuService.open(
 *         MyCustomContextMenuComponent,
 *         position,
 *         { data: { items: ['New Track', 'Change Map', 'Context Menu', 'Do Something'] } }
 *       )
 *    });
 *
 * ```
 */
export class AcContextMenuWrapperComponent {
    constructor(contextMenuService, cd, componentFactoryResolver) {
        this.contextMenuService = contextMenuService;
        this.cd = cd;
        this.componentFactoryResolver = componentFactoryResolver;
    }
    ngOnInit() {
        this.contextMenuChangeSubscription =
            this.contextMenuService.contextMenuChangeNotifier.subscribe(() => this.cd.detectChanges());
        this.contextMenuOpenSubscription =
            this.contextMenuService.onOpen.subscribe(() => {
                const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.contextMenuService.content);
                this.viewContainerRef.clear();
                const componentRef = this.viewContainerRef.createComponent(componentFactory);
                componentRef.instance.data = this.contextMenuService.options.data;
                this.cd.detectChanges();
            });
    }
    ngOnDestroy() {
        if (this.contextMenuChangeSubscription) {
            this.contextMenuChangeSubscription.unsubscribe();
        }
        if (this.contextMenuOpenSubscription) {
            this.contextMenuOpenSubscription.unsubscribe();
        }
    }
}
AcContextMenuWrapperComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcContextMenuWrapperComponent, deps: [{ token: i1.ContextMenuService }, { token: i0.ChangeDetectorRef }, { token: i0.ComponentFactoryResolver }], target: i0.ɵɵFactoryTarget.Component });
AcContextMenuWrapperComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcContextMenuWrapperComponent, selector: "ac-context-menu-wrapper", viewQueries: [{ propertyName: "viewContainerRef", first: true, predicate: ["contextMenuContainer"], descendants: true, read: ViewContainerRef }], ngImport: i0, template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `, isInline: true, components: [{ type: i2.AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], directives: [{ type: i3.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcContextMenuWrapperComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-context-menu-wrapper',
                    template: `
    <ac-html *ngIf="contextMenuService.showContextMenu" [props]="{position: contextMenuService.position}">
      <ng-template #contextMenuContainer></ng-template>
    </ac-html>
  `,
                    styles: [],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i1.ContextMenuService }, { type: i0.ChangeDetectorRef }, { type: i0.ComponentFactoryResolver }]; }, propDecorators: { viewContainerRef: [{
                type: ViewChild,
                args: ['contextMenuContainer', { read: ViewContainerRef }]
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtY29udGV4dC1tZW51LXdyYXBwZXIuY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS9jb21wb25lbnRzL2FjLWNvbnRleHQtbWVudS13cmFwcGVyL2FjLWNvbnRleHQtbWVudS13cmFwcGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQ0wsdUJBQXVCLEVBRXZCLFNBQVMsRUFJVCxTQUFTLEVBQ1QsZ0JBQWdCLEVBQ2pCLE1BQU0sZUFBZSxDQUFDOzs7OztBQUt2Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F1Qkc7QUFZSCxNQUFNLE9BQU8sNkJBQTZCO0lBT3hDLFlBQW1CLGtCQUFzQyxFQUNyQyxFQUFxQixFQUNyQix3QkFBa0Q7UUFGbkQsdUJBQWtCLEdBQWxCLGtCQUFrQixDQUFvQjtRQUNyQyxPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQiw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQTBCO0lBQ3RFLENBQUM7SUFFRCxRQUFRO1FBQ04sSUFBSSxDQUFDLDZCQUE2QjtZQUNoQyxJQUFJLENBQUMsa0JBQWtCLENBQUMseUJBQXlCLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxFQUFFLENBQUMsYUFBYSxFQUFFLENBQUMsQ0FBQztRQUM3RixJQUFJLENBQUMsMkJBQTJCO1lBQzlCLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRTtnQkFDNUMsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsd0JBQXdCLENBQUMsdUJBQXVCLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE9BQWMsQ0FBQyxDQUFDO2dCQUN2SCxJQUFJLENBQUMsZ0JBQWdCLENBQUMsS0FBSyxFQUFFLENBQUM7Z0JBQzlCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxlQUFlLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztnQkFDNUUsWUFBWSxDQUFDLFFBQTZCLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2dCQUN4RixJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDO1lBQzFCLENBQUMsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELFdBQVc7UUFDVCxJQUFJLElBQUksQ0FBQyw2QkFBNkIsRUFBRTtZQUN0QyxJQUFJLENBQUMsNkJBQTZCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDbEQ7UUFFRCxJQUFJLElBQUksQ0FBQywyQkFBMkIsRUFBRTtZQUNwQyxJQUFJLENBQUMsMkJBQTJCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDaEQ7SUFDSCxDQUFDOzswSEFqQ1UsNkJBQTZCOzhHQUE3Qiw2QkFBNkIsb0tBS0csZ0JBQWdCLDZCQWJqRDs7OztHQUlUOzJGQUlVLDZCQUE2QjtrQkFWekMsU0FBUzttQkFBQztvQkFDVCxRQUFRLEVBQUUseUJBQXlCO29CQUNuQyxRQUFRLEVBQUU7Ozs7R0FJVDtvQkFDRCxNQUFNLEVBQUUsRUFBRTtvQkFDVixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtpQkFDaEQ7Z0xBTWdFLGdCQUFnQjtzQkFBOUUsU0FBUzt1QkFBQyxzQkFBc0IsRUFBRSxFQUFFLElBQUksRUFBRSxnQkFBZ0IsRUFBRSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7XHJcbiAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksXHJcbiAgQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgQ29tcG9uZW50LFxyXG4gIENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcixcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIFZpZXdDaGlsZCxcclxuICBWaWV3Q29udGFpbmVyUmVmXHJcbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcbmltcG9ydCB7IENvbnRleHRNZW51U2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2NvbnRleHQtbWVudS9jb250ZXh0LW1lbnUuc2VydmljZSc7XHJcbmltcG9ydCB7IFN1YnNjcmlwdGlvbiB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBCYXNpY0NvbnRleHRNZW51IH0gZnJvbSAnLi4vLi4vbW9kZWxzL2Jhc2ljLWNvbnRleHQtbWVudSc7XHJcblxyXG4vKipcclxuICogVGhpcyBjb21wb25lbnQgaXMgdXNlZCB0byBpbmplY3QgdGhlIGNvbXBvbmVudCB0aGF0IGlzIHBhc3NlZCB0byB0aGUgQ29udGV4dE1lbnVTZXJ2aWNlIHdoZW4gb3BlbmluZyBhIGNvbnRleHQgbWVudS5cclxuICogSXQgc2hvdWxkbid0IGJlIHVzZWQgZGlyZWN0bHkuXHJcbiAqXHJcbiAqIHVzYWdlOlxyXG4gKiBgYGB0eXBlc2NyaXB0XHJcbiAqIC8vIFdlIHdhbnQgdG8gb3BlbiB0aGUgY29udGV4dCBtZW51IG9uIG1vdXNlIHJpZ2h0IGNsaWNrLlxyXG4gKiAvLyBSZWdpc3RlciB0byBtb3VzZSByaWdodCBjbGljayB3aXRoIHRoZSBNYXBFdmVudHNNYW5hZ2VyXHJcbiAqIHRoaXMubWFwRXZlbnRzTWFuYWdlci5yZWdpc3Rlcih7IGV2ZW50OiBDZXNpdW1FdmVudC5SSUdIVF9DTElDSywgcGljazogUGlja09wdGlvbnMuTk9fUElDSyB9KVxyXG4gKiAgICAuc3Vic2NyaWJlKGV2ZW50ID0+IHtcclxuICogICAgICAgY29uc3QgcG9zaXRpb24gPSB0aGlzLmNvb3JkaW5hdGVDb252ZXJ0ZXIuc2NyZWVuVG9DYXJ0ZXNpYW4zKGV2ZW50Lm1vdmVtZW50LmVuZFBvc2l0aW9uLCB0cnVlKTtcclxuICogICAgICAgaWYgKCFwb3NpdGlvbikge1xyXG4gKiAgICAgICAgIHJldHVybjtcclxuICogICAgICAgfVxyXG4gKiAgICAgICAvLyBPcGVuIHRoZSBjb250ZXh0IG1lbnUgb24gdGhlIHBvc2l0aW9uIHRoYXQgd2FzIGNsaWNrZWQgYW5kIHBhc3Mgc29tZSBkYXRhIHRvIE15Q3VzdG9tQ29udGV4dE1lbnVDb21wb25lbnQuXHJcbiAqICAgICAgIHRoaXMuY29udGV4dE1lbnVTZXJ2aWNlLm9wZW4oXHJcbiAqICAgICAgICAgTXlDdXN0b21Db250ZXh0TWVudUNvbXBvbmVudCxcclxuICogICAgICAgICBwb3NpdGlvbixcclxuICogICAgICAgICB7IGRhdGE6IHsgaXRlbXM6IFsnTmV3IFRyYWNrJywgJ0NoYW5nZSBNYXAnLCAnQ29udGV4dCBNZW51JywgJ0RvIFNvbWV0aGluZyddIH0gfVxyXG4gKiAgICAgICApXHJcbiAqICAgIH0pO1xyXG4gKlxyXG4gKiBgYGBcclxuICovXHJcblxyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLWNvbnRleHQtbWVudS13cmFwcGVyJyxcclxuICB0ZW1wbGF0ZTogYFxyXG4gICAgPGFjLWh0bWwgKm5nSWY9XCJjb250ZXh0TWVudVNlcnZpY2Uuc2hvd0NvbnRleHRNZW51XCIgW3Byb3BzXT1cIntwb3NpdGlvbjogY29udGV4dE1lbnVTZXJ2aWNlLnBvc2l0aW9ufVwiPlxyXG4gICAgICA8bmctdGVtcGxhdGUgI2NvbnRleHRNZW51Q29udGFpbmVyPjwvbmctdGVtcGxhdGU+XHJcbiAgICA8L2FjLWh0bWw+XHJcbiAgYCxcclxuICBzdHlsZXM6IFtdLFxyXG4gIGNoYW5nZURldGVjdGlvbjogQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuT25QdXNoLFxyXG59KVxyXG5leHBvcnQgY2xhc3MgQWNDb250ZXh0TWVudVdyYXBwZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQsIE9uRGVzdHJveSB7XHJcblxyXG4gIHByaXZhdGUgY29udGV4dE1lbnVDaGFuZ2VTdWJzY3JpcHRpb246IFN1YnNjcmlwdGlvbjtcclxuICBwcml2YXRlIGNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbjogU3Vic2NyaXB0aW9uO1xyXG5cclxuICBAVmlld0NoaWxkKCdjb250ZXh0TWVudUNvbnRhaW5lcicsIHsgcmVhZDogVmlld0NvbnRhaW5lclJlZiB9KSB2aWV3Q29udGFpbmVyUmVmOiBWaWV3Q29udGFpbmVyUmVmO1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgY29udGV4dE1lbnVTZXJ2aWNlOiBDb250ZXh0TWVudVNlcnZpY2UsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjZDogQ2hhbmdlRGV0ZWN0b3JSZWYsXHJcbiAgICAgICAgICAgICAgcHJpdmF0ZSBjb21wb25lbnRGYWN0b3J5UmVzb2x2ZXI6IENvbXBvbmVudEZhY3RvcnlSZXNvbHZlcikge1xyXG4gIH1cclxuXHJcbiAgbmdPbkluaXQoKSB7XHJcbiAgICB0aGlzLmNvbnRleHRNZW51Q2hhbmdlU3Vic2NyaXB0aW9uID1cclxuICAgICAgdGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY29udGV4dE1lbnVDaGFuZ2VOb3RpZmllci5zdWJzY3JpYmUoKCkgPT4gdGhpcy5jZC5kZXRlY3RDaGFuZ2VzKCkpO1xyXG4gICAgdGhpcy5jb250ZXh0TWVudU9wZW5TdWJzY3JpcHRpb24gPVxyXG4gICAgICB0aGlzLmNvbnRleHRNZW51U2VydmljZS5vbk9wZW4uc3Vic2NyaWJlKCgpID0+IHtcclxuICAgICAgICBjb25zdCBjb21wb25lbnRGYWN0b3J5ID0gdGhpcy5jb21wb25lbnRGYWN0b3J5UmVzb2x2ZXIucmVzb2x2ZUNvbXBvbmVudEZhY3RvcnkodGhpcy5jb250ZXh0TWVudVNlcnZpY2UuY29udGVudCBhcyBhbnkpO1xyXG4gICAgICAgIHRoaXMudmlld0NvbnRhaW5lclJlZi5jbGVhcigpO1xyXG4gICAgICAgIGNvbnN0IGNvbXBvbmVudFJlZiA9IHRoaXMudmlld0NvbnRhaW5lclJlZi5jcmVhdGVDb21wb25lbnQoY29tcG9uZW50RmFjdG9yeSk7XHJcbiAgICAgICAgKGNvbXBvbmVudFJlZi5pbnN0YW5jZSBhcyBCYXNpY0NvbnRleHRNZW51KS5kYXRhID0gdGhpcy5jb250ZXh0TWVudVNlcnZpY2Uub3B0aW9ucy5kYXRhO1xyXG4gICAgICAgIHRoaXMuY2QuZGV0ZWN0Q2hhbmdlcygpO1xyXG4gICAgICB9KTtcclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMuY29udGV4dE1lbnVDaGFuZ2VTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5jb250ZXh0TWVudUNoYW5nZVN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmICh0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbikge1xyXG4gICAgICB0aGlzLmNvbnRleHRNZW51T3BlblN1YnNjcmlwdGlvbi51bnN1YnNjcmliZSgpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=