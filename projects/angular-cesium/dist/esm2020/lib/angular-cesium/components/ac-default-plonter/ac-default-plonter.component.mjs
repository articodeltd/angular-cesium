import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CoordinateConverter } from '../../services/coordinate-converter/coordinate-converter.service';
import * as i0 from "@angular/core";
import * as i1 from "../../services/plonter/plonter.service";
import * as i2 from "../../services/coordinate-converter/coordinate-converter.service";
import * as i3 from "../ac-html/ac-html.component";
import * as i4 from "@angular/common";
export class AcDefaultPlonterComponent {
    constructor(plonterService, cd, geoConverter) {
        this.plonterService = plonterService;
        this.cd = cd;
        this.geoConverter = geoConverter;
    }
    ngOnInit() {
        this.plonterService.plonterChangeNotifier.subscribe(() => this.cd.detectChanges());
    }
    get plonterPosition() {
        if (this.plonterService.plonterShown) {
            const screenPos = this.plonterService.plonterClickPosition.endPosition;
            return this.geoConverter.screenToCartesian3(screenPos);
        }
    }
    chooseEntity(entity) {
        this.plonterService.resolvePlonter(entity);
    }
}
AcDefaultPlonterComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDefaultPlonterComponent, deps: [{ token: i1.PlonterService }, { token: i0.ChangeDetectorRef }, { token: i2.CoordinateConverter }], target: i0.ɵɵFactoryTarget.Component });
AcDefaultPlonterComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcDefaultPlonterComponent, selector: "ac-default-plonter", providers: [CoordinateConverter], ngImport: i0, template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `, isInline: true, styles: [".plonter-context-menu{background-color:#fafafacc;box-shadow:1px 1px 5px #00000026}.plonter-item{cursor:pointer;padding:2px 15px;text-align:start}.plonter-item:hover{background-color:#00000026}\n"], components: [{ type: i3.AcHtmlComponent, selector: "ac-html", inputs: ["props"] }], directives: [{ type: i4.NgIf, selector: "[ngIf]", inputs: ["ngIf", "ngIfThen", "ngIfElse"] }, { type: i4.NgForOf, selector: "[ngFor][ngForOf]", inputs: ["ngForOf", "ngForTrackBy", "ngForTemplate"] }], changeDetection: i0.ChangeDetectionStrategy.OnPush });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcDefaultPlonterComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-default-plonter',
                    template: `
      <ac-html *ngIf="plonterService.plonterShown" [props]="{
        position: plonterPosition
      }">
        <div class="plonter-context-menu">
          <div *ngFor="let entity of plonterService.entitesToPlonter">
            <div class="plonter-item" (click)="chooseEntity(entity)">{{ entity?.name || entity?.id }}
            </div>
          </div>
        </div>
      </ac-html>
    `,
                    styles: [`
        .plonter-context-menu {
            background-color: rgba(250, 250, 250, 0.8);
            box-shadow: 1px 1px 5px 0px rgba(0, 0, 0, 0.15);
        }

        .plonter-item {
            cursor: pointer;
            padding: 2px 15px;
            text-align: start;
        }

        .plonter-item:hover {
            background-color: rgba(0, 0, 0, 0.15);
        }

    `],
                    changeDetection: ChangeDetectionStrategy.OnPush,
                    providers: [CoordinateConverter],
                }]
        }], ctorParameters: function () { return [{ type: i1.PlonterService }, { type: i0.ChangeDetectorRef }, { type: i2.CoordinateConverter }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uL3NyYy9saWIvYW5ndWxhci1jZXNpdW0vY29tcG9uZW50cy9hYy1kZWZhdWx0LXBsb250ZXIvYWMtZGVmYXVsdC1wbG9udGVyLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsdUJBQXVCLEVBQXFCLFNBQVMsRUFBVSxNQUFNLGVBQWUsQ0FBQztBQUU5RixPQUFPLEVBQUUsbUJBQW1CLEVBQUUsTUFBTSxrRUFBa0UsQ0FBQzs7Ozs7O0FBc0N2RyxNQUFNLE9BQU8seUJBQXlCO0lBRXBDLFlBQW1CLGNBQThCLEVBQzdCLEVBQXFCLEVBQ3JCLFlBQWlDO1FBRmxDLG1CQUFjLEdBQWQsY0FBYyxDQUFnQjtRQUM3QixPQUFFLEdBQUYsRUFBRSxDQUFtQjtRQUNyQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFDckQsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsY0FBYyxDQUFDLHFCQUFxQixDQUFDLFNBQVMsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDckYsQ0FBQztJQUVELElBQUksZUFBZTtRQUNqQixJQUFJLElBQUksQ0FBQyxjQUFjLENBQUMsWUFBWSxFQUFFO1lBQ3BDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxjQUFjLENBQUMsb0JBQW9CLENBQUMsV0FBVyxDQUFDO1lBQ3ZFLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxrQkFBa0IsQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUN4RDtJQUNILENBQUM7SUFFRCxZQUFZLENBQUMsTUFBVztRQUN0QixJQUFJLENBQUMsY0FBYyxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUM3QyxDQUFDOztzSEFwQlUseUJBQXlCOzBHQUF6Qix5QkFBeUIsNkNBSHZCLENBQUMsbUJBQW1CLENBQUMsMEJBOUJ0Qjs7Ozs7Ozs7Ozs7S0FXVDsyRkFzQlEseUJBQXlCO2tCQXBDckMsU0FBUzttQkFDUjtvQkFDRSxRQUFRLEVBQUUsb0JBQW9CO29CQUM5QixRQUFRLEVBQUU7Ozs7Ozs7Ozs7O0tBV1Q7b0JBQ0QsTUFBTSxFQUFFLENBQUM7Ozs7Ozs7Ozs7Ozs7Ozs7S0FnQlIsQ0FBQztvQkFDRixlQUFlLEVBQUUsdUJBQXVCLENBQUMsTUFBTTtvQkFDL0MsU0FBUyxFQUFFLENBQUMsbUJBQW1CLENBQUM7aUJBQ2pDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3ksIENoYW5nZURldGVjdG9yUmVmLCBDb21wb25lbnQsIE9uSW5pdCB9IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xyXG5pbXBvcnQgeyBQbG9udGVyU2VydmljZSB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL3Bsb250ZXIvcGxvbnRlci5zZXJ2aWNlJztcclxuaW1wb3J0IHsgQ29vcmRpbmF0ZUNvbnZlcnRlciB9IGZyb20gJy4uLy4uL3NlcnZpY2VzL2Nvb3JkaW5hdGUtY29udmVydGVyL2Nvb3JkaW5hdGUtY29udmVydGVyLnNlcnZpY2UnO1xyXG5cclxuQENvbXBvbmVudChcclxuICB7XHJcbiAgICBzZWxlY3RvcjogJ2FjLWRlZmF1bHQtcGxvbnRlcicsXHJcbiAgICB0ZW1wbGF0ZTogYFxyXG4gICAgICA8YWMtaHRtbCAqbmdJZj1cInBsb250ZXJTZXJ2aWNlLnBsb250ZXJTaG93blwiIFtwcm9wc109XCJ7XHJcbiAgICAgICAgcG9zaXRpb246IHBsb250ZXJQb3NpdGlvblxyXG4gICAgICB9XCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cInBsb250ZXItY29udGV4dC1tZW51XCI+XHJcbiAgICAgICAgICA8ZGl2ICpuZ0Zvcj1cImxldCBlbnRpdHkgb2YgcGxvbnRlclNlcnZpY2UuZW50aXRlc1RvUGxvbnRlclwiPlxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzPVwicGxvbnRlci1pdGVtXCIgKGNsaWNrKT1cImNob29zZUVudGl0eShlbnRpdHkpXCI+e3sgZW50aXR5Py5uYW1lIHx8IGVudGl0eT8uaWQgfX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgPC9hYy1odG1sPlxyXG4gICAgYCxcclxuICAgIHN0eWxlczogW2BcclxuICAgICAgICAucGxvbnRlci1jb250ZXh0LW1lbnUge1xyXG4gICAgICAgICAgICBiYWNrZ3JvdW5kLWNvbG9yOiByZ2JhKDI1MCwgMjUwLCAyNTAsIDAuOCk7XHJcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDFweCAxcHggNXB4IDBweCByZ2JhKDAsIDAsIDAsIDAuMTUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnBsb250ZXItaXRlbSB7XHJcbiAgICAgICAgICAgIGN1cnNvcjogcG9pbnRlcjtcclxuICAgICAgICAgICAgcGFkZGluZzogMnB4IDE1cHg7XHJcbiAgICAgICAgICAgIHRleHQtYWxpZ246IHN0YXJ0O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLnBsb250ZXItaXRlbTpob3ZlciB7XHJcbiAgICAgICAgICAgIGJhY2tncm91bmQtY29sb3I6IHJnYmEoMCwgMCwgMCwgMC4xNSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIGBdLFxyXG4gICAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2gsXHJcbiAgICBwcm92aWRlcnM6IFtDb29yZGluYXRlQ29udmVydGVyXSxcclxuICB9XHJcbilcclxuZXhwb3J0IGNsYXNzIEFjRGVmYXVsdFBsb250ZXJDb21wb25lbnQgaW1wbGVtZW50cyBPbkluaXQge1xyXG5cclxuICBjb25zdHJ1Y3RvcihwdWJsaWMgcGxvbnRlclNlcnZpY2U6IFBsb250ZXJTZXJ2aWNlLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgY2Q6IENoYW5nZURldGVjdG9yUmVmLFxyXG4gICAgICAgICAgICAgIHByaXZhdGUgZ2VvQ29udmVydGVyOiBDb29yZGluYXRlQ29udmVydGVyKSB7XHJcbiAgfVxyXG5cclxuICBuZ09uSW5pdCgpIHtcclxuICAgIHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNoYW5nZU5vdGlmaWVyLnN1YnNjcmliZSgoKSA9PiB0aGlzLmNkLmRldGVjdENoYW5nZXMoKSk7XHJcbiAgfVxyXG5cclxuICBnZXQgcGxvbnRlclBvc2l0aW9uKCkge1xyXG4gICAgaWYgKHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlclNob3duKSB7XHJcbiAgICAgIGNvbnN0IHNjcmVlblBvcyA9IHRoaXMucGxvbnRlclNlcnZpY2UucGxvbnRlckNsaWNrUG9zaXRpb24uZW5kUG9zaXRpb247XHJcbiAgICAgIHJldHVybiB0aGlzLmdlb0NvbnZlcnRlci5zY3JlZW5Ub0NhcnRlc2lhbjMoc2NyZWVuUG9zKTtcclxuICAgIH1cclxuICB9XHJcblxyXG4gIGNob29zZUVudGl0eShlbnRpdHk6IGFueSkge1xyXG4gICAgdGhpcy5wbG9udGVyU2VydmljZS5yZXNvbHZlUGxvbnRlcihlbnRpdHkpO1xyXG4gIH1cclxufVxyXG4iXX0=