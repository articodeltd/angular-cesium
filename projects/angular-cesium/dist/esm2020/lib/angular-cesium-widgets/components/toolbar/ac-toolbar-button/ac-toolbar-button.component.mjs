import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
/**
 * Toolbar button widget, act as a single button inside ac-toolbar component
 * Can accepts content components or passing [iconUrl]
 * configure with: `[iconUrl]`,`[buttonClass]`,`[iconClass]`,`(onClick)`
 *
 * Usage:
 * ```
 * <ac-toolbar [allowDrag]="true">
 <ac-toolbar-button [iconUrl]="'assets/home-icon.svg'" (onClick)="goHome()">
 </ac-toolbar-button>
 <ac-toolbar-button [iconUrl]="'assets/explore-icon.svg'" (onClick)="rangeAndBearing()">
 </ac-toolbar-button>
 </ac-toolbar>
 * ```
 *
 */
export class AcToolbarButtonComponent {
    constructor() {
        this.onClick = new EventEmitter();
    }
    ngOnInit() {
    }
}
AcToolbarButtonComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarButtonComponent, deps: [], target: i0.ɵɵFactoryTarget.Component });
AcToolbarButtonComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcToolbarButtonComponent, selector: "ac-toolbar-button", inputs: { iconUrl: "iconUrl", buttonClass: "buttonClass", iconClass: "iconClass" }, outputs: { onClick: "onClick" }, ngImport: i0, template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `, isInline: true, styles: [".button-container{border-radius:1px;background-color:#fffc;height:30px;width:30px;padding:5px;transition:all .2s;cursor:pointer;display:flex;justify-content:center;align-items:center;flex-direction:column}.button-container:hover{background-color:#fffffff2}.icon{height:30px;width:30px}\n"], directives: [{ type: i1.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcToolbarButtonComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-toolbar-button',
                    template: `
        <div (click)="onClick.emit()" class="button-container {{buttonClass}}">
            <img *ngIf="iconUrl" [src]="iconUrl" class="icon {{iconClass}}"/>
            <ng-content></ng-content>
        </div>
    `,
                    styles: [`
        .button-container {
            border-radius: 1px;
            background-color: rgba(255, 255, 255, 0.8);
            height: 30px;
            width: 30px;
            padding: 5px;
            transition: all 0.2s;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }

        .button-container:hover {
            background-color: rgba(255, 255, 255, 0.95);
        }

        .icon {
            height: 30px;
            width: 30px;
        }
    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                }]
        }], ctorParameters: function () { return []; }, propDecorators: { iconUrl: [{
                type: Input
            }], buttonClass: [{
                type: Input
            }], iconClass: [{
                type: Input
            }], onClick: [{
                type: Output
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdG9vbGJhci1idXR0b24uY29tcG9uZW50LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vc3JjL2xpYi9hbmd1bGFyLWNlc2l1bS13aWRnZXRzL2NvbXBvbmVudHMvdG9vbGJhci9hYy10b29sYmFyLWJ1dHRvbi9hYy10b29sYmFyLWJ1dHRvbi5jb21wb25lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsT0FBTyxFQUFFLHVCQUF1QixFQUFFLFNBQVMsRUFBRSxZQUFZLEVBQUUsS0FBSyxFQUFVLE1BQU0sRUFBRSxNQUFNLGVBQWUsQ0FBQzs7O0FBRXhHOzs7Ozs7Ozs7Ozs7Ozs7R0FlRztBQXFDSCxNQUFNLE9BQU8sd0JBQXdCO0lBY25DO1FBRkEsWUFBTyxHQUFHLElBQUksWUFBWSxFQUFFLENBQUM7SUFHN0IsQ0FBQztJQUVELFFBQVE7SUFFUixDQUFDOztxSEFuQlUsd0JBQXdCO3lHQUF4Qix3QkFBd0IsOEtBakN2Qjs7Ozs7S0FLVDsyRkE0QlEsd0JBQXdCO2tCQXBDcEMsU0FBUzttQkFDUjtvQkFDRSxRQUFRLEVBQUUsbUJBQW1CO29CQUM3QixRQUFRLEVBQUU7Ozs7O0tBS1Q7b0JBQ0QsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0tBdUJSLENBQUM7b0JBQ0YsZUFBZSxFQUFFLHVCQUF1QixDQUFDLE1BQU07aUJBQ2hEOzBFQUtELE9BQU87c0JBRE4sS0FBSztnQkFJTixXQUFXO3NCQURWLEtBQUs7Z0JBSU4sU0FBUztzQkFEUixLQUFLO2dCQUlOLE9BQU87c0JBRE4sTUFBTSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENoYW5nZURldGVjdGlvblN0cmF0ZWd5LCBDb21wb25lbnQsIEV2ZW50RW1pdHRlciwgSW5wdXQsIE9uSW5pdCwgT3V0cHV0IH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XHJcblxyXG4vKipcclxuICogVG9vbGJhciBidXR0b24gd2lkZ2V0LCBhY3QgYXMgYSBzaW5nbGUgYnV0dG9uIGluc2lkZSBhYy10b29sYmFyIGNvbXBvbmVudFxyXG4gKiBDYW4gYWNjZXB0cyBjb250ZW50IGNvbXBvbmVudHMgb3IgcGFzc2luZyBbaWNvblVybF1cclxuICogY29uZmlndXJlIHdpdGg6IGBbaWNvblVybF1gLGBbYnV0dG9uQ2xhc3NdYCxgW2ljb25DbGFzc11gLGAob25DbGljaylgXHJcbiAqXHJcbiAqIFVzYWdlOlxyXG4gKiBgYGBcclxuICogPGFjLXRvb2xiYXIgW2FsbG93RHJhZ109XCJ0cnVlXCI+XHJcbiA8YWMtdG9vbGJhci1idXR0b24gW2ljb25VcmxdPVwiJ2Fzc2V0cy9ob21lLWljb24uc3ZnJ1wiIChvbkNsaWNrKT1cImdvSG9tZSgpXCI+XHJcbiA8L2FjLXRvb2xiYXItYnV0dG9uPlxyXG4gPGFjLXRvb2xiYXItYnV0dG9uIFtpY29uVXJsXT1cIidhc3NldHMvZXhwbG9yZS1pY29uLnN2ZydcIiAob25DbGljayk9XCJyYW5nZUFuZEJlYXJpbmcoKVwiPlxyXG4gPC9hYy10b29sYmFyLWJ1dHRvbj5cclxuIDwvYWMtdG9vbGJhcj5cclxuICogYGBgXHJcbiAqXHJcbiAqL1xyXG5AQ29tcG9uZW50KFxyXG4gIHtcclxuICAgIHNlbGVjdG9yOiAnYWMtdG9vbGJhci1idXR0b24nLFxyXG4gICAgdGVtcGxhdGU6IGBcclxuICAgICAgICA8ZGl2IChjbGljayk9XCJvbkNsaWNrLmVtaXQoKVwiIGNsYXNzPVwiYnV0dG9uLWNvbnRhaW5lciB7e2J1dHRvbkNsYXNzfX1cIj5cclxuICAgICAgICAgICAgPGltZyAqbmdJZj1cImljb25VcmxcIiBbc3JjXT1cImljb25VcmxcIiBjbGFzcz1cImljb24ge3tpY29uQ2xhc3N9fVwiLz5cclxuICAgICAgICAgICAgPG5nLWNvbnRlbnQ+PC9uZy1jb250ZW50PlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgYCxcclxuICAgIHN0eWxlczogW2BcclxuICAgICAgICAuYnV0dG9uLWNvbnRhaW5lciB7XHJcbiAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDFweDtcclxuICAgICAgICAgICAgYmFja2dyb3VuZC1jb2xvcjogcmdiYSgyNTUsIDI1NSwgMjU1LCAwLjgpO1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgICAgICAgICBwYWRkaW5nOiA1cHg7XHJcbiAgICAgICAgICAgIHRyYW5zaXRpb246IGFsbCAwLjJzO1xyXG4gICAgICAgICAgICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgICAgICAgICAgIGRpc3BsYXk6IGZsZXg7XHJcbiAgICAgICAgICAgIGp1c3RpZnktY29udGVudDogY2VudGVyO1xyXG4gICAgICAgICAgICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmJ1dHRvbi1jb250YWluZXI6aG92ZXIge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1NSwgMjU1LCAyNTUsIDAuOTUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLmljb24ge1xyXG4gICAgICAgICAgICBoZWlnaHQ6IDMwcHg7XHJcbiAgICAgICAgICAgIHdpZHRoOiAzMHB4O1xyXG4gICAgICAgIH1cclxuICAgIGBdLFxyXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgfVxyXG4pXHJcbmV4cG9ydCBjbGFzcyBBY1Rvb2xiYXJCdXR0b25Db21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGljb25Vcmw6IHN0cmluZztcclxuXHJcbiAgQElucHV0KClcclxuICBidXR0b25DbGFzczogc3RyaW5nO1xyXG5cclxuICBASW5wdXQoKVxyXG4gIGljb25DbGFzczogc3RyaW5nO1xyXG5cclxuICBAT3V0cHV0KClcclxuICBvbkNsaWNrID0gbmV3IEV2ZW50RW1pdHRlcigpO1xyXG5cclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG5cclxuICB9XHJcbn1cclxuIl19