import { Component, Input } from '@angular/core';
import { PrimitiveCollection, Cesium3DTileset, Cesium3DTileStyle } from 'cesium';
import { Checker } from '../../utils/checker';
import * as i0 from "@angular/core";
import * as i1 from "../../services/cesium/cesium.service";
/**
 *  This component is used for adding a 3d tileset layer to the map (ac-map).
 *  options according to `Cesium3DTileset` definition.
 *  check out: https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
 *
 *
 *  __Usage :__
 *  ```
 *    <ac-3d-tile-layer [options]="optionsObject">
 *    </ac-3d-tile-layer>
 *  ```
 */
export class AcTileset3dComponent {
    constructor(cesiumService) {
        this.cesiumService = cesiumService;
        /**
         * refer to cesium docs for details https://cesiumjs.org/Cesium/Build/Documentation/Cesium3DTileset.html
         */
        this.options = { url: null };
        /**
         * show (optional) - Determines if the map layer is shown.
         */
        this.show = true;
        this.tilesetInstance = null;
    }
    ngOnInit() {
        if (!Checker.present(this.options.url)) {
            throw new Error('Options must have a url');
        }
        this._3dtilesCollection = new PrimitiveCollection();
        this.cesiumService.getScene().primitives.add(this._3dtilesCollection);
        if (this.show) {
            this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
            if (this.style) {
                this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnChanges(changes) {
        if (changes['show'] && !changes['show'].isFirstChange()) {
            const showValue = changes['show'].currentValue;
            if (showValue) {
                if (this.tilesetInstance) {
                    this._3dtilesCollection.add(this.tilesetInstance, this.index);
                }
                else {
                    this.tilesetInstance = this._3dtilesCollection.add(new Cesium3DTileset(this.options), this.index);
                    if (this.style) {
                        this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
                    }
                }
            }
            else if (this.tilesetInstance) {
                this._3dtilesCollection.remove(this.tilesetInstance, false);
            }
        }
        if (changes['style'] && !changes['style'].isFirstChange()) {
            const styleValue = changes['style'].currentValue;
            if (this.tilesetInstance) {
                this.tilesetInstance.style = new Cesium3DTileStyle(this.style);
            }
        }
    }
    ngOnDestroy() {
        if (this.tilesetInstance) {
            this._3dtilesCollection.remove(this.tilesetInstance, false);
        }
    }
}
AcTileset3dComponent.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcTileset3dComponent, deps: [{ token: i1.CesiumService }], target: i0.ɵɵFactoryTarget.Component });
AcTileset3dComponent.ɵcmp = i0.ɵɵngDeclareComponent({ minVersion: "12.0.0", version: "13.3.0", type: AcTileset3dComponent, selector: "ac-3d-tile-layer", inputs: { options: "options", index: "index", show: "show", style: "style" }, usesOnChanges: true, ngImport: i0, template: '', isInline: true });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "13.3.0", ngImport: i0, type: AcTileset3dComponent, decorators: [{
            type: Component,
            args: [{
                    selector: 'ac-3d-tile-layer',
                    template: '',
                }]
        }], ctorParameters: function () { return [{ type: i1.CesiumService }]; }, propDecorators: { options: [{
                type: Input
            }], index: [{
                type: Input
            }], show: [{
                type: Input
            }], style: [{
                type: Input
            }] } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYWMtdGlsZXNldC0zZC5jb21wb25lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbGliL2FuZ3VsYXItY2VzaXVtL2NvbXBvbmVudHMvYWMtM2QtdGlsZXNldC9hYy10aWxlc2V0LTNkLmNvbXBvbmVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxPQUFPLEVBQUUsU0FBUyxFQUFFLEtBQUssRUFBK0MsTUFBTSxlQUFlLENBQUM7QUFDOUYsT0FBTyxFQUFFLG1CQUFtQixFQUFFLGVBQWUsRUFBRSxpQkFBaUIsRUFBRSxNQUFNLFFBQVEsQ0FBQztBQUVqRixPQUFPLEVBQUUsT0FBTyxFQUFFLE1BQU0scUJBQXFCLENBQUM7OztBQUU5Qzs7Ozs7Ozs7Ozs7R0FXRztBQUtILE1BQU0sT0FBTyxvQkFBb0I7SUE0Qi9CLFlBQW9CLGFBQTRCO1FBQTVCLGtCQUFhLEdBQWIsYUFBYSxDQUFlO1FBM0JoRDs7V0FFRztRQUVILFlBQU8sR0FBaUIsRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLENBQUM7UUFRdEM7O1dBRUc7UUFFSCxTQUFJLEdBQUcsSUFBSSxDQUFDO1FBUUwsb0JBQWUsR0FBUSxJQUFJLENBQUM7SUFJbkMsQ0FBQztJQUVELFFBQVE7UUFDTixJQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxFQUFFO1lBQ3RDLE1BQU0sSUFBSSxLQUFLLENBQUMseUJBQXlCLENBQUMsQ0FBQztTQUM1QztRQUVELElBQUksQ0FBQyxrQkFBa0IsR0FBRyxJQUFJLG1CQUFtQixFQUFFLENBQUM7UUFDcEQsSUFBSSxDQUFDLGFBQWEsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDO1FBRXRFLElBQUksSUFBSSxDQUFDLElBQUksRUFBRTtZQUNiLElBQUksQ0FBQyxlQUFlLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLGVBQWUsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ2xHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTtnQkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzthQUNoRTtTQUNGO0lBQ0gsQ0FBQztJQUVELFdBQVcsQ0FBQyxPQUFzQjtRQUNoQyxJQUFJLE9BQU8sQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQyxhQUFhLEVBQUUsRUFBRTtZQUN2RCxNQUFNLFNBQVMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsWUFBWSxDQUFDO1lBRS9DLElBQUksU0FBUyxFQUFFO2dCQUNiLElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtvQkFDeEIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztpQkFDL0Q7cUJBQU07b0JBQ0wsSUFBSSxDQUFDLGVBQWUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsR0FBRyxDQUFDLElBQUksZUFBZSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7b0JBQ2xHLElBQUksSUFBSSxDQUFDLEtBQUssRUFBRTt3QkFDZCxJQUFJLENBQUMsZUFBZSxDQUFDLEtBQUssR0FBRyxJQUFJLGlCQUFpQixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztxQkFDaEU7aUJBQ0Y7YUFDRjtpQkFBTSxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQy9CLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGVBQWUsRUFBRSxLQUFLLENBQUMsQ0FBQzthQUM3RDtTQUNGO1FBQ0QsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUMsYUFBYSxFQUFFLEVBQUU7WUFDekQsTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLE9BQU8sQ0FBQyxDQUFDLFlBQVksQ0FBQztZQUNqRCxJQUFJLElBQUksQ0FBQyxlQUFlLEVBQUU7Z0JBQ3hCLElBQUksQ0FBQyxlQUFlLENBQUMsS0FBSyxHQUFHLElBQUksaUJBQWlCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO2FBQ2hFO1NBQ0Y7SUFDSCxDQUFDO0lBRUQsV0FBVztRQUNULElBQUksSUFBSSxDQUFDLGVBQWUsRUFBRTtZQUN4QixJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsS0FBSyxDQUFDLENBQUM7U0FDN0Q7SUFDSCxDQUFDOztpSEE1RVUsb0JBQW9CO3FHQUFwQixvQkFBb0IsMkpBRnJCLEVBQUU7MkZBRUQsb0JBQW9CO2tCQUpoQyxTQUFTO21CQUFDO29CQUNULFFBQVEsRUFBRSxrQkFBa0I7b0JBQzVCLFFBQVEsRUFBRSxFQUFFO2lCQUNiO29HQU1DLE9BQU87c0JBRE4sS0FBSztnQkFPTixLQUFLO3NCQURKLEtBQUs7Z0JBT04sSUFBSTtzQkFESCxLQUFLO2dCQU9OLEtBQUs7c0JBREosS0FBSyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IENvbXBvbmVudCwgSW5wdXQsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBPbkluaXQsIFNpbXBsZUNoYW5nZXMgfSBmcm9tICdAYW5ndWxhci9jb3JlJztcclxuaW1wb3J0IHsgUHJpbWl0aXZlQ29sbGVjdGlvbiwgQ2VzaXVtM0RUaWxlc2V0LCBDZXNpdW0zRFRpbGVTdHlsZSB9IGZyb20gJ2Nlc2l1bSc7XHJcbmltcG9ydCB7IENlc2l1bVNlcnZpY2UgfSBmcm9tICcuLi8uLi9zZXJ2aWNlcy9jZXNpdW0vY2VzaXVtLnNlcnZpY2UnO1xyXG5pbXBvcnQgeyBDaGVja2VyIH0gZnJvbSAnLi4vLi4vdXRpbHMvY2hlY2tlcic7XHJcblxyXG4vKipcclxuICogIFRoaXMgY29tcG9uZW50IGlzIHVzZWQgZm9yIGFkZGluZyBhIDNkIHRpbGVzZXQgbGF5ZXIgdG8gdGhlIG1hcCAoYWMtbWFwKS5cclxuICogIG9wdGlvbnMgYWNjb3JkaW5nIHRvIGBDZXNpdW0zRFRpbGVzZXRgIGRlZmluaXRpb24uXHJcbiAqICBjaGVjayBvdXQ6IGh0dHBzOi8vY2VzaXVtanMub3JnL0Nlc2l1bS9CdWlsZC9Eb2N1bWVudGF0aW9uL0Nlc2l1bTNEVGlsZXNldC5odG1sXHJcbiAqXHJcbiAqXHJcbiAqICBfX1VzYWdlIDpfX1xyXG4gKiAgYGBgXHJcbiAqICAgIDxhYy0zZC10aWxlLWxheWVyIFtvcHRpb25zXT1cIm9wdGlvbnNPYmplY3RcIj5cclxuICogICAgPC9hYy0zZC10aWxlLWxheWVyPlxyXG4gKiAgYGBgXHJcbiAqL1xyXG5AQ29tcG9uZW50KHtcclxuICBzZWxlY3RvcjogJ2FjLTNkLXRpbGUtbGF5ZXInLFxyXG4gIHRlbXBsYXRlOiAnJyxcclxufSlcclxuZXhwb3J0IGNsYXNzIEFjVGlsZXNldDNkQ29tcG9uZW50IGltcGxlbWVudHMgT25Jbml0LCBPbkNoYW5nZXMsIE9uRGVzdHJveSB7XHJcbiAgLyoqXHJcbiAgICogcmVmZXIgdG8gY2VzaXVtIGRvY3MgZm9yIGRldGFpbHMgaHR0cHM6Ly9jZXNpdW1qcy5vcmcvQ2VzaXVtL0J1aWxkL0RvY3VtZW50YXRpb24vQ2VzaXVtM0RUaWxlc2V0Lmh0bWxcclxuICAgKi9cclxuICBASW5wdXQoKVxyXG4gIG9wdGlvbnM6IHsgdXJsOiBhbnkgfSA9IHsgdXJsOiBudWxsIH07XHJcblxyXG4gIC8qKlxyXG4gICAqIGluZGV4IChvcHRpb25hbCkgLSBUaGUgaW5kZXggdG8gYWRkIHRoZSBsYXllciBhdC4gSWYgb21pdHRlZCwgdGhlIGxheWVyIHdpbGwgYWRkZWQgb24gdG9wIG9mIGFsbCBleGlzdGluZyBsYXllcnMuXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBpbmRleDogTnVtYmVyO1xyXG5cclxuICAvKipcclxuICAgKiBzaG93IChvcHRpb25hbCkgLSBEZXRlcm1pbmVzIGlmIHRoZSBtYXAgbGF5ZXIgaXMgc2hvd24uXHJcbiAgICovXHJcbiAgQElucHV0KClcclxuICBzaG93ID0gdHJ1ZTtcclxuXHJcbiAgLyoqXHJcbiAgICogc2hvdyAob3B0aW9uYWwpIC0gU2V0cyAzRHRpbGVzIHN0eWxlLlxyXG4gICAqL1xyXG4gIEBJbnB1dCgpXHJcbiAgc3R5bGU6IGFueTtcclxuXHJcbiAgcHVibGljIHRpbGVzZXRJbnN0YW5jZTogYW55ID0gbnVsbDtcclxuICBwcml2YXRlIF8zZHRpbGVzQ29sbGVjdGlvbjogYW55O1xyXG5cclxuICBjb25zdHJ1Y3Rvcihwcml2YXRlIGNlc2l1bVNlcnZpY2U6IENlc2l1bVNlcnZpY2UpIHtcclxuICB9XHJcblxyXG4gIG5nT25Jbml0KCkge1xyXG4gICAgaWYgKCFDaGVja2VyLnByZXNlbnQodGhpcy5vcHRpb25zLnVybCkpIHtcclxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPcHRpb25zIG11c3QgaGF2ZSBhIHVybCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uID0gbmV3IFByaW1pdGl2ZUNvbGxlY3Rpb24oKTtcclxuICAgIHRoaXMuY2VzaXVtU2VydmljZS5nZXRTY2VuZSgpLnByaW1pdGl2ZXMuYWRkKHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uKTtcclxuXHJcbiAgICBpZiAodGhpcy5zaG93KSB7XHJcbiAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlID0gdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24uYWRkKG5ldyBDZXNpdW0zRFRpbGVzZXQodGhpcy5vcHRpb25zKSwgdGhpcy5pbmRleCk7XHJcbiAgICAgIGlmICh0aGlzLnN0eWxlKSB7XHJcbiAgICAgICAgdGhpcy50aWxlc2V0SW5zdGFuY2Uuc3R5bGUgPSBuZXcgQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25DaGFuZ2VzKGNoYW5nZXM6IFNpbXBsZUNoYW5nZXMpOiB2b2lkIHtcclxuICAgIGlmIChjaGFuZ2VzWydzaG93J10gJiYgIWNoYW5nZXNbJ3Nob3cnXS5pc0ZpcnN0Q2hhbmdlKCkpIHtcclxuICAgICAgY29uc3Qgc2hvd1ZhbHVlID0gY2hhbmdlc1snc2hvdyddLmN1cnJlbnRWYWx1ZTtcclxuXHJcbiAgICAgIGlmIChzaG93VmFsdWUpIHtcclxuICAgICAgICBpZiAodGhpcy50aWxlc2V0SW5zdGFuY2UpIHtcclxuICAgICAgICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLmFkZCh0aGlzLnRpbGVzZXRJbnN0YW5jZSwgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgIHRoaXMudGlsZXNldEluc3RhbmNlID0gdGhpcy5fM2R0aWxlc0NvbGxlY3Rpb24uYWRkKG5ldyBDZXNpdW0zRFRpbGVzZXQodGhpcy5vcHRpb25zKSwgdGhpcy5pbmRleCk7XHJcbiAgICAgICAgICBpZiAodGhpcy5zdHlsZSkge1xyXG4gICAgICAgICAgICB0aGlzLnRpbGVzZXRJbnN0YW5jZS5zdHlsZSA9IG5ldyBDZXNpdW0zRFRpbGVTdHlsZSh0aGlzLnN0eWxlKTtcclxuICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICAgIH0gZWxzZSBpZiAodGhpcy50aWxlc2V0SW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLl8zZHRpbGVzQ29sbGVjdGlvbi5yZW1vdmUodGhpcy50aWxlc2V0SW5zdGFuY2UsIGZhbHNlKTtcclxuICAgICAgfVxyXG4gICAgfVxyXG4gICAgaWYgKGNoYW5nZXNbJ3N0eWxlJ10gJiYgIWNoYW5nZXNbJ3N0eWxlJ10uaXNGaXJzdENoYW5nZSgpKSB7XHJcbiAgICAgIGNvbnN0IHN0eWxlVmFsdWUgPSBjaGFuZ2VzWydzdHlsZSddLmN1cnJlbnRWYWx1ZTtcclxuICAgICAgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy50aWxlc2V0SW5zdGFuY2Uuc3R5bGUgPSBuZXcgQ2VzaXVtM0RUaWxlU3R5bGUodGhpcy5zdHlsZSk7XHJcbiAgICAgIH1cclxuICAgIH1cclxuICB9XHJcblxyXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xyXG4gICAgaWYgKHRoaXMudGlsZXNldEluc3RhbmNlKSB7XHJcbiAgICAgIHRoaXMuXzNkdGlsZXNDb2xsZWN0aW9uLnJlbW92ZSh0aGlzLnRpbGVzZXRJbnN0YW5jZSwgZmFsc2UpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG4iXX0=