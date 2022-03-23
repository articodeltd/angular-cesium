import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { fromEvent as observableFromEvent } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';
import * as i0 from "@angular/core";
import * as i1 from "../../../../angular-cesium/services/cesium/cesium.service";
import * as i2 from "../ac-toolbar-button/ac-toolbar-button.component";
import * as i3 from "./drag-icon.component";
import * as i4 from "@angular/common";
/**
 * Toolbar widget, act as a container for ac-toolbar-button components
 * allowing drag configuration and passing `toolbarClass` as attributes
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true" (onDrag)="handleDrag($event)">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export class AcToolbarComponent {
    constructor(element, cesiumService) {
        this.element = element;
        this.cesiumService = cesiumService;
        this.allowDrag = true;
        this.onDrag = new EventEmitter();
        this.dragStyle = {
            'height.px': 20,
            'width.px': 20,
        };
    }
    ngOnInit() {
        //this.cesiumService.getMap().getMapContainer().appendChild(this.element.nativeElement);
        this.cesiumService.getMapContainer().appendChild(this.element.nativeElement);
        if (this.allowDrag) {
            this.listenForDragging();
        }
    }
    ngOnChanges(changes) {
        if (changes.allowDrag && changes.allowDrag.currentValue && !changes.allowDrag.previousValue) {
            this.listenForDragging();
        }
        if (changes.allowDrag && !changes.allowDrag.currentValue && changes.allowDrag.previousValue) {
            this.dragSubscription.unsubscribe();
        }
    }
    ngOnDestroy() {
        if (this.dragSubscription) {
            this.dragSubscription.unsubscribe();
        }
    }
    listenForDragging() {
        this.mouseDown$ = this.mouseDown$ || observableFromEvent(this.element.nativeElement, 'mousedown');
        this.mouseMove$ = this.mouseMove$ || observableFromEvent(document, 'mousemove');
        this.mouseUp$ = this.mouseUp$ || observableFromEvent(document, 'mouseup');
        this.drag$ = this.drag$ ||
            this.mouseDown$.pipe(switchMap(() => this.mouseMove$.pipe(tap(this.onDrag.emit), takeUntil(this.mouseUp$))));
        this.dragSubscription = this.drag$.subscribe((event) => {
            this.element.nativeElement.style.left = `${event.x}px`;
            this.element.nativeElement.style.top = `${event.y}px`;
        });
    }
}
AcToolbarComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarComponent, deps: [{ token: i0.ElementRef }, { token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcToolbarComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcToolbarComponent, selector: "ac-toolbar", inputs: { toolbarClass: "toolbarClass", allowDrag: "allowDrag" }, outputs: { onDrag: "onDrag" }, usesOnChanges: true, ngImport: i0, template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [":host{position:absolute;top:20px;left:20px;width:20px;height:20px;z-index:999;-webkit-user-drag:none}\n"], components: [{ type: i2.AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: ["iconUrl", "buttonClass", "iconClass"], outputs: ["onClick"] }, { type: i3.DragIconComponent, selector: "ac-drag-icon" }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-toolbar',
                    template: `
        <div class="{{toolbarClass}}">
            <div *ngIf="allowDrag">
                <ac-toolbar-button>
                    <ac-drag-icon></ac-drag-icon>
                </ac-toolbar-button>
            </div>

            <ng-content></ng-content>
        </div>
    `,
                    styles: [`
        :host {
            position: absolute;
            top: 20px;
            left: 20px;
            width: 20px;
            height: 20px;
            z-index: 999;
            -webkit-user-drag: none;
        }
    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.CesiumService }]; }, propDecorators: { toolbarClass: [{
                type: Input
            }], allowDrag: [{
                type: Input
            }], onDrag: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtLXdpZGdldHMvY29tcG9uZW50cy90b29sYmFyL2FjLXRvb2xiYXIvYWMtdG9vbGJhci5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUNMLHVCQUF1QixFQUN2QixTQUFTLEVBRVQsS0FBSyxFQUtMLE1BQU0sRUFDTixZQUFZLEVBQ2IsTUFBTSxlQUFlLENBQUM7QUFDdkIsT0FBTyxFQUFFLFNBQVMsSUFBSSxtQkFBbUIsRUFBNEIsTUFBTSxNQUFNLENBQUM7QUFDbEYsT0FBTyxFQUFFLFNBQVMsRUFBRSxTQUFTLEVBQUUsR0FBRyxFQUFFLE1BQU0sZ0JBQWdCLENBQUM7Ozs7OztBQUkzRDs7Ozs7Ozs7Ozs7Ozs7R0FjRztBQTZCSCxNQUFNLE9BQU8sa0JBQWtCO0lBbUI3QixZQUFvQixPQUFtQixFQUFVLGFBQTRCO1FBQXpELFlBQU8sR0FBUCxPQUFPLENBQVk7UUFBVSxrQkFBYSxHQUFiLGFBQWEsQ0FBZTtRQWY3RSxjQUFTLEdBQUcsSUFBSSxDQUFDO1FBRWpCLFdBQU0sR0FBRyxJQUFJLFlBQVksRUFBYyxDQUFDO1FBRXhDLGNBQVMsR0FBRztZQUNWLFdBQVcsRUFBRSxFQUFFO1lBQ2YsVUFBVSxFQUFFLEVBQUU7U0FDZixDQUFDO0lBUThFLENBQUM7SUFFakYsUUFBUTtRQUNOLHdGQUF3RjtRQUN4RixJQUFJLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDO1FBQzdFLElBQUksSUFBSSxDQUFDLFNBQVMsRUFBRTtZQUNsQixJQUFJLENBQUMsaUJBQWlCLEVBQUUsQ0FBQztTQUMxQjtJQUNILENBQUM7SUFHRCxXQUFXLENBQUMsT0FBc0I7UUFDaEMsSUFBSSxPQUFPLENBQUMsU0FBUyxJQUFJLE9BQU8sQ0FBQyxTQUFTLENBQUMsWUFBWSxJQUFJLENBQUMsT0FBTyxDQUFDLFNBQVMsQ0FBQyxhQUFhLEVBQUU7WUFDM0YsSUFBSSxDQUFDLGlCQUFpQixFQUFFLENBQUM7U0FDMUI7UUFFRCxJQUFJLE9BQU8sQ0FBQyxTQUFTLElBQUksQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFlBQVksSUFBSSxPQUFPLENBQUMsU0FBUyxDQUFDLGFBQWEsRUFBRTtZQUMzRixJQUFJLENBQUMsZ0JBQWdCLENBQUMsV0FBVyxFQUFFLENBQUM7U0FDckM7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLGdCQUFnQixFQUFFO1lBQ3pCLElBQUksQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLEVBQUUsQ0FBQztTQUNyQztJQUNILENBQUM7SUFFTyxpQkFBaUI7UUFDdkIsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsVUFBVSxJQUFJLG1CQUFtQixDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLFdBQVcsQ0FBQyxDQUFDO1FBQ2xHLElBQUksQ0FBQyxVQUFVLEdBQUcsSUFBSSxDQUFDLFVBQVUsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsV0FBVyxDQUEyQixDQUFDO1FBQzFHLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDLFFBQVEsSUFBSSxtQkFBbUIsQ0FBQyxRQUFRLEVBQUUsU0FBUyxDQUEyQixDQUFDO1FBRXBHLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUs7WUFDVixJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FDakIsU0FBUyxDQUFDLEdBQUcsRUFBRSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUNsQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsRUFDckIsU0FBUyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FDekIsQ0FBQyxDQUNKLENBQUM7UUFFZixJQUFJLENBQUMsZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFpQixFQUFFLEVBQUU7WUFDakUsSUFBSSxDQUFDLE9BQU8sQ0FBQyxhQUFhLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxHQUFHLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztZQUN2RCxJQUFJLENBQUMsT0FBTyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsS0FBSyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQ3hELENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQzs7K0dBL0RVLGtCQUFrQjttR0FBbEIsa0JBQWtCLHdLQXpCakI7Ozs7Ozs7Ozs7S0FVVDsyRkFlUSxrQkFBa0I7a0JBNUI5QixTQUFTO21CQUNSO29CQUNFLFFBQVEsRUFBRSxZQUFZO29CQUN0QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7S0FVVDtvQkFDRCxNQUFNLEVBQUUsQ0FBQzs7Ozs7Ozs7OztLQVVSLENBQUM7b0JBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEOzZIQUlELFlBQVk7c0JBRFgsS0FBSztnQkFHTixTQUFTO3NCQURSLEtBQUs7Z0JBR04sTUFBTTtzQkFETCxNQUFNIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcclxuICBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneSxcclxuICBDb21wb25lbnQsXHJcbiAgRWxlbWVudFJlZixcclxuICBJbnB1dCxcclxuICBPbkRlc3Ryb3ksXHJcbiAgT25Jbml0LFxyXG4gIE9uQ2hhbmdlcyxcclxuICBTaW1wbGVDaGFuZ2VzLFxyXG4gIE91dHB1dCxcclxuICBFdmVudEVtaXR0ZXJcclxufSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgZnJvbUV2ZW50IGFzIG9ic2VydmFibGVGcm9tRXZlbnQsIFN1YnNjcmlwdGlvbiwgT2JzZXJ2YWJsZSB9IGZyb20gJ3J4anMnO1xyXG5pbXBvcnQgeyBzd2l0Y2hNYXAsIHRha2VVbnRpbCwgdGFwIH0gZnJvbSAncnhqcy9vcGVyYXRvcnMnO1xyXG5pbXBvcnQgeyBDZXNpdW1TZXJ2aWNlIH0gZnJvbSAnLi4vLi4vLi4vLi4vYW5ndWxhci1jZXNpdW0vc2VydmljZXMvY2VzaXVtL2Nlc2l1bS5zZXJ2aWNlJztcclxuXHJcblxyXG4vKipcclxuICogVG9vbGJhciB3aWRnZXQsIGFjdCBhcyBhIGNvbnRhaW5lciBmb3IgYWMtdG9vbGJhci1idXR0b24gY29tcG9uZW50c1xyXG4gKiBhbGxvd2luZyBkcmFnIGNvbmZpZ3VyYXRpb24gYW5kIHBhc3NpbmcgYHRvb2xiYXJDbGFzc2AgYXMgYXR0cmlidXRlc1xyXG4gKlxyXG4gKiBVc2FnZTpcclxuICogYGBgXHJcbiAqIDxhYy10b29sYmFyIFthbGxvd0RyYWddPVwidHJ1ZVwiIChvbkRyYWcpPVwiaGFuZGxlRHJhZygkZXZlbnQpXCI+XHJcbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9ob21lLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cImdvSG9tZSgpXCI+XHJcbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxyXG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvZXhwbG9yZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJyYW5nZUFuZEJlYXJpbmcoKVwiPlxyXG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cclxuIDwvYWMtdG9vbGJhcj5cclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5AQ29tcG9uZW50KFxyXG4gIHtcclxuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhcicsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJ7e3Rvb2xiYXJDbGFzc319XCI+XHJcbiAgICAgICAgICAgIDxkaXYgKm5nSWY9XCJhbGxvd0RyYWdcIj5cclxuICAgICAgICAgICAgICAgIDxhYy10b29sYmFyLWJ1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICA8YWMtZHJhZy1pY29uPjwvYWMtZHJhZy1pY29uPlxyXG4gICAgICAgICAgICAgICAgPC9hYy10b29sYmFyLWJ1dHRvbj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICA8bmctY29udGVudD48L25nLWNvbnRlbnQ+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICBgLFxyXG4gICAgc3R5bGVzOiBbYFxyXG4gICAgICAgIDpob3N0IHtcclxuICAgICAgICAgICAgcG9zaXRpb246IGFic29sdXRlO1xyXG4gICAgICAgICAgICB0b3A6IDIwcHg7XHJcbiAgICAgICAgICAgIGxlZnQ6IDIwcHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAyMHB4O1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDIwcHg7XHJcbiAgICAgICAgICAgIHotaW5kZXg6IDk5OTtcclxuICAgICAgICAgICAgLXdlYmtpdC11c2VyLWRyYWc6IG5vbmU7XHJcbiAgICAgICAgfVxyXG4gICAgYF0sXHJcbiAgICBjaGFuZ2VEZXRlY3Rpb246IENoYW5nZURldGVjdGlvblN0cmF0ZWd5Lk9uUHVzaCxcclxuICB9XHJcbilcclxuZXhwb3J0IGNsYXNzIEFjVG9vbGJhckNvbXBvbmVudCBpbXBsZW1lbnRzIE9uSW5pdCwgT25DaGFuZ2VzLCBPbkRlc3Ryb3kge1xyXG4gIEBJbnB1dCgpXHJcbiAgdG9vbGJhckNsYXNzOiBzdHJpbmc7XHJcbiAgQElucHV0KClcclxuICBhbGxvd0RyYWcgPSB0cnVlO1xyXG4gIEBPdXRwdXQoKVxyXG4gIG9uRHJhZyA9IG5ldyBFdmVudEVtaXR0ZXI8TW91c2VFdmVudD4oKTtcclxuXHJcbiAgZHJhZ1N0eWxlID0ge1xyXG4gICAgJ2hlaWdodC5weCc6IDIwLFxyXG4gICAgJ3dpZHRoLnB4JzogMjAsXHJcbiAgfTtcclxuXHJcbiAgcHJpdmF0ZSBtb3VzZURvd24kOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xyXG4gIHByaXZhdGUgbW91c2VNb3ZlJDogT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcclxuICBwcml2YXRlIG1vdXNlVXAkOiBPYnNlcnZhYmxlPE1vdXNlRXZlbnQ+O1xyXG4gIHByaXZhdGUgZHJhZyQ6IE9ic2VydmFibGU8TW91c2VFdmVudD47XHJcbiAgcHJpdmF0ZSBkcmFnU3Vic2NyaXB0aW9uOiBTdWJzY3JpcHRpb247XHJcblxyXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZiwgcHJpdmF0ZSBjZXNpdW1TZXJ2aWNlOiBDZXNpdW1TZXJ2aWNlKSB7fVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIC8vdGhpcy5jZXNpdW1TZXJ2aWNlLmdldE1hcCgpLmdldE1hcENvbnRhaW5lcigpLmFwcGVuZENoaWxkKHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50KTtcclxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRNYXBDb250YWluZXIoKS5hcHBlbmRDaGlsZCh0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudCk7XHJcbiAgICBpZiAodGhpcy5hbGxvd0RyYWcpIHtcclxuICAgICAgdGhpcy5saXN0ZW5Gb3JEcmFnZ2luZygpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpIHtcclxuICAgIGlmIChjaGFuZ2VzLmFsbG93RHJhZyAmJiBjaGFuZ2VzLmFsbG93RHJhZy5jdXJyZW50VmFsdWUgJiYgIWNoYW5nZXMuYWxsb3dEcmFnLnByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgdGhpcy5saXN0ZW5Gb3JEcmFnZ2luZygpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmIChjaGFuZ2VzLmFsbG93RHJhZyAmJiAhY2hhbmdlcy5hbGxvd0RyYWcuY3VycmVudFZhbHVlICYmIGNoYW5nZXMuYWxsb3dEcmFnLnByZXZpb3VzVmFsdWUpIHtcclxuICAgICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBuZ09uRGVzdHJveSgpOiB2b2lkIHtcclxuICAgIGlmICh0aGlzLmRyYWdTdWJzY3JpcHRpb24pIHtcclxuICAgICAgdGhpcy5kcmFnU3Vic2NyaXB0aW9uLnVuc3Vic2NyaWJlKCk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBwcml2YXRlIGxpc3RlbkZvckRyYWdnaW5nKCkge1xyXG4gICAgdGhpcy5tb3VzZURvd24kID0gdGhpcy5tb3VzZURvd24kIHx8IG9ic2VydmFibGVGcm9tRXZlbnQodGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQsICdtb3VzZWRvd24nKTtcclxuICAgIHRoaXMubW91c2VNb3ZlJCA9IHRoaXMubW91c2VNb3ZlJCB8fCBvYnNlcnZhYmxlRnJvbUV2ZW50KGRvY3VtZW50LCAnbW91c2Vtb3ZlJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcclxuICAgIHRoaXMubW91c2VVcCQgPSB0aGlzLm1vdXNlVXAkIHx8IG9ic2VydmFibGVGcm9tRXZlbnQoZG9jdW1lbnQsICdtb3VzZXVwJykgYXMgT2JzZXJ2YWJsZTxNb3VzZUV2ZW50PjtcclxuXHJcbiAgICB0aGlzLmRyYWckID0gdGhpcy5kcmFnJCB8fFxyXG4gICAgICAgICAgICAgICAgIHRoaXMubW91c2VEb3duJC5waXBlKFxyXG4gICAgICAgICAgICAgICAgICAgIHN3aXRjaE1hcCgoKSA9PiB0aGlzLm1vdXNlTW92ZSQucGlwZShcclxuICAgICAgICAgICAgICAgICAgICAgIHRhcCh0aGlzLm9uRHJhZy5lbWl0KSxcclxuICAgICAgICAgICAgICAgICAgICAgIHRha2VVbnRpbCh0aGlzLm1vdXNlVXAkKVxyXG4gICAgICAgICAgICAgICAgICAgICkpXHJcbiAgICAgICAgICAgICAgICAgKTtcclxuXHJcbiAgICB0aGlzLmRyYWdTdWJzY3JpcHRpb24gPSB0aGlzLmRyYWckLnN1YnNjcmliZSgoZXZlbnQ6IE1vdXNlRXZlbnQpID0+IHtcclxuICAgICAgdGhpcy5lbGVtZW50Lm5hdGl2ZUVsZW1lbnQuc3R5bGUubGVmdCA9IGAke2V2ZW50Lnh9cHhgO1xyXG4gICAgICB0aGlzLmVsZW1lbnQubmF0aXZlRWxlbWVudC5zdHlsZS50b3AgPSBgJHtldmVudC55fXB4YDtcclxuICAgIH0pO1xyXG4gIH1cclxufVxyXG4iXX0=